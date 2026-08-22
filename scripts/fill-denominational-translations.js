// One-off script: fills bible_translation / bible_translation_notes for the
// three categories with a confirmed denominational default. Leaves every
// other row's existing values untouched.
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
  latter_day_saints_church: {
    translation: "KJV",
    notes: "Officially designated by The Church of Jesus Christ of Latter-day Saints as its English-language Bible (denominational mandate, not individually confirmed per congregation)",
  },
  christian_science_church: {
    translation: "KJV",
    notes: "Used alongside Science and Health with Key to the Scriptures per Christian Science practice (denominational default, not individually confirmed per congregation)",
  },
  episcopal_church: {
    translation: "NRSV",
    notes: "NRSV is the translation used in the Episcopal Church's official lectionary (Revised Common Lectionary as authorized by the 2006 General Convention) and liturgical worship; not mandated for individual members' personal use and not individually confirmed per parish",
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
