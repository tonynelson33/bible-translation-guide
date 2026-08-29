// One-off script: fills bible_translation / bible_translation_notes for the
// categories with a confirmed denominational default. Leaves every other row's
// existing values untouched.
//
// NOTE (2026-08): the latter_day_saints_church and christian_science_church
// defaults (both KJV) were removed along with those rows. The episcopal_church
// (NRSV) default was also dropped — that bucket is now anglican_episcopal_church,
// which also holds ACNA / Continuing Anglican parishes (ESV / 1662 BCP, not
// NRSV), so a single denominational default no longer applies. Its leftover
// values (incl. ~1,822 African Methodist Episcopal rows the classifier had
// mislabeled `episcopal_church`, plus ~86 real Anglican/Episcopal rows) were
// cleared to NULL straight against Supabase in 2026-08. See
// scripts/apply-taxonomy-2026-08.mjs.
//
// Also applied straight against Supabase, not reproduced here (this rule keys
// off the church *name*, not refined_category): congregational_church rows whose
// name contains "United Church of Christ" → NRSV, same note text as the
// disciples_of_christ_church default below. The bare-"Congregational Church"
// rows in that bucket were left alone (a real minority are CCCC/NACCC, not UCC).
const fs = require("fs");
const readline = require("readline");
const path = require("path");

const inputPath = path.join(__dirname, "..", "churches-combined.csv");
const backupPath = path.join(__dirname, "..", "churches-combined.csv.bak");
const outputPath = path.join(__dirname, "..", "churches-combined.tmp.csv");

const DENOMINATIONAL_DEFAULTS = {
  catholic_church: {
    translation: "NABRE",
    notes: "USCCB Lectionary for Mass, standard for U.S. Catholic parishes (denominational default, not individually confirmed per parish)",
  },
  disciples_of_christ_church: {
    translation: "NRSV",
    notes: "Standard translation in Christian Church (Disciples of Christ) worship resources and Chalice Press curriculum (denominational default, not individually confirmed per congregation)",
  },
};

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
  const out = fs.createWriteStream(outputPath);

  let isHeader = true;
  let refinedCategoryIndex = -1;
  let translationIndex = -1;
  let notesIndex = -1;
  let filled = 0;

  for await (const line of rl) {
    if (line === "") continue;
    const fields = parseCsvLine(line);
    if (isHeader) {
      refinedCategoryIndex = fields.indexOf("refined_category");
      translationIndex = fields.indexOf("bible_translation");
      notesIndex = fields.indexOf("bible_translation_notes");
      isHeader = false;
    } else {
      const category = fields[refinedCategoryIndex];
      const defaultEntry = DENOMINATIONAL_DEFAULTS[category];
      if (defaultEntry) {
        fields[translationIndex] = defaultEntry.translation;
        fields[notesIndex] = defaultEntry.notes;
        filled++;
      }
    }
    out.write(fields.map(writeCsvField).join(",") + "\n");
  }

  await new Promise((resolve) => out.end(resolve));

  fs.copyFileSync(inputPath, backupPath);
  fs.renameSync(outputPath, inputPath);

  console.log(`Filled ${filled} rows. Previous file backed up to ${backupPath}.`);
}

main();
