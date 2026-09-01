// Pulls the Anglican Church in North America (ACNA) congregation directory into
// scripts/acna-churches.ndjson — one JSON object per line.
//
// acna.org/anglican_church/map is a Rails page (gmaps4rails) that embeds every
// congregation inline as `handler.addMarkers([{lat, lng, infowindow: "<html>"}])`.
// The infowindow HTML has the church name in an <h2> and the address in a <p>.
// ~1,005 markers, ~935 US after dropping Canada / international.
//
// Run:  node scripts/fetch-acna-churches.mjs

import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "acna-churches.ndjson");

const html = await fetch("https://www.acna.org/anglican_church/map", {
  headers: { "User-Agent": "Mozilla/5.0 (compatible; bible-translation-guide sync)", Accept: "text/html" },
}).then((r) => r.text());

// carve out the addMarkers([...]) array (balanced brackets, string-aware)
const arrStart = html.indexOf("[", html.indexOf("handler.addMarkers(["));
let depth = 0, end = -1;
for (let i = arrStart; i < html.length; i++) {
  const ch = html[i];
  if (ch === "[") depth++;
  else if (ch === "]") { depth--; if (depth === 0) { end = i; break; } }
  else if (ch === '"') { i++; while (i < html.length && html[i] !== '"') { if (html[i] === "\\") i++; i++; } }
}
const markers = JSON.parse(html.slice(arrStart, end + 1));

const decode = (s) =>
  String(s || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => { try { return String.fromCodePoint(+n); } catch { return ""; } })
    .replace(/\s+/g, " ").trim();

const rows = [];
for (const m of markers) {
  const iw = m.infowindow || "";
  const name = decode((iw.match(/<h2[^>]*>([\s\S]*?)<\/h2>/) || [])[1]);
  const ps = [...iw.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].map((x) => decode(x[1]));
  let a = (ps.find((p) => /\d/.test(p) && /,/.test(p)) || ps[0] || "").trim();
  if (/Canada$/i.test(a)) continue;
  a = a.replace(/\s*,?\s*United States\s*$/i, "").trim();
  const parts = a.split(",").map((x) => x.trim()).filter(Boolean);
  let street = "", city = "", state = "", zip = "";
  if (parts.length >= 3) {
    const sz = parts[parts.length - 1].match(/([A-Za-z]{2})\s+(\d{5}(?:-\d{4})?)/);
    if (sz) { state = sz[1].toUpperCase(); zip = sz[2]; }
    city = parts[parts.length - 2];
    street = parts.slice(0, parts.length - 2).join(", ").replace(/\bN\/A\b/gi, "").replace(/\s+/g, " ").trim();
  } else if (parts.length === 2) {
    const sz = parts[1].match(/([A-Za-z]{2})\s+(\d{5})/);
    if (sz) { state = sz[1].toUpperCase(); zip = sz[2]; }
    street = parts[0];
  }
  const id = ((iw.match(/admin_units\/(\d+)/) || [])[1]) || `${m.lat},${m.lng}`;
  rows.push({ id, name, street, city, state, zip, lat: m.lat, lng: m.lng });
}

// dedupe by id
const seen = new Set();
const uniq = rows.filter((r) => (seen.has(r.id) ? false : (seen.add(r.id), true)));
writeFileSync(OUT, uniq.map((r) => JSON.stringify(r)).join("\n") + "\n");
console.log(`${uniq.length} US congregations → ${path.relative(process.cwd(), OUT)}`);
