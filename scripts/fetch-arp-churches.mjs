#!/usr/bin/env node
/**
 * Fetch the Associate Reformed Presbyterian Church congregation directory.
 *
 * arpchurch.org/find-a-church is WP Store Locator. The store_search AJAX
 * ignores search_radius (returns only a handful), so:
 *
 *   1. /wp-json/wp/v2/wpsl_stores?per_page=100&page=N  -> every store as a WP
 *      post {id, slug, link, title}; X-WP-Total header = ~269.
 *   2. GET each /churches/<slug>/ ; the page inlines
 *        var wpslMap_N = { ..., "locations":[ { store, address, address2,
 *          city, state, zip, country, lat, lng, id } ] };
 *
 * Output: scripts/arp-churches.ndjson  (US rows only)
 *   {id,name,street,city,state,zip,lat,lng,permalink}
 */
import { writeFileSync } from "node:fs";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";
const REST = "https://arpchurch.org/wp-json/wp/v2/wpsl_stores";
const OUT = new URL("./arp-churches.ndjson", import.meta.url);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const clean = (s) => String(s ?? "").replace(/\s+/g, " ").trim();
const CA = new Set(["ON", "BC", "AB", "MB", "SK", "NS", "NB", "PE", "NL", "QC"]);

async function getText(url, tries = 4) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: { "User-Agent": UA } });
      if (r.ok) return await r.text();
      if (r.status === 404) return null;
    } catch (e) {
      if (i === tries - 1) throw e;
    }
    await sleep(1000 * (i + 1));
  }
  return null;
}

async function listStores() {
  const stores = [];
  for (let page = 1; page <= 20; page++) {
    let arr = null;
    for (let i = 0; i < 4 && arr === null; i++) {
      try {
        const r = await fetch(`${REST}?per_page=100&page=${page}&_fields=id,slug,link,title`, { headers: { "User-Agent": UA } });
        if (r.status === 400) return stores;
        if (r.ok) arr = await r.json();
        else await sleep(1000 * (i + 1));
      } catch {
        await sleep(1000 * (i + 1));
      }
    }
    if (!arr || !arr.length) break;
    for (const p of arr) stores.push({ id: String(p.id), slug: p.slug, link: p.link, name: clean(p.title?.rendered) });
  }
  return stores;
}

function parseDetail(html) {
  const m = html.match(/wpslMap_\d+\s*=\s*(\{[\s\S]*?\});/);
  if (!m) return null;
  try {
    return (JSON.parse(m[1]).locations || [])[0] || null;
  } catch {
    return null;
  }
}

async function pool(items, size, worker) {
  const out = new Array(items.length);
  let idx = 0;
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (idx < items.length) {
        const my = idx++;
        out[my] = await worker(items[my]);
      }
    })
  );
  return out;
}

(async () => {
  const stores = await listStores();
  console.log(`${stores.length} stores listed; fetching detail pages...`);
  let done = 0;
  const results = await pool(stores, 8, async (s) => {
    const html = await getText(s.link);
    done++;
    if (done % 20 === 0) process.stdout.write(`\r  ${done}/${stores.length}`);
    if (!html) return { ...s, _fail: 1 };
    const loc = parseDetail(html);
    if (!loc) return { ...s, _fail: 1 };
    return {
      id: s.id,
      name: clean(loc.store) || s.name,
      street: [clean(loc.address), clean(loc.address2)].filter(Boolean).join(" ").trim(),
      city: clean(loc.city),
      state: clean(loc.state).toUpperCase().slice(0, 2),
      zip: clean(loc.zip).slice(0, 10),
      lat: loc.lat ? Number(loc.lat) : null,
      lng: loc.lng ? Number(loc.lng) : null,
      country: clean(loc.country),
      permalink: s.link,
    };
  });
  process.stdout.write("\n");

  const fails = results.filter((r) => r._fail).length;
  const rows = results.filter((r) => !r._fail && r.state && r.state.length === 2 && !CA.has(r.state) && r.street);
  rows.sort((a, b) => Number(a.id) - Number(b.id));
  writeFileSync(OUT, rows.map((r) => JSON.stringify({ id: r.id, name: r.name, street: r.street, city: r.city, state: r.state, zip: r.zip, lat: r.lat, lng: r.lng, permalink: r.permalink })).join("\n") + "\n");
  console.log(`Wrote ${rows.length} US rows to ${OUT.pathname}  (${fails} fetch/parse failures)`);
  console.log(`  ${rows.filter((r) => !r.zip).length} no zip, ${rows.filter((r) => !r.lat).length} no coords`);
})();
