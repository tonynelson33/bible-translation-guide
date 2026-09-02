#!/usr/bin/env node
/**
 * Fetch the Converge (formerly Baptist General Conference) church directory.
 *
 * converge.org/churches is bot-protected HTML, but its data endpoint is open:
 *
 *   GET https://converge.org/wp-json/ak/v1/churches
 *   -> [ { id, name, address ("street, city, ST zip"), state, region,
 *          website, pastor, lat, lng } ]   (~1,720 rows, one call)
 *
 * `region` is one of Converge's 10 US regional districts. Rows with no real
 * address ("Coming Soon!", international "-, <city>, Santo Domingo -") are
 * dropped by requiring a parseable US state + 5-digit zip.
 *
 * Output: scripts/converge-churches.ndjson
 *   {id,name,street,city,state,zip,lat,lng,region,website}
 */
import { writeFileSync } from "node:fs";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";
const URL_ = "https://converge.org/wp-json/ak/v1/churches";
const OUT = new URL("./converge-churches.ndjson", import.meta.url);
const US_REGIONS = new Set([
  "rocky-mountain", "midamerica", "northwest", "north-central", "southwest",
  "heartland", "midatlantic", "northeast", "pacwest", "great-lakes",
]);
const decode = (s) =>
  String(s ?? "")
    .replace(/&amp;/g, "&")
    .replace(/&#0?39;/g, "'")
    .replace(/&#8217;/g, "’")
    .replace(/&quot;/g, '"')
    .replace(/&#8211;/g, "–")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
const clean = (s) => decode(String(s ?? "")).replace(/\s+/g, " ").trim();

const r = await fetch(URL_, { headers: { "User-Agent": UA, Accept: "application/json" } });
if (!r.ok) throw new Error(`HTTP ${r.status}`);
const list = await r.json();
if (!Array.isArray(list) || !list.length) throw new Error("empty list");

const rows = [];
let noparse = 0, nonus = 0;
const seen = new Set();
for (const c of list) {
  const m = clean(c.address).match(/^(.*),\s*([^,]+),\s*([A-Za-z]{2})\.?\s+(\d{5})(?:-\d{4})?\b/);
  if (!m) { noparse++; continue; }
  const state = m[3].toUpperCase();
  const region = clean(c.region);
  if (region && !US_REGIONS.has(region)) { nonus++; continue; }
  if (seen.has(c.id)) continue;
  seen.add(c.id);
  const website = clean(c.website).replace(/^https?:\/\//, "").replace(/\/$/, "");
  rows.push({
    id: String(c.id),
    name: clean(c.name),
    street: clean(m[1]),
    city: clean(m[2]),
    state,
    zip: m[4],
    lat: c.lat ? Number(c.lat) : null,
    lng: c.lng ? Number(c.lng) : null,
    region,
    website: website && website.includes(".") && !/facebook|instagram|twitter|youtube/i.test(website) ? "https://" + website : "",
  });
}

rows.sort((a, b) => Number(a.id) - Number(b.id));
writeFileSync(OUT, rows.map((r) => JSON.stringify(r)).join("\n") + "\n");
console.log(`Wrote ${rows.length} US rows to ${OUT.pathname}`);
console.log(`  ${noparse} unparseable/no-address, ${nonus} non-US region, ${list.length} total in feed`);
console.log(`  ${rows.filter((r) => !r.lat).length} no coords, ${rows.filter((r) => r.website).length} with website`);
