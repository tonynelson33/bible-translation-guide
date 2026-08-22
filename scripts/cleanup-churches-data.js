// One-off data cleanup pass over churches-combined.csv:
// 1. Removes exact duplicate rows (same name + address + locality, case-insensitive),
//    preferring to keep whichever copy has research data filled in and/or better-cased locality.
// 2. Fixes zip codes: leading-zero loss (New England/NJ/PR numeric truncation), corrupted
//    zip+4 suffixes, stray whitespace, explicit garbage markers, and 3 UK churches that were
//    geocoded to similarly-named US places and mistagged country=US.
// 3. Where locality is empty but the city is embedded in the address string, extracts it into
//    locality and trims the address down to just the street portion.
//
// Never deletes a church for having an imperfect address - only removes true duplicate ROWS.
// Rows with incomplete-but-real addresses (e.g. just a rural route with no city) are left as is.

const fs = require("fs");
const readline = require("readline");
const path = require("path");

const inputPath = path.join(__dirname, "..", "churches-combined.csv");
const backupPath = path.join(__dirname, "..", "churches-combined.csv.bak");
const outputPath = path.join(__dirname, "..", "churches-combined.tmp.csv");

const LEADING_ZERO_STATES = new Set(["ME", "NH", "VT", "MA", "RI", "CT", "NJ", "PR", "VI"]);

// The 3 confirmed UK churches mistagged as US, found via manual review of zip anomalies.
const UK_MISTAGGED = {
  // St Mary's, Disley - Cheshire, England (postcode SK12 2NP was geocoded to Cheshire, MA)
  "SK12 2NP": { locality: "Disley", region: "Cheshire", country: "GB" },
  // Parish of St Mary and St Anselm - Rochdale, Greater Manchester, England (OL12 postcode area)
  "OL128DB": { locality: "Rochdale", region: "Greater Manchester", country: "GB" },
  // Holy Trinity Church, Eggleston - County Durham, England (DL12 postcode area)
  "DL12 0AH": { locality: "Eggleston", region: "County Durham", country: "GB" },
};

const GARBAGE_ZIP_VALUES = new Set([
  "<<not-applicable>>",
  "n/a",
  "na",
  "goodwill,",
  "i-9",
  "r/b/5",
]);

function parseCsvLine(line) {
  const fields = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      fields.push(cur);
      cur = "";
    } else {
      cur += c;
    }
  }
  fields.push(cur);
  return fields;
}

function writeCsvField(value) {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return '"' + value.replace(/"/g, '""') + '"';
  }
  return value;
}

function fixZip(zip, region, country) {
  if (country !== "US") return zip;
  const trimmed = zip.trim();
  if (/^\d{5}(-\d{4})?$/.test(trimmed)) return trimmed; // already valid

  // UK postcode mistagged as US - handled separately via country/region reassignment,
  // but keep the original postcode value as-is here.
  if (UK_MISTAGGED[trimmed]) return trimmed;

  // Leading-zero loss: 3-4 digit numeric zip in a state whose real zips start with 0.
  if (/^\d{3,4}$/.test(trimmed) && LEADING_ZERO_STATES.has(region)) {
    return trimmed.padStart(5, "0");
  }

  // Corrupted zip+4 suffix, e.g. "77328-33ND" - truncate to the base 5-digit zip.
  const corrupted = trimmed.match(/^(\d{5})-\d{1,3}[A-Za-z]+$/);
  if (corrupted) return corrupted[1];

  // "CO 80128" style - state abbreviation accidentally included in the zip field.
  const stateZip = trimmed.match(/^[A-Za-z]{2}\s+(\d{5})$/);
  if (stateZip) return stateZip[1];

  // Explicit garbage/placeholder markers - clear rather than keep nonsense.
  if (GARBAGE_ZIP_VALUES.has(trimmed.toLowerCase())) return "";

  return trimmed;
}

