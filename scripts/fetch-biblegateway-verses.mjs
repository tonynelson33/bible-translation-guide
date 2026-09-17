// One-off helper for the candidate translations Bible Gateway hosts but no
// no-key API covers: CEV, GNT, ISV, GW, NCV, MEV, LEB, NIrV, Voice, Message
// (data/cachedVerses.json). BSB/LSV/MSB use bible.helloao.org instead
// (fetch-helloao-verses.mjs); WEB uses bible-api.com (fetch-candidate-verses.mjs).
//
//   node scripts/fetch-biblegateway-verses.mjs [id...]
//
// Bible Gateway caps a multi-reference ?search=Ref1;Ref2;...  query at 25
// passages, so each translation is fetched in two batches (25 + 17). Each
// verse is a `<span class="text Book-Chapter-Verse">` — sometimes several
// consecutive verses collapse into one combined span (e.g.
// "Eph-2-8-Eph-2-9") when a translation renders them as one sentence, so
// verse numbers are matched anywhere inside any class token rather than by
// an exact class name. Headings/subtitles reuse the same class on the verse
// they introduce, so heading-wrapped spans are excluded. The LORD/YHWH
// small-caps rendering is a `.small-caps` inline style, not literal
// uppercase text, and is upper-cased before the markup is stripped.
//
// Merges into the file — never clears a hand-sourced value. Fidelity rule
// (see scripts/verse-clean.mjs): words + punctuation exact as the source
// returns them; only headings/footnote/cross-reference markers dropped,
// poetic line breaks flattened to one line.

import { readFileSync, writeFileSync } from "node:fs";
import * as cheerio from "cheerio";

const VERSIONS = {
  gnt: "GNT", cev: "CEV", nirv: "NIRV", isv: "ISV", gw: "GW",
  ncv: "NCV", mev: "MEV", leb: "LEB", voice: "VOICE", message: "MSG",
};

// Keep in sync with data/verses.json.
const REFS = [
  ["Genesis 1:1", "Gen", 1, 1, 1], ["Joshua 1:9", "Josh", 1, 9, 9],
  ["Psalm 23:1", "Ps", 23, 1, 1], ["Psalm 27:1", "Ps", 27, 1, 1],
  ["Psalm 46:10", "Ps", 46, 10, 10], ["Psalm 119:105", "Ps", 119, 105, 105],
  ["Proverbs 3:5-6", "Prov", 3, 5, 6], ["Isaiah 40:31", "Isa", 40, 31, 31],
  ["Isaiah 41:10", "Isa", 41, 10, 10], ["Isaiah 53:5", "Isa", 53, 5, 5],
  ["Jeremiah 29:11", "Jer", 29, 11, 11], ["Lamentations 3:22-23", "Lam", 3, 22, 23],
  ["Micah 6:8", "Mic", 6, 8, 8], ["Matthew 6:33", "Matt", 6, 33, 33],
  ["Matthew 11:28-30", "Matt", 11, 28, 30], ["Matthew 28:19-20", "Matt", 28, 19, 20],
  ["Luke 1:37", "Luke", 1, 37, 37], ["John 1:1", "John", 1, 1, 1],
  ["John 3:16", "John", 3, 16, 16], ["John 8:32", "John", 8, 32, 32],
  ["John 10:10", "John", 10, 10, 10], ["John 11:25-26", "John", 11, 25, 26],
  ["John 14:6", "John", 14, 6, 6], ["Acts 1:8", "Acts", 1, 8, 8],
  ["Romans 3:23", "Rom", 3, 23, 23],
  // batch 2 (indices 25-41)
  ["Romans 5:8", "Rom", 5, 8, 8], ["Romans 6:23", "Rom", 6, 23, 23],
  ["Romans 8:28", "Rom", 8, 28, 28], ["Romans 10:9", "Rom", 10, 9, 9],
  ["Romans 12:1-2", "Rom", 12, 1, 2], ["1 Corinthians 10:13", "1Cor", 10, 13, 13],
  ["1 Corinthians 13:4-7", "1Cor", 13, 4, 7], ["2 Corinthians 5:17", "2Cor", 5, 17, 17],
  ["Galatians 5:22-23", "Gal", 5, 22, 23], ["Ephesians 2:8-9", "Eph", 2, 8, 9],
  ["Philippians 4:6-7", "Phil", 4, 6, 7], ["Philippians 4:13", "Phil", 4, 13, 13],
  ["2 Timothy 1:7", "2Tim", 1, 7, 7], ["2 Timothy 3:16-17", "2Tim", 3, 16, 17],
  ["Hebrews 4:12", "Heb", 4, 12, 12], ["Hebrews 11:1", "Heb", 11, 1, 1],
  ["1 John 1:9", "1John", 1, 9, 9],
];
const BATCH1 = REFS.slice(0, 25);
const BATCH2 = REFS.slice(25);

