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
import { readFile, writeFile, rename, access } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "history");

// target = max width in px; format forced to jpeg unless noted
const TARGETS = {
  "lindisfarne-gloss.png": { out: "lindisfarne-gloss.jpg", width: 760 },
  "wycliffe-john.jpg": { width: 620 },
  "erasmus-1516-text.jpg": { width: 660 },
  "kjv-1611-genesis.jpg": { width: 680 },
  "coverdale-1535-title.jpg": { width: 660 },
  "great-bible-1539-title.jpg": { width: 660 },
  "bishops-bible-1568.jpg": { width: 660 },
  "estienne-1551-nt.jpg": { width: 540 },
  "papyrus-52.jpg": { width: 400 },
  "codex-boreelianus.jpg": { width: 560 },
  "leningrad-codex.jpg": { width: 660 },
};

const exists = (p) => access(p).then(() => true).catch(() => false);

for (const [name, cfg] of Object.entries(TARGETS)) {
  const plain = join(DIR, name);
  const src = join(DIR, name.replace(/\.(\w+)$/, ".src.$1"));
  const input = (await exists(src)) ? src : plain;
  if (!(await exists(input))) {
    console.warn(`skip ${name} — not found`);
    continue;
  }
  // keep an untouched copy the first time so re-runs start from the original
  if (input === plain && !(await exists(src))) await rename(plain, src);

  const buf = await readFile((await exists(src)) ? src : plain);
  const out = await sharp(buf)
    .rotate()
    .resize({ width: cfg.width, withoutEnlargement: true })
    .jpeg({ quality: 80, progressive: true, mozjpeg: true })
    .toBuffer();

  const outName = cfg.out ?? name;
  await writeFile(join(DIR, outName), out);
  const { width, height } = await sharp(out).metadata();
  console.log(`${outName.padEnd(28)} ${width}x${height}  ${(out.length / 1024).toFixed(0)} KB`);
}
