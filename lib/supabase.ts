import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// This module-scope client is reused across requests, so its `fetch` sits
// outside any request's caching context. Next's App Router would otherwise
// cache every PostgREST GET in the Data Cache — and because the client is
// created here rather than per-request, even `export const dynamic =
// "force-dynamic"` on a page doesn't reliably reach it. Force every query to
// bypass the cache so the /church-finder counts and search always reflect the
// live DB (including edits made straight against Supabase). Harmless on the
// browser-side callers, where `no-store` just skips the HTTP cache.
const noStoreFetch: typeof fetch = (input, init) =>
  fetch(input, { ...init, cache: "no-store" });

/** null when the env vars aren't configured, so callers can show a setup notice instead of crashing. */
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, { global: { fetch: noStoreFetch } })
    : null;
