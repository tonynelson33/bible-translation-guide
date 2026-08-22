// Backfills the blank "region" (state) field for US rows that have a valid 5-digit zip,
// using the standard USPS zip3-prefix-to-state ranges. Never touches a region that's
// already populated - only fills in truly blank ones.

const fs = require("fs");
const readline = require("readline");
const path = require("path");

const inputPath = path.join(__dirname, "..", "churches-combined.csv");
const backupPath = path.join(__dirname, "..", "churches-combined.csv.bak");
const outputPath = path.join(__dirname, "..", "churches-combined.tmp.csv");

// [minZip3, maxZip3, state] - standard USPS zip code prefix allocation.
const ZIP3_RANGES = [
  [0, 0, "PR"], // 000-009 handled separately (PR/VI) but included for completeness
  [10, 27, "MA"],
  [28, 29, "RI"],
  [30, 38, "NH"],
  [39, 49, "ME"],
  [50, 59, "VT"],
  [60, 69, "CT"],
  [70, 89, "NJ"],
  [100, 149, "NY"],
  [150, 196, "PA"],
  [197, 199, "DE"],
  [200, 205, "DC"],
  [206, 219, "MD"],
  [220, 246, "VA"],
  [247, 268, "WV"],
  [270, 289, "NC"],
  [290, 299, "SC"],
  [300, 319, "GA"],
  [320, 349, "FL"],
  [350, 369, "AL"],
  [370, 385, "TN"],
  [386, 397, "MS"],
  [398, 399, "GA"],
  [400, 427, "KY"],
  [430, 459, "OH"],
  [460, 479, "IN"],
  [480, 499, "MI"],
  [500, 528, "IA"],
  [530, 549, "WI"],
  [550, 567, "MN"],
  [570, 577, "SD"],
  [580, 588, "ND"],
  [590, 599, "MT"],
  [600, 629, "IL"],
  [630, 658, "MO"],
  [660, 679, "KS"],
  [680, 693, "NE"],
  [700, 714, "LA"],
  [716, 729, "AR"],
  [730, 749, "OK"],
  [750, 799, "TX"],
  [885, 885, "TX"],
  [800, 816, "CO"],
  [820, 831, "WY"],
  [832, 838, "ID"],
  [840, 847, "UT"],
  [850, 865, "AZ"],
  [870, 884, "NM"],
  [889, 898, "NV"],
  [900, 961, "CA"],
  [967, 968, "HI"],
  [969, 969, "GU"],
  [970, 979, "OR"],
  [980, 994, "WA"],
  [995, 999, "AK"],
];

function stateForZip(zip5) {
  const prefix3 = parseInt(zip5.slice(0, 3), 10);
  const match = ZIP3_RANGES.find(([min, max]) => prefix3 >= min && prefix3 <= max);
  return match ? match[2] : null;
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
  let zipIdx, regionIdx, countryIdx;
  const rows = [];

  let lineNo = 0;
  for await (const line of rl) {
    if (line === "") continue;
    const fields = parseCsvLine(line);
    if (lineNo === 0) {
      header = fields;
      zipIdx = fields.indexOf("zip");
      regionIdx = fields.indexOf("region");
      countryIdx = fields.indexOf("country");
      lineNo++;
      continue;
    }
    rows.push(fields);
    lineNo++;
  }

  console.log(`Read ${rows.length} data rows.`);

  let backfilled = 0;
  let stillBlank = 0;

  for (const r of rows) {
    if (r[countryIdx] !== "US" || r[regionIdx].trim()) continue;
    const zip = r[zipIdx].trim();
    const m = zip.match(/^(\d{5})(-\d{4})?$/);
    if (!m) {
      stillBlank++;
      continue;
    }
    const state = stateForZip(m[1]);
    if (state) {
      r[regionIdx] = state;
      backfilled++;
    } else {
      stillBlank++;
    }
  }

  console.log(`Backfilled state for ${backfilled} rows from their zip code.`);
  console.log(`${stillBlank} rows still have a blank region (no usable zip, or zip3 not in the lookup table).`);

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
