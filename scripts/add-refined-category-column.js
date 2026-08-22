// One-off script: adds a "refined_category" column to churches-combined.csv.
// Non-"church_cathedral" rows just restate their existing prim_category.
// "church_cathedral" rows (the generic catch-all) get reclassified by matching
// denominational keywords in the church name; anything that matches nothing
// stays "church_cathedral".
const fs = require("fs");
const readline = require("readline");
const path = require("path");

const inputPath = path.join(__dirname, "..", "churches-combined.csv");
const outputPath = path.join(__dirname, "..", "churches-combined.tmp.csv");

// Overrides apply regardless of the existing prim_category, because these are
// known miscategorizations already present in the source data (e.g. AME
// churches tagged "episcopal_church" just because their name contains
// "Episcopal", when they're actually a distinct Methodist denomination).
const OVERRIDE_PATTERNS = [
  { category: "methodist_church", pattern: /African Methodist Episcopal|Christian Methodist Episcopal/i },
  { category: "lutheran_church", pattern: /\bLutheran\b/i },
  { category: "assembly_of_god_church", pattern: /\bAssembl(?:y|ies) of God\b/i },
];

// Order matters: first match wins, checked top to bottom. More specific
// patterns that are substrings of a broader one (e.g. "Orthodox Presbyterian"
// vs. "Orthodox", "Disciples of Christ" vs. "Church of Christ") must come
// before the broader pattern they'd otherwise collide with.
const CATCH_ALL_PATTERNS = [
  { category: "latter_day_saints_church", pattern: /latter[- ]day saints|\bLDS\b|\bMormon\b/i },
  { category: "catholic_church", pattern: /\bCatholic\b/i },
  { category: "presbyterian_church", pattern: /\bOrthodox Presbyterian\b/i },
  { category: "orthodox_church", pattern: /\bOrthodox\b/i },
  { category: "lutheran_church", pattern: /\bLutheran\b/i },
  { category: "methodist_church", pattern: /\bMethodist\b/i },
  { category: "assembly_of_god_church", pattern: /\bAssembl(?:y|ies) of God\b/i },
  { category: "presbyterian_church", pattern: /\bPresbyterian\b/i },
  { category: "adventist_church", pattern: /\bAdventist\b/i },
  { category: "congregational_church", pattern: /\bCongregational\b|\bUnited Church of Christ\b/i },
  { category: "disciples_of_christ_church", pattern: /\bDisciples of Christ\b/i },
  { category: "christian_science_church", pattern: /Church of Christ,? Scientist/i },
  { category: "church_of_christ", pattern: /\bChurch of Christ\b/i },
];

function classify(name) {
  for (const { category, pattern } of CATCH_ALL_PATTERNS) {
    if (pattern.test(name)) return category;
  }
  return "church_cathedral";
}

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
  let nameIndex = -1;
  let primCategoryIndex = -1;
  let refinedCategoryIndex = -1;
  const counts = {};

  for await (const line of rl) {
    if (line === "") continue;
    const fields = parseCsvLine(line);
    if (isHeader) {
      nameIndex = fields.indexOf("name");
      primCategoryIndex = fields.indexOf("prim_category");
      refinedCategoryIndex = fields.indexOf("refined_category");
      if (refinedCategoryIndex === -1) {
        refinedCategoryIndex = fields.length;
        fields.push("refined_category");
      }
      isHeader = false;
    } else {
      const name = fields[nameIndex];
      const primCategory = fields[primCategoryIndex];
      const override = OVERRIDE_PATTERNS.find(({ pattern }) => pattern.test(name));
      let refined;
      if (override) {
        refined = override.category;
      } else if (primCategory === "baptist_church" && /\bthe Baptist\b/i.test(name)) {
        // "St. ___ the Baptist" is patron-saint naming (John the Baptist),
        // common in Catholic/Orthodox/Episcopal parish names - not a
        // reliable signal of an actual Baptist congregation.
        refined = /Catholic/i.test(name) ? "catholic_church" : "church_cathedral";
      } else if (primCategory === "church_cathedral") {
        refined = classify(name);
      } else {
        refined = primCategory;
      }
      counts[refined] = (counts[refined] || 0) + 1;
      fields[refinedCategoryIndex] = refined;
    }
    out.write(fields.map(writeCsvField).join(",") + "\n");
  }

  out.end();
  console.log(counts);
}

main();
