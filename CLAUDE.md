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

This is a Next.js 14 App Router site comparing English Bible translations, deployed on
Vercel's free tier. Most of the site (comparison table, verse pages) runs on static JSON with
no database, but the Church Finder (`/church-finder`) is backed by a real Postgres database —
see that section below before assuming "no database" applies everywhere.

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

**Placeholder pages** (`/rankings`, `/blog`, `/buy`, `/translations/[slug]`) all render the
shared `components/ComingSoon.tsx` — real content/logic is intentionally not built yet.
`/church-finder` is NOT a placeholder — it's a real, working feature (below).

**Church Finder** (`/church-finder`): search ~361,000 U.S. churches by city+state or zip,
showing each one's confirmed Bible translation where known. Backed by a Supabase Postgres
project (`churches` table, ~361K rows, RLS enabled with a public SELECT-only policy — the
`NEXT_PUBLIC_SUPABASE_ANON_KEY` exposed to the browser cannot write). `lib/supabase.ts` creates
the client (returns `null` if env vars are unset, so the page shows a setup notice instead of
crashing); `lib/churches.ts` has the search function and `humanizeCategory()` for turning
category slugs like `baptist_church` into display labels. `app/church-finder/page.tsx` follows
the same searchParams-driven Server Component pattern as `/verses`.

Only ~8% of churches have a confirmed `bible_translation` so far — this is inherently a
long-tail research problem (see "Church data pipeline" below), not a bug. Most results
correctly show "Not yet confirmed."

**Church data pipeline** (`scripts/`, all one-off Node scripts, safe to re-run): the source
data (`churches-combined.csv`, ~110MB, gitignored — exceeds GitHub's 100MB limit and is fully
regenerable) was cleaned (deduped, bad zips/addresses fixed via `cleanup-churches-data*.js` and
`backfill-*-from-zip.js`) then loaded into Supabase via `load-churches-to-supabase.mjs`
(PostgREST bulk insert, batched). Translations are filled two ways:
- **Bulk denominational defaults** (`fill-denominational-translations.js`): for denominations
  with one confirmed, citable official translation - Catholic (NABRE), LDS (KJV), Christian
  Science (KJV), Episcopal (NRSV). Covers ~28,340 rows with zero per-church research needed.
- **Per-church research** (`add-translation-column.js`, `KNOWN_TRANSLATIONS` map): for
  denominations split across sub-bodies with different standards - e.g. Lutheran (LCMS→ESV,
  ELCA→NRSV, but WELS/LCMC/NALC/ELS have no official stance) and Presbyterian (PC(USA)→NRSV,
  but PCA/OPC/ECO/Cumberland don't). ~160 churches done this way as of this writing, via real
  web search per church (never guessed) - about 80-90% hit rate once the specific synod is
  confirmed via an official source (locator.lcms.org, pcusa.org, etc.). This is genuinely slow
  (one church at a time) and the ~361K total dwarfs what's been researched - continuing this is
  an open-ended task, not something to "finish."
- A bulk cross-reference via each denomination's official congregation locator was considered
  but ruled out: LCMS's locator actively rate-limits automated access, ELCA/PCUSA have no bulk
  export, and third-party aggregators like faithstreet.com block automated fetches (403) despite
  a permissive robots.txt. Don't re-attempt this without a different approach (e.g. the
  denomination granting explicit data access) - it's not a matter of trying harder.
- `reference-us-zips.csv`: a free public-domain zip/city/state dataset (SimpleMaps), used for
  the address backfill and reusable for future geocoding needs.

**Bible verse comparison dataset** (`data/verseComparisonList.json`, `data/verseComparisons.json`,
`scripts/fetchVerseComparisons.mjs` / `retryFailedVerses.mjs`): 502 verses with fetched KJV/NET
text (other translations need API keys, see below). Nothing in the app reads this yet - it's
data prepared for a future page, not a current feature.

## Environment variables

`ESV_API_KEY` and `API_BIBLE_KEY` are both optional — see `.env.example` for what they unlock and
where to obtain them. The site builds and runs with neither set.

`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are required for the Church
Finder to actually query data (without them it shows a "not configured" notice instead of
crashing). Both are safe to expose to the browser — the anon key is read-only via RLS.
Vercel env var changes require a manual redeploy to take effect (Deployments tab → ⋯ →
Redeploy) - saving them in the dashboard alone does not rebuild the site.
