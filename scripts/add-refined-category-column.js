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
// "Episcopal", when they're actually a distinct Methodist denomination — in the
// live data ~96% of the "episcopal_church" bucket was actually AME).
//
// AME family = the spelled-out names plus the AME / A.M.E. / AMEZ / AMEC / UAME
// abbreviations. Bare "CME" is deliberately NOT matched (870 false positives in
// the data); only spelled-out "Christian Methodist Episcopal" counts.
// "Missionary Baptist" is split out of the generic Baptist bucket (~8,800 rows).
const OVERRIDE_PATTERNS = [
  { category: "methodist_ame", pattern: /African Methodist|Christian Methodist Episcopal|\bU?A\.?M\.?E\.?[ZC]?\b/i },
  { category: "missionary_baptist_church", pattern: /\bMissionary Baptist\b/i },
  { category: "lutheran_church", pattern: /\bLutheran\b/i },
  { category: "assembly_of_god_church", pattern: /\bAssembl(?:y|ies) of God\b/i },
];

// Order matters: first match wins, checked top to bottom. More specific
// patterns that are substrings of a broader one (e.g. "Orthodox Presbyterian"
// vs. "Orthodox", "Disciples of Christ" vs. "Church of Christ") must come
// before the broader pattern they'd otherwise collide with. Same reasoning
// applies to the additions below: "Church of God in Christ" (COGIC) and
// "...of Prophecy" are distinct denominations from generic "Church of God"
// and must be checked first; "Reformed Baptist" is a Baptist church
// theologically, not part of the Reformed Church in America/Christian
// Reformed Church family, so it's routed to baptist_church before the
// generic Reformed pattern gets a chance to catch it.
// NOTE (2026-08): Latter Day Saints and Christian Science are no longer
// classified — every such row was removed from the directory (see
// scripts/apply-taxonomy-2026-08.mjs and scripts/removed-rows-2026-08-28.csv).
// Do NOT re-add /latter[- ]day saints/ or /Church of Christ,? Scientist/
// patterns here; a reload would resurrect the deleted rows.
const CATCH_ALL_PATTERNS = [
  { category: "catholic_church", pattern: /\bCatholic\b/i },
  { category: "presbyterian_church", pattern: /\bOrthodox Presbyterian\b/i },
  // Oriental Orthodox (Coptic/Armenian/Ethiopian/Eritrean/Syriac/Malankara) —
  // a separate communion from Eastern Orthodox since 451 AD; must precede the
  // generic Orthodox pattern.
  { category: "oriental_orthodox_church", pattern: /\bCoptic\b|Ethiopian Orthodox|Eritrean Orthodox|Armenian (?:Apostolic|Orthodox|Church)|\bSyriac\b|Malankara|Mar Thoma/i },
  { category: "orthodox_church", pattern: /\bOrthodox\b/i },
  { category: "lutheran_church", pattern: /\bLutheran\b/i },
  { category: "methodist_church", pattern: /\bMethodist\b/i },
  // "X Episcopal Church" — the Episcopal Church / Continuing Anglican bodies.
  // After Methodist so "Methodist Episcopal" (old UMC name) stays Methodist;
  // AME / A.M.E. is handled earlier by OVERRIDE_PATTERNS.
  { category: "anglican_episcopal_church", pattern: /\bEpiscopal\b/i },
  { category: "assembly_of_god_church", pattern: /\bAssembl(?:y|ies) of God\b/i },
  { category: "church_of_god_in_christ", pattern: /\bChurch of God in Christ\b/i },
  // Church of God of Prophecy (a 1917 split from Church of God, Cleveland TN)
  // was previously its own category but was merged back into the generic
  // "Church of God" bucket as an intentional simplification -- the two read
  // as basically the same thing to most people filling out a form, and
  // Prophecy's ~500 matches didn't justify the extra dropdown entry the way
  // COGIC's much larger, historically distinct ~2,000 does. No separate
  // pattern needed: "Church of God of Prophecy" already matches the plain
  // "Church of God" pattern below as a substring.
  { category: "church_of_god", pattern: /\bChurch of God\b/i },
  { category: "baptist_church", pattern: /\bReformed Baptist\b/i },
  { category: "presbyterian_church", pattern: /\bPresbyterian\b/i },
  { category: "reformed_church", pattern: /\bReformed\b/i },
  { category: "adventist_church", pattern: /\bAdventist\b/i },
  { category: "congregational_church", pattern: /\bCongregational\b|\bUnited Church of Christ\b/i },
  { category: "disciples_of_christ_church", pattern: /\bDisciples of Christ\b/i },
  { category: "church_of_christ", pattern: /\bChurch of Christ\b/i },
  { category: "nazarene_church", pattern: /\bNazarene\b/i },
  { category: "wesleyan_church", pattern: /\bWesleyan\b/i },
  { category: "mennonite_church", pattern: /\bMennonite\b/i },
  { category: "foursquare_church", pattern: /\bFoursquare\b/i },
  { category: "vineyard_church", pattern: /^(?!.*Martha'?s Vineyard).*\bVineyard\b/i },
  { category: "salvation_army", pattern: /\bSalvation Army\b/i },
  { category: "quaker_friends", pattern: /\bQuaker\b|\bFriends Meeting\b/i },
  { category: "calvary_chapel_church", pattern: /\bCalvary Chapel\b/i },
  { category: "church_of_the_brethren", pattern: /\bChurch of the Brethren\b/i },
  // Oneness / Apostolic Pentecostal (UPCI, PAW, and the many independent
  // "Apostolic" / "Christ ... Apostolic" churches). Excludes the unrelated
  // New Apostolic Church and the Anabaptist Apostolic Christian Church; the
  // Catholic / Orthodox / Lutheran "Apostolic" names are already caught above.
  {
    category: "oneness_apostolic_church",
    pattern: /^(?!.*New Apostolic)(?!.*Apostolic Christian).*(?:\bApostolic\b|United Pentecostal|\bUPCI\b|Pentecostal Assemblies of the World|\bOneness\b)/i,
  },
  // Independent / dispensational "Bible Church" — but not "X Bible Baptist
  // Church" or "Bible Presbyterian/Methodist/Lutheran" (real sub-denominations).
  {
    category: "bible_church",
    pattern: /^(?!.*\bBaptist\b)(?!.*\bPresbyterian\b)(?!.*\bMethodist\b)(?!.*\bLutheran\b)(?!.*\bCatholic\b).*\bBible Church\b/i,
  },
  // Christian & Missionary Alliance — congregations are almost always named
  // "X Alliance Church".
  { category: "christian_missionary_alliance", pattern: /\bAlliance Church\b|Christian and Missionary Alliance|Christian & Missionary Alliance/i },
  // Generic "X Baptist Church" — kept last so the more specific denominations
  // above win. Excludes "St. ___ the Baptist" patron-saint naming (John the
  // Baptist), common on Catholic/Orthodox/Episcopal parishes. "Missionary
  // Baptist" is handled earlier by OVERRIDE_PATTERNS.
  { category: "baptist_church", pattern: /^(?!.*\bthe Baptist\b).*\bBaptist\b/i },
];

function classify(name) {
  for (const { category, pattern } of CATCH_ALL_PATTERNS) {
    if (pattern.test(name)) return category;
  }
  return "church_cathedral";
}

// Fold / merge to the final taxonomy (mirrors lib/suggestionOptions.ts's
// denominationOptions). "Pentecostal" / "Evangelical" / "Mission" are
// descriptors, not a specific body -> not identified. Wesleyan and
// Anglican/Episcopal have merged dropdown labels. convents_and_monasteries is
// left as-is here; scripts/apply-taxonomy-2026-08.mjs removes those rows.
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
      refined = normalizeCategory(refined);
      // Fallback: if we still landed on "not identified" — either because the
      // source filed the row under a vague non-cathedral prim_category, or
      // because normalizeCategory just folded a generic Pentecostal/Evangelical/
      // Mission bucket — try the name classifier once more. A name like
      // "Bethel Church of God" should read as Church of God, not "not
      // identified". (classify() is a no-op here when it already ran above.)
      if (refined === "church_cathedral") {
        refined = classify(name);
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
