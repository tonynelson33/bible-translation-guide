// Ongoing script: updates the "bible_translation" / "bible_translation_notes"
// columns (already present in churches-combined.csv) for whichever church ids
// have been researched so far. Safe to re-run repeatedly as KNOWN_TRANSLATIONS
// grows - it only overwrites the two translation columns for matched ids and
// leaves every other field untouched.
const fs = require("fs");
const readline = require("readline");
const path = require("path");

const inputPath = path.join(__dirname, "..", "churches-combined.csv");
const backupPath = path.join(__dirname, "..", "churches-combined.csv.bak");
const outputPath = path.join(__dirname, "..", "churches-combined.tmp.csv");

// Researched via web search + fetching each church's own site / diocesan or
// denominational records. translation: just the abbreviation, for the column
// itself. notes: source/confidence caveats, kept in the column to the right.
const KNOWN_TRANSLATIONS = {
  "9dc70048-7856-45e0-93ad-c5e9ba84f4f9": { translation: "", notes: "" }, // Anchorage Native New Life Fellowship - not publicly stated
  "f68376f8-47d8-4051-922a-aa3715cb45a3": { translation: "", notes: "" }, // Grace Evangelical Lutheran Church, Langruth MB - not publicly stated
  "b6e0ce3d-d8f2-4af9-b8ea-6cd8f3d3a228": {
    translation: "KJV",
    notes: "RCCG denominational standard (official Study Bible); not independently confirmed for this specific congregation",
  },
  "cec4fe92-3a7e-4cbd-b30d-bb8fbe0873f3": { translation: "", notes: "" }, // Antioch Church of Philadelphia - not publicly stated
  "2c029b79-0ff8-4c12-a8c9-3d16ad56dcbf": {
    translation: "NABRE",
    notes: "USCCB Lectionary for Mass, standard for U.S. Catholic parishes (confirmed via parish site)",
  },
  "f9b6e7d2-b0fb-4504-a8ba-77ee9ee1e089": {
    translation: "ESV",
    notes:
      "St. John's Anglican Church, Southampton PA - confirmed ACNA parish (acna.org/admin_units/519); ACNA's 2019 Book of Common Prayer uses the ESV for scripture quotations (except Psalms/Canticles) - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "09ae984b-170d-4ebe-b626-1319c917b0d0": {
    translation: "",
    notes:
      "All Saints' Anglican Church, Macon GA - this is Anglican Catholic Church (a Continuing Anglican jurisdiction), NOT ACNA, so the ACNA/ESV default does not apply; specific translation not publicly stated",
  },
  "98fdf071-468a-4d2f-baf0-e1e31c10d8af": {
    translation: "ESV",
    notes:
      "Holy Trinity Anglican Church, Charleston SC - confirmed ACNA parish, Diocese of South Carolina (acna.org/admin_units/1382); ACNA's 2019 Book of Common Prayer uses the ESV for scripture quotations (except Psalms/Canticles) - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "7cad55a4-d9d5-49cf-b296-03c41cc83739": {
    translation: "ESV",
    notes:
      "HopePointe Anglican Church, The Woodlands TX - confirmed ACNA parish (acna.org/admin_units/256); ACNA's 2019 Book of Common Prayer uses the ESV for scripture quotations (except Psalms/Canticles) - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
  "2f1b1905-ebaa-4093-8869-b7e74cabde01": {
    translation: "ESV",
    notes:
      "Christ Church Vienna VA - confirmed ACNA parish (acna.org/admin_units/620); ACNA's 2019 Book of Common Prayer uses the ESV for scripture quotations (except Psalms/Canticles) - not independently confirmed which pew/pulpit Bible this specific congregation uses",
  },
};

// Minimal RFC-4180 CSV line parser/writer (handles quoted fields with commas).
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
  let idIndex = -1;
  let translationIndex = -1;
  let notesIndex = -1;
  let matched = 0;
  let rowCount = 0;

  for await (const line of rl) {
    if (line === "") continue;
    const fields = parseCsvLine(line);
    if (isHeader) {
      idIndex = fields.indexOf("id");
      translationIndex = fields.indexOf("bible_translation");
      notesIndex = fields.indexOf("bible_translation_notes");
      if (idIndex === -1 || translationIndex === -1 || notesIndex === -1) {
        throw new Error("Expected columns not found in header: " + line);
      }
      isHeader = false;
    } else {
      rowCount++;
      const id = fields[idIndex];
      const entry = KNOWN_TRANSLATIONS[id];
      if (entry) {
        matched++;
        fields[translationIndex] = entry.translation;
        fields[notesIndex] = entry.notes;
      }
    }
    out.write(fields.map(writeCsvField).join(",") + "\n");
  }

  await new Promise((resolve) => out.end(resolve));

  // Back up the previous version before replacing it, then swap in the new one.
  fs.copyFileSync(inputPath, backupPath);
  fs.renameSync(outputPath, inputPath);

  console.log(
    `Matched ${matched} of ${Object.keys(KNOWN_TRANSLATIONS).length} known ids across ${rowCount} rows. Previous file backed up to ${backupPath}.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
