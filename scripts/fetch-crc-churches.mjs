#!/usr/bin/env node
/**
 * Fetch the Christian Reformed Church in North America congregation directory.
 *
 * crcna.org/churches (Drupal + React) exposes the whole map as one GeoJSON blob,
 * no auth, no pagination:
 *
 *   https://www.crcna.org/churches/feed
 *   -> { type:"FeatureCollection", features:[ {
 *          geometry:{ coordinates:[lng,lat] (strings) },
 *          properties:{ id, name, previousName, koreanName, street, city, state,
 *                       status, languages[], barrier, livestream, ... } } ] }
 *
 * ~1,800 features including Disbanded / Merged / Disaffiliated. We keep
 * status === "Active" and drop Canadian provinces (US directory only).
 * No ZIP in the feed.
 *
 * Output: scripts/crc-churches.ndjson
 *   {id,name,prev_name,street,city,state,lat,lng,languages}
 */
import { writeFileSync } from "node:fs";

const UA = "Mozilla/5.0 (compatible; bible-translation-guide church-directory sync)";
const OUT = new URL("./crc-churches.ndjson", import.meta.url);
const CA = new Set(["ON", "BC", "AB", "MB", "SK", "NS", "NB", "PE", "NL", "QC", "YT", "NT", "NU"]);
const clean = (s) => String(s ?? "").replace(/\s+/g, " ").trim();

const r = await fetch("https://www.crcna.org/churches/feed", { headers: { "User-Agent": UA, Accept: "application/json" } });
if (!r.ok) throw new Error(`feed HTTP ${r.status}`);
const fc = await r.json();
const feats = fc.features || [];
if (!feats.length) throw new Error("no features");

const rows = [];
const skipped = { status: 0, canada: 0, nocoord: 0, nostreet: 0 };
for (const f of feats) {
  const p = f.properties || {};
  if (p.status !== "Active") { skipped.status++; continue; }
  const state = clean(p.state).toUpperCase().slice(0, 2);
  if (CA.has(state) || !state) { skipped.canada++; continue; }
  const c = f.geometry && f.geometry.coordinates;
  const lat = c ? Number(c[1]) : null;
  const lng = c ? Number(c[0]) : null;
  if (!lat || !lng) { skipped.nocoord++; continue; }
  const street = clean(p.street);
  if (!street) skipped.nostreet++;
  rows.push({
    id: String(p.id),
    name: clean(p.name),
    prev_name: clean(p.previousName) || null,
    street,
    city: clean(p.city),
    state,
    lat,
    lng,
    languages: Array.isArray(p.languages) ? p.languages.join("|") : "",
  });
}

rows.sort((a, b) => a.id.localeCompare(b.id));
writeFileSync(OUT, rows.map((r) => JSON.stringify(r)).join("\n") + "\n");
console.log(`Wrote ${rows.length} US active rows to ${OUT.pathname}`);
console.log(`  skipped: ${skipped.status} non-active, ${skipped.canada} Canadian, ${skipped.nocoord} no-coord`);
console.log(`  ${skipped.nostreet} of the kept rows have no street`);
