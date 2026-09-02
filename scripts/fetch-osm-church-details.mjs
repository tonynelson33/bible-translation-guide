#!/usr/bin/env node
/**
 * Second OSM pass: re-pull the US denomination-tagged places of worship, this
 * time keeping the address / website / phone tags (the first pass only kept
 * name + denomination + coords). Feeds:
 *   - website/phone backfill for churches that match an existing row
 *   - net-new church inserts for OSM entries not in our data
 *
 * Output: scripts/osm-church-details.ndjson
 *   {osm,name,denomination,religion,lat,lon,state,
 *    housenumber,street,city,st,postcode,website,phone,wikipedia}
 */
import { writeFileSync } from "node:fs";

const UA = "bible-translation-guide/1.0 (church-directory enrichment; contact tonynelson33 via github)";
const ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://lz4.overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];
const OUT = new URL("./osm-church-details.ndjson", import.meta.url);
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
      if (r.ok) return (await r.json()).elements || [];
      if ([429, 504, 502, 500].includes(r.status)) { await sleep(15000 * (attempt + 1)); continue; }
      await sleep(8000);
    } catch {
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
    for (const e of els) {
      const key = `${e.type[0]}${e.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const lat = e.lat ?? e.center?.lat;
      const lon = e.lon ?? e.center?.lon;
      if (lat == null || lon == null) continue;
      const t = e.tags || {};
      rows.push({
        osm: key,
        name: clean(t.name || t["name:en"] || ""),
        denomination: clean(t.denomination).toLowerCase(),
        religion: clean(t.religion).toLowerCase(),
        lat: Number(lat),
        lon: Number(lon),
        state: st,
        housenumber: clean(t["addr:housenumber"]),
        street: clean(t["addr:street"]),
        city: clean(t["addr:city"]),
        st_tag: clean(t["addr:state"]).toUpperCase(),
        postcode: clean(t["addr:postcode"]).replace(/\s+/g, ""),
        website: clean(t.website || t["contact:website"] || t.url || ""),
        phone: clean(t.phone || t["contact:phone"] || ""),
        wikipedia: clean(t.wikipedia),
      });
    }
    process.stdout.write(`\r  ${i + 1}/${STATES.length}  ${st}  (total ${rows.length})   `);
    await sleep(6000);
  }
  process.stdout.write("\n");

  rows.sort((a, b) => a.osm.localeCompare(b.osm));
  writeFileSync(OUT, rows.map((r) => JSON.stringify(r)).join("\n") + "\n");
  const withAddr = rows.filter((r) => r.housenumber && r.street).length;
  console.log(`Wrote ${rows.length} rows to ${OUT.pathname}`);
  console.log(`  ${withAddr} have a house# + street, ${rows.filter((r) => r.website).length} have a website, ${rows.filter((r) => r.phone).length} a phone`);
})();
