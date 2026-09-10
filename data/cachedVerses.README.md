# cachedVerses.json — sourcing

`/verses` and the translation-profile pages compare a **fixed** set of sample
verses (`data/verses.json`). Rather than call a live Bible API on every request,
the text for each translation is stored in `cachedVerses.json`:

```jsonc
{
  "<translation id>": {
    "attribution": "<publisher's required copyright notice>",
    "verses": { "John 3:16": "…", "Psalm 23:1": "…", … }
  }
}
```

`lib/verseProviders.ts` does a plain lookup by `translation.id` + verse
reference. No API keys, no rate limits.

## Fidelity — the text is reproduced exactly

The **words and punctuation** of each verse are exactly what the source
returns — every quotation mark, dash, and semicolon. Nothing is added,
substituted, or removed from the sentence. (John 3:16 in the ESV/NLT/NASB/LSB
keeps its opening `"`; the KJV/NIV/NKJV/CSB/NET have none — that matches how
each edition prints it.)

The only changes are things that are not the verse:
- verse/chapter numbers, section headings, and Psalm superscriptions are dropped
- the small-caps divine name is written `LORD` (the standard plain-text form).
  api.bible (NIV/NKJV/CSB) and labs.bible.org (NET) return it in normal case
  ("the Lord"); `scripts/fetch-sample-verses.mjs` restores `LORD` for the OT
  verses in the set that contain YHWH (see its `YHWH_VERSES` list).
- Psalm 119 / Lamentations acrostic letters that a source glues to the first
  verse of a stanza ("Nun …", "נ (Nun) …") are dropped
- line breaks are flattened so the verse fits one line in a card — universal
  practice for quoting a verse inline, and not a change to the text
- em-dashes are set tight (`word—word`); a space beside one is a poetry
  line-break the flattening turned to whitespace, not house style. CEB keeps
  the trailing "—" it prints on Genesis 1:1 (a deliberate subordinate-clause
  reading, like NRSVue's trailing comma there).

Do **not** hand-edit verse text (e.g. adding brackets a source didn't return).
The KJV capitalises the first word of many verses ("…faith, Meekness,
temperance"); that is how the KJV prints, so it is kept.

## Where the text came from

- **KJV** — bible-api.com (public domain). `scripts/fetch-sample-verses.mjs`.
- **ESV** — api.esv.org (Crossway's own API). `scripts/fetch-sample-verses.mjs`.
- **NIV, NKJV, CSB** — api.scripture.api.bible, HTML mode so footnote / cross-
  reference markers can be stripped cleanly (text mode welds the words on either
  side of a dropped marker). `scripts/fetch-sample-verses.mjs`.
- **NET** — labs.bible.org (no key). `scripts/fetch-sample-verses.mjs`.
- **NLT, NASB, NRSVue, CEB, AMP** — sourced by hand from Bible Gateway passage
  pages in a browser session (no API preserves their small-caps and quotation
  marks), then pasted in. The `nrsvue` entry is the NRSV Updated Edition (2021)
  text with that edition's copyright notice — the site labels the translation
  "NRSVue" throughout (renamed from "nrsv" 2026-09-08; `/translations/nrsv`
  redirects). The AMP verses keep every bracket the Amplified Bible prints.
- **LSB** — not on Bible Gateway; sourced by hand from `read.lsbible.org`
  (one reference per page load). Uses "Yahweh" for the divine name, so the
  `LORD` restoration above does not apply to it.
- NASB is the 2020 edition. (EHV was added 2026-09-06, then removed 2026-09-07.)

The set is **42 references** as of 2026-09-10 (was 5). They were chosen as the
"greatest hits" — the verses people actually look up — drawn from the 61
"Popular Standalone Verse" rows in `data/verseComparisonList.json` plus a few
canonical openers (Genesis 1:1, John 1:1). `data/verses.json` lists them in
Bible order; `scripts/fetch-sample-verses.mjs` `REFS` must stay in sync.
`components/VersePicker.tsx` groups them (Old Testament / Gospels / Acts & the
Letters) via `referenceSection()` in `lib/bibleOrder.ts`.

## Why this is allowed

Every translation here permits quoting far more than a handful of verses
without written permission, on a **non-commercial** site, with the copyright
notice shown and the quotation not amounting to a whole book / large fraction
of the work:

| Translation | Free quotation ceiling (verified 2026-09-09) |
| --- | --- |
| ESV, NIV, NLT, NRSVue, CEB | 500 verses |
| CSB, NKJV, NASB, LSB, AMP | 1,000 verses (the three Lockman titles — NASB/LSB/AMP — are all 1,000) |
| KJV | public domain |
| NET | no verse limit for non-commercial use; permission notice required |

42 verses per translation is well inside all of these (500 is the lowest
ceiling). Each notice is in its `attribution` string and renders in the
fine-print block at the foot of `/verses` and under the verse on a
translation-profile page.

## Adding a sample verse

1. Add the reference to `data/verses.json` (keep Bible order) **and** to the
   `REFS` array in `scripts/fetch-sample-verses.mjs`.
2. Run `node scripts/fetch-sample-verses.mjs` to fill KJV/ESV/NIV/NKJV/CSB/NET.
3. Hand-source NLT/NASB/NRSVue/CEB/AMP from Bible Gateway and LSB from
   read.lsbible.org, exactly as published (only dropping the furniture listed
   above).
4. If the reference contains YHWH and isn't LSB, add it to `YHWH_VERSES` in the
   fetch script first (and check no ordinary "Lord" in that verse would be
   wrongly upcased).

Only add the reference to `data/verses.json` once **all 12** translations have
text — a translation with no entry for a verse renders "Text unavailable".
