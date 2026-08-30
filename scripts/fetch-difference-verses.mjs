// One-off: fetch verse text for the passages QUOTED on /differences. Writes
// data/differenceVerses.json ({ [reference]: { kjv, esv, niv, nkjv, net } };
// a null value means that translation drops the text from its running text).
//
//   node scripts/fetch-difference-verses.mjs
//
// Needs ESV_API_KEY and API_BIBLE_KEY in the environment (see .env.local).
// KJV -> bible-api.com, NET -> labs.bible.org (no keys). NIV/NKJV -> api.bible.

import { readFileSync, writeFileSync } from "node:fs";
import { cleanPlain, cleanEsv } from "./verse-clean.mjs";

for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] ??= m[2];
}

const ESV_KEY = process.env.ESV_API_KEY;
const BIBLE_KEY = process.env.API_BIBLE_KEY;
const BIBLE_IDS = { niv: "78a9f6124f344018-01", nkjv: "63097d2a0a2f7db3-01" };

const BOOK = {
  Genesis: "GEN", Exodus: "EXO", Leviticus: "LEV", Deuteronomy: "DEU", "1 Samuel": "1SA",
  Psalm: "PSA", Isaiah: "ISA", Micah: "MIC", Zechariah: "ZEC",
  Matthew: "MAT", Mark: "MRK", Luke: "LUK", John: "JHN", Acts: "ACT", Romans: "ROM",
  "1 Corinthians": "1CO", Colossians: "COL", "1 Timothy": "1TI", "1 John": "1JN", Revelation: "REV",
};

// [reference, [translations to fetch]]. Default is kjv + esv.
const REFS = [
  // missing phrases
  ["Acts 9:5-6", ["kjv", "esv"]],
  ["John 5:3-4", ["kjv", "esv"]],
  ["Luke 9:55-56", ["kjv", "esv"]],
  ["Luke 22:43-44", ["kjv", "esv"]],
  ["Matthew 6:13", ["kjv", "esv"]],
  ["Luke 4:4", ["kjv", "esv"]],
  ["Luke 23:34", ["kjv", "esv"]],
  ["Luke 24:12", ["kjv", "esv"]],
  ["Romans 8:1", ["kjv", "esv"]],
  ["Luke 4:8", ["kjv", "esv"]],
  ["Colossians 1:14", ["kjv", "esv"]],
  // single words
  ["Matthew 27:35", ["kjv", "esv"]],
  ["Mark 1:2", ["kjv", "esv"]],
  ["Mark 9:29", ["kjv", "esv"]],
  ["Luke 11:2-4", ["kjv", "esv"]],
  ["Romans 14:10", ["kjv", "esv"]],
  ["1 Corinthians 15:47", ["kjv", "esv"]],
  ["Revelation 22:19", ["kjv", "esv"]],
  ["Revelation 1:11", ["kjv", "esv"]],
  // wording that touches doctrine
  ["1 John 5:7", ["kjv", "esv"]],
  ["1 John 5:8", ["kjv", "esv"]],
  ["1 Timothy 3:16", ["kjv", "esv"]],
  ["John 1:18", ["kjv", "esv"]],
  ["Luke 2:14", ["kjv", "esv"]],
  ["Matthew 1:25", ["kjv", "esv"]],
  // Old Testament
  ["Deuteronomy 32:8", ["kjv", "esv"]],
  ["1 Samuel 13:1", ["kjv", "esv"]],
  ["Psalm 22:16", ["kjv", "esv", "net"]],
  ["Psalm 8:5", ["kjv", "esv"]],
  ["Zechariah 12:10", ["kjv", "esv"]],
  // Part 2 — translation choices
  ["Isaiah 7:14", ["kjv", "esv", "net"]],
  ["Isaiah 9:6", ["kjv", "esv"]],
  ["Micah 5:2", ["kjv", "esv", "niv"]],
  ["1 Corinthians 1:10", ["kjv", "esv", "niv"]],
  ["1 Corinthians 6:9-10", ["kjv", "esv", "niv", "nkjv"]],
  ["1 Timothy 1:10", ["kjv", "esv", "niv"]],
  ["Leviticus 6:25", ["kjv", "esv"]],
  ["Matthew 4:24", ["kjv", "esv", "niv"]],
];

function apiId(ref) {
  const m = ref.match(/^(.+?) (\d+):(\d+)(?:-(\d+))?$/);
  const code = BOOK[m[1]];
  if (!code) throw new Error("no book code for " + m[1]);
  return m[4] ? `${code}.${m[2]}.${m[3]}-${code}.${m[2]}.${m[4]}` : `${code}.${m[2]}.${m[3]}`;
}

async function kjv(ref, tries = 4) {
  for (let i = 0; i < tries; i++) {
    const r = await fetch(`https://bible-api.com/${encodeURIComponent(ref)}?translation=kjv`);
    if (r.ok) {
      const d = await r.json();
      return d.text ? cleanPlain(d.text) : null;
    }
    await new Promise((res) => setTimeout(res, 2000));
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
  if (!r.ok) return null;
  const d = await r.json();
  return d.passages?.[0] ? cleanEsv(d.passages[0]) : null;
}

async function apiBible(ref, id) {
  const pid = apiId(ref);
  const kind = pid.includes("-") ? "passages" : "verses";
  const url = `https://api.scripture.api.bible/v1/bibles/${id}/${kind}/${pid}` +
    "?content-type=text&include-notes=false&include-titles=false&include-chapter-numbers=false" +
    "&include-verse-numbers=false&include-verse-spans=false";
  const r = await fetch(url, { headers: { "api-key": BIBLE_KEY } });
  if (!r.ok) return null;
  const d = await r.json();
  return d.data?.content ? cleanPlain(d.data.content) : null;
}

const out = {};
for (const [ref, want] of REFS) {
  const row = {};
  if (want.includes("kjv")) row.kjv = await kjv(ref);
  if (want.includes("esv")) row.esv = await esv(ref);
  if (want.includes("niv")) row.niv = await apiBible(ref, BIBLE_IDS.niv);
  if (want.includes("nkjv")) row.nkjv = await apiBible(ref, BIBLE_IDS.nkjv);
  if (want.includes("net")) row.net = await net(ref);
  out[ref] = row;
  const missing = Object.entries(row).filter(([, v]) => !v).map(([k]) => k);
  console.log(ref.padEnd(22), missing.length ? "MISSING: " + missing.join(",") : "ok");
  await new Promise((res) => setTimeout(res, 400));
}

writeFileSync(new URL("../data/differenceVerses.json", import.meta.url), JSON.stringify(out, null, 2) + "\n");
console.log("\nwrote data/differenceVerses.json —", Object.keys(out).length, "passages");
