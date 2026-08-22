// Second cleanup pass, addressing patterns missed by pass 1:
// - Puerto Rico / US Virgin Islands rows have a BLANK region field (not "PR"/"VI"), so
//   pass 1's leading-zero-loss fix (which required a matching region) never caught their
//   2-leading-zeros-stripped zips. Detected here by known PR/USVI municipality names.
// - A literal two-character "\n" (backslash + n) was embedded as text in some zips, which
//   .trim() doesn't touch (it's not a real whitespace character).
// - A handful of zip fields contain the real zip buried in extra text (e.g. a service time,
//   a note, a state abbreviation with no space) - extracted where unambiguous.
// - Unicode "mathematical bold" digit variants (e.g. from a copy-pasted style) normalized
//   to plain ASCII digits.
// - Two confirmed non-US churches mistagged as US (Canadian postal code / city name).
// - Anything left over that's clearly not a zip (free text, phone number, "N/A", etc.) is
//   cleared to empty rather than left as garbage - never deletes the row.

const fs = require("fs");
const readline = require("readline");
const path = require("path");

const inputPath = path.join(__dirname, "..", "churches-combined.csv");
const backupPath = path.join(__dirname, "..", "churches-combined.csv.bak");
const outputPath = path.join(__dirname, "..", "churches-combined.tmp.csv");

// Puerto Rico municipalities seen in the blank-region rows (locality field is the
// municipality/barrio name). Not exhaustive of all 78 PR municipalities - only the ones
// actually present get matched; anything else stays untouched by this rule.
const PR_LOCALITIES = new Set([
  "gurabo", "yauco", "hato arriba", "corozal", "san sebastian", "comerio", "barceloneta",
  "hatillo", "penuelas", "aibonito", "cidra", "toa alta", "guanica", "carolina", "manati",
  "camuy", "rafael capo", "cayuco", "cabo rojo", "botijas", "jauca", "la plena", "factor",
  "garrochales", "quebrada", "villa evangelina", "bayamon", "maricao", "luyando", "benitez",
  "coto sur", "aguada", "guayama", "juncos", "las piedras", "ponce", "arecibo", "quemado",
]);
const USVI_LOCALITIES = new Set(["sion farm"]);

// Confirmed non-US churches mistagged as US, found via manual review.
const NON_US_MISTAGGED = {
  // "SAINT PAUL london Ontario" - the church's own name states it's in London, Ontario, Canada.
  "N6C5G2": { locality: "London", region: "Ontario", country: "CA" },
};

const UNFIXABLE_GARBAGE_PATTERNS = [
  /^n\/?a$/i,
  /^<<.*>>$/,
  /^goodwill,?$/i,
  /^i-9$/i,
  /^r\/b\/5$/i,
  /^no mailbox$/i,
  /^yh$/i,
  /^español$/i,
  /^ohio$/i,
  /^obispado$/i,
  /^kingdom of tonga$/i,
  /^\d{1,4}-\d{4}$/, // looks like a phone number fragment
  /^0$/,
];

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

// Normalizes Unicode "mathematical bold" digit variants (U+1D7CE-U+1D7FF range) to ASCII.
function normalizeDigits(str) {
  return str.replace(/[\u{1D7CE}-\u{1D7FF}]/gu, (ch) => {
    const codePoint = ch.codePointAt(0);
    const digit = (codePoint - 0x1d7ce) % 10;
    return String(digit);
  });
}

function fixZipPass2(rawZip, locality, region, country) {
  if (country !== "US") return { zip: rawZip, region };

  // Strip a literal backslash-n text sequence (not a real newline character).
  let zip = rawZip.replace(/\\n/g, "").trim();

  if (/^\d{5}(-\d{4})?$/.test(zip)) return { zip, region };

  // Puerto Rico / USVI: blank region, 1-3 digit zip missing its "00" prefix.
  if (!region.trim() && /^\d{1,3}$/.test(zip)) {
    const loc = locality.trim().toLowerCase();
    if (PR_LOCALITIES.has(loc)) return { zip: zip.padStart(5, "0"), region: "PR" };
    if (USVI_LOCALITIES.has(loc)) return { zip: zip.padStart(5, "0"), region: "VI" };
  }

  // Unicode bold-digit obfuscation, e.g. a stylized "76049".
  const normalized = normalizeDigits(zip);
  if (/^\d{5}(-\d{4})?$/.test(normalized)) return { zip: normalized, region };

  // State abbreviation glued to the zip with no space, e.g. "PA17401".
  const glued = zip.match(/^([A-Za-z]{2})(\d{5})$/);
  if (glued) return { zip: glued[2], region };

  // A real 5-digit zip buried in extra text (service times, notes, addresses).
  const embedded = zip.match(/\b(\d{5})\b/);
  if (embedded) return { zip: embedded[1], region };

  // Known garbage/placeholder values - clear rather than leave nonsense.
  if (UNFIXABLE_GARBAGE_PATTERNS.some((re) => re.test(zip))) return { zip: "", region };

  return { zip, region };
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

  let zipFixed = 0;
  let zipCleared = 0;
  let countryFixed = 0;

  for (const r of rows) {
    const origZip = r[zipIdx];
    const trimmedZip = origZip.replace(/\\n/g, "").trim();

    if (NON_US_MISTAGGED[trimmedZip] && r[countryIdx] === "US") {
      const fix = NON_US_MISTAGGED[trimmedZip];
      r[localityIdx] = fix.locality;
      r[regionIdx] = fix.region;
      r[countryIdx] = fix.country;
      countryFixed++;
      continue;
    }

    const { zip: fixedZip, region: fixedRegion } = fixZipPass2(
      origZip,
      r[localityIdx],
      r[regionIdx],
      r[countryIdx],
    );
    if (fixedZip !== origZip) {
      if (!fixedZip) zipCleared++;
      else zipFixed++;
      r[zipIdx] = fixedZip;
      r[regionIdx] = fixedRegion;
    }
  }

  console.log(`Fixed ${zipFixed} additional malformed zip codes.`);
  console.log(`Cleared ${zipCleared} unfixable garbage zip values (set to empty, row kept).`);
  console.log(`Reclassified ${countryFixed} additional mistagged-country churches.`);

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
