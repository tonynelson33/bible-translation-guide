// Removes the small residual of rows that could not be resolved by the backfill passes:
// US rows with no usable zip AND no other way to determine their state (16 rows), and rows
// with no locality at all - pure route/highway addresses with no zip and no city mentioned
// anywhere (332 rows, 11 of which overlap with the first group). These are the only rows
// in the whole cleanup process that get deleted rather than repaired - everything else was
// fixed in place.
//
// Also re-runs deduplication: the original dedup pass (cleanup-churches-data.js) ran before
// the locality/region backfill, so pairs where one copy had a blank locality and the other
// didn't slipped through (different key at the time) and only became true duplicates once
// both were backfilled from the same zip reference.

const fs = require("fs");
const readline = require("readline");
const path = require("path");

const inputPath = path.join(__dirname, "..", "churches-combined.csv");
const backupPath = path.join(__dirname, "..", "churches-combined.csv.bak");
const outputPath = path.join(__dirname, "..", "churches-combined.tmp.csv");

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
  let nameIdx, addrIdx, localityIdx, zipIdx, regionIdx, countryIdx, transIdx, notesIdx;
  const kept = [];
  let removedUnresolvable = 0;

  let lineNo = 0;
  for await (const line of rl) {
    if (line === "") continue;
    const fields = parseCsvLine(line);
    if (lineNo === 0) {
      header = fields;
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

    const noLocality = !fields[localityIdx].trim();
    const noRegionUS = fields[countryIdx] === "US" && !fields[regionIdx].trim();
    if (noLocality || noRegionUS) {
      removedUnresolvable++;
      continue;
    }
    kept.push(fields);
    lineNo++;
  }

  console.log(`Removed ${removedUnresolvable} rows with no locality and/or no resolvable US state.`);
  console.log(`${kept.length} rows remain before final dedup.`);

  // Final dedup pass, now that locality/region are as complete as they'll get.
  const groups = new Map();
  for (const r of kept) {
    const key = [r[nameIdx], r[addrIdx], r[localityIdx]].map((v) => v.trim().toLowerCase()).join("|");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(r);
  }
  function score(r) {
    let s = 0;
    if (r[transIdx] || r[notesIdx]) s += 10;
    if (/^\d{5}-\d{4}$/.test(r[zipIdx].trim())) s += 2;
    else if (/^\d{5}$/.test(r[zipIdx].trim())) s += 1;
    return s;
  }
  const deduped = [];
  let dupsRemoved = 0;
  for (const g of groups.values()) {
    if (g.length === 1) {
      deduped.push(g[0]);
      continue;
    }
    const best = g.reduce((a, b) => (score(b) > score(a) ? b : a));
    deduped.push(best);
    dupsRemoved += g.length - 1;
  }
  console.log(`Removed ${dupsRemoved} duplicates revealed by the backfill (both copies of a pair converged to the same locality/region).`);
  console.log(`Final row count: ${deduped.length}.`);

  const out = fs.createWriteStream(outputPath);
  out.write(header.map(writeCsvField).join(",") + "\n");
  for (const r of deduped) {
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
