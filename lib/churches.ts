import { supabase } from "./supabase";

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
  city?: string;
  state?: string;
  zip?: string;
}

const RESULTS_LIMIT = 30;

// churches.category holds slugs like "baptist_church" from the source data's
// denomination classification; church_cathedral is the generic catch-all for
// churches that didn't match a specific denomination pattern.
//
// The overrides below keep the /church-finder breakdown table in step with the
// dropdown taxonomy in lib/suggestionOptions.ts — any category that has a 1:1
// dropdown entry shows that same label here. Categories with no dropdown entry
// (pentecostal_church, evangelical_church, mission, convents_and_monasteries,
// wesleyan_church, anglican_church, episcopal_church) fall through to the
// generic humanizer. The *_holiness / non_denominational* / plymouth_brethren /
// anglican_episcopal slugs carry zero rows until manual review merges
// suggestions into them.
const CATEGORY_LABEL_OVERRIDES: Record<string, string> = {
  church_cathedral: "Denomination not identified",
  quaker_friends: "Quaker (Friends)",
  adventist_church: "Seventh-day Adventist",
  anglican_episcopal_church: "Anglican / Episcopal",
  missionary_baptist_church: "Baptist (Historically Black / National)",
  baptist_church: "Baptist (Mainstream / Southern / American)",
  bible_church: "Bible Church (Independent / Dispensational)",
  christian_missionary_alliance: "Christian & Missionary Alliance (CMA)",
  church_of_god_holiness: "Church of God (Holiness / Traditional)",
  church_of_god: "Church of God (Pentecostal)",
  congregational_church: "Congregational (UCC)",
  mennonite_church: "Mennonite / Amish",
  methodist_ame: "Methodist (Historically Black / AME)",
  non_denominational_charismatic: "Non-denominational (Contemporary / Charismatic)",
  non_denominational: "Non-denominational (Traditional / Mainstream)",
  orthodox_church: "Orthodox (Eastern / Greek / Russian)",
  oriental_orthodox_church: "Orthodox (Oriental / Coptic / Ethiopian)",
  oneness_apostolic_church: "Pentecostal (Oneness / Apostolic)",
  plymouth_brethren_church: "Plymouth Brethren / Christian Brethren",
};

const LOWERCASE_CONNECTORS = new Set(["of", "and", "the", "in"]);

export function humanizeCategory(category: string | null): string {
  if (!category) return "Denomination not identified";
  if (CATEGORY_LABEL_OVERRIDES[category]) return CATEGORY_LABEL_OVERRIDES[category];
  return category
    .split("_")
    .map((word, i) =>
      i > 0 && LOWERCASE_CONNECTORS.has(word) ? word : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");
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

/** Returns [] when Supabase isn't configured or the search has no usable criteria. */
export async function searchChurches(params: ChurchSearchParams): Promise<Church[]> {
  const zip = params.zip?.trim();
  const city = params.city?.trim();
  const state = params.state?.trim().toUpperCase();

  if (!supabase || (!zip && !city)) return [];

  let query = supabase.from("churches").select("*").order("name").limit(RESULTS_LIMIT);

  if (zip) {
    query = query.ilike("zip", `${zip}%`);
  } else if (city) {
    query = query.ilike("locality", `${city}%`);
    if (state) query = query.eq("region", state);
  }

  const { data, error } = await query;
  if (error) {
    console.error("searchChurches error:", error.message);
    return [];
  }
  return (data ?? []).map(rowToChurch);
}
