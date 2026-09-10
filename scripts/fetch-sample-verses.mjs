// One-off helper for the /verses comparison verses (data/cachedVerses.json).
//
// Six translations can be pulled from an API and are fetched here:
//   KJV  -> bible-api.com            (public domain, no key)
//   NET  -> labs.bible.org           (no key)
//   ESV  -> api.esv.org              (ESV_API_KEY)
//   NIV, NKJV, CSB -> api.scripture.api.bible (API_BIBLE_KEY)
//
// The other six — NLT, NASB, NRSVue, CEB, AMP — have no API that keeps
// their punctuation / small-caps, so they are sourced by hand from Bible
// Gateway in a browser session and pasted into data/cachedVerses.json.
// LSB is not on Bible Gateway; it is sourced by hand from read.lsbible.org.
//
//   node scripts/fetch-sample-verses.mjs
//
// Merges into the file — never clears a hand-sourced value. See
// scripts/verse-clean.mjs: words + punctuation are kept EXACTLY as the source
// returns them; only verse numbers, headings, and Psalm superscriptions are
// dropped and whitespace flattened to one line.

import { readFileSync, writeFileSync } from "node:fs";
import { cleanPlain, cleanEsv } from "./verse-clean.mjs";

for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] ??= m[2];
}
const ESV_KEY = process.env.ESV_API_KEY;
const BIBLE_KEY = process.env.API_BIBLE_KEY;
const BIBLE_IDS = {
  niv: "78a9f6124f344018-01",
  nkjv: "63097d2a0a2f7db3-01",
  csb: "a556c5305ee15c3f-01",
};

// Every reference the /verses page will offer. Keep in sync with data/verses.json.
const REFS = [
  "Genesis 1:1",
  "Joshua 1:9",
  "Psalm 23:1",
  "Psalm 27:1",
  "Psalm 46:10",
  "Psalm 119:105",
  "Proverbs 3:5-6",
  "Isaiah 40:31",
  "Isaiah 41:10",
  "Isaiah 53:5",
  "Jeremiah 29:11",
  "Lamentations 3:22-23",
  "Micah 6:8",
  "Matthew 6:33",
  "Matthew 11:28-30",
  "Matthew 28:19-20",
  "Luke 1:37",
  "John 1:1",
  "John 3:16",
  "John 8:32",
  "John 10:10",
  "John 11:25-26",
  "John 14:6",
  "Acts 1:8",
  "Romans 3:23",
  "Romans 5:8",
  "Romans 6:23",
  "Romans 8:28",
  "Romans 10:9",
  "Romans 12:1-2",
  "1 Corinthians 10:13",
  "1 Corinthians 13:4-7",
  "2 Corinthians 5:17",
  "Galatians 5:22-23",
  "Ephesians 2:8-9",
  "Philippians 4:6-7",
  "Philippians 4:13",
  "2 Timothy 1:7",
  "2 Timothy 3:16-17",
  "Hebrews 4:12",
  "Hebrews 11:1",
  "1 John 1:9",
];

const BOOK = {
  Genesis: "GEN", Joshua: "JOS", Psalm: "PSA", Proverbs: "PRO", Isaiah: "ISA",
  Jeremiah: "JER", Lamentations: "LAM", Micah: "MIC",
  Matthew: "MAT", Luke: "LUK", John: "JHN", Acts: "ACT", Romans: "ROM",
  "1 Corinthians": "1CO", "2 Corinthians": "2CO", Galatians: "GAL", Ephesians: "EPH",
  Philippians: "PHP", "2 Timothy": "2TI", Hebrews: "HEB", "1 John": "1JN",
};
function apiId(ref) {
  const m = ref.match(/^(.+?) (\d+):(\d+)(?:-(\d+))?$/);
  const code = BOOK[m[1]];
  if (!code) throw new Error("no book code for " + m[1]);
  return m[4] ? `${code}.${m[2]}.${m[3]}-${code}.${m[2]}.${m[4]}` : `${code}.${m[2]}.${m[3]}`;
}

