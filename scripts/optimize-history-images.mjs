/**
 * One-off: shrink the raw Wikimedia downloads in public/history/ to web sizes.
 * The images are displayed at ~220-340 px; sources are capped well above that
 * for 2x screens, converted to progressive JPEG, metadata stripped.
 *
 *   npm i -D sharp && node scripts/optimize-history-images.mjs
 *
 * Safe to re-run: it reads <name>.src.<ext> if present, else the plain file,
 * and always writes the plain file. To re-process, keep the .src copy.
 */
import { readFile, writeFile, rename, access, readdir } from "node:fs/promises";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "history");

/** The kept-original for `name` — `<base>.src.<any ext>` — or null. */
async function findSrc(name) {
  const stem = basename(name).replace(/\.\w+$/, "");
  for (const f of await readdir(DIR)) {
    if (f.startsWith(`${stem}.src.`)) return join(DIR, f);
  }
  return null;
}

// target = max width in px; `crop` (fractions of the source: left, top, width,
// height) runs before the resize; format forced to jpeg unless noted.
const TARGETS = {
  "lindisfarne-gloss.png": { out: "lindisfarne-gloss.jpg", width: 760 },
  "wycliffe-john.jpg": { width: 620 },
  "tyndale-portrait.jpg": { width: 620 },
  "erasmus-1516-text.jpg": { width: 660 },
  "kjv-1611-genesis.jpg": { width: 680 },
  "coverdale-1535-title.jpg": { width: 660 },
  "great-bible-1539-title.jpg": { width: 660 },
  "bishops-bible-1568.jpg": { width: 640 },
  "geneva-1560-text.jpg": { width: 640 },
  "estienne-1551-nt.jpg": { width: 540 },
  "papyrus-52.jpg": { width: 400 },
  // drop the illuminated headpiece so the card banner shows the Greek text
  "codex-boreelianus.jpg": { width: 600, crop: { left: 0, top: 0.217, width: 1, height: 0.77 } },
  "leningrad-codex.jpg": { width: 660 },
};

const exists = (p) => access(p).then(() => true).catch(() => false);

for (const [name, cfg] of Object.entries(TARGETS)) {
  const plain = join(DIR, name);
  let src = await findSrc(name);
  if (!src) {
    // first run: keep the plain file as the untouched original
    if (!(await exists(plain))) {
      console.warn(`skip ${name} — not found`);
      continue;
    }
    src = plain.replace(/\.(\w+)$/, ".src.$1");
    await rename(plain, src);
  }

  const buf = await readFile(src);
  let pipe = sharp(buf).rotate();
  if (cfg.crop) {
    const m = await sharp(buf).metadata();
    pipe = pipe.extract({
      left: Math.round(cfg.crop.left * m.width),
      top: Math.round(cfg.crop.top * m.height),
      width: Math.round(cfg.crop.width * m.width),
      height: Math.round(cfg.crop.height * m.height),
    });
  }
  const out = await pipe
    .resize({ width: cfg.width, withoutEnlargement: true })
    .jpeg({ quality: 80, progressive: true, mozjpeg: true })
    .toBuffer();

  const outName = cfg.out ?? name;
  await writeFile(join(DIR, outName), out);
  const { width, height } = await sharp(out).metadata();
  console.log(`${outName.padEnd(28)} ${width}x${height}  ${(out.length / 1024).toFixed(0)} KB`);
}
