// Re-check every cached verse on the site against its source text.
//
//   npm run check:verses              all 26 translations, /verses + /differences
//   npm run check:verses -- web net   only these translation ids
//   npm run check:verses -- --punct   also report punctuation-only differences
//
// Sources (the same ones the cache was built from — see data/cachedVerses.README.md):
//   - Bible Gateway passage pages for most translations
//   - ebible.org for the WEB and LSV (the publisher's own WEB; bible-api.com's is older)
//   - bereanbible.com/bsb.txt and majoritybible.com/msb.txt for the BSB and MSB
//
// It only reads; it never writes to the data files. A difference it reports is a lead to
// check by hand, not an automatic fix: the cache's rules (data/cachedVerses.README.md) say the
// text is reproduced exactly as the publisher prints it, with only non-verse furniture removed.
// Re-run it whenever a translation publishes a new edition — the 2026-11-09 audit found the WEB,
// NET and Message text had all gone stale that way, not through typos.
//
// Throttled to one request per ~1.2 s; a full run takes about 5 minutes.

import fs from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const cheerio = require("cheerio");
const root = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const read = (p) => JSON.parse(fs.readFileSync(root + p, "utf8"));

const args = process.argv.slice(2);
const PUNCT = args.includes("--punct");
const only = args.filter((a) => !a.startsWith("--"));

const sampleRefs = read("data/verses.json").map((v) => v.reference);
const cached = read("data/cachedVerses.json");
const diffData = read("data/differenceVerses.json");

const UA = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0 Safari/537.36" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function get(url) {
  await sleep(1200);
  const res = await fetch(url, { headers: UA });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res;
}

const BG = {
  esv: "ESV", kjv: "KJV", niv: "NIV", nlt: "NLT", csb: "CSB", lsb: "LSB", nkjv: "NKJV", nasb: "NASB",
  net: "NET", nrsvue: "NRSVUE", ceb: "CEB", amp: "AMP", gnt: "GNT", cev: "CEV", nirv: "NIRV",
  isv: "ISV", gw: "GW", ncv: "NCV", mev: "MEV", leb: "LEB", voice: "VOICE", message: "MSG",
};
// Bible Gateway runs The Voice's study notes into the verse and returns The Message's
// multi-verse paragraphs whole, so for these two the cached text only has to appear inside it.
const CONTAINED = new Set(["voice", "message"]);

// Known, deliberate differences (see data/cachedVerses.README.md, "Verification").
const KNOWN = [
  // KJV here is the standard 1769 text; Bible Gateway's modernizes a few spellings.
  (id, ref, d) => id === "kjv" && d.every((w) => ["+always", "-alway", "+thoroughly", "-throughly"].includes(w)),
  // ebible.org (the WEB's publisher) reads "on the earth"; Bible Gateway's WEB still has "in".
  (id, ref, d) => id === "web" && ref === "Psalm 46:10" && d.join(" ") === "+in -on",
  // Mark 9:44 and 9:46 are word-for-word identical, so /differences prints the text once.
  (id, ref, d) => ref === "Mark 9:44 and 9:46" && d.every((w) => w.startsWith("+")),
];
// Punctuation/capitalization differences that are the 1769 KJV's own printing, where Bible
// Gateway's KJV is a modernized one ("JESUS", "most High", "spirit", colon vs. semicolon).
const KNOWN_PUNCT = new Set([
  "kjv|Lamentations 3:22-23", "kjv|1 Corinthians 15:47", "kjv|1 John 5:8", "kjv|John 1:18",
  "kjv|Matthew 1:25", "kjv|Deuteronomy 32:8",
]);

