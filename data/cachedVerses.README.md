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
- the small-caps divine name is written `LORD` (the standard plain-text form)
- line breaks are flattened so the verse fits one line in a card — universal
  practice for quoting a verse inline, and not a change to the text

Do **not** hand-edit verse text (e.g. adding brackets a source didn't return).

## Where the text came from (2026-08)

- **KJV** — bible-api.com (public domain). `scripts/fetch-sample-verses.mjs`.
- **ESV** — api.esv.org (Crossway's own API). `scripts/fetch-sample-verses.mjs`.
- **NIV, NLT, CSB, NASB, NKJV, NET, LSB** — sourced by hand from Bible Gateway
  passage pages in a browser session (no API preserves their small-caps and
  quotation marks), then pasted in. Same approach the LSB always used.

## Why this is allowed

Every translation here permits quoting far more than a handful of verses
without written permission, on a **non-commercial** site, with the copyright
notice shown and the quotation not amounting to a whole book / large fraction
of the work:

| Translation | Free quotation ceiling |
| --- | --- |
| ESV, NIV, NLT, CSB, NASB | ~500 verses |
| NKJV, LSB | ~1,000 verses |
| KJV | public domain |
| NET | generous; permission notice required |

Five verses per translation is trivially inside all of these. Each notice is in
its `attribution` string and renders under the verse in
`components/VerseCard.tsx` (no added quote glyphs — the verse keeps its own).

## Adding a sample verse

1. Add the reference to `data/verses.json`.
2. Add its text for **every** translation id in `cachedVerses.json`, from an
   authoritative source, exactly as published (only dropping the furniture
   listed above).

A translation with no entry for a given verse renders as "Text unavailable" —
it does not error.
