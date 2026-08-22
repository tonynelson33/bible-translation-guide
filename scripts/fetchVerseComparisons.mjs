// One-off batch fetch of verse text for every entry in data/verseComparisonList.json,
// across whichever translations currently have a working, key-free API.
//
// Run: node scripts/fetchVerseComparisons.mjs
//
// Currently only kjv (bible-api.com) and net (labs.bible.org) can be fetched without an
// API key. The other translations are written with status "unavailable" (mirroring
// lib/verseProviders.ts) so this file has a complete, stable shape ready to backfill —
// re-run this script after adding ESV_API_KEY / API_BIBLE_KEY to fetch the rest.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const REQUEST_DELAY_MS = 1500;
const RATE_LIMIT_BACKOFF_MS = 8000;
const FETCH_TIMEOUT_MS = 8000;
const MAX_RETRIES = 3;

const translations = JSON.parse(
  readFileSync(path.join(ROOT, "data", "translations.json"), "utf-8"),
);
const verseList = JSON.parse(
  readFileSync(path.join(ROOT, "data", "verseComparisonList.json"), "utf-8"),
);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchFromBibleApiCom(reference) {
  const url = `https://bible-api.com/${encodeURIComponent(reference)}?translation=kjv`;
  const res = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
  if (res.status === 429) {
    const err = new Error("rate limited");
    err.rateLimited = true;
    throw err;
  }
  if (!res.ok) throw new Error(`bible-api.com returned HTTP ${res.status}`);
  const data = await res.json();
  const text = data?.text ? String(data.text).trim() : "";
  if (!text) throw new Error("bible-api.com response did not include verse text");
  return { text, attribution: "Public domain. Text served via bible-api.com." };
}

async function fetchFromNetBible(reference) {
  const url = `https://labs.bible.org/api/?passage=${encodeURIComponent(reference)}&type=json`;
  const res = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
  if (!res.ok) throw new Error(`NET Bible web service returned HTTP ${res.status}`);
  const data = await res.json();
  const text = Array.isArray(data)
    ? data.map((v) => v.text ?? "").join(" ").trim()
    : "";
  if (!text) {
    // The API represents an omitted verse either as an empty array or as an entry
    // with a blank "text" field (e.g. Acts 24:7) — both mean the same thing.
    const err = new Error("verse not present in this translation");
    err.omitted = true;
    throw err;
  }
  return {
    text,
    attribution:
      "NET Bible® copyright © 1996-2017 by Biblical Studies Press, L.L.C. Used by permission, all rights reserved. (Verify exact required wording against bible.org's current terms before launch.)",
  };
}

// provider id -> fetcher, for providers that work without an API key
const FETCHABLE_PROVIDERS = {
  "bible-api": fetchFromBibleApiCom,
  "net-bible": fetchFromNetBible,
};

async function fetchWithRetry(fetcher, reference) {
  let lastError;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const { text, attribution } = await fetcher(reference);
      return { status: "ok", text, attribution, message: undefined };
    } catch (err) {
      if (err.omitted) {
        return {
          status: "omitted",
          text: null,
          attribution: null,
          message: "This verse is not present in this translation (omitted from the underlying text).",
        };
      }
      lastError = err;
      const backoff = err.rateLimited ? RATE_LIMIT_BACKOFF_MS : REQUEST_DELAY_MS * 2;
      if (attempt < MAX_RETRIES) await sleep(backoff);
    }
  }
  return {
    status: "error",
    text: null,
    attribution: null,
    message: lastError?.message ?? "Unknown error",
  };
}

async function main() {
  const results = [];
  const total = verseList.length;

  for (let i = 0; i < total; i++) {
    const verse = verseList[i];
    const byTranslation = {};

    for (const translation of translations) {
      const provider = translation.verseApi.provider;
      const fetcher = FETCHABLE_PROVIDERS[provider];

      if (!fetcher) {
        byTranslation[translation.id] = {
          status: "unavailable",
          text: null,
          attribution: null,
          message: translation.verseApi.note ?? "No key-free source configured yet.",
        };
        continue;
      }

      byTranslation[translation.id] = await fetchWithRetry(fetcher, verse.reference);
      await sleep(REQUEST_DELAY_MS);
    }

    results.push({ ...verse, translations: byTranslation });

    if ((i + 1) % 25 === 0 || i === total - 1) {
      console.log(`Progress: ${i + 1}/${total} (${verse.reference})`);
    }
  }

  const outPath = path.join(ROOT, "data", "verseComparisons.json");
  writeFileSync(outPath, JSON.stringify(results, null, 2) + "\n", "utf-8");

  const okCounts = {};
  for (const r of results) {
    for (const [id, v] of Object.entries(r.translations)) {
      if (v.status === "ok") okCounts[id] = (okCounts[id] ?? 0) + 1;
    }
  }
  console.log("Done. Successful fetches per translation:", okCounts);
  console.log(`Wrote ${results.length} verses to ${outPath}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