/* ---------- normalizers ---------- */
const words = (s) =>
  s.toLowerCase().replace(/[’‘]/g, "'").replace(/[^a-z0-9' ]+/g, " ")
    .replace(/'(?![a-z])|(?<![a-z])'/g, " ").split(/\s+/).filter(Boolean);
const punct = (s) =>
  s.replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/\s*[—–]\s*/g, "—").replace(/\s+/g, " ")
    .replace(/\bLORD'S\b/g, "Lord's").replace(/\bLORD\b/g, "Lord").replace(/\bGOD\b/g, "God").replace(/(\w)\*(\w)/g, "$1$2").replace(/ \*(\w)/g, " $1").trim();
// Psalm titles and acrostic letters the sources glue to the verse; the cache drops them.
const stripFurniture = (s) =>
  s.replace(/^(?:A PSALM OF DAVID\.|BY DAVID\.|\[[A-Z]+\])\s*/, "")
    .replace(/^(?:A Psalm of David\.|Of David\.)\s*/, "")
    .replace(/\s*\|\|\s*/g, " ")
    .replace(/\s+(?:[1-3] )?[A-Z][a-z]+(?: [A-Z][a-z]+)? < \d+ >\s*$/, "")
    .replace(/\s+/g, " ").trim();

function wordDiff(a, b) {
  const n = a.length, m = b.length;
  const dp = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--)
    dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const ops = [];
  let i = 0, j = 0;
  while (i < n || j < m) {
    if (i < n && j < m && a[i] === b[j]) { i++; j++; continue; }
    if (j < m && (i === n || dp[i][j + 1] >= dp[i + 1][j])) ops.push("+" + b[j++]);
    else ops.push("-" + a[i++]);
  }
  return ops;
}

/* ---------- sources ---------- */
async function bibleGateway(code, ref) {
  const q = ref.replace(/^(.*) (\d+):(\d+) and (\d+):(\d+)$/, "$1 $2:$3; $1 $4:$5");
  const html = await (await get(`https://www.biblegateway.com/passage/?search=${encodeURIComponent(q)}&version=${code}`)).text();
  const $ = cheerio.load(html);
  const parts = $(".passage-text span.text").toArray()
    .filter((s) => $(s).closest("h1,h2,h3,h4,h5,h6,.psalm-title,.psalm-acrostic,.chapter-heading").length === 0)
    .map((s) => { const c = $(s).clone(); c.find("sup, .chapternum, .versenum, .footnote, .crossreference, .footnotes").remove(); return c.text(); });
  return parts.join(" ").replace(/\s+/g, " ").trim() || null;
}

const EBIBLE_CODE = {
  Genesis: "GEN", Joshua: "JOS", Psalm: "PSA", Proverbs: "PRO", Isaiah: "ISA", Jeremiah: "JER",
  Lamentations: "LAM", Micah: "MIC", Matthew: "MAT", Luke: "LUK", John: "JHN", Acts: "ACT",
  Romans: "ROM", "1 Corinthians": "1CO", "2 Corinthians": "2CO", Galatians: "GAL", Ephesians: "EPH",
  Philippians: "PHP", "2 Timothy": "2TI", Hebrews: "HEB", "1 John": "1JN",
};
const parseRef = (r) => {
  const m = r.match(/^(.+) (\d+):(\d+)(?:-(\d+))?$/);
  return { book: m[1], ch: +m[2], v1: +m[3], v2: +(m[4] ?? m[3]) };
};
const ebibleCache = new Map();
async function ebible(mod, ref) {
  const { book, ch, v1, v2 } = parseRef(ref);
  const code = EBIBLE_CODE[book];
  const key = `${mod}/${code}${ch}`;
  if (!ebibleCache.has(key)) {
    const pad = code === "PSA" ? String(ch).padStart(3, "0") : String(ch).padStart(2, "0");
    const html = await (await get(`https://ebible.org/${mod}/${code}${pad}.htm`)).text();
    const $ = cheerio.load(html);
    $(".notemark, .popup, .footnote, .tnav, .s, .s1, .s2, .ms, .mr, .r, .d, .qa, .copyright").remove();
    const body = $(".main").html() ?? $("body").html();
    const parts = body.split(/<span class="verse" id="V(\d+)">.*?<\/span>/);
    const verses = {};
    for (let i = 1; i < parts.length - 1; i += 2)
      verses[+parts[i]] = cheerio.load(parts[i + 1]).text().replace(/ /g, " ").replace(/\s+/g, " ").trim();
    ebibleCache.set(key, verses);
  }
  const vs = ebibleCache.get(key);
  const out = [];
  for (let v = v1; v <= v2; v++) out.push(vs[v] ?? "<<missing>>");
  return out.join(" ");
}

const txtCache = new Map();
async function fullText(url, ref) {
  if (!txtCache.has(url)) {
    const buf = Buffer.from(await (await get(url)).arrayBuffer());
    let text = buf.toString("utf8");
    if (text.includes("�")) text = new TextDecoder("windows-1252").decode(buf); // msb.txt
    const map = {};
    for (const line of text.replace(/^﻿/, "").split(/\r?\n/)) {
      const [k, v] = line.split("\t");
      if (k && v) map[k.trim()] = v.trim();
    }
    txtCache.set(url, map);
  }
  const map = txtCache.get(url);
  const { book, ch, v1, v2 } = parseRef(ref);
  const out = [];
  for (let v = v1; v <= v2; v++) out.push(map[`${book} ${ch}:${v}`] ?? "<<missing>>");
  return out.join(" ");
}

async function source(id, ref) {
  if (BG[id]) return bibleGateway(BG[id], ref);
  if (id === "web") return ebible("eng-web", ref);
  if (id === "lsv") return ebible("englsv", ref);
  if (id === "bsb") return fullText("https://bereanbible.com/bsb.txt", ref);
  if (id === "msb") return fullText("https://majoritybible.com/msb.txt", ref);
  return null;
}

/* ---------- run ---------- */
const jobs = [];
for (const id of Object.keys(cached)) {
  if (only.length && !only.includes(id)) continue;
  for (const ref of sampleRefs) jobs.push({ page: "/verses", id, ref, text: cached[id].verses[ref] });
}
for (const [ref, byId] of Object.entries(diffData))
  for (const [id, text] of Object.entries(byId))
    if (text && (!only.length || only.includes(id))) jobs.push({ page: "/differences", id, ref, text });

console.log(`Checking ${jobs.length} verses…`);
let problems = 0, punctOnly = 0, failed = 0;
for (const j of jobs) {
  let ref;
  try { ref = await source(j.id, j.ref); } catch (e) { failed++; console.log(`FETCH FAILED ${j.id} ${j.ref}: ${e.message}`); continue; }
  if (!ref) { failed++; console.log(`NO SOURCE TEXT ${j.id} ${j.ref}`); continue; }
  if (!j.text) { problems++; console.log(`MISSING ${j.page} ${j.id} ${j.ref}`); continue; }
  const src = stripFurniture(ref);
  if (CONTAINED.has(j.id)) {
    if (!(" " + words(src).join(" ") + " ").includes(" " + words(j.text).join(" ") + " ")) {
      problems++;
      console.log(`WORDS ${j.page} ${j.id} ${j.ref}: not found in the source paragraph\n  site:   ${j.text}\n  source: ${src.slice(0, 600)}`);
    }
    continue;
  }
  const d = wordDiff(words(j.text), words(src));
  if (d.length && !KNOWN.some((k) => k(j.id, j.ref, d))) {
    problems++;
    console.log(`WORDS ${j.page} ${j.id} ${j.ref}: ${d.join(" ")}\n  site:   ${j.text}\n  source: ${src}`);
  } else if (!d.length && PUNCT && punct(j.text) !== punct(src) && !KNOWN_PUNCT.has(`${j.id}|${j.ref}`)) {
    punctOnly++;
    console.log(`PUNCT ${j.page} ${j.id} ${j.ref}\n  site:   ${j.text}\n  source: ${src}`);
  }
}
console.log(`\n${problems} word differences${PUNCT ? `, ${punctOnly} punctuation-only differences` : ""}, ${failed} could not be fetched.`);
process.exit(problems || failed ? 1 : 0);
