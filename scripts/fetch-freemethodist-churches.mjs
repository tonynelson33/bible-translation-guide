#!/usr/bin/env node
/**
 * Fetch the Free Methodist Church USA congregation directory.
 *
 * fmcusa.org/find-a-church is WordPress + "WP Google Map Gold" (Flipper Code).
 * The whole marker set is inlined in the page as base64 JSON:
 *   window.wpgmp.mapdata13 = "<base64>"
 * decode -> { places: [ { id, title, address, location: { city, state,
 *   postal_code, country, lat, lng, extra_fields: { conferencename, county,
 *   status, phone, email, website } } } ] }  (~834 US congregations)
 *
 * `address` is inconsistent — sometimes just the street, sometimes
 * "<street> <City> <ST> <ZIP>". We prefer the structured city/state/zip and
 * strip a trailing "City ST ZIP" from the street when present.
 *
 * Output: scripts/freemethodist-churches.ndjson
 *   {id,name,street,city,state,zip,lat,lng,conference,status,phone,email,website}
 */
import { writeFileSync } from "node:fs";

const UA = "Mozilla/5.0 (compatible; bible-translation-guide church-directory sync)";
const OUT = new URL("./freemethodist-churches.ndjson", import.meta.url);

const html = await (await fetch("https://fmcusa.org/find-a-church", { headers: { "User-Agent": UA } })).text();
const marker = html.indexOf("wpgmp.mapdata");
if (marker < 0) throw new Error("wpgmp.mapdata marker not found");
const b64 = html.slice(marker).match(/([A-Za-z0-9+/]{200,}={0,2})/)?.[1];
if (!b64) throw new Error("base64 blob not found after marker");
const data = JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
const places = data.places || [];
if (!places.length) throw new Error("no places in decoded data");

const clean = (s) => String(s || "").replace(/\s+/g, " ").trim();

function splitStreet(address, city, state, zip) {
  let s = clean(address);
  // drop a trailing "<City> <ST> <ZIP>" / "<City>, <ST> <ZIP>"
  if (state) {
    const re = new RegExp(`[, ]+${city ? city.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "[, ]+" : ""}${state}\\.?(\\s+\\d{5}(-\\d{4})?)?\\s*$`, "i");
    s = s.replace(re, "");
  }
  if (zip) s = s.replace(new RegExp(`[, ]+${zip}\\s*$`), "");
  return clean(s);
}

const rows = places
  .map((p) => {
    const L = p.location || {};
    const x = L.extra_fields || {};
    const city = clean(L.city);
    const state = clean(L.state).toUpperCase();
    const zip = clean(L.postal_code).slice(0, 10);
    return {
      id: String(p.id || ""),
      name: clean(p.title) || "Free Methodist Church",
      street: splitStreet(p.address, city, state, zip),
      city,
      state,
      zip,
      lat: L.lat ? Number(L.lat) : null,
      lng: L.lng ? Number(L.lng) : null,
      conference: clean(x.conferencename),
      status: clean(x.status),
      phone: clean(x.phone),
      email: clean(x.email),
      website: clean(x.website),
    };
  })
  .filter((r) => (r.country !== "CA") && r.state && r.state.length === 2);

writeFileSync(OUT, rows.map((r) => JSON.stringify(r)).join("\n") + "\n");
console.log(`Wrote ${rows.length} rows to ${OUT.pathname}`);
console.log(`  ${rows.filter((r) => !r.street).length} without street, ${rows.filter((r) => r.website).length} with website`);
