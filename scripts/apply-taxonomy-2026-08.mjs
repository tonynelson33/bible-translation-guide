// One-off (2026-08): applies the denomination-taxonomy overhaul to churches-combined.csv
// so the source data matches the changes made directly against Supabase on 2026-08-28.
//
//   1. Removes every Latter-day Saints and Christian Science row (denominational
//      decision: neither holds to historic Christian doctrine by any mainstream
//      tradition's definition, and this site is a Christian-church directory).
//      Removed rows are written out verbatim to scripts/removed-rows-2026-08-28.csv
//      as a record.
//   2. Reclassifies five name-identifiable groups out of the buckets they were
//      sitting in, to match the current dropdown taxonomy (lib/suggestionOptions.ts):
//        missionary_baptist_church, methodist_ame, oriental_orthodox_church,
//        bible_church, oneness_apostolic_church
//
// Writes churches-combined.tmp.csv + scripts/removed-rows-2026-08-28.csv and prints a
// summary. It does NOT replace churches-combined.csv — inspect the summary, then:
//   mv churches-combined.csv churches-combined.csv.bak5 && mv churches-combined.tmp.csv churches-combined.csv
//
// Run: node scripts/apply-taxonomy-2026-08.mjs

import { createReadStream, createWriteStream } from "node:fs";
import { createInterface } from "node:readline";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const INPUT = path.join(ROOT, "churches-combined.csv");
const OUTPUT = path.join(ROOT, "churches-combined.tmp.csv");
const REMOVED = path.join(__dirname, "removed-rows-2026-08-28.csv");

// --- row removal -----------------------------------------------------------
// LDS: the category plus name variants the classifier's /latter[- ]day saints/
// pattern missed — "Latter Day Saint" (singular), "Latter Days Saints", the
// abbreviated corporate name ("...Church of Christ Latter-Day St"), "Deseret"
// (a Book-of-Mormon word, LDS-exclusive), typo'd "Crhist", etc. Deliberately
// does NOT match Community of Christ / RLDS (a separate denomination) or the
// eschatological "latter day" naming used by some Baptist/Pentecostal churches.
const REMOVE_LDS_NAME = /latter[-\s]?days?[-\s]?saints?|church of jesus c\w+t of latter|church of christ latter-day st|\bLDS\b|\bMormon\b|\bDeseret\b/i;
const REMOVE_CS_NAME = /christ,? scientist|christian science/i;
const REMOVED_CATEGORIES = new Set(["latter_day_saints_church", "christian_science_church"]);

function shouldRemove(name, refinedCategory) {
  if (REMOVED_CATEGORIES.has(refinedCategory)) return "category";
  if (REMOVE_LDS_NAME.test(name)) return "lds-name";
  if (REMOVE_CS_NAME.test(name)) return "cs-name";
  return null;
}

// --- reclassification (order matters; first match wins) --------------------
// Applied regardless of the row's existing refined_category — these are
// known miscategorizations (e.g. AME churches tagged methodist_church or
// episcopal_church) the same way add-refined-category-column.js's
// OVERRIDE_PATTERNS work.
const BIBLE_CHURCH_BLOCKERS = /\bBaptist\b|\bPresbyterian\b|\bMethodist\b|\bLutheran\b|\bCatholic\b/i;
const APOSTOLIC_BLOCKERS = /\bLutheran\b|\bCatholic\b|\bArmenian\b|New Apostolic|Apostolic Christian|\bCoptic\b|Ethiopian|Anglican|\bOrthodox\b/i;
// AME family: spelled-out forms + the AME / A.M.E. / AMEZ / AMEC / UAME abbreviations.
// Bare "CME" is deliberately excluded (870 false positives in the data); only the
// spelled-out "Christian Methodist Episcopal" counts.
const AME_PATTERN = /African Methodist|Christian Methodist Episcopal|\bU?A\.?M\.?E\.?[ZC]?\b/i;

function reclassify(name, refinedCategory) {
  if (/\bMissionary Baptist\b/i.test(name)) return "missionary_baptist_church";
  if (AME_PATTERN.test(name)) return "methodist_ame";
  if (/\bCoptic\b|Ethiopian Orthodox|Eritrean Orthodox|Armenian (?:Apostolic|Orthodox|Church)|\bSyriac\b|Malankara|Mar Thoma/i.test(name)) {
    return "oriental_orthodox_church";
  }
  if (/\bBible Church\b/i.test(name) && !BIBLE_CHURCH_BLOCKERS.test(name)) return "bible_church";
  const apostolic = /\bApostolic\b/i.test(name) && !APOSTOLIC_BLOCKERS.test(name);
  const oneness = /United Pentecostal|\bUPCI\b|Pentecostal Assemblies of the World|\bOneness\b/i.test(name);
  if (apostolic || oneness) return "oneness_apostolic_church";
  return refinedCategory;
}

// --- minimal RFC-4180 CSV (matches the other scripts) ---------------------
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
  const rl = createInterface({ input: createReadStream(INPUT), crlfDelay: Infinity });
  const out = createWriteStream(OUTPUT);
  const removedOut = createWriteStream(REMOVED);

  let isHeader = true;
  let nameIndex = -1;
  let refinedIndex = -1;

  const removedBy = { category: 0, "lds-name": 0, "cs-name": 0 };
  const remappedTo = {};
  const remappedFrom = {};
  let kept = 0;
  let total = 0;

  for await (const line of rl) {
    if (line === "") continue;
    const fields = parseCsvLine(line);

    if (isHeader) {
      nameIndex = fields.indexOf("name");
      refinedIndex = fields.indexOf("refined_category");
      const encoded = fields.map(writeCsvField).join(",") + "\n";
      out.write(encoded);
      removedOut.write(encoded);
      isHeader = false;
      continue;
    }

    total++;
    const name = fields[nameIndex];
    const rc = fields[refinedIndex];

    const removeReason = shouldRemove(name, rc);
    if (removeReason) {
      removedBy[removeReason]++;
      removedOut.write(fields.map(writeCsvField).join(",") + "\n");
      continue;
    }

    const next = reclassify(name, rc);
    if (next !== rc) {
      remappedTo[next] = (remappedTo[next] || 0) + 1;
      remappedFrom[`${rc} -> ${next}`] = (remappedFrom[`${rc} -> ${next}`] || 0) + 1;
      fields[refinedIndex] = next;
    }
    kept++;
    out.write(fields.map(writeCsvField).join(",") + "\n");
  }

  await new Promise((r) => out.end(r));
  await new Promise((r) => removedOut.end(r));

  const removedTotal = removedBy.category + removedBy["lds-name"] + removedBy["cs-name"];
  console.log(`\nRead ${total} data rows.`);
  console.log(`Removed ${removedTotal}:`, removedBy);
  console.log(`Kept ${kept}.  (removed + kept = ${removedTotal + kept})`);
  console.log(`\nReclassified totals:`, remappedTo);
  console.log(`\nReclassified transitions:`);
  for (const [k, v] of Object.entries(remappedFrom).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${v.toString().padStart(6)}  ${k}`);
  }
  console.log(`\nWrote ${OUTPUT} and ${REMOVED}.`);
}

main();
