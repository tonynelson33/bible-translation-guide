// One-off helper specifically for The Message's sample verses
// (data/cachedVerses.json). Bible Gateway's passage view groups several
// consecutive verses that read as one sentence under a single combined
// span (e.g. "7-10"), with no way to isolate one verse inside it — but the
// underlying published text does carry a distinct verse number at every
// verse (confirmed: Bible Gateway's combined block and biblestudytools.com's
// per-verse rows are word-for-word identical, just displayed differently).
// biblestudytools.com renders every verse as its own
// `<div class="bible-verse-row" data-verse-id="N">`, so it recovers the
// verses Bible Gateway's grouped display can't isolate.
//
//   node scripts/fetch-message-verses.mjs
//
// Merges into the file. Fidelity rule (see scripts/verse-clean.mjs): words +
// punctuation exact as the source returns them; only the verse-number link
// is dropped and whitespace flattened to one line.

import { readFileSync, writeFileSync } from "node:fs";
import * as cheerio from "cheerio";

// Keep in sync with data/verses.json.
const REFS = [
  ["Genesis 1:1", "genesis", 1, 1, 1], ["Joshua 1:9", "joshua", 1, 9, 9],
  ["Psalm 23:1", "psalms", 23, 1, 1], ["Psalm 27:1", "psalms", 27, 1, 1],
  ["Psalm 46:10", "psalms", 46, 10, 10], ["Psalm 119:105", "psalms", 119, 105, 105],
  ["Proverbs 3:5-6", "proverbs", 3, 5, 6], ["Isaiah 40:31", "isaiah", 40, 31, 31],
  ["Isaiah 41:10", "isaiah", 41, 10, 10], ["Isaiah 53:5", "isaiah", 53, 5, 5],
  ["Jeremiah 29:11", "jeremiah", 29, 11, 11], ["Lamentations 3:22-23", "lamentations", 3, 22, 23],
  ["Micah 6:8", "micah", 6, 8, 8], ["Matthew 6:33", "matthew", 6, 33, 33],
  ["Matthew 11:28-30", "matthew", 11, 28, 30], ["Matthew 28:19-20", "matthew", 28, 19, 20],
  ["Luke 1:37", "luke", 1, 37, 37], ["John 1:1", "john", 1, 1, 1],
  ["John 3:16", "john", 3, 16, 16], ["John 8:32", "john", 8, 32, 32],
  ["John 10:10", "john", 10, 10, 10], ["John 11:25-26", "john", 11, 25, 26],
  ["John 14:6", "john", 14, 6, 6], ["Acts 1:8", "acts", 1, 8, 8],
  ["Romans 3:23", "romans", 3, 23, 23], ["Romans 5:8", "romans", 5, 8, 8],
  ["Romans 6:23", "romans", 6, 23, 23], ["Romans 8:28", "romans", 8, 28, 28],
  ["Romans 10:9", "romans", 10, 9, 9], ["Romans 12:1-2", "romans", 12, 1, 2],
  ["1 Corinthians 10:13", "1-corinthians", 10, 13, 13], ["1 Corinthians 13:4-7", "1-corinthians", 13, 4, 7],
  ["2 Corinthians 5:17", "2-corinthians", 5, 17, 17], ["Galatians 5:22-23", "galatians", 5, 22, 23],
  ["Ephesians 2:8-9", "ephesians", 2, 8, 9], ["Philippians 4:6-7", "philippians", 4, 6, 7],
  ["Philippians 4:13", "philippians", 4, 13, 13], ["2 Timothy 1:7", "2-timothy", 1, 7, 7],
  ["2 Timothy 3:16-17", "2-timothy", 3, 16, 17], ["Hebrews 4:12", "hebrews", 4, 12, 12],
  ["Hebrews 11:1", "hebrews", 11, 1, 1], ["1 John 1:9", "1-john", 1, 9, 9],
];

const chapterCache = new Map();
async function fetchChapter(book, chapter) {
  const key = `${book}/${chapter}`;
  if (chapterCache.has(key)) return chapterCache.get(key);
  const url = `https://www.biblestudytools.com/msg/${book}/${chapter}.html`;
  for (let i = 0; i < 4; i++) {
    const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (r.ok) {
      const $ = cheerio.load(await r.text());
      chapterCache.set(key, $);
      return $;
    }
    await new Promise((res) => setTimeout(res, 1500));
  }
  return null;
}

// biblestudytools.com renders straight quotes/apostrophes instead of the
// curly ones Bible Gateway (and every other cached translation) uses —
// confirmed same wording, just flattened typography. Standard smart-quotes
// heuristic: a ' or " opens when it follows whitespace/start-of-string/an
// opening bracket or dash, closes otherwise (covers the run of ordinary
// contractions/possessives and quoted dialogue The Message actually uses).
function smartQuotes(text) {
  return text
    .replace(/(^|[\s([{—-])'/g, "$1‘")
    .replace(/'/g, "’")
    .replace(/(^|[\s([{—-])"/g, "$1“")
    .replace(/"/g, "”");
}

function tidy(text) {
  return smartQuotes(text)
    .replace(/\s+/g, " ")
    // Same source also renders the em-dash as a plain spaced hyphen
    // (confirmed against Bible Gateway's identical wording for the same
    // verses, which keeps a real "—"); normalize to this project's
    // tight-em-dash house style. Only the spaced form — never a hyphenated
    // compound word like "going-to-work", which has no surrounding spaces.
    .replace(/ - /g, "—")
    .replace(/\s*—\s*/g, "—")
    .replace(/\s+([.,;:!?’”])/g, "$1")
    .trim();
}

const file = new URL("../data/cachedVerses.json", import.meta.url);
const cache = JSON.parse(readFileSync(file, "utf8"));

const missed = [];
for (const [ref, book, chapter, vFrom, vTo] of REFS) {
  const $ = await fetchChapter(book, chapter);
  if (!$) { missed.push(ref); console.log(ref.padEnd(24), "MISSED (fetch)"); continue; }
  let combined = "";
  let found = 0;
  for (let v = vFrom; v <= vTo; v++) {
    const row = $(`.bible-verse-row[data-verse-id="${v}"]`);
    if (row.length === 0) continue;
    found++;
    combined += " " + row.find(".bible-text").text();
  }
  if (found === vTo - vFrom + 1) {
    cache.message.verses[ref] = tidy(combined);
    console.log(ref.padEnd(24), "ok");
  } else {
    missed.push(ref);
    console.log(ref.padEnd(24), `MISSED (found ${found}/${vTo - vFrom + 1} verse rows)`);
  }
  await new Promise((res) => setTimeout(res, 200));
}

writeFileSync(file, JSON.stringify(cache, null, 2) + "\n");
console.log(`\n${42 - missed.length}/42 ok${missed.length ? "; MISSED: " + missed.join(", ") : ""}`);
console.log("wrote data/cachedVerses.json");
