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

## Why this is allowed

Every translation here permits quoting far more than a handful of verses without
written permission, on a **non-commercial** site, provided the copyright notice
appears with the text and the quotation isn't a whole book / large fraction of
the work:

| Translation | Free quotation ceiling |
| --- | --- |
| ESV, NIV, NLT, CSB, NASB | ~500 verses |
| NKJV, LSB | ~1,000 verses |
| KJV | public domain |
| NET | generous; permission notice required |

Five verses per translation is trivially inside all of these. The notice for
each is in its `attribution` string and renders under the verse in
`components/VerseCard.tsx`.

## Where the text came from (2026-08)

- **KJV** — bible-api.com (public domain)
- **NET** — labs.bible.org NET Bible web service
- **ESV** — api.esv.org (Crossway's official API)
- **LSB** — carried over from the earlier hand-sourced set (read.lsbible.org)
- **NIV, NLT, CSB, NASB (2020), NKJV** — Bible Gateway passage pages

Superscriptions ("A psalm of David."), section headings, footnote/cross-ref
markers and verse numbers were stripped; internal whitespace collapsed; the
divine name written `LORD` where the source small-caps it. NASB is the 2020
edition (matches `latestRevisionYear` in `translations.json`).

## Adding a sample verse

1. Add the reference to `data/verses.json`.
2. Add its text for **every** translation id in `cachedVerses.json`, from an
   authoritative source, normalized as above.

A translation with no entry for a given verse renders as "Text unavailable" —
it does not error.
