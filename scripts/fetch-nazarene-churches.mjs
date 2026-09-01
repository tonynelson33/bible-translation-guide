// Pulls the Church of the Nazarene directory into scripts/nazarene-churches.ndjson.
//
// maps.nazarene.org/FindAChurch/ is an ArcGIS map. The layer's REST query endpoint
// returns every church:
//   .../ArcGIS/rest/services/Nazarene/NazareneChurches/MapServer/0/query
//     ?where=NazRes2.DBO.NazCh.Region='USA/Canada'&outFields=...&f=json
// maxRecordCount is 2000, so we page with resultOffset. ~4,694 US/Canada records;
// ~4,510 US after filtering by a valid US state in the "City ST ZIP" address string.
// The `name` field has NO "Church of the Nazarene" suffix (it's implied).
//
// Run:  node scripts/fetch-nazarene-churches.mjs

import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "nazarene-churches.ndjson");

const BASE =
  "https://maps.nazarene.org/ArcGIS/rest/services/Nazarene/NazareneChurches/MapServer/0/query";
const P = "NazRes2.DBO."; // field prefix
const FIELDS = [
  `${P}NazCh.WKEY`, `${P}CHURCH.CHURCH`, `${P}NazCh.AddrStreet`, `${P}NazCh.AddrCity`,
  `${P}CHURCH.LADDR1`, `${P}CHURCH.LADDR2`, `${P}CHURCH.WEBSITE`, `${P}CHURCH.PHONE`,
  `${P}NazCh.X_COORD`, `${P}NazCh.Y_COORD`, `${P}NazCh.District`, `${P}NazCh.Status`,
].join(",");

const US = new Set(
  ("AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV " +
   "NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY PR VI GU AS MP").split(" "),
);

const rows = [];
for (let off = 0; off < 20000; off += 2000) {
  const url =
    `${BASE}?where=${encodeURIComponent(`${P}NazCh.Region='USA/Canada'`)}` +
    `&outFields=${encodeURIComponent(FIELDS)}&returnGeometry=false` +
    `&resultOffset=${off}&resultRecordCount=2000&f=json`;
  const j = await fetch(url, { headers: { Accept: "application/json" } }).then((r) => r.json());
  const feats = j.features || [];
  for (const f of feats) {
    const a = f.attributes;
    const cs = (a[`${P}NazCh.AddrCity`] || a[`${P}CHURCH.LADDR2`] || "").trim();
    const m = cs.match(/^(.+?)\s+([A-Za-z]{2})\s+(\d{5}(?:-\d{4})?)\s*$/);
    if (!m) continue;
    const state = m[2].toUpperCase();
    if (!US.has(state)) continue;
    rows.push({
      id: String(a[`${P}NazCh.WKEY`]),
      name: (a[`${P}CHURCH.CHURCH`] || "").trim(),
      street: (a[`${P}NazCh.AddrStreet`] || a[`${P}CHURCH.LADDR1`] || "").trim(),
      city: m[1].trim(),
      state,
      zip: m[3],
      lat: a[`${P}NazCh.Y_COORD`] || null,
      lng: a[`${P}NazCh.X_COORD`] || null,
      website: (a[`${P}CHURCH.WEBSITE`] || "").trim(),
      district: (a[`${P}NazCh.District`] || "").trim(),
      status: a[`${P}NazCh.Status`],
    });
  }
  if (feats.length < 2000) break;
}

const seen = new Set();
const uniq = rows.filter((r) => (seen.has(r.id) ? false : (seen.add(r.id), true)));
writeFileSync(OUT, uniq.map((r) => JSON.stringify(r)).join("\n") + "\n");
console.log(`${uniq.length} US churches → ${path.relative(process.cwd(), OUT)}`);
