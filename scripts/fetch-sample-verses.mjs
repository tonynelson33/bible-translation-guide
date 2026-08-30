// One-off helper for the /verses sample verses.
//
// KJV, ESV, and NET can be pulled from an API (this script). NIV, NLT, CSB,
// NASB, NKJV, and LSB have no API that preserves small-caps and quotation
// marks, so those six are sourced by hand from Bible Gateway in a browser
// session (same as the LSB always was) and pasted into data/cachedVerses.json.
//
//   node scripts/fetch-sample-verses.mjs
//
// See scripts/verse-clean.mjs — the words and punctuation of each verse are
// kept EXACTLY as the source returns them. Only editorial furniture (verse
// numbers, headings, Psalm superscriptions) is dropped and whitespace flattened
// so the verse fits one line.

import { readFileSync, writeFileSync } from "node:fs";
import { cleanPlain, cleanEsv } from "./verse-clean.mjs";

for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] ??= m[2];
}
const ESV_KEY = process.env.ESV_API_KEY;
const REFS = ["John 3:16", "Psalm 23:1", "Genesis 1:1", "Romans 8:28", "Philippians 4:13"];

async function kjv(ref, tries = 5) {
  for (let i = 0; i < tries; i++) {
    const r = await fetch(`https://bible-api.com/${encodeURIComponent(ref)}?translation=kjv`);
    if (r.ok) return cleanPlain((await r.json()).text);
    await new Promise((res) => setTimeout(res, 2500));
  }
  return null;
}
async function esv(ref) {
  const url = `https://api.esv.org/v3/passage/text/?q=${encodeURIComponent(ref)}` +
    "&include-headings=false&include-footnotes=false&include-verse-numbers=false" +
    "&include-short-copyright=false&include-passage-references=false";
  const r = await fetch(url, { headers: { Authorization: `Token ${ESV_KEY}` } });
  return r.ok ? cleanEsv((await r.json()).passages?.[0]) : null;
}

const file = new URL("../data/cachedVerses.json", import.meta.url);
const cache = JSON.parse(readFileSync(file, "utf8"));

for (const ref of REFS) {
  const k = await kjv(ref);
  const e = await esv(ref);
  if (k) cache.kjv.verses[ref] = k;
  if (e) cache.esv.verses[ref] = e;
  console.log(ref, k && e ? "kjv+esv ok" : "PARTIAL — keeping existing");
  await new Promise((res) => setTimeout(res, 500));
}
writeFileSync(file, JSON.stringify(cache, null, 2) + "\n");
console.log("\nupdated kjv + esv in data/cachedVerses.json; other translations unchanged.");
