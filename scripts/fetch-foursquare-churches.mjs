// Pulls the Foursquare Church (ICFG) directory from foursquare.org into
// scripts/foursquare-churches.ndjson — one JSON object per line.
//
// The locator (foursquare.org/locator/) is a WordPress site with a custom REST
// endpoint: GET /wp-json/locator/v1/locations?state=<ST>&type[]=Church returns a
// JSON array of that state's churches (name, street, city, state, coords, phone,
// email, website, district — the `shipping_zip` field is present but always
// empty, so there's no zip). We iterate every US state. ~1,365 churches, no auth,
// no Cloudflare.
//
// Run:  node scripts/fetch-foursquare-churches.mjs

import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "foursquare-churches.ndjson");

const BASE = "https://www.foursquare.org/wp-json/locator/v1/locations";
const STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM",
  "NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA",
  "WV","WI","WY","PR","VI","GU","AS","MP",
];
const HEADERS = { Accept: "application/json", "User-Agent": "Mozilla/5.0 (compatible; bible-translation-guide sync)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchState(st) {
  for (let a = 1; a <= 4; a++) {
    try {
      const res = await fetch(`${BASE}?state=${st}&type[]=Church`, { headers: HEADERS });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const j = await res.json();
      return Array.isArray(j) ? j : j.data || [];
    } catch (err) {
      console.warn(`  ${st} attempt ${a}: ${err.message}`);
      await sleep(1000 * a);
    }
  }
  throw new Error(`${st} failed`);
}

const seen = new Set();
const rows = [];
for (const st of STATES) {
  const arr = await fetchState(st);
  for (const x of arr) {
    const id = String(x.ID);
    if (seen.has(id)) continue;
    seen.add(id);
    rows.push({
      id,
      name: (x.name || "").trim(),
      street: (x.street || "").trim(),
      city: (x.city || "").trim(),
      state: (x.state || "").trim().toUpperCase(),
      zip: (x.shipping_zip || "").trim(),
      lat: x.latitude && x.latitude !== "0" ? parseFloat(x.latitude) : null,
      lng: x.longitude && x.longitude !== "0" ? parseFloat(x.longitude) : null,
      website: (x.website || "").trim(),
      email: (x.email || "").trim(),
      phone: (x.phone || "").trim(),
      district: (x.district || "").trim(),
    });
  }
  if (arr.length) console.log(`${st}: ${arr.length}`);
  await sleep(300);
}

writeFileSync(OUT, rows.map((r) => JSON.stringify(r)).join("\n") + "\n");
console.log(`\n${rows.length} churches → ${path.relative(process.cwd(), OUT)}`);
