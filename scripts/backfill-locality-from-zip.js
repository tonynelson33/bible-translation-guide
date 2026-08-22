// Backfills the "locality" (city) field for rows that have a valid US zip code but no
// city, using scripts/reference-us-zips.csv - a free, public-domain zip/city/state
// reference dataset (SimpleMaps US Zip Codes, ~33,100 rows). Also broadens the address
// text extraction for the remaining rows whose address embeds a "City, State" pattern.
//
// Never invents a city - only fills locality when the zip code gives a confident match.

const fs = require("fs");
const readline = require("readline");
const path = require("path");

const inputPath = path.join(__dirname, "..", "churches-combined.csv");
const backupPath = path.join(__dirname, "..", "churches-combined.csv.bak");
const outputPath = path.join(__dirname, "..", "churches-combined.tmp.csv");
const zipRefPath = path.join(__dirname, "reference-us-zips.csv");

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

// Broader "City, State" extraction for addresses without a full street+zip pattern.
function extractCityFromAddress(address) {
  const patterns = [
    // "123 Street, City, ST 12345, USA" or similar with a trailing zip/country
    /^(.*?),\s*([A-Za-z .'-]+),\s*[A-Z]{2}\s*\d{5}(?:-\d{4})?,?\s*(?:USA|US|United States)?\s*$/,
    // "123 Street, City, State Name" (no zip)
    /^(.*?),\s*([A-Za-z .'-]+),\s*(?:Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming)\s*$/i,
    // Bare "City, State" with no street at all
    /^([A-Za-z .'-]+),\s*(?:Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming)\s*$/i,
  ];
  for (let idx = 0; idx < patterns.length; idx++) {
    const m = address.match(patterns[idx]);
    if (m) {
      if (idx === 2) return { city: m[1].trim(), streetOnly: address.trim() };
      const street = m[1].trim();
      const city = m[2].trim();
      if (street && city) return { city, streetOnly: street };
    }
  }
  return null;
}

async function loadZipReference() {
  const rl = readline.createInterface({
    input: fs.createReadStream(zipRefPath),
    crlfDelay: Infinity,
  });
  const map = new Map();
  let i = 0;
  let zipI, cityI, stateI;
  for await (const line of rl) {
    const fields = parseCsvLine(line);
    if (i === 0) {
      zipI = fields.indexOf("zip");
      cityI = fields.indexOf("city");
      stateI = fields.indexOf("state_id");
      i++;
      continue;
    }
    map.set(fields[zipI], { city: fields[cityI], state: fields[stateI] });
    i++;
  }
  return map;
}

async function main() {
  const zipRef = await loadZipReference();
  console.log(`Loaded ${zipRef.size} reference zip codes.`);

  const rl = readline.createInterface({
    input: fs.createReadStream(inputPath),
    crlfDelay: Infinity,
  });

  let header;
  let nameIdx, addrIdx, localityIdx, zipIdx, regionIdx, countryIdx;
  const rows = [];

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
      lineNo++;
      continue;
    }
    rows.push(fields);
    lineNo++;
  }

  console.log(`Read ${rows.length} data rows.`);

  let filledFromZip = 0;
  let filledFromAddress = 0;

  for (const r of rows) {
    if (r[localityIdx].trim()) continue;
    if (r[countryIdx] !== "US") continue;

    const zip = r[zipIdx].trim().match(/^(\d{5})/);
    if (zip && zipRef.has(zip[1])) {
      const ref = zipRef.get(zip[1]);
      r[localityIdx] = ref.city;
      filledFromZip++;
      continue;
    }

    const extracted = extractCityFromAddress(r[addrIdx]);
    if (extracted) {
      r[localityIdx] = extracted.city;
      r[addrIdx] = extracted.streetOnly;
      filledFromAddress++;
    }
  }

  console.log(`Filled ${filledFromZip} localities from the zip reference dataset.`);
  console.log(`Filled ${filledFromAddress} additional localities from address text patterns.`);

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