// Extracts a trailing "City, ST ZIP[, Country]" or "City, ZIP, Country" pattern from an
// address string when locality is empty, returning { city, streetOnly } or null.
function extractCityFromAddress(address) {
  const patterns = [
    /^(.*?),\s*([A-Za-z .'-]+),\s*[A-Z]{2}\s+\d{5}(?:-\d{4})?,?\s*(?:USA|US|United States)?\s*$/,
    /^(.*?),\s*([A-Za-z .'-]+),\s*\d{4,6},?\s*(?:USA|US|United States)\s*$/,
  ];
  for (const re of patterns) {
    const m = address.match(re);
    if (m) {
      const street = m[1].trim();
      const city = m[2].trim();
      if (street && city) return { city, streetOnly: street };
    }
  }
  return null;
}

async function main() {
  const rl = readline.createInterface({
    input: fs.createReadStream(inputPath),
    crlfDelay: Infinity,
  });

  let header;
  let idIdx, nameIdx, addrIdx, localityIdx, zipIdx, regionIdx, countryIdx, transIdx, notesIdx;
  const rows = [];

  let lineNo = 0;
  for await (const line of rl) {
    if (line === "") continue;
    const fields = parseCsvLine(line);
    if (lineNo === 0) {
      header = fields;
      idIdx = fields.indexOf("id");
      nameIdx = fields.indexOf("name");
      addrIdx = fields.indexOf("address");
      localityIdx = fields.indexOf("locality");
      zipIdx = fields.indexOf("zip");
      regionIdx = fields.indexOf("region");
      countryIdx = fields.indexOf("country");
      transIdx = fields.indexOf("bible_translation");
      notesIdx = fields.indexOf("bible_translation_notes");
      lineNo++;
      continue;
    }
    rows.push(fields);
    lineNo++;
  }

  console.log(`Read ${rows.length} data rows.`);

  // --- Step 1: deduplicate ---
  const groups = new Map();
  for (const r of rows) {
    const key = [r[nameIdx], r[addrIdx], r[localityIdx]]
      .map((v) => v.trim().toLowerCase())
      .join("|");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(r);
  }

  function rowScore(r) {
    let score = 0;
    if (r[transIdx] || r[notesIdx]) score += 10; // keep researched rows
    if (r[localityIdx] && /[a-z]/.test(r[localityIdx])) score += 1; // prefer proper case over ALL-CAPS
    return score;
  }

  const deduped = [];
  let duplicatesRemoved = 0;
  for (const group of groups.values()) {
    if (group.length === 1) {
      deduped.push(group[0]);
      continue;
    }
    const best = group.reduce((a, b) => (rowScore(b) > rowScore(a) ? b : a));
    deduped.push(best);
    duplicatesRemoved += group.length - 1;
  }
  console.log(`Removed ${duplicatesRemoved} duplicate rows (${groups.size} unique churches remain from ${rows.length}).`);

  // --- Step 2 & 3: zip fixes, UK mistagging, city extraction ---
  let zipFixed = 0;
  let ukFixed = 0;
  let cityExtracted = 0;

  for (const r of deduped) {
    const origZip = r[zipIdx];
    const trimmedZip = origZip.trim();

    if (UK_MISTAGGED[trimmedZip] && r[countryIdx] === "US") {
      const fix = UK_MISTAGGED[trimmedZip];
      r[localityIdx] = fix.locality;
      r[regionIdx] = fix.region;
      r[countryIdx] = fix.country;
      ukFixed++;
    } else {
      const fixedZip = fixZip(origZip, r[regionIdx], r[countryIdx]);
      if (fixedZip !== origZip) {
        r[zipIdx] = fixedZip;
        zipFixed++;
      }
    }

    if (!r[localityIdx].trim()) {
      const extracted = extractCityFromAddress(r[addrIdx]);
      if (extracted) {
        r[localityIdx] = extracted.city;
        r[addrIdx] = extracted.streetOnly;
        cityExtracted++;
      }
    }
  }

  console.log(`Fixed ${zipFixed} malformed zip codes.`);
  console.log(`Reclassified ${ukFixed} UK churches mistagged as US.`);
  console.log(`Extracted city into locality from address text for ${cityExtracted} rows.`);

  // --- Write output ---
  const out = fs.createWriteStream(outputPath);
  out.write(header.map(writeCsvField).join(",") + "\n");
  for (const r of deduped) {
    out.write(r.map(writeCsvField).join(",") + "\n");
  }
  await new Promise((resolve) => out.end(resolve));

  fs.copyFileSync(inputPath, backupPath);
  fs.renameSync(outputPath, inputPath);

  console.log(`Done. ${deduped.length} rows written. Previous file backed up to ${backupPath}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
