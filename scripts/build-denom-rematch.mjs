// Combine the committed per-denomination directory scrapes into one normalized
// ndjson for a second-pass geo re-match against church_cathedral ("not identified").
// SBC + AG done separately (they have no coords). Everything here has coords.
import fs from "node:fs";

const SRC = [
  ["ARP", "arp-churches", "presbyterian_church"],
  ["CVG", "converge-churches", "baptist_church"],
  ["CRC", "crc-churches", "reformed_church"],
  ["FSQ", "foursquare-churches", "foursquare_church"],
  ["FMC", "freemethodist-churches", "methodist_church"],
  ["NAZ", "nazarene-churches", "nazarene_church"],
  ["OPC", "opc-churches", "presbyterian_church"],
  ["RCA", "rca-churches", "reformed_church"],
  ["TEC", "tec-churches", "anglican_episcopal_church"],
  ["WES", "wesleyan-churches", "methodist_church"],
];

const out = [];
for (const [source, file, target] of SRC) {
  const lines = fs.readFileSync(`scripts/${file}.ndjson`, "utf8").split("\n").filter(Boolean);
  let kept = 0;
  for (const l of lines) {
    let o;
    try { o = JSON.parse(l); } catch { continue; }
    const lat = o.lat ?? o.latitude ?? null;
    const lon = o.lng ?? o.lon ?? o.longitude ?? null;
    if (lat == null || lon == null) continue;
    if (!(lat > 17 && lat < 72 && lon > -180 && lon < -64)) continue;
    out.push({
      source,
      target,
      ext_id: String(o.id ?? o.nid ?? o.permalink ?? o.name ?? ""),
      name: (o.name || "").slice(0, 200),
      lat: +lat,
      lon: +lon,
      street: o.street || "",
      city: o.city || "",
      st: (o.state || "").toUpperCase().slice(0, 2),
      zip: String(o.zip || "").slice(0, 5) || null,
      website: o.website || null,
    });
    kept++;
  }
  console.log(`${source}: ${kept}/${lines.length}`);
}

fs.writeFileSync("scripts/denom-rematch.ndjson", out.map((x) => JSON.stringify(x)).join("\n") + "\n");
console.log(`\ntotal ${out.length} → scripts/denom-rematch.ndjson`);
const byT = {};
for (const r of out) byT[r.target] = (byT[r.target] || 0) + 1;
console.log(byT);
