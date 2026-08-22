// Retries only the entries in data/verseComparisons.json that failed on the first pass,
// with a much longer delay (bible-api.com rate-limited us at the original 300ms cadence).
// Also distinguishes a genuinely-omitted verse (API responds successfully with empty
// content, e.g. Mark 9:44 in a critical-text translation) from a real fetch error.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const REQUEST_DELAY_MS = 1500;
const RATE_LIMIT_BACKOFF_MS = 8000;
const FETCH_TIMEOUT_MS = 8000;
const MAX_RETRIES = 3;

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

const FETCHERS = { kjv: fetchFromBibleApiCom, net: fetchFromNetBible };

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
  const dataPath = path.join(ROOT, "data", "verseComparisons.json");
  const results = JSON.parse(readFileSync(dataPath, "utf-8"));

  const toRetry = [];
  for (const entry of results) {
    for (const id of Object.keys(FETCHERS)) {
      if (entry.translations[id]?.status === "error") {
        toRetry.push({ entry, id });
      }
    }
  }

  console.log(`Retrying ${toRetry.length} failed fetches...`);

  for (let i = 0; i < toRetry.length; i++) {
    const { entry, id } = toRetry[i];
    entry.translations[id] = await fetchWithRetry(FETCHERS[id], entry.reference);
    await sleep(REQUEST_DELAY_MS);

    if ((i + 1) % 10 === 0 || i === toRetry.length - 1) {
      console.log(`Progress: ${i + 1}/${toRetry.length} (${entry.reference} / ${id})`);
    }
  }

  writeFileSync(dataPath, JSON.stringify(results, null, 2) + "\n", "utf-8");

  const counts = {};
  for (const r of results) {
    for (const [id, v] of Object.entries(r.translations)) {
      counts[id] = counts[id] ?? {};
      counts[id][v.status] = (counts[id][v.status] ?? 0) + 1;
    }
  }
  console.log("Final status counts per translation:", JSON.stringify(counts, null, 2));
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
