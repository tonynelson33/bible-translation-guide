# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install     # install dependencies
npm run dev     # start dev server (localhost:3000)
npm run build   # production build
npm run start   # run the production build locally
npm run lint    # next lint
```

There is no test suite in this project yet.

## Architecture

This is a Next.js 14 App Router site comparing English Bible translations. There is no
database — all data is static JSON, and the deploy target is Vercel's free tier.

**Data layer**: `data/translations.json` (9 translations, all comparison-table fields) and
`data/verses.json` (5 sample verse references) are the single source of truth, typed by
`lib/types.ts` and loaded through `lib/data.ts` (`translations`, `sampleVerses`,
`getTranslation()`, `getSampleVerse()`). Every page/component that needs translation data reads
through `lib/data.ts` rather than importing the JSON directly. Adding a 10th translation is a
matter of adding one entry to `data/translations.json` — the nav dropdown (`components/Nav.tsx`),
the comparison table, and the `/translations/[slug]` static params all derive from that array
automatically.

Each translation's `verifyFields` array (e.g. `["quoteLimit"]`) flags which values were not
fully confirmed against publisher documentation; `ComparisonTable` renders those with a `†`
marker.

**Live verse fetching** (`/verses` page): Scripture text is never hardcoded. Each translation's
`verseApi` config in `data/translations.json` names a `provider`, and
`lib/verseProviders.ts` has one adapter function per provider:

- `bible-api` → bible-api.com (KJV; public domain, no key)
- `esv-api` → api.esv.org (needs `ESV_API_KEY` env var)
- `net-bible` → labs.bible.org (no key needed)
- `api-bible` → scripture.api.bible (needs `API_BIBLE_KEY` env var + a per-translation
  `apiBibleId`; the free Starter plan only allows 3 copyrighted translations active at once —
  currently configured for NIV, CSB, NASB)
- `unavailable` → no known free API (currently just LSB)

Every adapter returns a `VerseFetchResult` with `status: "ok" | "unavailable" | "error"` instead
of throwing, so a missing key or a down API degrades to a "Text unavailable" card
(`components/VerseCard.tsx`) rather than breaking the page. `app/verses/page.tsx` is a Server
Component that reads the selected verse from `searchParams`, fetches all 9 translations in
parallel via `Promise.all`, and renders one `VerseCard` per translation; `components/VersePicker.tsx`
is the client-side `<select>` that updates the URL query param.

**Comparison table** (`app/page.tsx` → `components/ComparisonTable.tsx`): a client component
driven by a `columns` array, where each column defines its own `sortValue()` extractor and
`render()` function. Sorting state (`sortKey`/`sortDir`) lives in the component and re-sorts via
the generic `compareValues()` comparator in `lib/sort.ts`, which handles string/number/boolean
columns uniformly. `gradeLevelSortValue()` and `quoteLimitSortValue()` in the same file parse
free-text fields (e.g. `"7-8"`, `"Unlimited"`, `"~1,000 verses (verify)"`) into sortable numbers.
The first column is sticky (`position: sticky; left: 0`) for horizontal scroll on mobile — its
background must stay fully opaque (not the alternating-row-stripe color) or scrolled content
shows through.

**Styling**: Tailwind, with a custom `brand` (deep blue) color scale in `tailwind.config.ts` as
the one accent color. `app/layout.tsx` loads two fonts via `next/font/google`: Inter for UI
(`font-sans`, the default) and Lora for quoted Scripture text specifically (`font-serif`, applied
deliberately on verse text, not site copy).

**Placeholder pages** (`/rankings`, `/blog`, `/church-finder`, `/buy`, `/translations/[slug]`)
all render the shared `components/ComingSoon.tsx` — real content/logic is intentionally not built
yet.

## Environment variables

`ESV_API_KEY` and `API_BIBLE_KEY` are both optional — see `.env.example` for what they unlock and
where to obtain them. The site builds and runs with neither set.