function batchUrl(batch, version) {
  const search = batch.map(([ref]) => ref).join(";");
  return `https://www.biblegateway.com/passage/?search=${encodeURIComponent(search)}&version=${version}`;
}

async function fetchHtml(url, tries = 4) {
  for (let i = 0; i < tries; i++) {
    const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (r.ok) return r.text();
    await new Promise((res) => setTimeout(res, 2000));
  }
  throw new Error("failed to fetch " + url);
}

function extractBatch($, batch) {
  const out = {};
  for (const [ref, book, chapter, vFrom, vTo] of batch) {
    // A translation (The Message especially) can merge several consecutive
    // verses into one span, naming only the first and last in its class
    // (e.g. "Isa-53-2-Isa-53-6" for a combined vv.2-6). A span is only used
    // when its own range is fully CONTAINED in [vFrom,vTo] — an exact single
    // verse, an exact combined pair/range we asked for in full, or several
    // such spans together covering it. A span that spills outside the
    // requested range (e.g. merges in verse 2 or 6 when we asked only for 5)
    // is skipped rather than quoting neighboring verses under this
    // reference's name — same "cache fewer verses than mangle one" rule
    // used elsewhere in this project.
    const re = new RegExp(`${book}-${chapter}-(\\d+)`, "g");
    const spans = [];
    $(".text").each((_, el) => {
      const $el = $(el);
      if ($el.closest("h1,h2,h3,h4,h5,h6").length) return;
      // The Voice interleaves editorial commentary essays into the passage
      // view, reusing the same verse class inside a `.long-aside`/
      // `.short-aside` wrapper alongside the real verse text elsewhere in
      // the passage — exclude those, not part of the translation itself.
      if ($el.closest('[class*="aside"]').length) return;
      const classes = ($el.attr("class") || "").split(/\s+/);
      let spanMin = null, spanMax = null;
      for (const token of classes) {
        re.lastIndex = 0;
        let m;
        while ((m = re.exec(token))) {
          const n = Number(m[1]);
          if (spanMin === null || n < spanMin) spanMin = n;
          if (spanMax === null || n > spanMax) spanMax = n;
        }
      }
      if (spanMin !== null && spanMin >= vFrom && spanMax <= vTo) spans.push(el);
    });
    let combined = "";
    for (const span of spans) {
      const $clone = $(span).clone();
      $clone.find(".small-caps").each((_, sc) => { $(sc).text($(sc).text().toUpperCase()); });
      $clone.find("sup.footnote, sup.crossreference, sup.versenum, .chapternum, .versenum").remove();
      combined += " " + $clone.text();
    }
    const text = combined.replace(/\s+/g, " ").trim();
    if (text) out[ref] = text;
  }
  return out;
}

const file = new URL("../data/cachedVerses.json", import.meta.url);
const cache = JSON.parse(readFileSync(file, "utf8"));

const requested = process.argv.slice(2);
const ids = requested.length ? requested : Object.keys(VERSIONS);

for (const id of ids) {
  const version = VERSIONS[id];
  if (!version) { console.log("skip (no Bible Gateway version code):", id); continue; }
  console.log(`\n=== ${id} (${version}) ===`);
  const html1 = await fetchHtml(batchUrl(BATCH1, version));
  const $1 = cheerio.load(html1);
  const out1 = extractBatch($1, BATCH1);
  await new Promise((res) => setTimeout(res, 1000));
  const html2 = await fetchHtml(batchUrl(BATCH2, version));
  const $2 = cheerio.load(html2);
  const out2 = extractBatch($2, BATCH2);

  const merged = { ...out1, ...out2 };
  const missed = REFS.map(([ref]) => ref).filter((ref) => !merged[ref]);
  console.log(`  ${Object.keys(merged).length}/42 ok${missed.length ? "; MISSED: " + missed.join(", ") : ""}`);

  if (!cache[id]) cache[id] = { attribution: "", verses: {} };
  Object.assign(cache[id].verses, merged);
  await new Promise((res) => setTimeout(res, 1000));
}

writeFileSync(file, JSON.stringify(cache, null, 2) + "\n");
console.log("\nwrote data/cachedVerses.json");
