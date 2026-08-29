// One-off (2026-08): applies the denomination-taxonomy overhaul to churches-combined.csv
// so the source data matches the changes made directly against Supabase on 2026-08-28.
//
//   1. Removes every row that isn't a historic-Christian congregation: the
//      Latter Day Saint movement (LDS / Mormon AND RLDS / Community of Christ),
//      Christian Science, Jehovah's Witnesses, Unitarian Universalism, the New
//      Thought movement (Unity / Religious Science / Divine Science),
//      Scientology, and other-faith centres miscatalogued as churches — none
//      holds to historic Christian doctrine by any mainstream tradition's
//      definition. Also the convents_and_monasteries bucket (religious
//      communities, not congregations) and a handful of joke / non-church junk.
//      Removed rows are written out verbatim to
//      scripts/removed-rows-2026-08-28.csv as a record.
//   2. Reclassifies five name-identifiable groups out of the buckets they were
//      sitting in, to match the current dropdown taxonomy (lib/suggestionOptions.ts):
//        missionary_baptist_church, methodist_ame, oriental_orthodox_church,
//        bible_church, oneness_apostolic_church
//   3. Folds / merges the buckets that have no dropdown entry so the
//      /church-finder breakdown table mirrors the dropdown exactly:
//        pentecostal_church, evangelical_church, mission -> church_cathedral
//          ("Denomination not identified" -- none is a specific denomination)
//        wesleyan_church -> methodist_church   ("Methodist / Wesleyan")
//        anglican_church, episcopal_church -> anglican_episcopal_church
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
// does NOT match the eschatological "latter day" naming used by some
// Baptist/Pentecostal churches.
const REMOVE_LDS_NAME = /latter[-\s]?days?[-\s]?saints?|church of jesus c\w+t of latter|church of christ latter-day st|\bLDS\b|\bMormon\b|\bDeseret\b/i;
const REMOVE_CS_NAME = /christ,? scientist|christian science/i;
// RLDS / Community of Christ — a distinct branch of the Latter Day Saint
// movement, still excluded from a directory of historic-Christian churches.
// The NOT clause spares congregations of other denominations that happen to be
// named "Community of Christ ..." (Catholic / Lutheran / UMC etc.).
const REMOVE_RLDS_NAME = /community of christ|reorganized church|\bRLDS\b|everlasting church of jesus christ.*latter/i;
const RLDS_NOT = /\bcatholic\b|\blutheran\b|\bUMC\b|united methodist|\bbaptist\b|presbyterian|episcopal/i;
// Joke / non-church junk that turned up in the "latter day" sweep.
const REMOVE_JUNK_NAME = /latter day pimps|latter day dude|latter[- ]day designs|latter day cottage/i;
// Non-Christian groups (same call as LDS / Christian Science): Jehovah's
// Witnesses, Unitarian Universalism, the New Thought movement (Unity, Religious
// Science, Divine Science), Scientology, and other-faith centres that were
// miscatalogued as churches. The NOT clauses spare Christian churches that use
// "Jehovah" as a Hebrew name for God, the "Unity Fellowship" Christian
// denomination, Primitive Baptist Universalists, Messianic congregations, and
// South-Asian Christian churches ("... Mandir", "Masihi ...").
const REMOVE_JW_NAME = /Kingdom Hall|Jehovah.{0,3}s Witness|Congregation[- ].{0,4}Jehovah/i;
const REMOVE_UU_NAME = /\bUnitarian\b|\bUniversalist\b/i;
const REMOVE_NEWTHOUGHT_NAME = /^Unity (?:Church|Spiritual|Center|of|on the)|\bUnity Church of\b|\bUnity of [A-Z]|Religious Science|Science of Mind|Divine Science|\bNew Thought\b|Unity Village|Unity Worldwide/i;
const NEWTHOUGHT_NOT = /\bBaptist\b|\bHoliness\b|Pentecostal|\bApostolic\b|\bCOGIC\b|Missionary|Holy Unity|Unity Fellowship|Jesus Christ/i;
const REMOVE_SCIENTOLOGY_NAME = /Scientology/i;
const REMOVE_OTHERFAITH_NAME = /\bBuddhis|\bHindu\b|\bMosque\b|\bMasjid\b|\bIslamic\b|\bSikh\b|\bJain\b|Hare Krishna|\bMandir\b|\bGurdwara\b|Swaminarayan|\bShinto\b|\bTaoist\b|\bSynagogue\b/i;
const OTHERFAITH_NOT = /Messianic|Christ/i;
const REMOVED_CATEGORIES = new Set([
  "latter_day_saints_church",
  "christian_science_church",
  "convents_and_monasteries",
]);

function shouldRemove(name, refinedCategory) {
  if (refinedCategory === "convents_and_monasteries") return "convents";
  if (REMOVED_CATEGORIES.has(refinedCategory)) return "category";
  if (REMOVE_JUNK_NAME.test(name)) return "junk";
  if (REMOVE_LDS_NAME.test(name)) return "lds-name";
  if (REMOVE_CS_NAME.test(name)) return "cs-name";
  if (REMOVE_RLDS_NAME.test(name) && !RLDS_NOT.test(name)) return "rlds-name";
  if (REMOVE_JW_NAME.test(name) && !/\bCatholic\b|\bEx-Jehovah/i.test(name)) return "jehovahs-witnesses";
  if (REMOVE_UU_NAME.test(name) && !/\bBaptist\b/i.test(name)) return "unitarian-universalist";
  if (REMOVE_NEWTHOUGHT_NAME.test(name) && !NEWTHOUGHT_NOT.test(name)) return "new-thought";
  if (REMOVE_SCIENTOLOGY_NAME.test(name)) return "scientology";
  if (REMOVE_OTHERFAITH_NAME.test(name) && !OTHERFAITH_NOT.test(name)) return "other-faith";
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

// --- fold / merge to match the dropdown (step 3) --------------------------
// Buckets with no entry in lib/suggestionOptions.ts's denominationOptions.
// "Pentecostal" / "Evangelical" / "Mission" are descriptors, not a specific
// body -> treat as not-identified. Wesleyan and Anglican/Episcopal have merged
// dropdown labels ("Methodist / Wesleyan", "Anglican / Episcopal").
const FOLD_TO_CATHEDRAL = new Set(["pentecostal_church", "evangelical_church", "mission"]);
const CATEGORY_MERGES = {
  wesleyan_church: "methodist_church",
  anglican_church: "anglican_episcopal_church",
  episcopal_church: "anglican_episcopal_church",
};

function normalizeCategory(cat) {
  if (FOLD_TO_CATHEDRAL.has(cat)) return "church_cathedral";
  return CATEGORY_MERGES[cat] ?? cat;
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

  const removedBy = {
    category: 0, convents: 0, "lds-name": 0, "cs-name": 0, "rlds-name": 0, junk: 0,
    "jehovahs-witnesses": 0, "unitarian-universalist": 0, "new-thought": 0,
    scientology: 0, "other-faith": 0,
  };
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

    const next = normalizeCategory(reclassify(name, rc));
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

  const removedTotal = Object.values(removedBy).reduce((a, b) => a + b, 0);
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
