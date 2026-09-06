// Scrape usachurches.org "Non-Denominational / Independent" category (~2,890 listings).
// Category pages only: name + street + city + state. Paginated by /N/ offset, step 20.
// robots.txt permits crawling; ToU restricts *commercial* redistribution — this is a
// non-commercial category-field enrichment against our own church table.
import fs from "node:fs";

const UA = "bible-translation-guide/1.0 (non-commercial church directory; contact tonynelson33@gmail.com)";
const BASE = "https://www.usachurches.org/christian/other/non-denominational-independent";
const OUT = "scripts/usachurches-nondenom.ndjson";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// One listing block: <a href=".../church/SLUG.htm">NAME</a> ... <span ...>Size: <a...>SIZE</a><br>STREET<br>CITY, ST</span>
const BLOCK =
  /<a href="https:\/\/www\.usachurches\.org\/church\/([^"]+?)\.htm">([^<]+)<\/a><\/strong><br><span[^>]*>Size:\s*<a[^>]*>([^<]*)<\/a><br>([^<]*)<br>([^<]*?),\s*([A-Z]{2})<\/span>/g;

async function getPage(offset) {
  const url = offset === 0 ? `${BASE}/` : `${BASE}/${offset}/`;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const r = await fetch(url, { headers: { "User-Agent": UA } });
      if (r.status === 404) return { rows: [], done: true };
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const html = await r.text();
      const rows = [];
      for (const m of html.matchAll(BLOCK)) {
        rows.push({
          slug: m[1].trim(),
          name: m[2].replace(/&amp;/g, "&").trim(),
          size: m[3].trim(),
          street: m[4].replace(/&amp;/g, "&").trim(),
          city: m[5].replace(/&amp;/g, "&").trim(),
          st: m[6].trim(),
        });
      }
      const hasNext = html.includes(`/${offset + 20}/">Next`) || /">\s*Next/.test(html);
      return { rows, done: rows.length === 0 || !hasNext };
    } catch (e) {
      if (attempt === 3) { console.error(`  offset ${offset}: ${e.message}`); return { rows: [], done: false, err: true }; }
      await sleep(1500 * (attempt + 1));
    }
  }
}

const all = new Map();
let offset = 0;
for (let i = 0; i < 200; i++) {
  const { rows, done } = await getPage(offset);
  for (const r of rows) all.set(r.slug, r);
  process.stdout.write(`\r offset ${offset}  (+${rows.length})  total ${all.size}   `);
  if (done && rows.length === 0) break;
  offset += 20;
  await sleep(900);
}
console.log();

const list = [...all.values()];
fs.writeFileSync(OUT, list.map((r) => JSON.stringify(r)).join("\n") + "\n");
const bySize = {};
for (const r of list) bySize[r.size] = (bySize[r.size] || 0) + 1;
console.log(`wrote ${list.length} → ${OUT}`);
console.log("by size:", bySize);
console.log("with street:", list.filter((r) => r.street).length, "| with city+st:", list.filter((r) => r.city && r.st).length);
