// Pulls the full Southern Baptist Convention church directory from
// churches.sbc.net (WordPress + FacetWP) into scripts/sbc-churches.ndjson —
// one JSON object per line: {slug, name, street, city, state, zip}.
//
// The directory's FacetWP listing "all_churches" is paginated 24/page, sorted
// alphabetically by name. We page through it via the FacetWP REST refresh
// endpoint (no auth). ~1,640 pages, ~39,300 churches. Each result row carries
// name + street + city + state + ZIP+4; blank stubs (duplicate/unlocated
// entries) come through with empty address fields and are kept as-is.
//
// Politeness: churches.sbc.net/robots.txt sets "Crawl-delay: 10", so this waits
// 10s between requests => ~4.6 hours for a full run. Identifying User-Agent +
// Referer/Origin are set.
//
// Resumable: rewrites scripts/.sbc-fetch-checkpoint.json after every page and
// appends to the .ndjson as it goes, deduping by slug. Re-running picks up from
// the last completed page. Safe to kill and restart. A page that fails all
// retries is recorded and swept at the end rather than aborting the run.
//
// Run:  node scripts/fetch-sbc-churches.mjs
//       node scripts/fetch-sbc-churches.mjs --test   (3 pages, 1s delay, *.test.ndjson)

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

const BASE = "https://churches.sbc.net";
const ENDPOINT = `${BASE}/wp-json/facetwp/v1/refresh`;
const DELAY_MS = TEST ? 1000 : 10_000;
const TEST_PAGES = 3;
const PER_PAGE_RETRIES = 6;
const MAX_SWEEP_ROUNDS = 3;

const OUT = path.join(__dirname, TEST ? "sbc-churches.test.ndjson" : "sbc-churches.ndjson");
const CHECKPOINT = path.join(
  __dirname,
  TEST ? ".sbc-fetch-checkpoint.test.json" : ".sbc-fetch-checkpoint.json",
);

const UA =
  "bible-translation-guide church-directory sync (+https://github.com/tonynelson33/bible-translation-guide)";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function payloadFor(paged) {
  return {
    action: "facetwp_refresh",
    data: {
      facets: { search: [], results_pages: [], pages: [] },
      frozen_facets: {},
      http_params: { get: { _paged: String(paged) }, uri: "", url_vars: [] },
      template: "all_churches",
      extras: { sort: "default" },
      soft_refresh: 1,
      is_bfcache: 1,
      first_load: 0,
      paged,
    },
  };
}

const NAMED_ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
function decodeEntities(s) {
  return s
    .replace(/&#(\d+);/g, (_, n) => safeCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => safeCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, name) =>
      name.toLowerCase() in NAMED_ENTITIES ? NAMED_ENTITIES[name.toLowerCase()] : m,
    );
}
function safeCodePoint(n) {
  try {
    return String.fromCodePoint(n);
  } catch {
    return "";
  }
}
function clean(s) {
  return decodeEntities(s.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
}

function parsePage(html) {
  const rows = [];
  const blocks = html.split('<div class="fwpl-result').slice(1);
  for (const b of blocks) {
    const link = b.match(
      /<a href="https:\/\/churches\.sbc\.net\/church\/([^"\/]+)\/?"[^>]*>([\s\S]*?)<\/a>/,
    );
    if (!link) continue;
    // 5 ordered fwpl-item divs per result: name(link), street, city, state, zip.
    // Empty fields render as <div class="fwpl-item ... is-empty"></div> (not omitted),
    // so positional parsing is safe.
    const items = [...b.matchAll(/<div class="fwpl-item[^"]*">([\s\S]*?)<\/div>/g)].map((m) =>
      clean(m[1]),
    );
    const [, street = "", cityRaw = "", state = "", zip = ""] = items;
    rows.push({
      slug: link[1],
      name: clean(link[2]),
      street,
      city: cityRaw.replace(/,\s*$/, ""),
      state: state.toUpperCase(),
      zip,
    });
  }
  return rows;
}

async function fetchPageOnce(paged) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": UA,
      Referer: `${BASE}/`,
      Origin: BASE,
    },
    body: JSON.stringify(payloadFor(paged)),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const rows = parsePage(json.template || "");
  const pager = json.settings?.pager || null;
  if (rows.length === 0) throw new Error("0 results parsed");
  return { rows, pager };
}

async function fetchPage(paged) {
  let lastErr;
  for (let attempt = 1; attempt <= PER_PAGE_RETRIES; attempt++) {
    try {
      return await fetchPageOnce(paged);
    } catch (err) {
      lastErr = err;
      const backoff = Math.min(DELAY_MS * attempt, 120_000);
      console.warn(
        `  page ${paged} attempt ${attempt}/${PER_PAGE_RETRIES}: ${err.message} — retry in ${backoff / 1000}s`,
      );
      await sleep(backoff);
    }
  }
  throw new Error(`page ${paged} failed ${PER_PAGE_RETRIES}x: ${lastErr?.message}`);
}

