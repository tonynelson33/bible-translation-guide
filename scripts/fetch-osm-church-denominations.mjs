#!/usr/bin/env node
/**
 * Pull every OpenStreetMap `amenity=place_of_worship` with a `denomination`
 * tag in the US, state by state, from the Overpass API.
 *
 *   [out:json][timeout:180];
 *   area["ISO3166-2"="US-XX"][admin_level=4]->.a;
 *   nwr(area.a)["amenity"="place_of_worship"]["denomination"];
 *   out center tags;
 *
 * Overpass needs a real User-Agent (default node UA -> 406). Be gentle:
 * one query at a time with a pause; retry on 429/504.
 *
 * Output: scripts/osm-church-denominations.ndjson
 *   {osm:"n123|w456", name, denomination, religion, lat, lon, state,
 *    operator, wikipedia}
 */
import { writeFileSync } from "node:fs";

const UA = "bible-translation-guide/1.0 (church-directory denomination enrichment; contact tonynelson33 via github)";
const ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://lz4.overpass-api.de/api/interpreter",
];
const OUT = new URL("./osm-church-denominations.ndjson", import.meta.url);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const clean = (s) => String(s ?? "").replace(/\s+/g, " ").trim();

const STATES =
  "AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY".split(" ");

async function overpass(state) {
  const q = `[out:json][timeout:240];area["ISO3166-2"="US-${state}"][admin_level=4]->.a;nwr(area.a)["amenity"="place_of_worship"]["denomination"];out center tags;`;
  for (let attempt = 0; attempt < 6; attempt++) {
    const ep = ENDPOINTS[attempt % ENDPOINTS.length];
    try {
      const r = await fetch(ep, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": UA },
        body: "data=" + encodeURIComponent(q),
      });
      if (r.ok) {
        const j = await r.json();
        return j.elements || [];
      }
      if (r.status === 429 || r.status === 504 || r.status === 502) {
        await sleep(15000 * (attempt + 1));
        continue;
      }
      console.warn(`  ${state}: HTTP ${r.status} from ${ep}`);
      await sleep(8000);
    } catch (e) {
      await sleep(10000 * (attempt + 1));
    }
  }
  throw new Error(`overpass gave up on ${state}`);
}

(async () => {
  const rows = [];
  const seen = new Set();
  for (let i = 0; i < STATES.length; i++) {
    const st = STATES[i];
    const els = await overpass(st);
    let added = 0;
    for (const e of els) {
      const key = `${e.type[0]}${e.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const lat = e.lat ?? e.center?.lat;
      const lon = e.lon ?? e.center?.lon;
      if (lat == null || lon == null) continue;
      const t = e.tags || {};
      rows.push({
        osm: `${e.type[0]}${e.id}`,
        name: clean(t.name || t["name:en"] || ""),
        denomination: clean(t.denomination).toLowerCase(),
        religion: clean(t.religion).toLowerCase(),
        lat: Number(lat),
        lon: Number(lon),
        state: st,
        operator: clean(t.operator),
        wikipedia: clean(t.wikipedia),
      });
      added++;
    }
    process.stdout.write(`\r  ${i + 1}/${STATES.length}  ${st}: +${added}  (total ${rows.length})   `);
    await sleep(6000);
  }
  process.stdout.write("\n");

  rows.sort((a, b) => a.osm.localeCompare(b.osm));
  writeFileSync(OUT, rows.map((r) => JSON.stringify(r)).join("\n") + "\n");

  const denoms = {};
  for (const r of rows) denoms[r.denomination] = (denoms[r.denomination] || 0) + 1;
  const top = Object.entries(denoms).sort((a, b) => b[1] - a[1]).slice(0, 40);
  console.log(`Wrote ${rows.length} rows to ${OUT.pathname}`);
  console.log(`  ${rows.filter((r) => !r.name).length} without a name`);
  console.log("  top denomination tags:");
  for (const [d, n] of top) console.log(`    ${String(n).padStart(6)}  ${d}`);
})();
