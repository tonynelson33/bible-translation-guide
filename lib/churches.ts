import { supabase } from "./supabase";
import { denominationOptions } from "./suggestionOptions";

export interface Church {
  id: string;
  name: string;
  address: string;
  locality: string;
  region: string;
  zip: string | null;
  country: string;
  category: string | null;
  bibleTranslation: string | null;
  bibleTranslationNotes: string | null;
}

export interface ChurchSearchParams {
  name?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export interface ChurchSearchResult {
  /** Up to RESULTS_LIMIT rows, ordered by name. */
  churches: Church[];
  /** Total matches in the DB, even when more than RESULTS_LIMIT. */
  total: number;
}

// Hard cap on rows returned for any one search. The densest zip has ~71 churches
// and the biggest city ~2,700 — past 100 the answer is "narrow it down" (add a
// name), not "page through hundreds". The client paginates these 100 in memory.
export const RESULTS_LIMIT = 100;

/** Client paginates the fetched results this many per page — 100 / 25 = 4 pages max. */
export const PAGE_SIZE = 25;

export const MIN_NAME_CHARS = 3;
export const MIN_CITY_CHARS = 3;

/**
 * Returns an error string if the params can't be searched, or null if they're good.
 * Shared by the client form (inline validation) and the server (shared-link guard).
 */
export function validateSearchParams(params: ChurchSearchParams): string | null {
  const name = params.name?.trim() ?? "";
  const city = params.city?.trim() ?? "";
  const zip = params.zip?.trim() ?? "";

  if (!name && !city && !zip) return "Enter a church name, city, or zip code.";
  if (zip && !/^\d{5}$/.test(zip)) return "Enter a 5-digit zip code.";
  if (name && name.length < MIN_NAME_CHARS)
    return `Church name needs at least ${MIN_NAME_CHARS} letters.`;
  // City is ignored when a zip is given, so only enforce its length otherwise.
  if (!zip && city && city.length < MIN_CITY_CHARS)
    return `City needs at least ${MIN_CITY_CHARS} letters.`;
  return null;
}

// churches.category holds slugs like "baptist_church". Every slug in the live
// data is either "church_cathedral" (the "not identified" catch-all) or a value
// from denominationOptions in lib/suggestionOptions.ts — the 2026-08 overhaul
// folded/merged every other bucket into one of those. So the /church-finder
// breakdown table shows the exact same label the submission dropdown uses.
// (scripts/apply-taxonomy-2026-08.mjs did the data side.)
const DROPDOWN_LABEL: Record<string, string> = Object.fromEntries(
  denominationOptions.map((o) => [o.value, o.label]),
);

const LOWERCASE_CONNECTORS = new Set(["of", "and", "the", "in"]);

export function humanizeCategory(category: string | null): string {
  if (!category || category === "church_cathedral") return "Denomination not identified";
  return (
    DROPDOWN_LABEL[category] ??
    category
      .split("_")
      .map((word, i) =>
        i > 0 && LOWERCASE_CONNECTORS.has(word) ? word : word.charAt(0).toUpperCase() + word.slice(1),
      )
      .join(" ")
  );
}

function rowToChurch(row: Record<string, unknown>): Church {
  return {
    id: row.id as string,
    name: row.name as string,
    address: row.address as string,
    locality: row.locality as string,
    region: row.region as string,
    zip: (row.zip as string | null) ?? null,
    country: row.country as string,
    category: (row.category as string | null) ?? null,
    bibleTranslation: (row.bible_translation as string | null) || null,
    bibleTranslationNotes: (row.bible_translation_notes as string | null) || null,
  };
}

export interface CountRow {
  label: string;
  count: number;
}

/** Reads the church_denomination_counts view (a GROUP BY over churches.category, security_invoker so it respects the same RLS as churches itself). */
export async function getDenominationCounts(): Promise<CountRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("church_denomination_counts")
    .select("category, count")
    .order("count", { ascending: false });
  if (error) {
    console.error("getDenominationCounts error:", error.message);
    return [];
  }
  return (data ?? []).map((row) => ({
    label: humanizeCategory(row.category as string | null),
    count: row.count as number,
  }));
}

/** Reads the church_translation_counts view (a GROUP BY over churches.bible_translation). */
export async function getTranslationCounts(): Promise<CountRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("church_translation_counts")
    .select("bible_translation, count")
    .order("count", { ascending: false });
  if (error) {
    console.error("getTranslationCounts error:", error.message);
    return [];
  }
  return (data ?? []).map((row) => ({
    label: (row.bible_translation as string | null) ?? "Not yet confirmed",
    count: row.count as number,
  }));
}

export interface SimilarChurchMatch {
  id: string;
  name: string;
  address: string;
  locality: string;
  region: string;
}

/**
 * Live "is this already listed?" check for the Add a Church form -- searches the real
 * churches table (public-select, so safe to call directly from a client component) as
 * someone types a name/city, to catch accidental duplicates before they're submitted.
 * Returns [] until both fields have enough characters to search meaningfully.
 */
export async function searchSimilarChurches(name: string, locality: string): Promise<SimilarChurchMatch[]> {
  const trimmedName = name.trim();
  const trimmedLocality = locality.trim();
  if (!supabase || trimmedName.length < 3 || trimmedLocality.length < 2) return [];

  const { data, error } = await supabase
    .from("churches")
    .select("id, name, address, locality, region")
    .ilike("name", `%${trimmedName}%`)
    .ilike("locality", `${trimmedLocality}%`)
    .limit(5);
  if (error) {
    console.error("searchSimilarChurches error:", error.message);
    return [];
  }
  return (data ?? []).map((row) => ({
    id: row.id as string,
    name: row.name as string,
    address: row.address as string,
    locality: row.locality as string,
    region: row.region as string,
  }));
}

const EMPTY_RESULT: ChurchSearchResult = { churches: [], total: 0 };

/**
 * Location comes from zip if given, otherwise city (+ optional state); a name
 * term is an additional `ILIKE '%…%'` filter on top of either. Returns up to
 * RESULTS_LIMIT rows plus the true total. Safe to call from a client component —
 * `churches` is public-SELECT.
 */
export async function searchChurches(params: ChurchSearchParams): Promise<ChurchSearchResult> {
  const name = params.name?.trim();
  const zip = params.zip?.trim();
  const city = params.city?.trim();
  const state = params.state?.trim().toUpperCase();

  if (!supabase || validateSearchParams(params) !== null) return EMPTY_RESULT;

  let query = supabase
    .from("churches")
    .select("*", { count: "exact" })
    .order("name")
    .limit(RESULTS_LIMIT);

  if (zip) {
    query = query.ilike("zip", `${zip}%`);
  } else if (city) {
    query = query.ilike("locality", `${city}%`);
    if (state) query = query.eq("region", state);
  } else if (state) {
    // Name-only search can still be scoped to a state.
    query = query.eq("region", state);
  }
  if (name) {
    // Escape PostgREST wildcards so a literal % or _ in the term isn't treated as one.
    query = query.ilike("name", `%${name.replace(/[%_]/g, "\\$&")}%`);
  }

  const { data, error, count } = await query;
  if (error) {
    console.error("searchChurches error:", error.message);
    return EMPTY_RESULT;
  }
  return { churches: (data ?? []).map(rowToChurch), total: count ?? 0 };
}
