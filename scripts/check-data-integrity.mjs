#!/usr/bin/env node
/**
 * Data-integrity checks for the `churches` table.
 *
 * Content-level invariants only — runs over PostgREST with the public anon key, the same key
 * every other scripts/*.mjs here uses (churches is public-SELECT by RLS, so this is safe to
 * commit and safe to run from anywhere, including CI). Schema-level things this can't see from
 * the anon key — RLS actually enabled, the count views' `security_invoker` flag — aren't
 * PostgREST-visible and need privileged access; verify those via the Supabase dashboard/MCP
 * tools instead (see CLAUDE.md's "Denomination/translation breakdown tables" section).
 *
 * Run: node scripts/check-data-integrity.mjs
 * Exits 1 if any check FAILs. Category-count drops against the committed baseline are a WARN,
 * not a FAIL — a suggestion-driven correction can legitimately shrink a bucket — but re-run
 * with --update-baseline after you've confirmed a shrink is intentional, to snapshot the new
 * numbers and stop the warning from repeating.
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BASELINE_PATH = path.join(__dirname, "data-integrity-baseline.json");

const SUPABASE_URL = "https://dyeeuwdwmmkwtsmmbtcr.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5ZWV1d2R3bW1rd3RzbW1idGNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzMjE2MzAsImV4cCI6MjEwMTg5NzYzMH0.9lGZbiHHHuDEDQZsj9ila9YQ_56Vf8RA8I3KeQYeXDc";

const REST = `${SUPABASE_URL}/rest/v1`;
const HEADERS = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` };
const UPDATE_BASELINE = process.argv.includes("--update-baseline");

async function rest(pathAndQuery, { count = false, limit } = {}) {
  const url = `${REST}${pathAndQuery}${limit != null ? `&limit=${limit}` : ""}`;
  const headers = { ...HEADERS };
  if (count) headers.Prefer = "count=exact";
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}\n${await res.text()}`);
  const rows = await res.json();
  const total = count ? Number(res.headers.get("content-range")?.split("/")[1] ?? rows.length) : rows.length;
  return { rows, total };
}

// Pull the valid category slugs straight from the source of truth instead of duplicating the
// list here — denominationOptions IS what a submission can legally set `category` to, plus the
// "not identified" sentinel the classifier/syncs use.
function loadValidCategories() {
  const src = readFileSync(path.join(ROOT, "lib", "suggestionOptions.ts"), "utf8");
  const start = src.indexOf("export const denominationOptions");
  const end = src.indexOf("\n];", start);
  const block = src.slice(start, end);
  const values = [...block.matchAll(/value:\s*"([a-z0-9_]+)"/g)].map((m) => m[1]);
  if (values.length < 25) throw new Error(`Only found ${values.length} denominationOptions values — parse broke`);
  return new Set([...values, "church_cathedral"]);
}

// Same idea for translations, with one deliberate substitution: the site profiles the 2021
// "NRSVue" text but `bible_translation` stores "NRSV" (see lib/suggestionOptions.ts's comment
// on translationOptions) — that's not drift, it's the documented convention.
function loadValidTranslations() {
  const data = JSON.parse(readFileSync(path.join(ROOT, "data", "translations.json"), "utf8"));
  const slugs = data.map((t) => t.slug ?? t.abbreviation ?? t.id);
  return new Set(slugs.map((s) => (s === "NRSVue" ? "NRSV" : s)));
}

const results = [];
function report(name, status, detail) {
  results.push({ name, status, detail });
  const icon = status === "pass" ? "✓" : status === "warn" ? "⚠" : status === "info" ? "ℹ" : "✗";
  console.log(`${icon} ${name}${detail ? ` — ${detail}` : ""}`);
}

async function checkNoInvalidCategories(validCategories) {
  const list = [...validCategories].join(",");
  const { rows, total } = await rest(
    `/churches?select=id,category&category=not.is.null&category=not.in.(${list})`,
    { count: true, limit: 5 },
  );
  if (total === 0) {
    report("category is always a known slug", "pass");
  } else {
    const sample = rows.map((r) => `${r.id}:${r.category}`).join(", ");
    report("category is always a known slug", "fail", `${total} row(s) with an unrecognized category, e.g. ${sample}`);
  }
}

async function checkNoInvalidTranslations(validTranslations) {
  const list = [...validTranslations].join(",");
  const { rows, total } = await rest(
    `/churches?select=id,bible_translation&bible_translation=not.is.null&bible_translation=not.in.(${list})`,
    { count: true, limit: 5 },
  );
  if (total === 0) {
    report("bible_translation is always a known code", "pass");
  } else {
    const sample = rows.map((r) => `${r.id}:${r.bible_translation}`).join(", ");
    report("bible_translation is always a known code", "fail", `${total} row(s), e.g. ${sample}`);
  }
}

async function checkNotesWithoutTranslation() {
  // Not a bug to flag: `bible_translation_notes` also doubles as a general classification
  // citation (e.g. "Assemblies of God — reclassified from church_cathedral 2026-08-30") for
  // rows where the category was verified but no translation was ever determined. Confirmed by
  // reading a sample — every one is a well-formed citation, not an orphaned reference. Reported
  // as a count, not a pass/fail, since there's no real invariant to assert here. Worth knowing
  // separately: ChurchResultCard only renders this tooltip when bibleTranslation is *also* set,
  // so these citations are currently stored but never shown to a visitor.
  const { total } = await rest(
    `/churches?select=id&bible_translation_notes=not.is.null&bible_translation=is.null`,
    { count: true, limit: 1 },
  );
  report("rows with a classification note but no translation (informational)", "info", `${total} row(s) — expected, see comment`);
}

async function checkNoTranslationOnUnidentified() {
  const { total } = await rest(
    `/churches?select=id&category=eq.church_cathedral&bible_translation=not.is.null`,
    { count: true, limit: 1 },
  );
  if (total === 0) {
    report("no confirmed translation on a still-\"not identified\" church", "pass");
  } else {
    report("no confirmed translation on a still-\"not identified\" church", "fail", `${total} row(s)`);
  }
}

async function checkNoEmptyRequiredFields() {
  const { total } = await rest(
    `/churches?select=id&or=(name.eq.,address.eq.,locality.eq.,region.eq.,country.eq.)`,
    { count: true, limit: 1 },
  );
  if (total === 0) {
    report("name/address/locality/region/country are never empty strings", "pass");
  } else {
    report("name/address/locality/region/country are never empty strings", "fail", `${total} row(s)`);
  }
}

async function checkCategoryConfidenceEnum() {
  // Belt-and-suspenders on top of the DB CHECK constraint — catches it if that constraint is
  // ever dropped by a future migration.
  const { total } = await rest(
    `/churches?select=id&category_confidence=not.is.null&category_confidence=not.in.(directory,crowd)`,
    { count: true, limit: 1 },
  );
  if (total === 0) {
    report("category_confidence is always directory/crowd/null", "pass");
  } else {
    report("category_confidence is always directory/crowd/null", "fail", `${total} row(s)`);
  }
}

async function checkRowCountBaseline() {
  const { total: grandTotal } = await rest(`/churches?select=id`, { count: true, limit: 1 });

  // church_denomination_counts is already a server-side GROUP BY (~30 rows out, not 347k) —
  // reading raw churches rows here would risk PostgREST's db-max-rows silently truncating the
  // count. It's the same view getDenominationCounts() reads, so this tracks exactly what the
  // /church-finder page shows.
  const { rows: catRows } = await rest(`/church_denomination_counts?select=category,count`, { limit: 200 });
  const counts = {};
  for (const r of catRows) {
    const key = r.category ?? "(null)";
    counts[key] = (counts[key] ?? 0) + Number(r.count);
  }

  let baseline = null;
  try {
    baseline = JSON.parse(readFileSync(BASELINE_PATH, "utf8"));
  } catch {
    // No baseline yet — first run establishes one.
  }

  if (!baseline) {
    report("row-count baseline", "warn", "no baseline file yet — writing one now");
    writeFileSync(BASELINE_PATH, JSON.stringify({ total: grandTotal, categories: counts }, null, 2) + "\n");
    return;
  }

  const drops = [];
  for (const [cat, oldCount] of Object.entries(baseline.categories)) {
    const newCount = counts[cat] ?? 0;
    if (newCount < oldCount) drops.push(`${cat}: ${oldCount} → ${newCount} (-${oldCount - newCount})`);
  }
  if (grandTotal < baseline.total) drops.unshift(`TOTAL: ${baseline.total} → ${grandTotal}`);

  if (drops.length === 0) {
    report("row-count baseline", "pass", `total ${grandTotal} (baseline ${baseline.total}, no regressions)`);
  } else {
    report("row-count baseline", "warn", drops.join("; "));
  }

  if (UPDATE_BASELINE) {
    writeFileSync(BASELINE_PATH, JSON.stringify({ total: grandTotal, categories: counts }, null, 2) + "\n");
    console.log(`  → baseline updated (${BASELINE_PATH})`);
  }
}

(async () => {
  console.log("Data-integrity checks — bible-translation-guide churches table\n");

  const validCategories = loadValidCategories();
  const validTranslations = loadValidTranslations();

  await checkNoInvalidCategories(validCategories);
  await checkNoInvalidTranslations(validTranslations);
  await checkNotesWithoutTranslation();
  await checkNoTranslationOnUnidentified();
  await checkNoEmptyRequiredFields();
  await checkCategoryConfidenceEnum();
  await checkRowCountBaseline();

  console.log("");
  const failed = results.filter((r) => r.status === "fail");
  const warned = results.filter((r) => r.status === "warn");
  if (failed.length) {
    console.log(`${failed.length} check(s) FAILED, ${warned.length} warning(s).`);
    process.exit(1);
  }
  console.log(`All checks passed${warned.length ? ` (${warned.length} warning(s) — see above)` : ""}.`);
})().catch((err) => {
  console.error("Integrity check crashed:", err);
  process.exit(1);
});
