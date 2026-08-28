import { supabase } from "./supabase";

export interface EditSuggestion {
  churchId: string;
  churchName: string;
  denomination: string;
  translation: string;
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
    denomination: input.denomination || null,
    translation: input.translation || null,
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
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
