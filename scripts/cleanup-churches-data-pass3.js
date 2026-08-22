// Third cleanup pass:
// - Additional Puerto Rico municipalities not in pass 2's list (Parcelas Nuevas, Collores,
//   Castaner).
// - 4-digit zip + truly blank region + US: this combination only occurs for the 0-prefix
//   Northeast states (MA/RI/NH/ME/VT/CT/NJ), so the zip prefix itself (once padded) reveals
//   which state it is - backfilling both the zip and the previously-blank region.
// - Fishers Island, NY is a genuine USPS quirk: its real zip (06390) falls in the
//   Connecticut prefix range even though the island is legally part of New York, so it's
//   special-cased rather than caught by the "blank region" rule.

const fs = require("fs");
const readline = require("readline");
const path = require("path");

const inputPath = path.join(__dirname, "..", "churches-combined.csv");
const backupPath = path.join(__dirname, "..", "churches-combined.csv.bak");
const outputPath = path.join(__dirname, "..", "churches-combined.tmp.csv");

const MORE_PR_LOCALITIES = new Set(["parcelas nuevas", "collores", "castaner"]);

// Prefix ranges for zips that start with 0 (padded from a 4-digit original).
const ZIP0_STATE_RANGES = [
  { min: 10, max: 27, state: "MA" },
  { min: 28, max: 29, state: "RI" },
  { min: 30, max: 38, state: "NH" },
  { min: 39, max: 49, state: "ME" },
  { min: 50, max: 59, state: "VT" },
  { min: 60, max: 69, state: "CT" },
  { min: 70, max: 89, state: "NJ" },
];

function stateForPadded5DigitZip(zip5) {
  const prefix2 = parseInt(zip5.slice(1, 3), 10);
  const match = ZIP0_STATE_RANGES.find((r) => prefix2 >= r.min && prefix2 <= r.max);
  return match ? match.state : null;
}

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

async function main() {
  const rl = readline.createInterface({
    input: fs.createReadStream(inputPath),
    crlfDelay: Infinity,
  });

  let header;
  let zipIdx, localityIdx, regionIdx, countryIdx;
  const rows = [];

  let lineNo = 0;
  for await (const line of rl) {
    if (line === "") continue;
    const fields = parseCsvLine(line);
    if (lineNo === 0) {
      header = fields;
      zipIdx = fields.indexOf("zip");
      localityIdx = fields.indexOf("locality");
      regionIdx = fields.indexOf("region");
      countryIdx = fields.indexOf("country");
      lineNo++;
      continue;
    }
    rows.push(fields);
    lineNo++;
  }

  console.log(`Read ${rows.length} data rows.`);

  let prFixed = 0;
  let neBlankRegionFixed = 0;
  let fishersIslandFixed = 0;

  for (const r of rows) {
    const zip = r[zipIdx].trim();
    const locality = r[localityIdx].trim();
    const localityLower = locality.toLowerCase();
    const region = r[regionIdx].trim();
    const country = r[countryIdx];

    if (country !== "US") continue;
    if (/^\d{5}(-\d{4})?$/.test(zip)) continue; // already valid

    // Fishers Island, NY - real zip 06390 despite being part of New York State.
    if (localityLower === "fishers island" && zip === "6390") {
      r[zipIdx] = "06390";
      fishersIslandFixed++;
      continue;
    }

    // Additional Puerto Rico municipalities.
    if (!region && /^\d{1,3}$/.test(zip) && MORE_PR_LOCALITIES.has(localityLower)) {
      r[zipIdx] = zip.padStart(5, "0");
      r[regionIdx] = "PR";
      prFixed++;
      continue;
    }

    // 4-digit zip + truly blank region => leading-zero-loss in a 0-prefix Northeast state.
    if (!region && /^\d{4}$/.test(zip)) {
      const padded = zip.padStart(5, "0");
      const state = stateForPadded5DigitZip(padded);
      if (state) {
        r[zipIdx] = padded;
        r[regionIdx] = state;
        neBlankRegionFixed++;
      }
    }
  }

  console.log(`Fixed ${prFixed} additional Puerto Rico zips.`);
  console.log(`Fixed ${neBlankRegionFixed} blank-region Northeast zips (region backfilled from zip prefix).`);
  console.log(`Fixed ${fishersIslandFixed} Fishers Island, NY rows (06390 quirk).`);

  const out = fs.createWriteStream(outputPath);
  out.write(header.map(writeCsvField).join(",") + "\n");
  for (const r of rows) {
    out.write(r.map(writeCsvField).join(",") + "\n");
  }
  await new Promise((resolve) => out.end(resolve));

  fs.copyFileSync(inputPath, backupPath);
  fs.renameSync(outputPath, inputPath);

  console.log(`Done. Previous file backed up to ${backupPath}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
