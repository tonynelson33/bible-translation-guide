// Nondenominational church-planting networks → one ndjson each.
//  - ARC (Association of Related Churches): Storepoint widget 160fafe6488211
//  - GCC (Great Commission Collective): WP Store Locator store_search
// Both member sets self-identify as non-denominational / independent.
import fs from "node:fs";

const UA = "bible-translation-guide/1.0 (non-commercial church directory; contact tonynelson33@gmail.com)";

// ---- ARC ----
{
  const r = await fetch("https://api.storepoint.co/v1/160fafe6488211/locations", { headers: { "User-Agent": UA } });
  const j = await r.json();
  const rows = (j.results?.locations || [])
    .filter((l) => l.loc_lat && /United States/i.test(l.streetaddress || ""))
    .map((l) => ({
      id: l.id,
      name: l.name,
      lat: l.loc_lat,
      lon: l.loc_long,
      addr: l.streetaddress, // "8000 W Broward Blvd, Plantation, FL 33324, United States"
      website: l.website || null,
      tags: l.tags || "",
    }));
  fs.writeFileSync("scripts/arc-churches.ndjson", rows.map((x) => JSON.stringify(x)).join("\n") + "\n");
  console.log(`ARC: ${rows.length} US rows`);
}

// ---- GCC ----
{
  const r = await fetch(
    "https://www.gccollective.org/wp-admin/admin-ajax.php?action=store_search&lat=39.8&lng=-98.5&max_results=5000&radius=9000&autoload=1",
    { headers: { "User-Agent": UA } },
  );
  const j = await r.json();
  const rows = j
    .filter((s) => s.lat && /United States/i.test(s.country || ""))
    .map((s) => ({
      id: s.id,
      name: String(s.store || "").replace(/\s*\([^)]*\)\s*$/, "").trim(),
      lat: +s.lat,
      lon: +s.lng,
      street: s.address,
      city: s.city,
      st: s.state,
      zip: String(s.zip || "").slice(0, 5),
      website: s.url || null,
    }));
  fs.writeFileSync("scripts/gcc-churches.ndjson", rows.map((x) => JSON.stringify(x)).join("\n") + "\n");
  console.log(`GCC: ${rows.length} US rows`);
}
