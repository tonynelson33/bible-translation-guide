// One-off helper for BSB / LSV / MSB sample verses (data/cachedVerses.json),
// sourced from bible.helloao.org's free, no-key, structured JSON API — each
// chapter's verses are typed content blocks (plain strings or {text, poem,
// lineBreak, noteId} objects), so headings/subtitles/footnote markers are
// already structurally separate from verse text, not embedded in it.
//
//   node scripts/fetch-helloao-verses.mjs
//
// Merges into the file — never clears a hand-sourced value. Fidelity rule
// (see scripts/verse-clean.mjs): words + punctuation exact as the source
// returns them; only headings/footnote markers dropped, poetic line breaks
// flattened to one line.

import { readFileSync, writeFileSync } from "node:fs";

const TRANSLATIONS = { bsb: "BSB", lsv: "eng_lsv", msb: "eng_msb" };

// Keep in sync with data/verses.json.
const REFS = [
  "Genesis 1:1", "Joshua 1:9", "Psalm 23:1", "Psalm 27:1", "Psalm 46:10",
  "Psalm 119:105", "Proverbs 3:5-6", "Isaiah 40:31", "Isaiah 41:10",
  "Isaiah 53:5", "Jeremiah 29:11", "Lamentations 3:22-23", "Micah 6:8",
  "Matthew 6:33", "Matthew 11:28-30", "Matthew 28:19-20", "Luke 1:37",
  "John 1:1", "John 3:16", "John 8:32", "John 10:10", "John 11:25-26",
  "John 14:6", "Acts 1:8", "Romans 3:23", "Romans 5:8", "Romans 6:23",
  "Romans 8:28", "Romans 10:9", "Romans 12:1-2", "1 Corinthians 10:13",
  "1 Corinthians 13:4-7", "2 Corinthians 5:17", "Galatians 5:22-23",
  "Ephesians 2:8-9", "Philippians 4:6-7", "Philippians 4:13",
  "2 Timothy 1:7", "2 Timothy 3:16-17", "Hebrews 4:12", "Hebrews 11:1",
  "1 John 1:9",
];

const BOOK = {
  Genesis: "GEN", Joshua: "JOS", Psalm: "PSA", Proverbs: "PRO", Isaiah: "ISA",
  Jeremiah: "JER", Lamentations: "LAM", Micah: "MIC",
  Matthew: "MAT", Luke: "LUK", John: "JHN", Acts: "ACT", Romans: "ROM",
  "1 Corinthians": "1CO", "2 Corinthians": "2CO", Galatians: "GAL", Ephesians: "EPH",
  Philippians: "PHP", "2 Timothy": "2TI", Hebrews: "HEB", "1 John": "1JN",
};

function parseRef(ref) {
  const m = ref.match(/^(.+?) (\d+):(\d+)(?:-(\d+))?$/);
  const book = BOOK[m[1]];
  if (!book) throw new Error("no book code for " + m[1]);
  const chapter = Number(m[2]);
  const vFrom = Number(m[3]);
  const vTo = m[4] ? Number(m[4]) : vFrom;
  return { book, chapter, vFrom, vTo };
}

function verseText(verse) {
  return verse.content
    .map((item) => (typeof item === "string" ? item : item.text || ""))
    .join(" ");
}

// LSV's raw strings (unlike BSB/MSB's structured {text,poem} objects) embed
// poetic line breaks as literal "||" and acrostic stanza letters as a
// bracketed "[NUN]" prefix instead of a separate heading block; both need
// stripping to match this project's flattened, superscription-free style.
const ACROSTIC_NAMES =
  "Aleph|Beth|Gimel|Daleth|He|Waw|Zayin|Heth|Teth|Yodh|Kaph|Lamedh|Mem|Nun|Samekh|Ayin|Pe|Tsadhe|Qoph|Resh|Sin|Shin|Taw";
const ACROSTIC_BRACKET = new RegExp(`^\\s*\\[(?:${ACROSTIC_NAMES})\\]\\s*`, "i");
const SUPERSCRIPTION =
  /^(?:(?:A|To the choirmaster\.?)[^.]*\bof David\.?|(?:Of|By) David\.)\s*/i;

function tidy(text) {
  return text
    .replace(/\s*\|\|?\s*/g, " ")
    .replace(ACROSTIC_BRACKET, "")
    .replace(SUPERSCRIPTION, "")
    .replace(/\s+/g, " ")
    .replace(/\s*—\s*/g, "—")
    .replace(/\s+([.,;:!?’”])/g, "$1")
    .trim();
}

async function fetchChapter(translationId, book, chapter, tries = 5) {
  for (let i = 0; i < tries; i++) {
    const r = await fetch(`https://bible.helloao.org/api/${translationId}/${book}/${chapter}.json`);
    if (r.ok) return r.json();
    await new Promise((res) => setTimeout(res, 2000));
  }
  return null;
}

const file = new URL("../data/cachedVerses.json", import.meta.url);
const cache = JSON.parse(readFileSync(file, "utf8"));

for (const [id, translationId] of Object.entries(TRANSLATIONS)) {
  const missed = [];
  for (const ref of REFS) {
    const { book, chapter, vFrom, vTo } = parseRef(ref);
    const data = await fetchChapter(translationId, book, chapter);
    if (!data) { missed.push(ref); console.log(id, ref.padEnd(24), "MISSED (fetch)"); continue; }
    const verses = data.chapter.content.filter(
      (c) => c.type === "verse" && c.number >= vFrom && c.number <= vTo
    );
    if (verses.length === 0) { missed.push(ref); console.log(id, ref.padEnd(24), "MISSED (no verse)"); continue; }
    const text = tidy(verses.map(verseText).join(" "));
    cache[id].verses[ref] = text;
    console.log(id, ref.padEnd(24), "ok");
    await new Promise((res) => setTimeout(res, 150));
  }
  console.log(`\n${id}: ${missed.length ? "MISSED " + missed.join(", ") : "all 42 ok"}\n`);
}

writeFileSync(file, JSON.stringify(cache, null, 2) + "\n");
console.log("updated BSB/LSV/MSB in data/cachedVerses.json.");
