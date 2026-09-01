#!/usr/bin/env node
/**
 * Fetch the Reformed Church in America congregation directory.
 *
 * rca.org/find-an-rca-church runs "WP Store Locator". The store_search AJAX
 * endpoint is slow (~2.5s/call) and caps at 100 rows, so instead:
 *
 *   1. /wp-json/wp/v2/wpsl_stores?per_page=100&page=N  (N=1..)
 *      -> every store as a WP post: { id, slug, link, title }. The post id is
 *         the WPSL store id. X-WP-Total header = total (~858).
 *   2. GET each store's permalink (/churches/<slug>/). The page inlines
 *         var wpslMap_0 = { ..., "locations":[ { store,address,address2,city,
 *           state,zip,country,lat,lng,id } ] };
 *      one entry — the full structured record for that church.
 *
 * Output: scripts/rca-churches.ndjson  (US rows only)
 *   {id,name,street,city,state,zip,lat,lng,permalink}
 */
import { writeFileSync } from "node:fs";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";
const REST = "https://www.rca.org/wp-json/wp/v2/wpsl_stores";
const OUT = new URL("./rca-churches.ndjson", import.meta.url);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const clean = (s) => String(s ?? "").replace(/\s+/g, " ").trim();

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
  for (let page = 1; page <= 30; page++) {
    let arr = null;
    for (let i = 0; i < 4 && arr === null; i++) {
      try {
        const r = await fetch(`${REST}?per_page=100&page=${page}&_fields=id,slug,link,title`, { headers: { "User-Agent": UA } });
        if (r.status === 400) return stores; // past last page
        if (r.ok) arr = await r.json();
        else await sleep(1000 * (i + 1));
      } catch {
        await sleep(1000 * (i + 1));
      }
    }
    if (!arr || !arr.length) break;
    for (const p of arr) stores.push({ id: String(p.id), slug: p.slug, link: p.link, name: clean(p.title?.rendered) });
    process.stdout.write(`\r  listing stores: ${stores.length}`);
  }
  process.stdout.write("\n");
  return stores;
}

function parseDetail(html) {
  const m = html.match(/wpslMap_\d+\s*=\s*(\{[\s\S]*?\});/);
  if (!m) return null;
  let obj;
  try {
    obj = JSON.parse(m[1]);
  } catch {
    return null;
  }
  const loc = (obj.locations || [])[0];
  return loc || null;
}

async function pool(items, size, worker) {
  const out = new Array(items.length);
  let idx = 0;
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (idx < items.length) {
        const my = idx++;
        out[my] = await worker(items[my], my);
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
    if (done % 25 === 0) process.stdout.write(`\r  detail ${done}/${stores.length}`);
    if (!html) return { ...s, _fail: "no_html" };
    const loc = parseDetail(html);
    if (!loc) return { ...s, _fail: "no_wpslmap" };
    return {
      id: s.id,
      name: clean(loc.store) || s.name,
      street: [clean(loc.address), clean(loc.address2)].filter(Boolean).join(" ").trim(),
      city: clean(loc.city),
      state: clean(loc.state).toUpperCase().slice(0, 2),
      zip: clean(loc.zip).slice(0, 10),
      lat: loc.lat ? Number(loc.lat) : null,
      lng: loc.lng ? Number(loc.lng) : null,
      country: clean(loc.country) || "US",
      permalink: s.link,
    };
  });
  process.stdout.write("\n");

  const fails = results.filter((r) => r._fail);
  const rows = results.filter((r) => !r._fail && (!r.country || r.country === "US") && r.state && r.state.length === 2 && r.street);
  rows.sort((a, b) => a.id.localeCompare(b.id));
  writeFileSync(OUT, rows.map((r) => JSON.stringify({ id: r.id, name: r.name, street: r.street, city: r.city, state: r.state, zip: r.zip, lat: r.lat, lng: r.lng, permalink: r.permalink })).join("\n") + "\n");
  console.log(`Wrote ${rows.length} US rows to ${OUT.pathname}`);
  console.log(`  ${fails.length} detail fetch/parse failures; ${results.length - rows.length - fails.length} filtered (non-US / no address)`);
  console.log(`  ${rows.filter((r) => !r.zip).length} no zip, ${rows.filter((r) => !r.lat).length} no coords`);
  if (fails.length) console.log(`  failure slugs (first 10): ${fails.slice(0, 10).map((f) => f.slug).join(", ")}`);
})();
