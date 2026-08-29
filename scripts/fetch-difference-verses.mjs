// One-off: fetch verse text for the verses SHOWN on /differences (most verses on
// that page are only referenced, not quoted). Writes data/differenceVerses.json.
//
//   node scripts/fetch-difference-verses.mjs
//
// Needs ESV_API_KEY and API_BIBLE_KEY in the environment (see .env.local).
// KJV -> bible-api.com, NET -> labs.bible.org (no keys). NIV/NKJV -> api.bible.

import { readFileSync, writeFileSync } from "node:fs";

// load .env.local
for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] ??= m[2];
}

const ESV_KEY = process.env.ESV_API_KEY;
const BIBLE_KEY = process.env.API_BIBLE_KEY;
const BIBLE_IDS = { niv: "78a9f6124f344018-01", nkjv: "63097d2a0a2f7db3-01", csb: "a556c5305ee15c3f-01" };

const BOOK = {
  Genesis: "GEN", Exodus: "EXO", Leviticus: "LEV", Deuteronomy: "DEU", "1 Samuel": "1SA",
  Psalm: "PSA", Isaiah: "ISA", Micah: "MIC", Zechariah: "ZEC",
  Matthew: "MAT", Mark: "MRK", Luke: "LUK", John: "JHN", Acts: "ACT", Romans: "ROM",
  "1 Corinthians": "1CO", Colossians: "COL", "1 Timothy": "1TI", "1 John": "1JN", Revelation: "REV",
};

// Verses quoted on the page. Keep this list tight — everything else is described, not quoted.
const REFS = [
  "John 8:7", "Mark 16:16",
  "Matthew 17:21", "Matthew 18:11", "Acts 8:37", "Matthew 23:14",
  "Luke 22:43", "Luke 22:44", "Colossians 1:14", "Romans 8:1", "Matthew 6:13", "Mark 9:29",
  "1 John 5:7", "1 John 5:8", "1 Timothy 3:16", "John 1:18",
  "Mark 1:2", "Revelation 22:19", "Romans 14:10",
  "Deuteronomy 32:8", "1 Samuel 13:1", "Psalm 22:16", "Psalm 8:5", "Zechariah 12:10",
  "Isaiah 7:14", "Isaiah 9:6", "Micah 5:2",
  "1 Corinthians 1:10", "1 Corinthians 6:9",
];

const stripOuter = (s) =>
  s
    .replace(/<[^>]+>/g, " ") // NET web service wraps OT quotes in <b>…</b>
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^[\s"“”]+|[\s"“”]+$/g, "");

function apiRef(reference) {
  const m = reference.match(/^(.+) (\d+):(\d+)$/);
  const code = BOOK[m[1]];
  if (!code) throw new Error("no book code for " + m[1]);
  return `${code}.${m[2]}.${m[3]}`;
}

async function kjv(reference, tries = 3) {
  for (let i = 0; i < tries; i++) {
    const r = await fetch(`https://bible-api.com/${encodeURIComponent(reference)}?translation=kjv`);
    if (r.ok) {
      const d = await r.json();
      return d.text ? stripOuter(d.text) : null;
    }
    await new Promise((res) => setTimeout(res, 1500));
  }
  return null;
}

async function net(reference) {
  const r = await fetch(`https://labs.bible.org/api/?passage=${encodeURIComponent(reference)}&type=json`);
  if (!r.ok) return null;
  const d = await r.json();
  return Array.isArray(d) ? stripOuter(d.map((v) => v.text || "").join(" ")) : null;
}

async function esv(reference) {
  const url = `https://api.esv.org/v3/passage/text/?q=${encodeURIComponent(reference)}` +
    "&include-headings=false&include-footnotes=false&include-verse-numbers=false" +
    "&include-short-copyright=false&include-passage-references=false";
  const r = await fetch(url, { headers: { Authorization: `Token ${ESV_KEY}` } });
  if (!r.ok) return null;
  const d = await r.json();
  const t = d.passages?.[0];
  return t ? stripOuter(t) : null;
}

async function apiBible(reference, id) {
  const url = `https://api.scripture.api.bible/v1/bibles/${id}/verses/${apiRef(reference)}` +
    "?content-type=text&include-notes=false&include-titles=false&include-chapter-numbers=false" +
    "&include-verse-numbers=false&include-verse-spans=false";
  const r = await fetch(url, { headers: { "api-key": BIBLE_KEY } });
  if (!r.ok) return null;
  const d = await r.json();
  return d.data?.content ? stripOuter(d.data.content) : null;
}

const out = {};
for (const reference of REFS) {
  out[reference] = {
    kjv: await kjv(reference),
    esv: await esv(reference),
    niv: await apiBible(reference, BIBLE_IDS.niv),
    nkjv: await apiBible(reference, BIBLE_IDS.nkjv),
    net: await net(reference),
  };
  const missing = Object.entries(out[reference]).filter(([, v]) => !v).map(([k]) => k);
  console.log(reference.padEnd(20), missing.length ? "MISSING: " + missing.join(",") : "ok");
  await new Promise((res) => setTimeout(res, 350));
}

writeFileSync(new URL("../data/differenceVerses.json", import.meta.url), JSON.stringify(out, null, 2) + "\n");
console.log("\nwrote data/differenceVerses.json —", Object.keys(out).length, "verses");
