#!/usr/bin/env node
/**
 * Fetch The Wesleyan Church (USA) congregation directory.
 *
 * wesleyan.org/find-a-church embeds secure.wesleyan.org/findachurch/frame,
 * whose search calls one no-auth JSON endpoint:
 *
 *   GET /findachurch/codes?latitude=<lat>&longitude=<lng>&distance=<miles>
 *   -> [ { name, website, phone, mailing_address, formatted_address,
 *          latitude, longitude, distance } ]
 *
 * A single call from the US centroid with distance=4000 returns the whole set
 * (~1,540, no pagination). `mailing_address` / `formatted_address` are
 * "<street>, <city>, <ST> <zip> <country|county>"; country tail is
 * inconsistent (United States / US / USA / CAN / a county name / missing).
 * We keep rows that parse to a US state + 5-digit zip and drop Canadian
 * provinces.
 *
 * Output: scripts/wesleyan-churches.ndjson
 *   {name,street,city,state,zip,lat,lng,phone,website}
 */
import { writeFileSync } from "node:fs";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";
const URL_ = "https://secure.wesleyan.org/findachurch/codes?latitude=39.8&longitude=-98.6&distance=4000";
const OUT = new URL("./wesleyan-churches.ndjson", import.meta.url);
const CA = new Set(["ON", "BC", "AB", "MB", "SK", "NS", "NB", "PE", "NL", "QC", "YT", "NT", "NU"]);
const clean = (s) => String(s ?? "").replace(/\s+/g, " ").trim();

function parseAddr(a) {
  const s = clean(a);
  // "<street>, <city>, <ST>[, <ST>] <zip>[-####] [country/county...]"
  const m = s.match(/^(.+?),\s*([^,]+?),\s*([A-Za-z]{2})\.?(?:,\s*[A-Za-z]{2})?\s+(\d{5})(?:-\d{4})?(?:\b|\s|$)/);
  if (!m) return null;
  return { street: clean(m[1]), city: clean(m[2]), state: m[3].toUpperCase(), zip: m[4] };
}

const r = await fetch(URL_, { headers: { "User-Agent": UA, "X-Requested-With": "XMLHttpRequest", Referer: "https://secure.wesleyan.org/findachurch/frame" } });
if (!r.ok) throw new Error(`HTTP ${r.status}`);
const list = await r.json();
if (!Array.isArray(list) || !list.length) throw new Error("empty list");

const rows = [];
let noparse = 0, canada = 0;
const seen = new Set();
for (const c of list) {
  const a = parseAddr(c.mailing_address) || parseAddr(c.formatted_address);
  if (!a) { noparse++; continue; }
  if (CA.has(a.state)) { canada++; continue; }
  const key = `${clean(c.name).toLowerCase()}|${a.street.toLowerCase()}|${a.city.toLowerCase()}`;
  if (seen.has(key)) continue;
  seen.add(key);
  const website = clean(c.website).replace(/^https?:\/\//, "");
  rows.push({
    name: clean(c.name),
    street: a.street,
    city: a.city,
    state: a.state,
    zip: a.zip,
    lat: c.latitude ? Number(c.latitude) : null,
    lng: c.longitude ? Number(c.longitude) : null,
    phone: clean(c.phone),
    website: website && website.includes(".") && !/facebook|instagram|twitter|youtube/i.test(website) ? "https://" + website : "",
  });
}

rows.sort((a, b) => (a.state + a.city + a.name).localeCompare(b.state + b.city + b.name));
writeFileSync(OUT, rows.map((r) => JSON.stringify(r)).join("\n") + "\n");
console.log(`Wrote ${rows.length} US rows to ${OUT.pathname}`);
console.log(`  ${noparse} unparseable addresses, ${canada} Canadian, ${list.length} total in feed`);
console.log(`  ${rows.filter((r) => !r.lat).length} no coords, ${rows.filter((r) => r.website).length} with website`);
