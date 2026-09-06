// Second pass: fetch each usachurches.org non-denominational detail page for
// coords (from the embedded Google Maps link), ZIP, and website.
// Input: scripts/usachurches-nondenom.ndjson  →  Output: scripts/usachurches-nondenom-details.ndjson
import fs from "node:fs";

const UA = "bible-translation-guide/1.0 (non-commercial church directory; contact tonynelson33@gmail.com)";
const IN = "scripts/usachurches-nondenom.ndjson";
const OUT = "scripts/usachurches-nondenom-details.ndjson";
const CONCURRENCY = 5;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const SOCIAL = /(facebook|twitter|instagram|youtube|vimeo|tiktok|linkedin|flickr|pinterest|x\.com|t\.me|whatsapp|maps\.google|google\.com\/maps|goo\.gl|bit\.ly)/i;

const items = fs.readFileSync(IN, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));

async function one(it) {
  const url = `https://www.usachurches.org/church/${it.slug}.htm`;
  for (let a = 0; a < 3; a++) {
    try {
      const r = await fetch(url, { headers: { "User-Agent": UA } });
      if (r.status === 404) return { ...it, gone: true };
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const h = (await r.text()).replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "");
      const ll = h.match(/google\.com\/maps\/place\/(-?\d+\.\d+),(-?\d+\.\d+)/);
      const zip = h.match(/,\s*[A-Z]{2}\s+(\d{5})(?:-\d{4})?</) || h.match(/\b([A-Z]{2})\s+(\d{5})\b/);
      const ext = [...h.matchAll(/href="(https?:\/\/[^"]+)"/g)]
        .map((m) => m[1])
        .filter((u) => !/usachurches\.org/i.test(u) && !SOCIAL.test(u));
      const founded = h.match(/founded in (\d{4})/i);
      return {
        slug: it.slug,
        name: it.name,
        lat: ll ? +ll[1] : null,
        lon: ll ? +ll[2] : null,
        zip: zip ? (zip[1].length === 5 ? zip[1] : zip[2]) : null,
        website: ext[0] || null,
        founded: founded ? +founded[1] : null,
        city: it.city,
        st: it.st,
        street: it.street,
      };
    } catch (e) {
      if (a === 2) return { slug: it.slug, name: it.name, err: e.message, city: it.city, st: it.st, street: it.street };
      await sleep(1200 * (a + 1));
    }
  }
}

const out = [];
let idx = 0, done = 0;
async function worker() {
  while (idx < items.length) {
    const it = items[idx++];
    out.push(await one(it));
    done++;
    if (done % 50 === 0) process.stdout.write(`\r ${done}/${items.length}  `);
    await sleep(250);
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
console.log();

fs.writeFileSync(OUT, out.map((r) => JSON.stringify(r)).join("\n") + "\n");
console.log(`wrote ${out.length} → ${OUT}`);
console.log("  with coords:", out.filter((r) => r.lat != null).length);
console.log("  with zip:   ", out.filter((r) => r.zip).length);
console.log("  with website:", out.filter((r) => r.website).length);
console.log("  errors/gone:", out.filter((r) => r.err || r.gone).length);