function loadCheckpoint() {
  if (existsSync(CHECKPOINT)) {
    try {
      return JSON.parse(readFileSync(CHECKPOINT, "utf8"));
    } catch {
      /* fall through to fresh */
    }
  }
  return {
    lastCompletedPage: 0,
    totalWritten: 0,
    failedPages: [],
    totalPages: null,
    totalRowsReported: null,
    startedAt: new Date().toISOString(),
  };
}
function saveCheckpoint(cp) {
  writeFileSync(CHECKPOINT + ".tmp", JSON.stringify(cp, null, 2));
  renameSync(CHECKPOINT + ".tmp", CHECKPOINT);
}

function loadSeenSlugs() {
  const seen = new Set();
  if (existsSync(OUT)) {
    for (const line of readFileSync(OUT, "utf8").split("\n")) {
      if (!line.trim()) continue;
      try {
        seen.add(JSON.parse(line).slug);
      } catch {
        /* ignore a torn last line */
      }
    }
  }
  return seen;
}

function writeRows(rows, seen) {
  const buf = [];
  for (const r of rows) {
    if (seen.has(r.slug)) continue;
    seen.add(r.slug);
    buf.push(JSON.stringify(r));
  }
  if (buf.length) appendFileSync(OUT, buf.join("\n") + "\n");
  return buf.length;
}

async function main() {
  const cp = loadCheckpoint();
  const seen = loadSeenSlugs();
  let totalPages = cp.totalPages || (TEST ? TEST_PAGES : 1637);

  console.log(
    `SBC directory fetch — resume from page ${cp.lastCompletedPage + 1}, ` +
      `${seen.size} churches already written, delay ${DELAY_MS}ms`,
  );
  console.log(`output: ${path.relative(process.cwd(), OUT)}\n`);

  const startPage = cp.lastCompletedPage + 1;
  const runStart = Date.now();

  for (let page = startPage; page <= totalPages; page++) {
    let result;
    try {
      result = await fetchPage(page);
    } catch (err) {
      console.error(`  ${err.message} — recorded, moving on`);
      if (!cp.failedPages.includes(page)) cp.failedPages.push(page);
      cp.lastCompletedPage = page;
      saveCheckpoint(cp);
      if (page < totalPages) await sleep(DELAY_MS);
      continue;
    }

    if (result.pager?.total_pages) {
      cp.totalPages = result.pager.total_pages;
      cp.totalRowsReported = result.pager.total_rows;
      totalPages = TEST ? Math.min(TEST_PAGES, result.pager.total_pages) : result.pager.total_pages;
    }

    const added = writeRows(result.rows, seen);
    cp.lastCompletedPage = page;
    cp.totalWritten = seen.size;
    saveCheckpoint(cp);

    const done = page - startPage + 1;
    const perPage = (Date.now() - runStart) / 1000 / done;
    const etaH = ((totalPages - page) * perPage) / 3600;
    if (page % 10 === 0 || page === totalPages || TEST) {
      console.log(
        `page ${page}/${totalPages} — ${result.rows.length} rows (${added} new) — ` +
          `${seen.size} total — ETA ${etaH.toFixed(2)}h`,
      );
    }

    if (page < totalPages) await sleep(DELAY_MS);
  }

  // Sweep any pages that failed all retries during the linear pass.
  for (let round = 1; round <= MAX_SWEEP_ROUNDS && cp.failedPages.length; round++) {
    const todo = [...cp.failedPages];
    console.log(`\nsweep ${round}: retrying ${todo.length} failed page(s): ${todo.join(", ")}`);
    for (const page of todo) {
      await sleep(DELAY_MS);
      try {
        const { rows } = await fetchPage(page);
        const added = writeRows(rows, seen);
        cp.failedPages = cp.failedPages.filter((p) => p !== page);
        cp.totalWritten = seen.size;
        saveCheckpoint(cp);
        console.log(`  page ${page} recovered — ${added} new (${seen.size} total)`);
      } catch (err) {
        console.error(`  page ${page} still failing: ${err.message}`);
      }
    }
  }

  console.log(`\nDone. ${seen.size} churches in ${path.relative(process.cwd(), OUT)}`);
  if (cp.totalRowsReported) {
    console.log(`Directory reported ${cp.totalRowsReported} total rows.`);
  }
  if (cp.failedPages.length) {
    console.log(`STILL-FAILED pages (re-run the script to retry): ${cp.failedPages.join(", ")}`);
    process.exitCode = 2;
  }
}

main().catch((err) => {
  console.error("\nFATAL:", err.stack || err.message);
  process.exit(1);
});
