#!/usr/bin/env node
/**
 * Fetch The Episcopal Church (TEC) parish directory from the Episcopal Asset Map.
 *
 * Two public endpoints on episcopalassetmap.org (Drupal + Leaflet Views), both
 * fetchable server-side with no auth:
 *
 *   1. /search/places/batch?offset=<N>&limit=500&display=block_4
 *      → the map's batched-loading feed: {nid, lat, lon, type} only.
 *        `type` is one of church | school | other; `has_more` is unreliable
 *        (always false past the first page) so we page until a short page.
 *        `total` counts DOWN (remaining) as offset grows.
 *
 *   2. /list?type[church]=church&countries=All&page=<N>
 *      → server-rendered listing, 10 rows/page, ~687 pages. Each
 *        <div class="views-row"> carries name (inside the `nid--<N>` span),
 *        address-line1, locality (city), administrative-area (state),
 *        country-code. No ZIP, no coords.
 *
 * We pull coords from (1), name/address from (2), and join on nid. Output:
 *   scripts/tec-churches.ndjson  — {nid,name,street,city,state,lat,lon}
 * churches with type==='church' only.
 */
import { writeFileSync } from "node:fs";

const UA = "Mozilla/5.0 (compatible; bible-translation-guide church-directory sync)";
const BASE = "https://www.episcopalassetmap.org";
const OUT = new URL("./tec-churches.ndjson", import.meta.url);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJSON(url, tries = 4) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: { Accept: "application/json", "User-Agent": UA } });
      if (r.ok) return await r.json();
      if (r.status === 404) return null;
    } catch (e) {
      if (i === tries - 1) throw e;
    }
    await sleep(1000 * (i + 1));
  }
  throw new Error(`giving up on ${url}`);
}

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
  throw new Error(`giving up on ${url}`);
}

async function fetchCoords() {
  const coord = new Map();
  let offset = 0;
  for (let guard = 0; guard < 60; guard++) {
    const j = await getJSON(`${BASE}/search/places/batch?offset=${offset}&limit=500&display=block_4`);
    if (!j || !j.places?.length) break;
    for (const p of j.places) coord.set(String(p.nid), { lat: p.lat, lon: p.lon, type: p.type });
    process.stdout.write(`\r  coords: ${coord.size}`);
    if (j.places.length < 500) break;
    offset += 500;
    await sleep(200);
  }
  process.stdout.write("\n");
  return coord;
}

const stripTags = (s) => s.replace(/<[^>]*>/g, "");
const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&#0?39;/g, "'")
    .replace(/&#8217;/g, "’")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
const clean = (s) => decode(stripTags(s || "")).replace(/,\s*$/, "").replace(/\s+/g, " ").trim();

function parseRows(html) {
  const rows = [];
  const rowRe = /<div class="views-row">([\s\S]*?)<\/div>\s*<\/div>/g;
  let m;
  while ((m = rowRe.exec(html))) {
    const block = m[1];
    const nidM = block.match(/nid--(\d+)">([\s\S]*?)<\/span>/);
    if (!nidM) continue;
    const field = (cls) => {
      const fm = block.match(new RegExp(`views-field-${cls}[^>]*><span class="field-content">([\\s\\S]*?)</span>`));
      return fm ? clean(fm[1]) : "";
    };
    rows.push({
      nid: nidM[1],
      name: clean(nidM[2]),
      street: field("address-line1-unmodified"),
      city: field("locality-unmodified"),
      state: field("administrative-area-unmodified"),
      country: field("country-code"),
    });
  }
  return rows;
}

async function fetchListing() {
  const byNid = new Map();
  for (let page = 0; page < 900; page++) {
    const html = await getText(`${BASE}/list?type%5Bchurch%5D=church&countries=All&page=${page}`);
    if (html == null) break;
    const rows = parseRows(html);
    if (rows.length === 0) break;
    for (const r of rows) if (!byNid.has(r.nid)) byNid.set(r.nid, r);
    process.stdout.write(`\r  listing: page ${page + 1}, ${byNid.size} rows`);
    await sleep(250);
  }
  process.stdout.write("\n");
  return byNid;
}

(async () => {
  console.log("Fetching coordinates from batch feed...");
  const coord = await fetchCoords();
  const churchNids = new Set([...coord].filter(([, v]) => v.type === "church").map(([k]) => k));
  console.log(`  ${coord.size} places, ${churchNids.size} of type church`);

  console.log("Fetching parish listing...");
  const listing = await fetchListing();

  const out = [];
  let noCoord = 0;
  for (const [nid, row] of listing) {
    if (row.country && row.country !== "US") continue;
    const c = coord.get(nid);
    if (!c) noCoord++;
    out.push({
      nid,
      name: row.name,
      street: row.street,
      city: row.city,
      state: row.state,
      lat: c ? c.lat : null,
      lon: c ? c.lon : null,
    });
  }
  // parishes that are in the coord feed as churches but never appeared in the listing
  for (const nid of churchNids) {
    if (!listing.has(nid)) {
      const c = coord.get(nid);
      out.push({ nid, name: null, street: null, city: null, state: null, lat: c.lat, lon: c.lon });
    }
  }

  writeFileSync(OUT, out.map((r) => JSON.stringify(r)).join("\n") + "\n");
  console.log(`\nWrote ${out.length} rows to ${OUT.pathname}`);
  console.log(`  ${noCoord} listing rows had no coord match; ${out.filter((r) => !r.name).length} coord-only rows`);
})();
