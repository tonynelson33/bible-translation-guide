#!/usr/bin/env node
/**
 * Reads scripts/kjvchurches.ndjson (from fetch-kjvchurches.mjs) and writes
 * batched INSERT statements for sync_archive.kjvchurches_raw as numbered
 * .sql files under scripts/kjvchurches-batches/.
 *
 * Deliberately lean: only the columns the geo/name matching step needs
 * (ext_id, name, category, city, region, zip, lat, lon) — street/phone/
 * website/source_url stay in the ndjson on disk and get pulled back in later,
 * only for the much smaller set of rows that actually turn into an insert or
 * update. This keeps each batch file small enough to move through the
 * assistant's file-reading tool in a single call.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";

const IN = new URL("./kjvchurches-us.ndjson", import.meta.url);
const OUT_DIR = new URL("./kjvchurches-batches/", import.meta.url);
const BATCH_SIZE = 400;

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR);

const esc = (s) => (s == null ? "NULL" : `'${String(s).replace(/'/g, "''")}'`);
const num = (n) => (n == null || Number.isNaN(n) ? "NULL" : String(n));

const lines = readFileSync(IN, "utf8").split("\n").filter(Boolean);
const rows = lines.map((l) => JSON.parse(l));

let batchIdx = 0;
for (let i = 0; i < rows.length; i += BATCH_SIZE) {
  const batch = rows.slice(i, i + BATCH_SIZE);
  const values = batch
    .map((r) => `(${num(r.id)},${esc(r.name)},${esc(r.category)},${esc(r.city)},${esc(r.region)},${esc(r.zip)},${num(r.lat)},${num(r.lon)})`)
    .join(",\n");
  const sql = `insert into sync_archive.kjvchurches_raw (ext_id, name, category, city, region, zip, lat, lon)
values
${values}
on conflict (ext_id) do nothing;
`;
  batchIdx++;
  const path = new URL(`batch_${String(batchIdx).padStart(3, "0")}.sql`, OUT_DIR);
  writeFileSync(path, sql);
}

console.log(`Wrote ${batchIdx} batch files (${rows.length} rows, ${BATCH_SIZE}/batch) to ${OUT_DIR.pathname}`);
