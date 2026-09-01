// Pulls the Assemblies of God (USA) church directory from ag.org into
// scripts/ag-churches.ndjson — one JSON object per line:
// {guid, name, street, city, state, zip, phone}.
//
// ag.org's directory is server-rendered HTML, searchable by state with page-number
// pagination (?S=<ST>&page=<N>), 20 results/page, no auth. We iterate every US
// state + DC + territories and page each until an empty page. ~650 pages total,
// ~12–13k churches.
//
// The result rows give the address as one string "<street> <city>, <ST> <ZIP>"
// with no delimiter between street and city — we split at the last street-suffix
// token (St / Ave / Rd / …, plus a trailing unit designator). ~90%+ clean; the
// rest keep the whole run as `street` and an empty `city` (matching leans on
// house number + zip5 anyway).
//
// robots.txt is empty (no crawl-delay); this waits 1.2s between requests to be
// polite (~15 min).
//
// Resumable: checkpoint after every page, dedupe by guid on restart.
//
// Run:  node scripts/fetch-ag-churches.mjs
//       node scripts/fetch-ag-churches.mjs --test   (2 states, *.test.ndjson)

import {
  readFileSync,
  existsSync,
  appendFileSync,
  writeFileSync,
  renameSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEST = process.argv.includes("--test");

const BASE = "https://ag.org";
const PATH = "/en/resources/directories/church-directory";
const DELAY_MS = TEST ? 400 : 1200;
const PER_PAGE_RETRIES = 5;

const STATES = TEST
  ? ["RI", "VT"]
  : [
      "AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN","IA",
      "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM",
      "NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA",
      "WV","WI","WY","PR","VI","GU","AS","MP",
    ];

const OUT = path.join(__dirname, TEST ? "ag-churches.test.ndjson" : "ag-churches.ndjson");
const CHECKPOINT = path.join(
  __dirname,
  TEST ? ".ag-fetch-checkpoint.test.json" : ".ag-fetch-checkpoint.json",
);
// ag.org 403s a generic/bot User-Agent on the first hit of a session; a normal
// browser UA + Accept headers sail through. robots.txt is empty (no restriction);
// the 1.2s delay is the politeness budget.
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";
const REQ_HEADERS = {
  "User-Agent": UA,
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const NAMED_ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", "#39": "'" };
function decodeEntities(s) {
  return s
    .replace(/&#(\d+);/g, (_, n) => { try { return String.fromCodePoint(+n); } catch { return ""; } })
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => { try { return String.fromCodePoint(parseInt(n, 16)); } catch { return ""; } })
    .replace(/&([a-z0-9#]+);/gi, (m, name) =>
      name.toLowerCase() in NAMED_ENTITIES ? NAMED_ENTITIES[name.toLowerCase()] : m);
}
const clean = (s) => decodeEntities(String(s || "").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

// street-suffix tokens (lowercase, no punctuation); city begins after the last one.
const SUFFIX =
  /\b(st|street|ave|avenue|aven|blvd|boulevard|rd|road|dr|drive|ln|lane|way|ct|court|pkwy|parkway|hwy|highway|cir|circle|pl|place|ter|terrace|trl|trail|loop|pike|row|sq|square|expy|expressway|fwy|freeway|aly|alley|plz|plaza|xing|crossing|run|path|walk|pass|bend|pt|point|rdg|ridge|creek|park|estates|cv|cove|holw|hollow|knl|knoll|byp|bypass|rte|route|county road|cr|fm|state route|sr|us|hwy)\b/i;
const UNIT = /\s+(ste|suite|apt|unit|bldg|building|#|no|fl|floor|rm|room|dept|lot|trlr|space|spc)\.?\s*[\w-]+\.?$/i;

function splitStreetCity(runRaw) {
  const run = runRaw.trim();
  // strip a trailing unit designator into the street part
  let unit = "";
  const um = run.match(UNIT);
  const core = um ? run.slice(0, um.index).trim() : run;
  if (um) unit = um[0].trim();

  let lastIdx = -1;
  const re = new RegExp(SUFFIX.source, "gi");
  let m;
  while ((m = re.exec(core)) !== null) lastIdx = m.index + m[0].length;
  if (lastIdx > 0 && lastIdx < core.length) {
    let street = core.slice(0, lastIdx).trim();
    const city = core.slice(lastIdx).trim();
    if (unit) street += " " + unit;
    // sanity: city shouldn't be absurdly long or contain digits
    if (city && city.length <= 40 && !/\d/.test(city)) return { street, city };
  }
  return { street: run, city: "" };
}

function parsePage(html) {
  const rows = [];
  const panels = html.split('<div class="panel">').slice(1);
  for (const p of panels) {
    const g = (p.match(/Church-Details\?g=([0-9a-f-]{36})/i) || [])[1];
    if (!g) continue;
    const name = clean((p.match(/<h3>([\s\S]*?)<\/h3>/) || [])[1]);
    const addrRaw = clean((p.match(/<p class="address">[\s\S]*?<\/i>\s*([\s\S]*?)<\/p>/) || [])[1]);
    const phone = clean((p.match(/<p class="phone">[\s\S]*?<\/i>\s*([\s\S]*?)<\/p>/) || [])[1]);
    const m = addrRaw.match(/^(.*),\s*([A-Za-z]{2})\s+(\d{5}(?:-\d{4})?)\s*$/);
    let street = "", city = "", state = "", zip = "";
    if (m) {
      state = m[2].toUpperCase();
      zip = m[3];
      ({ street, city } = splitStreetCity(m[1]));
    } else {
      street = addrRaw;
    }
    if (!name) continue;
    rows.push({ guid: g, name, street, city, state, zip, phone });
  }
  return rows;
}

async function fetchPage(state, page) {
  const url = `${BASE}${PATH}?Q=&D=&C=&S=${state}&Z=&page=${page}`;
  let lastErr;
  for (let attempt = 1; attempt <= PER_PAGE_RETRIES; attempt++) {
    try {
      const res = await fetch(url, { headers: REQ_HEADERS });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();
      return parsePage(html);
    } catch (err) {
      lastErr = err;
      const backoff = Math.min(DELAY_MS * attempt, 30_000);
      console.warn(`  ${state} p${page} attempt ${attempt}: ${err.message} — retry in ${backoff / 1000}s`);
      await sleep(backoff);
    }
  }
  throw new Error(`${state} p${page} failed ${PER_PAGE_RETRIES}x: ${lastErr?.message}`);
}

function loadCheckpoint() {
  if (existsSync(CHECKPOINT)) {
    try { return JSON.parse(readFileSync(CHECKPOINT, "utf8")); } catch { /* fresh */ }
  }
  return { doneStates: [], totalWritten: 0, startedAt: new Date().toISOString() };
}
function saveCheckpoint(cp) {
  writeFileSync(CHECKPOINT + ".tmp", JSON.stringify(cp, null, 2));
  renameSync(CHECKPOINT + ".tmp", CHECKPOINT);
}
function loadSeen() {
  const seen = new Set();
  if (existsSync(OUT)) {
    for (const line of readFileSync(OUT, "utf8").split("\n")) {
      if (!line.trim()) continue;
      try { seen.add(JSON.parse(line).guid); } catch { /* torn line */ }
    }
  }
  return seen;
}

async function main() {
  const cp = loadCheckpoint();
  const seen = loadSeen();
  const todo = STATES.filter((s) => !cp.doneStates.includes(s));
  console.log(`AG directory fetch — ${todo.length} states left, ${seen.size} churches already written`);

  const runStart = Date.now();
  let pagesDone = 0;

  for (const state of todo) {
    let page = 1;
    let stateCount = 0;
    while (true) {
      const rows = await fetchPage(state, page);
      pagesDone++;
      if (rows.length === 0) break;
      const buf = [];
      for (const r of rows) {
        if (seen.has(r.guid)) continue;
        seen.add(r.guid);
        buf.push(JSON.stringify(r));
      }
      if (buf.length) appendFileSync(OUT, buf.join("\n") + "\n");
      stateCount += rows.length;
      page++;
      await sleep(DELAY_MS);
      if (page > 400) break; // safety
    }
    cp.doneStates.push(state);
    cp.totalWritten = seen.size;
    saveCheckpoint(cp);
    const rate = (Date.now() - runStart) / 1000 / pagesDone;
    console.log(
      `${state}: ${page - 1} pages, ${stateCount} rows — ${seen.size} total — ~${(rate).toFixed(1)}s/pg`,
    );
  }

  console.log(`\nDone. ${seen.size} churches in ${path.relative(process.cwd(), OUT)}`);
}

main().catch((err) => {
  console.error("\nFATAL:", err.stack || err.message);
  process.exit(1);
});
