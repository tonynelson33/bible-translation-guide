import { supabase } from "./supabase";
import { normalizeWebsite } from "./website";

export interface EditSuggestion {
  churchId: string;
  /** name as the submitter has it (may be a correction) */
  churchName: string;
  address?: string;
  locality?: string;
  region?: string;
  zip?: string;
  denomination?: string;
  translation?: string;
  /** Raw submitter input; normalised to `https://…` (or dropped) on insert. */
  website?: string;
  note?: string;
}

export interface ClosedReport {
  churchId: string;
  churchName: string;
  note?: string;
}

export interface NewChurchSuggestion {
  churchName: string;
  address: string;
  locality: string;
  region: string;
  zip: string;
  denomination: string;
  translation: string;
  /** Raw submitter input; normalised to `https://…` (or dropped) on insert. */
  website?: string;
}

export interface SubmitResult {
  ok: boolean;
  error?: string;
}

/** Inserts into church_suggestions (insert-only for anon via RLS) — reviewed manually before merging into churches. */
export async function submitEditSuggestion(input: EditSuggestion): Promise<SubmitResult> {
  if (!supabase) return { ok: false, error: "Not configured." };
  const { error } = await supabase.from("church_suggestions").insert({
    suggestion_type: "edit",
    church_id: input.churchId,
    church_name: input.churchName,
    address: input.address || null,
    locality: input.locality || null,
    region: input.region || null,
    zip: input.zip || null,
    denomination: input.denomination || null,
    translation: input.translation || null,
    website: normalizeWebsite(input.website),
    note: input.note || null,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/** Flags a church as permanently closed / no longer existing, for removal on review. */
export async function submitClosedReport(input: ClosedReport): Promise<SubmitResult> {
  if (!supabase) return { ok: false, error: "Not configured." };
  const { error } = await supabase.from("church_suggestions").insert({
    suggestion_type: "closed",
    church_id: input.churchId,
    church_name: input.churchName,
    note: input.note || null,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function submitNewChurchSuggestion(input: NewChurchSuggestion): Promise<SubmitResult> {
  if (!supabase) return { ok: false, error: "Not configured." };
  const { error } = await supabase.from("church_suggestions").insert({
    suggestion_type: "new_church",
    church_name: input.churchName,
    address: input.address,
    locality: input.locality,
    region: input.region,
    zip: input.zip,
    denomination: input.denomination,
    translation: input.translation,
    website: normalizeWebsite(input.website),
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
