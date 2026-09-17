// One-off helper for the 14 candidate translations' sample verses
// (data/cachedVerses.json). Companion to fetch-sample-verses.mjs.
//
// Only WEB has a no-key API (bible-api.com, same as KJV). The other 13 —
// BSB, GNT, CEV, NIrV, ISV, GW, NCV, MEV, LEB, Voice, LSV, MSB, Message —
// are sourced by hand (Bible Gateway for the 10 it hosts; biblehub.com /
// ebible.org for BSB/LSV/MSB) and pasted into data/cachedVerses.json.
//
//   node scripts/fetch-candidate-verses.mjs
//
// Merges into the file — never clears a hand-sourced value. See
// scripts/verse-clean.mjs: words + punctuation are kept EXACTLY as the
// source returns them; only verse numbers, headings, and Psalm
// superscriptions are dropped and whitespace flattened to one line.

import { readFileSync, writeFileSync } from "node:fs";
import { cleanPlain } from "./verse-clean.mjs";

// Keep in sync with data/verses.json / fetch-sample-verses.mjs's REFS.
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

async function web(ref, tries = 5) {
  for (let i = 0; i < tries; i++) {
    const r = await fetch(`https://bible-api.com/${encodeURIComponent(ref)}?translation=web`);
    if (r.ok) {
      const d = await r.json();
      if (d.text) return cleanPlain(d.text);
    }
    await new Promise((res) => setTimeout(res, 2500));
  }
  return null;
}

const file = new URL("../data/cachedVerses.json", import.meta.url);
const cache = JSON.parse(readFileSync(file, "utf8"));

const missed = [];
for (const ref of REFS) {
  const text = await web(ref);
  if (text) cache.web.verses[ref] = text;
  else missed.push(ref);
  console.log(ref.padEnd(24), text ? "ok" : "MISSED");
  await new Promise((res) => setTimeout(res, 300));
}

writeFileSync(file, JSON.stringify(cache, null, 2) + "\n");
console.log("\nupdated WEB in data/cachedVerses.json.");
console.log(missed.length ? "MISSED: " + missed.join(", ") : "all 42 ok.");
console.log("Hand-sourced (not touched here): BSB, GNT, CEV, NIrV, ISV, GW, NCV, MEV, LEB, Voice, LSV, MSB, Message.");
