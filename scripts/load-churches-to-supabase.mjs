// Bulk-loads churches-combined.csv into the Supabase `churches` table via PostgREST's
// bulk-insert endpoint (POST with a JSON array body), batched to keep each request a
// reasonable size. Run: node scripts/load-churches-to-supabase.mjs

import { readFileSync, createReadStream } from "node:fs";
import { createInterface } from "node:readline";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CSV_PATH = path.join(ROOT, "churches-combined.csv");

const SUPABASE_URL = "https://dyeeuwdwmmkwtsmmbtcr.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5ZWV1d2R3bW1rd3RzbW1idGNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzMjE2MzAsImV4cCI6MjEwMTg5NzYzMH0.9lGZbiHHHuDEDQZsj9ila9YQ_56Vf8RA8I3KeQYeXDc";

const BATCH_SIZE = 1000;

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

async function insertBatch(rows) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/churches`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(rows),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 500)}`);
  }
}

async function main() {
  const rl = createInterface({ input: createReadStream(CSV_PATH), crlfDelay: Infinity });

  let header;
  let idI, nameI, addrI, localityI, zipI, regionI, countryI, xminI, yminI, categoryI, transI, notesI;
  let batch = [];
  let total = 0;
  let lineNo = 0;

  for await (const line of rl) {
    if (line === "") continue;
    const fields = parseCsvLine(line);
    if (lineNo === 0) {
      header = fields;
      idI = fields.indexOf("id");
      nameI = fields.indexOf("name");
      addrI = fields.indexOf("address");
      localityI = fields.indexOf("locality");
      zipI = fields.indexOf("zip");
      regionI = fields.indexOf("region");
      countryI = fields.indexOf("country");
      xminI = fields.indexOf("xmin");
      yminI = fields.indexOf("ymin");
      categoryI = fields.indexOf("refined_category");
      transI = fields.indexOf("bible_translation");
      notesI = fields.indexOf("bible_translation_notes");
      lineNo++;
      continue;
    }

    batch.push({
      id: fields[idI],
      name: fields[nameI],
      address: fields[addrI],
      locality: fields[localityI],
      zip: fields[zipI] || null,
      region: fields[regionI],
      country: fields[countryI],
      latitude: fields[yminI] ? parseFloat(fields[yminI]) : null,
      longitude: fields[xminI] ? parseFloat(fields[xminI]) : null,
      category: fields[categoryI] || null,
      bible_translation: fields[transI] || null,
      bible_translation_notes: fields[notesI] || null,
    });

    if (batch.length >= BATCH_SIZE) {
      await insertBatch(batch);
      total += batch.length;
      if (total % 20000 === 0) console.log(`Inserted ${total} rows...`);
      batch = [];
    }
    lineNo++;
  }

  if (batch.length > 0) {
    await insertBatch(batch);
    total += batch.length;
  }

  console.log(`Done. Inserted ${total} rows total.`);
}

main().catch((err) => {
  console.error("Fatal error:", err.message);
  process.exit(1);
});