async function kjv(ref, tries = 5) {
  for (let i = 0; i < tries; i++) {
    const r = await fetch(`https://bible-api.com/${encodeURIComponent(ref)}?translation=kjv`);
    if (r.ok) return cleanPlain((await r.json()).text);
    await new Promise((res) => setTimeout(res, 2500));
  }
  return null;
}
async function net(ref) {
  const r = await fetch(`https://labs.bible.org/api/?passage=${encodeURIComponent(ref)}&type=json`);
  if (!r.ok) return null;
  const d = await r.json();
  return Array.isArray(d) ? cleanPlain(d.map((v) => v.text || "").join(" ")) : null;
}
async function esv(ref) {
  const url = `https://api.esv.org/v3/passage/text/?q=${encodeURIComponent(ref)}` +
    "&include-headings=false&include-footnotes=false&include-verse-numbers=false" +
    "&include-short-copyright=false&include-passage-references=false";
  const r = await fetch(url, { headers: { Authorization: `Token ${ESV_KEY}` } });
  return r.ok ? cleanEsv((await r.json()).passages?.[0]) : null;
}
async function apiBible(ref, id) {
  const pid = apiId(ref);
  const kind = pid.includes("-") ? "passages" : "verses";
  // HTML, not text: content-type=text silently drops footnote / cross-reference
  // markers, which (a) welds the words on either side together when api.bible
  // splits a red-letter run at the marker (NKJV Acts 1:8: "powerwhen") and
  // (b) can leave a stray superscript glyph behind (CSB 2 Tim 1:7: "power, ,").
  // Pulling HTML lets us strip those span/label elements cleanly and turn every
  // remaining tag into a space.
  const url = `https://api.scripture.api.bible/v1/bibles/${id}/${kind}/${pid}` +
    "?content-type=html&include-notes=false&include-titles=false&include-chapter-numbers=false" +
    "&include-verse-numbers=false&include-verse-spans=false";
  const r = await fetch(url, { headers: { "api-key": BIBLE_KEY } });
  if (!r.ok) return null;
  const html = (await r.json()).data?.content;
  if (html == null) return null;
  const text = html
    .replace(/<span[^>]*\bclass="(?:sup|note|f|fr|fq|fqa|ft|x|xo|xt)"[^>]*>[\s\S]*?<\/span>/gi, " ")
    .replace(/<p[^>]*\bclass="(?:cl|ms\d?|mr|s\d?|sr|d|sp|qa)"[^>]*>[\s\S]*?<\/p>/gi, " ")
    .replace(/<[^>]+>/g, " ");
  return cleanPlain(text);
}

// Per-reference corrections for things the source APIs get wrong on their own:
//  - the divine name (YHWH). api.bible (NIV/NKJV/CSB) and labs.bible.org (NET)
//    render it in normal case ("the Lord"); every print edition sets it in small
//    caps, which this project writes as "LORD". Only the verses in this set that
//    actually contain YHWH are listed, and each was checked to hold no ordinary
//    "Lord" (Adonai / the NT sense) that must stay mixed-case.
//  - Psalm 119 / Lamentations acrostic letters. The ESV text endpoint prepends
//    the bare stanza-letter name ("Nun …"); labs.bible.org prepends the Hebrew
//    character and a transliteration ("נ (Nun) …").
const YHWH_VERSES = new Set([
  "Joshua 1:9", "Psalm 23:1", "Psalm 27:1", "Proverbs 3:5-6", "Isaiah 40:31",
  "Jeremiah 29:11", "Lamentations 3:22-23", "Micah 6:8",
]);
const ACROSTIC_NAMES =
  "Aleph|Beth|Gimel|Daleth|Waw|Zayin|Heth|Khet|Teth|Yodh|Kaph|Lamedh|Mem|Nun|Samekh|Ayin|Pe|Tsadhe|Qoph|Resh|Sin|Shin|Taw";
const ACROSTIC_BARE = new RegExp(`^\\s*(?:${ACROSTIC_NAMES})\\s+(?=[A-Z“‘])`);
const ACROSTIC_HEBREW = /^\s*[֐-׿]+\s*(?:\([A-Za-z]+\)\s*)?/;

function tidy(ref, text) {
  if (!text) return text;
  let t = text
    .replace(/\s*#\s*—\s*#\s*/g, "—") // CSB api.bible dash-marker artifact
    .replace(/\s*#\s*/g, " ")
    .replace(ACROSTIC_HEBREW, "")
    .replace(ACROSTIC_BARE, "")
    .replace(/^\s*(?:Psalm|PSALM)\s+\d+\s+(?=[A-Z“‘])/, "")
    // a dash left dangling at either end is the seam of a multi-verse range,
    // not part of the verse
    .replace(/^\s*[—–]\s*/, "")
    .replace(/\s*[—–]\s*$/, "");
  if (YHWH_VERSES.has(ref)) t = t.replace(/\bLord(’s|'s)?\b/g, (_m, s) => "LORD" + (s || ""));
  return t
    .replace(/\s+/g, " ")
    // KJV/ESV/NIV/NKJV/CSB/NET all set the em-dash tight; a space beside one is a
    // poetry line-break the flattening turned into whitespace, not house style.
    .replace(/\s*—\s*/g, "—")
    .replace(/\s+([.,;:!?’”])/g, "$1")
    .trim();
}

const file = new URL("../data/cachedVerses.json", import.meta.url);
const cache = JSON.parse(readFileSync(file, "utf8"));

for (const ref of REFS) {
  const got = {
    kjv: await kjv(ref),
    esv: await esv(ref),
    net: await net(ref),
    niv: await apiBible(ref, BIBLE_IDS.niv),
    nkjv: await apiBible(ref, BIBLE_IDS.nkjv),
    csb: await apiBible(ref, BIBLE_IDS.csb),
  };
  const missed = [];
  for (const [t, text] of Object.entries(got)) {
    if (text) cache[t].verses[ref] = tidy(ref, text);
    else missed.push(t);
  }
  console.log(ref.padEnd(24), missed.length ? "MISSED " + missed.join(",") : "ok (6)");
  await new Promise((res) => setTimeout(res, 500));
}

writeFileSync(file, JSON.stringify(cache, null, 2) + "\n");
console.log("\nupdated KJV/ESV/NET/NIV/NKJV/CSB in data/cachedVerses.json.");
console.log("Hand-sourced (not touched here): NLT, NASB, NRSVue, CEB, AMP (Bible Gateway); LSB (read.lsbible.org).");
