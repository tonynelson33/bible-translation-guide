#!/usr/bin/env node
/**
 * Fetch the Orthodox Presbyterian Church congregation directory.
 *
 * opc.org/locator.html is a POST form (name="church_locator"). POSTing
 * `state=<ST>&search_go=Y` returns an HTML page with one card per church:
 *
 *   <div class="divGridTableCell ChurchDir"><span>NAME - City, ST</span></div>
 *   ...
 *   <div class="divGridTableCell ChurchDirMore span"><table class="churchCard">
 *     <h2>NAME - City, ST</h2>
 *     <h4>Mailing Address</h4><p>...</p>
 *     <h4>Meeting At</h4><p>STREET</p>
 *     <p><a href="http://maps.google.com/maps?...&q=STREET,+City,+ST+ZIP&...&ll=LAT,LNG&...">
 *     ... Phone / Email / Website / Presbytery ...
 *     <a href="/church.html?church_id=NNN">
 *
 * We sweep all states, parse each card, and dedupe by church_id.
 *
 * Output: scripts/opc-churches.ndjson
 *   {id,name,street,city,state,zip,lat,lng,presbytery,website,phone}
 */
import { writeFileSync } from "node:fs";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";
const OUT = new URL("./opc-churches.ndjson", import.meta.url);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const STATES = "AL AK AZ AR CA CO CT DE DC FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY".split(" ");

const decodeEntities = (s) =>
  String(s || "").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n)).replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"');
const stripTags = (s) => decodeEntities(String(s || "").replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();

async function post(state, tries = 4) {
  const body = new URLSearchParams({ state, presbytery_id: "", keywords: "", zip: "", search_go: "Y", Submit: "Search" }).toString();
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch("https://opc.org/locator.html", {
        method: "POST",
        headers: { "User-Agent": UA, "Content-Type": "application/x-www-form-urlencoded", Referer: "https://opc.org/locator.html" },
        body,
      });
      if (r.ok) return await r.text();
    } catch (e) {
      if (i === tries - 1) throw e;
    }
    await sleep(1000 * (i + 1));
  }
  return null;
}

function parseCards(html) {
  const out = [];
  // each detail card
  const re = /<table class="churchCard">([\s\S]*?)<\/table>/g;
  let m;
  while ((m = re.exec(html))) {
    const card = m[1];
    const idM = card.match(/church_id=(\d+)/);
    if (!idM) continue;
    const h2 = card.match(/<h2>([\s\S]*?)<\/h2>/);
    let name = stripTags(h2 ? h2[1] : "");
    // "NAME - City, ST"  ->  drop the trailing " - City, ST"
    name = name.replace(/\s*[-–]\s*[^-–]+,\s*[A-Z]{2}\s*$/, "").trim() || name;
    // the locator renders names in all-caps; title-case, keeping short particles lower
    if (name === name.toUpperCase()) {
      name = name
        .toLowerCase()
        .replace(/\b([a-z])/g, (_, c) => c.toUpperCase())
        .replace(/\b(Of|The|And|At|In|On|De|La|El)\b/g, (w) => w.toLowerCase())
        .replace(/^([a-z])/, (_, c) => c.toUpperCase());
    }

    const addrM = card.match(/<h4>\s*Address\s*<\/h4>\s*<p>([\s\S]*?)<\/p>/i);
    const meetM = card.match(/<h4>\s*Meeting At\s*<\/h4>\s*<p>([\s\S]*?)<\/p>/i);
    const mailM = card.match(/<h4>\s*Mailing Address\s*<\/h4>\s*<p>([\s\S]*?)<\/p>/i);
    // coords: new maps format /@lat,lng  OR old &ll=lat,lng
    const gll =
      card.match(/\/maps\/place\/([^/]+)\/@(-?\d+\.\d+),(-?\d+\.\d+)/i) ||
      card.match(/maps\?[^"']*[?&]q=([^"'&]+)[^"']*?[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/i);

    let street = "", city = "", state = "", zip = "", lat = null, lng = null;

    // structured address block: "STREET<br />City, ST ZIP"
    const parseBlock = (raw) => {
      const parts = decodeEntities(raw).split(/<br\s*\/?>/i).map((s) => stripTags(s));
      const last = parts[parts.length - 1] || "";
      const cm = last.match(/^(.*?),\s*([A-Z]{2})\s+(\d{5})(?:-\d{4})?$/);
      if (cm) return { street: parts.slice(0, -1).join(" ").trim(), city: cm[1].trim(), state: cm[2], zip: cm[3] };
      return null;
    };
    const blk = (addrM && parseBlock(addrM[1])) || (mailM && parseBlock(mailM[1]));
    if (blk) ({ street, city, state, zip } = blk);
    if (meetM) { const ms = stripTags(meetM[1]).replace(/,?\s*$/, ""); if (ms) street = ms; }

    if (gll) {
      lat = Number(gll[2]);
      lng = Number(gll[3]);
      if (!city || !state) {
        const q = decodeURIComponent(gll[1].replace(/\+/g, " "));
        const qm = q.match(/^(.*),\s*([^,]+),\s*([A-Z]{2})\s+(\d{5})/);
        if (qm) { street = street || qm[1].trim(); city = city || qm[2].trim(); state = state || qm[3]; zip = zip || qm[4]; }
      }
    }
    const presM = card.match(/presbytery_id=\d+[^>]*>([^<]+)</);
    const webM = card.match(/Website:\s*<\/span>\s*<a[^>]*href="([^"]+)"/i) || card.match(/<a[^>]*class="lista"[^>]*href="(http[^"]+)"[^>]*>\s*Website/i);
    const phoneM = card.match(/Phone:\s*([0-9()\-.\s]+)/i);

    out.push({
      id: idM[1],
      name,
      street,
      city,
      state,
      zip,
      lat,
      lng,
      presbytery: presM ? stripTags(presM[1]) : "",
      website: webM ? webM[1].trim() : "",
      phone: phoneM ? phoneM[1].trim() : "",
    });
  }
  return out;
}

(async () => {
  const byId = new Map();
  for (let i = 0; i < STATES.length; i++) {
    const html = await post(STATES[i]);
    if (html) for (const c of parseCards(html)) if (!byId.has(c.id)) byId.set(c.id, c);
    process.stdout.write(`\r  ${i + 1}/${STATES.length} states, ${byId.size} churches`);
    await sleep(400);
  }
  process.stdout.write("\n");

  const rows = [...byId.values()].filter((r) => r.state && r.street);
  rows.sort((a, b) => Number(a.id) - Number(b.id));
  writeFileSync(OUT, rows.map((r) => JSON.stringify(r)).join("\n") + "\n");
  console.log(`Wrote ${rows.length} rows to ${OUT.pathname}`);
  console.log(`  ${[...byId.values()].length - rows.length} dropped (no state/street)`);
  console.log(`  ${rows.filter((r) => !r.lat).length} no coords, ${rows.filter((r) => !r.zip).length} no zip, ${rows.filter((r) => r.website).length} with website`);
})();
