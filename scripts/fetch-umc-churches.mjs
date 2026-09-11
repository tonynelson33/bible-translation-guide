#!/usr/bin/env node
/**
 * Fetch the United Methodist Church "Find-A-Church" directory.
 *
 * umc.org/find-a-church geocodes a search term client-side (Google Maps) then
 * POSTs { latitude, longitude, search, Page } to
 * https://www.umc.org/ChurchesFeature/Churches/GetChurches (a Salesforce-backed
 * JSON endpoint) and pages 6-at-a-time, sorted by distance from the given
 * point, until `hasMoreItems` goes false — which happens once ~100 results
 * have been returned (confirmed empirically: dense-area query points cap out
 * around page 16-18, i.e. ~96-108 rows). There is no street address in the
 * response (`address_line_1..3` are always null) — only city/state/zip/lat/lng
 * — and no bulk/by-state mode, so full national coverage means querying from
 * many points and de-duplicating by `id`.
 *
 * Points: reference-us-zips.csv snapped to a 0.5-degree (~35 mile) grid,
 * keeping the highest-population zip's coordinates per occupied cell as the
 * query point (~3,300 points incl. AK/HI). 0.5 degrees was chosen empirically
 * — a dense-metro query point (Atlanta) saturates the ~100-result cap at
 * about a 30-mile radius, so a 35-mile grid spacing leaves only small,
 * mostly-overlap-covered gaps at the fringes of the densest areas.
 *
 * Output: scripts/umc-churches.ndjson
 *   {id,name,city,state,zip,lat,lng,website}
 */
import { readFileSync, writeFileSync } from "node:fs";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";
const API = "https://www.umc.org/ChurchesFeature/Churches/GetChurches";
const OUT = new URL("./umc-churches.ndjson", import.meta.url);
const ZIPS_CSV = new URL("./reference-us-zips.csv", import.meta.url);
const GRID_DEG = 0.5;
const MAX_PAGES = 25; // safety margin above the observed ~16-18 page cap
const CONCURRENCY = 24;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const clean = (s) => String(s ?? "").replace(/\s+/g, " ").trim();
const TERRITORIES = new Set(["PR", "VI", "GU", "AS", "MP"]);

/** UMC's church_url is sometimes schemeless ("www.foo.org") and sometimes not
 * a real site at all (mailto:, Facebook-only, single word) — normalize to
 * "https://..." the way every other website value in `churches` is stored,
 * or drop it. */
function normalizeWebsite(raw) {
  let s = clean(raw);
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  if (/^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}(\/.*)?$/i.test(s)) return `https://${s}`;
  return "";
}

function buildGridPoints() {
  const lines = readFileSync(ZIPS_CSV, "utf8").split("\n").filter(Boolean);
  // Only the first 9 fields are needed and are safe to regex — later fields
  // (all_county_weights) contain unescaped commas inside their own quotes.
  const re = /^"([^"]*)","([^"]*)","([^"]*)","([^"]*)","([^"]*)","([^"]*)","([^"]*)","([^"]*)","([^"]*)"/;
  const cells = new Map();
  for (let i = 1; i < lines.length; i++) {
    const m = lines[i].match(re);
    if (!m) continue;
    const [, zip, lat, lng, city, state_id, , , , pop] = m;
    if (TERRITORIES.has(state_id)) continue;
    const la = Number(lat),
      lo = Number(lng),
      p = Number(pop) || 0;
    if (!Number.isFinite(la) || !Number.isFinite(lo)) continue;
    const key = Math.round(la / GRID_DEG) + "," + Math.round(lo / GRID_DEG);
    const cur = cells.get(key);
    if (!cur || p > cur.pop) cells.set(key, { pop: p, lat: la, lng: lo, city, state: state_id, zip });
  }
  return [...cells.values()];
}

async function fetchPage(point, page, tries = 3) {
  const body = JSON.stringify({ latitude: point.lat, longitude: point.lng, search: `${point.city}, ${point.state}`, Page: page });
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json", "User-Agent": UA }, body });
      if (r.ok) return await r.json();
    } catch {
      // fall through to retry
    }
    await sleep(500 * (i + 1));
  }
  return null;
}

async function pool(items, size, worker) {
  let idx = 0;
  let done = 0;
  await Promise.all(
    Array.from({ length: size }, async () => {
      while (idx < items.length) {
        const my = idx++;
        await worker(items[my], my);
        done++;
        if (done % 25 === 0) process.stdout.write(`\r  points done: ${done}/${items.length}`);
      }
    })
  );
}

(async () => {
  let points = buildGridPoints();
  console.log(`${points.length} grid points to query (${GRID_DEG}° spacing)`);
  if (process.env.UMC_LIMIT) points = points.slice(0, Number(process.env.UMC_LIMIT));

  const churches = new Map(); // id -> record
  let requests = 0;
  let failures = 0;

  await pool(points, CONCURRENCY, async (point) => {
    for (let page = 1; page <= MAX_PAGES; page++) {
      const j = await fetchPage(point, page);
      requests++;
      if (!j) {
        failures++;
        break;
      }
      const list = j.churches || [];
      for (const c of list) {
        if (!c.id || churches.has(c.id)) continue;
        churches.set(c.id, {
          id: c.id,
          name: clean(c.Preferred_Name__c) || clean(c.name),
          city: clean(c.address_city),
          state: clean(c.address_statecode).toUpperCase().slice(0, 2),
          zip: clean(c.address_zip).slice(0, 10),
          lat: typeof c.latitude === "number" ? c.latitude : null,
          lng: typeof c.longitude === "number" ? c.longitude : null,
          website: normalizeWebsite(c.church_url),
        });
      }
      if (!j.hasMoreItems || list.length === 0) break;
    }
  });
  process.stdout.write("\n");

  const rows = [...churches.values()].filter((r) => r.name && r.city && r.state && r.state.length === 2);
  rows.sort((a, b) => a.id.localeCompare(b.id));
  writeFileSync(OUT, rows.map((r) => JSON.stringify(r)).join("\n") + "\n");
  console.log(`Made ${requests} requests (${failures} failed after retries).`);
  console.log(`Wrote ${rows.length} unique US UMC churches to ${OUT.pathname}`);
  console.log(`  ${rows.filter((r) => r.website).length} with website, ${rows.filter((r) => r.zip).length} with zip`);
  console.log(`  states represented: ${new Set(rows.map((r) => r.state)).size}`);
})();
