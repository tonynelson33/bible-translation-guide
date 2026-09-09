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

No unit-test suite. CI (`.github/workflows/ci.yml`) runs `tsc --noEmit`, `npm run lint`, and
`npm run build` on every PR and every push to `main`. `.eslintrc.json` is just
`next/core-web-vitals` — it must stay committed or `next lint` drops into an interactive
"how would you like to configure ESLint?" prompt (which hangs CI).

## Architecture

This is a Next.js 14 App Router site comparing English Bible translations, deployed on
Vercel's free tier. Most of the site (comparison table, verse pages) runs on static JSON with
no database, but the Church Finder (`/church-finder`) is backed by a real Postgres database —
see that section below before assuming "no database" applies everywhere.

**Data layer**: `data/translations.json` (12 translations, all comparison-table fields) and
`data/verses.json` (5 sample verse references) are the single source of truth, typed by
`lib/types.ts` and loaded through `lib/data.ts` (`translations`, `sampleVerses`,
`getTranslation()`, `getSampleVerse()`). Every page/component that needs translation data reads
through `lib/data.ts` rather than importing the JSON directly. Adding a translation is a
matter of adding one entry to `data/translations.json` — the nav dropdown (`components/Nav.tsx`),
the comparison table, and the `/translations/[slug]` static params all derive from that array
automatically. The other four files that must be kept in step per translation (none auto-derived):
`data/cachedVerses.json` (sample-verse text + attribution), `lib/buyLinks.ts` (buy / read-free
links), `lib/translationProfiles.ts` (the full profile page — without an entry the route falls
back to `ComingSoon`), and `lib/rankings.ts` (a placement in all 7 ranking categories).

**Site structure (rebuilt 2026-09-07 "site-overhaul" branch)**: `/` is a **landing page**
(`app/page.tsx`) — hero, four entry cards, the `TranslationSpectrum`, a "the twelve" grid; the
sortable comparison table moved to **`/compare`** (`app/compare/page.tsx`). The nav
(`components/Nav.tsx`) is `At a Glance · Church Finder · Translations ▾ · Verses · Rankings ·
Learn ▾ · Where to Buy`; the logo links to `/`; a reusable `NavDropdown` powers both the
Translations menu (all 12 profiles) and the **Learn** menu (`/history`, `/differences`, `/faq`,
`/blog`). `/compare` was labelled "Compare" until 2026-09-09 — renamed "At a Glance" (nav, h1
"Every translation at a glance", metadata title, footer) because "Verses" is where people
picture a comparison; the route stayed `/compare`. `/verses` is still "Verses" in the nav (the
longer "Popular Verses" pushed the bar into the logo near 1024px) but its h1/title are
"Comparison of Popular Verses" and the footer says "Popular verses side by side".
Footer (`components/SiteFooter.tsx`) is a four-column layout led by a `SpectrumStrip`. When you
add a route to the nav/footer, add it to `app/sitemap.ts` too. `next.config.mjs` has the
redirects: `/translations/nrsv` → `/translations/nrsvue`, `/choose` → `/rankings`.

The current 12: CSB, ESV, KJV, NIV, NLT, LSB, NKJV, NASB, NET (the original 9), plus NRSVue, CEB,
AMP (added 2026-09-06 — NRSVue as `nrsv`, renamed 2026-09-08 since the verse text is the 2021
Updated Edition; `/translations/nrsv` redirects). EHV was added the same day and cut 2026-09-07
(see "The editorial line").
This set is identical to `translationOptions` in `lib/suggestionOptions.ts` — every translation a
church-finder submitter can pick has a profile.

**2026-09-07: NET moved right of CSB in the "Most Literal" ranking** (and the balance category
recomputed). The NET's literal renderings live in its footnotes, so its main text reads freer
than its "Mixed" label — which is where published translation-spectrum charts place it. Its #1
for "Serious Study" is unchanged (that's the 60,000 notes, not the main text).

Each translation's `verifyFields` array (e.g. `["quoteLimit"]`) flags which values were not
fully confirmed against publisher documentation; `ComparisonTable` renders those with a `†`
marker.

**Sample verses** (`/verses` page, and the sample-verse block on translation-profile pages):
`/verses` compares a **fixed** set of 5 sample verses (`data/verses.json`), so their text is
**cached, not fetched live**. `data/cachedVerses.json` holds `{ [translationId]: { attribution,
verses: { [reference]: text } } }` for all 12 translations, and `lib/verseProviders.ts`'s
`fetchVerseForTranslation` is a plain synchronous lookup — no API keys, no rate limits, no
network. A translation with no entry for a verse returns `status: "unavailable"`, never throws.

`/verses` layout (rewritten 2026-09-07): a single-column list, one row per translation, `max-w-6xl`,
ordered **most literal → freest** — the order is derived at module load from the `literal` category
in `lib/rankings.ts` (`rankingCategories.find(c => c.slug === "literal")`), so it self-syncs. Each
row is a `[abbr | verse text]` grid (stacks on mobile); attributions are collected into one
fine-print block at the foot of the page (still on-page = licence notice satisfied). `VerseCard.tsx`
is **no longer used here** — it survives only as the single-verse card on `/translations/[slug]`.

- **Fidelity**: verse **words and punctuation are exact** — every quotation mark and dash as
  the source publishes it (John 3:16 keeps its opening `"` in ESV/NLT/NASB/LSB, has none in
  KJV/NIV/NKJV/CSB/NET). Only non-verse furniture is removed: verse/chapter numbers, headings,
  Psalm superscriptions; the small-caps divine name is written `LORD`; line breaks flattened to
  one line. **Never hand-edit the text** (an earlier bug hand-added `[[ ]]` to Luke 22:43-44 —
  removed). `components/VerseCard.tsx` adds no quote glyphs of its own. See
  `data/cachedVerses.README.md`: KJV→bible-api, ESV→api.esv.org (`scripts/fetch-sample-verses.mjs`),
  NIV/NLT/CSB/NASB/NKJV/NET/LSB→Bible Gateway by hand (no API keeps their small-caps + quotes).
  NASB is the 2020 edition (matches `latestRevisionYear`).
- **Why it's legal**: 5 verses per translation is far inside every publisher's
  quote-without-permission ceiling (~500 for ESV/NIV/NLT/CSB/NASB, ~1,000 for NKJV/LSB, KJV
  public domain, NET generous) on a **non-commercial** site, with the required notice shown
  under each verse.
- **Non-commercial still matters**: several of those permissions (ESV especially) are
  *non-commercial only*. Owner confirmed 2026-08-29 the site stays non-commercial and `/buy`
  stays a placeholder. If that changes — affiliate links, ads, sponsorship, donations anywhere
  — the licensed translations (everything except KJV) need re-clearing or removing from
  `cachedVerses.json`. See [[project_bible_guide_noncommercial]].
- **No verse-API keys are used by the app anymore.** `ESV_API_KEY` / `API_BIBLE_KEY` were
  removed from `.env.example`; the only remaining consumers are the one-off
  `scripts/fetchVerseComparisons.mjs` (for the separate, not-yet-used
  `data/verseComparisons.json` dataset).
- **Adding a sample verse**: add the ref to `data/verses.json` and its text for every
  translation to `cachedVerses.json`, from an authoritative source. If `/verses` ever needs to
  cover arbitrary user-chosen verses (not a curated list), the caching approach breaks down and
  a live-API layer would need rebuilding.

**Comparison table** (`app/compare/page.tsx` → `components/ComparisonTable.tsx`): a client
component driven by a `columns` array, where each column defines its own `sortValue()` extractor
and `render()` function. Sorting state (`sortKey`/`sortDir`) lives in the component and re-sorts
via the generic `compareValues()` comparator in `lib/sort.ts`, which handles string/number/boolean
columns uniformly. `gradeLevelSortValue()` and `quoteLimitSortValue()` in the same file parse
free-text fields (e.g. `"7-8"`, `"Unlimited"`, `"~1,000 verses (verify)"`) into sortable numbers.
The first column is sticky (`position: sticky; left: 0`) for horizontal scroll on mobile — its
background must stay fully opaque (not the alternating-row-stripe color) or scrolled content
shows through. `Translation.genderApproachLabel` (a display override for the gender pill) is
defined but unused as of 2026-09-09 — NIV/NASB dropped their "Moderate (2011)"/"(2020)" labels;
the pill is now just the bare bucket name everywhere, with the year context left to the profile
prose. The field stays as an escape hatch.

**Styling**: Tailwind. `tailwind.config.ts` defines: `brand` (deep navy) as the structural
colour; `gild` (a deep old-gold, 50→900) as the one warm accent, rationed to eyebrows, one CTA,
callout left-rules, active states; and flat `paper` (#fcfbf8 page ground) + `ink` (#20242c body
text) neutrals. Three fonts via `next/font/google` in `app/layout.tsx`: **Inter** for UI
(`font-sans`, default), **Newsreader** for all headings (`font-display` — `adjustFontFallback:
false`, next/font has no metric data for it), and **Lora** for quoted Scripture only
(`font-serif`). Sweep any new heading to `font-display`; keep `font-serif` for verse text.
Philosophy pills (`lib/glossary.ts`) — **three** zones, not four: indigo (Formal), teal (Optimal
*and* Mixed — they share the mediating middle), amber (Dynamic). Used consistently on `/`, the
profiles, `ComparisonTable`, `/buy` monograms, and both spectrum components.
`components/TranslationSpectrum.tsx` (the full SVG, `/rankings` "Most Literal" tab + `/` — pass
`standalone` when it's not under a ranked list); `components/SpectrumStrip.tsx` (the slim
label-free three-band motif; footer + landing; caller sets the height class).

**`app/globals.css`**: the `@layer base` block sets `text-wrap: balance` on `h1/h2/h3` (font is
**not** set there — some h2s are small uppercase eyebrow labels that must stay sans) and a
`prefers-reduced-motion` guard on smooth scroll. **`overflow-x` gotcha**: it is set on `<html>`
**only**, deliberately. Setting it on `<body>` too (as it was until 2026-09-07) makes `<body>` a
scroll container, which silently kills `position: sticky` on the nav. Don't re-add it to `body`.
The comparison table's own `overflow-x-auto` wrapper handles its horizontal scroll.

**Learn pages** (all static server components, content in a `lib/*` file, added 2026-09-07):
- **`/faq`** — 13 Q&As in 3 groups, content + `FAQPage` JSON-LD inline in `app/faq/page.tsx`
  (rich answer + a self-contained `plain` string for the structured data). The "why no
  translation uses the Majority Text" answer is the one `components/TextTraditions.tsx`
  deep-links to (`/faq#majority-text`). The 3 group `<h2>`s carry a `border-t-2 border-gild-300`
  rule + bump to `sm:text-3xl` (2026-09-09) so the sections read as sections. `#kjv-1611-vs-today`
  (added 2026-09-09) quotes the 1611 John 3:16 in original spelling — KJV is public domain, so no
  quote-limit concern; it's the one hard-coded scripture quote outside the cached datasets. The
  "which translation should I use" answer mirrors the top 3 of the matching `rankings` category
  (study→NET/NASB/NRSVue, devotions→NLT/CEB/CSB, preaching→CSB/ESV/NIV) — keep it in step if the
  rankings move.
- **`/history`** ("How We Got the English Bible") — `lib/englishBibleHistory.ts`: a `timeline`
  array (Wycliffe → modern, `major` flags the load-bearing entries) rendered as a vertical
  timeline, a Tyndale narrative, and a "where the text comes from" section: the `textPrimer`
  ("Nobody has the originals" — textual criticism in general) followed by
  `components/TextTraditions.tsx`, the two data-driven diagrams (NT text-forms bucketed by
  `textualBasis`; OT Masoretic base + Septuagint + Dead Sea Scrolls). The NT/OT prose that used
  to sit here was cut 2026-09-08 as redundant with the diagrams. Each timeline `year` string
  carries a place (`"1516 · Basel"`) as of 2026-09-09 (Coverdale is "Antwerp" — disputed, but the
  current scholarly consensus).
  **Images** (added 2026-09-09, the only images on the site): 19 public-domain manuscript /
  title-page / text-page / portrait scans — one per timeline entry through 1611 (`images:
  HistoryImage[]` on each entry — KJV and Geneva carry two, a title image + a page of text,
  rendered as a 2-up row), one on each `TextTraditions` card, plus a Tyndale portrait
  (`tyndalePortrait`, a hand-coloured engraving after the Hertford College painting) in the
  "through-line: Tyndale" narrative, which is a text-left / portrait-right grid. Data
  (src/dims/alt/caption/credit + provenance) is in `historyImages` in
  `lib/englishBibleHistory.ts`; `components/HistoryImage.tsx` wraps `next/image` with a shared
  sepia filter (`sepia(.24) saturate(.86) contrast(1.03)`).
  Files in `public/history/`; raw downloads (from Wikimedia Commons + the Internet Archive)
  are shrunk by `scripts/optimize-history-images.mjs` (one-off; needs `npm i -D sharp` — sharp
  is a devDep, also what `next/image` wants) and kept as `public/history/*.src.*` (gitignored).
  No text-page scan exists for the Coverdale or Great Bible, so those keep their title pages.

There is **no `/choose` page** — it was built then removed 2026-09-08. Its six purpose scenarios
duplicated `/rankings` categories and the picks kept drifting from the ranked lists they linked
to. `RankingsPage.tsx` now opens with a "Not sure where to start?" guide: `startGuide` routes to
five categories, and each row's top pick is read from that category's own `entries[0]` so it can
never contradict the list. The KJV-bridge and formal+readable advice moved there too.
`/choose` → `/rankings` redirect.

**No placeholder pages remain.** `/rankings` (`lib/rankings.ts` + `components/RankingsPage.tsx`),
`/buy` (`lib/buyLinks.ts`), `/faq`, `/history`, and every `/translations/[slug]`
(`lib/translationProfiles.ts`) are all real. `components/ComingSoon.tsx` still exists only as the
per-route fallback in `app/translations/[slug]/page.tsx` for a translation with no
`translationProfiles` entry — with all 12 profiled, it currently never renders.

`/rankings`: 7 categories in `rankingCategories` — order is the tab order. As of 2026-09-07:
popular, literal, memorization, devotions, preaching, study, balance (Serious Study and
Memorization were swapped so the row runs roughly basic → serious; `balance` renders as a
featured tab below the row, `defaultRankingSlug`). `lib/rankings.ts` header comment documents
the per-category ranking logic (original 9 keep relative order in the 6 descriptive categories;
balance is computed). The Most Literal tab also renders `TranslationSpectrum`.

**`/blog`** (nav + footer label "Videos", grouped under the Learn menu) is a curated library of
~12 embedded YouTube videos on where the English Bible came from, how translations are made,
Textus Receptus vs. Critical Text, whether the transmitted text is reliable (Wes Huff, "Is the
Bible We Have What the Original Authors Even Wrote?", added 2026-09-09), gender language, and
choosing a Bible — two tiers ("Start here" / "Go deeper"). Static server component, video list inlined in `app/blog/page.tsx`. Embeds
use `youtube-nocookie.com` (no cookies until play) and `loading="lazy"`. The route stayed
`/blog` to avoid churning nav/footer/sitemap. Videos are picked to be instructive and
non-polemical and to represent both the Critical Text and Majority/Byzantine (KJV-underlying)
text positions; re-check embeds periodically since uploads get pulled or have embedding
disabled. The Septuagint / OT-text slot is deliberately left empty — the neutral options were
thin and `/history` covers that material in prose.

**Where Translations Differ** (`/differences`, nav + footer label "Where Translations Differ" —
renamed from "Why" 2026-09-08; the page is a catalogue of specific verses, the *why* is in the
intro): the verses where translations most visibly disagree — a curated set (~52 references, 9
sections) drawn from the
~84 rows tagged "Translation Difference" in `data/verseComparisonList.json`. **No total is stated
on the page or in the page metadata** (both said "84" / "roughly 85"; removed 2026-09-07 —
"most visible" has no standard threshold, and the page is a subset of the list anyway). The page
intro says which sections are complete: Part 1's "Two well-known passages" and "Whole verses" are
closed lists (all of each is on the page); every other section is a representative sample.
(Leviticus 6:25 was dropped 2026-08 from the JSON and the source xlsx — reads the same in KJV and
ESV. A "John 8:58" section — a non-difference, "I am" is identical in every version — was cut
2026-09-07.) Grouped into **Part 1 — Manuscript Differences**
(Textus Receptus / Byzantine vs. Critical Text; Masoretic OT vs. Septuagint / Dead Sea Scrolls)
and **Part 2 — English Word Differences** (undisputed text, different English). Content
structure + every verse's one-line note (and which translations each card shows) live in
`lib/translationDifferences.ts`; sections are numbered in the page component, not the data.
Most verses are only *described*; the ~35 comparison cards *quote* KJV + ESV (plus NKJV/NIV/NET
only where that translation is what creates the difference), except "Whole verses" cards which
show KJV alone (modern texts drop the verse). Quoted text is cached in
`data/differenceVerses.json`, `scripts/fetch-difference-verses.mjs` (KJV→bible-api,
NET→labs.bible.org, ESV→api.esv.org, NIV/NKJV→api.bible; merges, doesn't overwrite) — same
fidelity rules as `cachedVerses.json` (words + punctuation exact via `scripts/verse-clean.mjs`,
no hand-editing). Layout is `max-w-6xl`, two-column (`sm:columns-2`) verse lists.
Attributions reuse `cachedVerses.json`. Tone is
deliberately neutral — "present in the Byzantine manuscripts, absent from the earliest," never
"added" / "removed." Same non-commercial-quotation basis as `/verses`.

**Church Finder** (`/church-finder`): search ~348,000 U.S. **Protestant** churches by church name,
denomination, city+state, or zip, showing each one's confirmed Bible translation where known. Backed by a Supabase Postgres
project (`churches` table, ~348,000 rows — US only; non-congregations removed 2026-08-30; and
**Catholic, Orthodox, and Oneness/Apostolic congregations removed 2026-09-06** (~29,700 — the
directory is now Trinitarian Protestant only, see "Denomination taxonomy" and the editorial-line
section below) — with 31 distinct `category` values: `church_cathedral` plus all 30 dropdown
categories, every one with rows; RLS enabled with a public SELECT-only
policy, so the `NEXT_PUBLIC_SUPABASE_ANON_KEY` exposed to the browser cannot write).
`lib/supabase.ts` creates the client (returns `null` if env vars are unset, so the page shows a
setup notice instead of crashing); `lib/churches.ts` has `searchChurches()`,
`validateSearchParams()`, and `humanizeCategory()` for turning category slugs like
`baptist_church` into display labels.

**Search model** (`lib/churches.ts` + `components/ChurchSearch.tsx`, a client component):
- Fields: church name (`ILIKE '%term%'`, min 3 chars), denomination (dropdown built from the
  live `getDenominationCounts()` — real `category` buckets only, A–Z; `category =` exact
  filter), city (starts-with, min 3), state (dropdown, `lib/usStates.ts`, exact, optional), zip
  (exactly 5 digits, prefix match so ZIP+4 rows are caught). Location comes from zip if given,
  else city+state, else state alone can scope a name/denomination search; name and denomination
  are extra filters on any of those and a search is valid with just one of name/denomination/
  city/zip. Zip disables the city/state inputs. `validateSearchParams()` is the single source
  of truth for "is this searchable?", shared by the client (inline errors) and the server
  (shared-link guard). `CountRow` carries a `value` (slug / translation code) so the dropdown
  and the breakdown table share one query.
- `searchChurches()` returns `{ churches, total }` — capped at `RESULTS_LIMIT` (300) rows plus
  the true `count`. `ChurchSearch` paginates those in memory, `PAGE_SIZE` (50) per page → max
  6 pages, ‹ › arrows, zero network per page turn. The query string
  (`?name=&denomination=&city=&state=&zip=&page=`) is kept in sync with `history.replaceState`
  (no Next navigation, so no RSC refetch / scroll jump), and `page.tsx` still does the first
  search server-side from `searchParams` so shared links and no-JS render correctly.
- When `total > 300` the results line says "first 300 shown — {add a church name / narrow it
  further}". 300 covers every 5-digit zip in full (densest is ~256 in 75216, Dallas); large
  cities (~2,700 in Houston TX) and broad denomination-only searches (70k Baptist) overflow.

Search performance depends on these indexes (all 2026-08):
`church_finder_search_indexes` (`pg_trgm` extension + `idx_churches_locality_trgm` GIN on
`locality`, `idx_churches_zip` on `zip`), `church_finder_name_trgm_index`
(`idx_churches_name_trgm` GIN on `name`, for the leading-wildcard name search), and
`church_finder_category_region_indexes` (`idx_churches_category`, `idx_churches_region`,
`idx_churches_region_category` — for the denomination filter and state-only scopes). Without the
matching index a cold-cache query seq-scans ~352k rows and hits the statement timeout (this bit
us on Waco TX, then again on "Orthodox churches in CA").

**Caching — two pieces, both required**: `app/church-finder/page.tsx` sets
`export const dynamic = "force-dynamic"`, *and* `lib/supabase.ts` wraps the client's `fetch` to
force `cache: "no-store"`. The Supabase client is created at module scope, so its `fetch` runs
outside any request's caching context and `force-dynamic` alone doesn't reach it — without the
`no-store` wrapper, Next's Data Cache serves stale PostgREST responses (they persist across
deploys), so edits made straight against the DB can take up to an hour to surface. This cost
real debugging time once; don't drop either half.

Only ~2.8% of churches have a confirmed `bible_translation` (~9,850 rows as of 2026-09-06 —
7,911 Episcopal / ELCA / PC(USA) / UMC / UCC → NRSV, 1,904 PCA / OPC → ESV, the rest per-church
research). It was ~8.5% before 2026-09-06, but the Catholic → NABRE default (~22,300 rows) went
away with the Catholic bucket. Translation is inherently a long-tail research problem for the
Protestant free-church world where the pastor picks (see "Church data pipeline" below), not a bug.
Most results correctly show "Not identified" for the translation (same label the result card and
the breakdown tables use for an unknown denomination or translation).

**Crowdsourced corrections**: since the `churches` table is public-SELECT-only (the anon key
can't write to it), user submissions go into a separate `church_suggestions` table instead —
RLS allows anon `insert` only, no `select`/`update`/`delete`, so submitters can't read anyone
else's suggestions and there's no way to write directly into `churches` from the browser.
`suggestion_type` is `edit | new_church | closed` (the `closed` value was added 2026-08 —
widening that CHECK constraint is the only migration if you add another type).
`components/SuggestCorrectionForm.tsx` (inline on each `ChurchResultCard`) lets a visitor
correct name / address / denomination / translation / **website**, **or** tick "permanently
closed" to flag the row for removal (`submitClosedReport`). `components/AddChurchForm.tsx` (in
the middle column of `/church-finder`, open by default) is for a church not in the directory.
Both call helpers in `lib/churchSuggestions.ts`.

**`website`** (added 2026-08-30, nullable, on both `churches` and `church_suggestions`): an
optional church homepage. Stored as a full `https://…` URL. `lib/website.ts` `normalizeWebsite()`
does the "https:// assumed" bit — strips any scheme the submitter typed and prepends `https://`,
keeping `www.` only if they included it (forcing www breaks apex-only + `.church` domains); drops
anything with a space or no dot. `prettyWebsite()` is the display form (scheme stripped). Both
forms show a field with a static grey `https://` prefix. **NB the visible field in
`AddChurchForm` is the `homepage` state var, not `website`** — `website` is the honeypot input
name there and must stay a bot trap. The result card renders it as a `rel="nofollow noopener"`
external link when present. `churches.website` is null for ~all rows until the crowdsourced
forms populate it (no bulk import).
Dropdown options for both forms live in `lib/suggestionOptions.ts` — `denominationOptions` is a
fixed 30-entry US master taxonomy (NOT a mirror of `churches.category`; see "Denomination
taxonomy" below), and `translationOptions` is 12 entries: the set this site profiles
(`data/translations.json`), with **one deliberate mismatch** — the site profiles the 2021
**NRSVue** text (renamed from `nrsv` 2026-09-08 — see the NRSVue note below), but the form keeps
`value: "NRSV"` (label "NRSV / NRSVue"). That matches the ~7,900 stored `bible_translation =
'NRSV'` rows, and a mainline church that says it uses "the NRSV" usually means the 1989 lectionary
text. The list is scoped to translations a meaningful number of US Protestant congregations
actually use *from the pulpit / in worship*:
- `NRSV` / `NRSVue` — still the lectionary Bible family in most Episcopal / ELCA / PC(USA) / UMC /
  UCC / Disciples parishes. Church-finder data and the form use "NRSV"; the profiled translation
  (verses, comparison table, rankings) is the 2021 NRSVue, at `/translations/nrsvue`
  (`/translations/nrsv` → 308 redirect in `next.config.mjs`).
- `CEB` and `AMP` were also promoted to full profiles 2026-09-06. `CEB` is mainline (UMC
  especially); `AMP` is a legacy study/devotional Bible with real use in charismatic circles.
- `EHV` was added 2026-09-06 and **cut 2026-09-07**. WELS/ELS (its only real constituency, ~1,300
  congregations) have no official translation and use a mix of NIV / ESV / CSB — all already
  listed — and the EHV is absent from the translation-comparison genre. A stored
  `bible_translation = 'EHV'` value would still render as "EHV"; it's just no longer a form option
  or a profile.
- Deliberately excluded: editions genuinely out of print (HCSB→CSB, NAB→NABRE, JB→NJB, TLB→NLT),
  Catholic / Orthodox editions (out of scope — NABRE, OSB, Douay-Rheims, RSV-2CE), readability
  rather than pulpit editions (CEV, GNT), public-domain texts with near-zero church use (WEB),
  RSV (superseded by NRSV/ESV), Darby, and paraphrases (MSG, TPT, The Voice, NIrV, The Clear
  Word). ASV is out too — even Churches of Christ have moved to NKJV/ESV.

Every submission lands with `status = 'pending'`;
there's no admin UI for review yet, so review/merge into `churches` happens by hand via the
Supabase dashboard's Table Editor.

Church Finder sits at **nav position 2** and is one of the four landing-page entry cards
(`app/page.tsx` — that card was reworded 2026-09-09 to ask people to tell us the translation,
since coverage is thin); the footer has an "Add your church →" CTA (`components/SiteFooter.tsx`).
The `/compare` callout to the Church Finder was **removed 2026-09-09** (owner call — it read as
clutter above the table). All of this is deliberate — the feature drives the crowdsourced
submissions, and without prominent links it's buried and users don't know they can correct their
own church's entry. `components/ChurchSearch.tsx` gained a "Find a church" heading 2026-09-09,
matched to a bigger "Add a church" heading in `AddChurchForm`, with a `border-t` between the two
so the search and the submit form read as separate things.

**Spam/duplicate mitigation on `AddChurchForm`**: the insert-only RLS policy is the primary
defense — nothing a submitter sends ever reaches the public `churches` table without a human
reviewing it first, so the actual blast radius of spam is an annoying review queue, not corrupted
public data. On top of that: all 7 fields (name/address/city/state/zip/denomination/translation)
are required, since a half-filled "new church" row isn't actionable during manual review anyway.
`lib/churches.ts`'s `searchSimilarChurches()` does a live, debounced lookup against the real
`churches` table (public-select, safe to call directly from the client) as someone types the name
and city, surfacing existing matches before they submit — catches accidental duplicates, which is
almost certainly the dominant failure mode over deliberate spam at this site's traffic level. A
hidden honeypot field (`website`, positioned off-screen + `aria-hidden`, invisible to real users
and screen readers) catches unsophisticated auto-fill bots — a filled honeypot silently no-ops
the submit (shows the normal success message, makes no network call) rather than erroring, so a
bot doesn't learn it was caught. Deliberately not implemented yet: real rate-limiting (would need
a server-side piece — this is currently a pure browser→Supabase insert with no backend to track
state) and CAPTCHA (real friction, not worth adding pre-emptively without evidence of actual
abuse at low traffic).

**Denomination/translation breakdown tables**: two `GROUP BY` views —
`church_denomination_counts` and `church_translation_counts` — sit in front of `churches` and
are read by `lib/churches.ts`'s `getDenominationCounts()`/`getTranslationCounts()`, rendered by
`components/CountTable.tsx`. `/church-finder` is a 3-column layout (`lg:flex-row`): search form +
results + `AddChurchForm` on the **far left** (`lg:flex-1`), then the Denominations count table,
then the Bible Translations count table. JSX source order == visual order, so no `order-*`
classes — on mobile the columns just stack in that order (search first). Both views are created
with `security_invoker = true` — Postgres views default to running with the *creator's*
privileges unless told otherwise, which would silently bypass `churches`' RLS policy; explicit
`security_invoker` makes them respect the same public-SELECT policy as the table itself. Get
this wrong and Supabase's security advisor flags it immediately (`security_definer_view`,
ERROR level) — worth re-running `get_advisors` after any new view.

**Church data pipeline** (`scripts/`, all one-off Node scripts, safe to re-run): the source
data (`churches-combined.csv`, ~110MB, gitignored — exceeds GitHub's 100MB limit and is fully
regenerable) was cleaned (deduped, bad zips/addresses fixed via `cleanup-churches-data*.js` and
`backfill-*-from-zip.js`) then loaded into Supabase via `load-churches-to-supabase.mjs`
(PostgREST bulk insert, batched). Translations are filled two ways:
- **Bulk denominational defaults**: applied only where a denomination is ~99% aligned to one
  pulpit/lectionary translation and the category bucket is clean.
  - `catholic_church` → NABRE — **removed 2026-09-06** with the Catholic bucket (was ~22,300
    rows; the site is Protestant-only now). The `fill-denominational-translations.js` entry and
    the `add-translation-column.js` NABRE note are gone; historical rollback for the delete is
    `sync_archive.archive_removed_nonprotestant_2026_09_06`.
  - `disciples_of_christ_church` → NRSV (~137) and `congregational_church` rows whose *name*
    says "United Church of Christ" → NRSV (~1,580) — mainline bodies, NRSV in their worship
    resources. Disciples is in `fill-denominational-translations.js`; the UCC-by-name rule was
    applied straight against Supabase (it keys off the name, not `refined_category`) and is
    only documented in that script's header. Bare-"Congregational Church" rows were left alone
    (a real minority are CCCC / NACCC, not UCC).
  - The old blanket `episcopal_church` → NRSV rule was **removed** in 2026-08 — that bucket
    became `anglican_episcopal_church` (mixed: TEC uses NRSV, ACNA / Continuing Anglican don't),
    and ~1,822 of its rows were actually African Methodist Episcopal churches the classifier had
    mis-bucketed on the word "Episcopal". Those + ~86 real Anglican/Episcopal rows were
    **cleared to NULL**; LDS / Christian Science (both KJV) went out with their rows.
  - **2026-09-01 the NRSV default was re-applied, but precisely**: only to the ~5,990
    `anglican_episcopal_church` rows matched to a parish in The Episcopal Church's *own* parish
    directory (the TEC directory sync below) — no ACNA, no AME, no Continuing Anglican. NRSV is
    the version overwhelmingly used in TEC worship / lectionary. Rollback:
    `tec_sync_nrsv_before_2026_09_01` (restore `bible_translation` + `_notes` by `id`).
  - ~71 `NRSV` rows on `presbyterian_church` / `lutheran_church` are per-church research (PC(USA)
    / ELCA confirmed individually), not a bulk default — left as-is.
- **Per-church research** (`add-translation-column.js`, `KNOWN_TRANSLATIONS` map): for
  denominations split across sub-bodies with different standards - e.g. Lutheran (LCMS→ESV,
  ELCA→NRSV, but WELS / ELS / LCMC / NALC have no official stance — WELS in particular uses a
  mix of NIV / ESV / CSB / EHV) and Presbyterian (PC(USA)→NRSV, but PCA/OPC/ECO/Cumberland don't). ~100 churches done this way as of this writing (25 LCMS→ESV,
  ~71 PC(USA)/ELCA→NRSV), via real web search per church (never guessed) - about 80-90% hit rate
  once the specific synod is confirmed via an official source (locator.lcms.org, pcusa.org,
  etc.). This is genuinely slow
  (one church at a time) and the ~352K total dwarfs what's been researched - continuing this is
  an open-ended task, not something to "finish."
- A bulk cross-reference via each denomination's official congregation locator was considered
  but ruled out: LCMS's locator actively rate-limits automated access, ELCA/PCUSA have no bulk
  export, and third-party aggregators like faithstreet.com block automated fetches (403) despite
  a permissive robots.txt. Don't re-attempt this without a different approach (e.g. the
  denomination granting explicit data access) - it's not a matter of trying harder.
- `reference-us-zips.csv`: a free public-domain zip/city/state dataset (SimpleMaps), used for
  the address backfill and reusable for future geocoding needs.

**Denomination taxonomy** — three pieces that must stay in step:
`scripts/add-refined-category-column.js` (`OVERRIDE_PATTERNS` + `CATCH_ALL_PATTERNS` +
`normalizeCategory`, the regex classifier that turns `church_cathedral` names into category
slugs), `lib/suggestionOptions.ts`'s `denominationOptions` (the submission dropdown), and
`lib/churches.ts`'s `humanizeCategory` (how `churches.category` slugs render in the
`/church-finder` breakdown table).

`denominationOptions` is a **fixed 30-entry US master taxonomy**, not a projection of what's in
the data. Several labels split or merge the underlying buckets:
- Where a label maps 1:1 onto a slug, `value` *is* that slug (so an edit suggestion merges
  without a translation step).
- Splits the source names *can* distinguish are real categories, populated by the classifier:
  `missionary_baptist_church`, `methodist_ame`, `bible_church` (added in the 2026-08 overhaul),
  `plymouth_brethren_church` (populated 2026-08-30 by a "Gospel Hall" pattern), and
  `pentecostal_church` ("Pentecostal", added 2026-09-06 — the Pentecostal *family* catch-all,
  checked after AG/Foursquare/COGIC so those win; ~3,850 rows; "Full Gospel" deliberately
  excluded from the pattern as too broad).
- `non_denominational` (~4,575 rows as of 2026-09-05) is populated from external directories that
  explicitly classify a church as non-denominational/independent (usachurches.org, the ARC / GCC
  church-planting networks, OSM `nondenominational` and filtered `evangelical`/`protestant` tags —
  see the 2026-09-05 section below) or per-church verification — **never a bare name pattern**:
  a sample proved ~35-45% of generic-named "X Community Church" rows are quietly SBC / AG / EFCA / etc.
- **Merged 2026-08-30** (all empty or unenforceable by name): `church_of_god_holiness` +
  `church_of_god` → one "Church of God" (Anderson/Holiness vs Cleveland/Pentecostal is
  invisible in a bare "Church of God" name); the two `non_denominational*` tiers → one
  "Non-denominational".
- **Added 2026-08-30**: `evangelical_free_church` ("Evangelical Free Church (EFCA)"). **1,330
  rows** after syncing EFCA's own church locator: `https://data.efca.org/api/v1/churches?bounds[…]`
  returns all ~1,586 EFCA churches as one JSON blob (name, full address, district, website,
  coords). Pulled server-side via the `http` extension into an `efca_import` staging table,
  matched to `churches` on normalised street+zip5 then name+city+state, then **960 relabelled**
  (551 were `church_cathedral`, ~70 mislabelled `bible_church`, rest already EFCA), **265 new
  churches inserted**, 361 skipped (ambiguous / shared-building matches). Websites backfilled from
  the EFCA data where ours were blank. Audit/rollback tables: `efca_sync_relabel_before_2026_08_30`,
  `efca_sync_inserted_2026_08_30`, `efca_orphans_2026_08_30`. This is the template for other
  denominations that publish a church locator — see the "denomination directory sync" memory.
- **Added 2026-08-31**: `sbc_church` ("Baptist (Southern Baptist Convention)"). Populated from
  the SBC's own directory (`churches.sbc.net`, WordPress + FacetWP, ~39,288 listings with
  name+street+city+state+zip). `scripts/fetch-sbc-churches.mjs` pages the FacetWP listing at
  robots.txt crawl-delay (~4.6h) → `scripts/sbc-churches.ndjson` (committed), pulled server-side
  via the `http` extension into `sbc_import`; best match per listing computed once into
  `sbc_match` (Tier A: region+zip5+normalised street; Tier B: name similarity ≥0.75 + sole
  strong candidate in-city). **Phase 1: 20,201 rows relabelled** — 17,666 from `baptist_church`,
  2,460 from `church_cathedral` (SBC churches named "X Community/Cowboy Church" that were "not
  identified"), 75 from `bible_church`. Rows in specific non-Baptist buckets and
  `missionary_baptist_church` were left alone (address matches there are building-shares /
  dual-alignment). **Phase 2: +718 more relabels** (loose address match the strict tier missed)
  **and 10,271 new rows inserted** (SBC listings with a full address and no match; deterministic
  id `md5('sbc:'||slug)`; aggressive dedup + junk filter; 696 held back — PO-box-only, likely
  existing dupes, non-church entities — in `sbc_sync_holdback_2026_08_31`). `sbc_church` now
  **31,190**, `baptist_church` **52,295**, table **~360,000 rows**. With SBC carved out,
  `baptist_church` was relabelled **"Baptist (Southern / Independent / other)" → "Baptist
  (Independent / other)"**. Rollback: `sbc_sync_relabel_before_2026_08_31` +
  `sbc_sync_phase2_relabel_before_2026_08_31` (restore `category`), delete
  `sbc_sync_inserted_2026_08_31` ids. Phase 3 (website/phone backfill from `/church/<slug>/`
  detail pages) still pending. Like `non_denominational`, the name classifier never assigns
  `sbc_church` — a `churches-combined.csv` reload would not reproduce it.
  - **Re-match 2026-09-05**: a third pass against the same `sbc-churches.ndjson` with a *looser*
    street key (drop all street-type suffixes; compare house# + stripped street name, prefix-OK)
    and a name tier at sim ≥ 0.62 + sole-in-city, targeting only `church_cathedral` +
    `baptist_church`, with an "other denomination in our name" guard (PH / COGIC / AME / …).
    **+3,870 relabelled** (627 from `church_cathedral`, 3,243 `baptist_church` → `sbc_church` —
    mostly "First Baptist Church of X" ↔ our "First Church X"). Address-tier matches with
    name_sim < 0.45 were dropped — building succession (e.g. "Forest Hill Baptist" → the
    non-SBC "Harvest Church" now in its building). `sbc_church` **31,233 → 35,103**;
    `church_cathedral` **122,649**. Rollback `sync_archive.sbc_rematch_relabel_before_2026_09_05`.
- **Tried 2026-08-31, then REVERTED (owner call — too fine-grained for this site):** separate
  slugs `pca_church` (PCA), `gmc_church` (Global Methodist Church), `acna_church` (ACNA), each
  carved from its parent bucket via the denomination's own directory. Migration
  `revert_pca_gmc_acna_slugs_to_parent_buckets` moved every touched row (relabels + the ~2,360
  inserts) into `presbyterian_church` / `methodist_church` / `anglican_episcopal_church` and the
  residual labels were restored ("Presbyterian", "Methodist / Wesleyan (Mainline & Global)",
  "Anglican / Episcopal"). **The added churches were kept** (they carry real addresses / coords /
  websites) — they just live in the parent bucket now, so `presbyterian_church` (+1,768),
  `methodist_church` (+3,559), `anglican_episcopal_church` (+772) are each a bit larger and a
  bit better-identified than before the syncs. If any is wanted back: the feed URLs are
  `pcaac.org/church-directory/` (BatchGeo JSON, tokenised), `globalmethodist.org` (Storepoint
  widget `1682b4fc2190ec` → `api.storepoint.co/v1/<id>/locations`), `acna.org/anglican_church/map`
  (gmaps4rails markers inline; `scripts/fetch-acna-churches.mjs`); rollback tables
  `{pca,gmc,acna}_sync_relabel_before_2026_08_31` + `_inserted_` still exist.
- **Added 2026-09-06: `pentecostal_church` ("Pentecostal")** — partly reverses the 2026-08 call
  to fold generic "Pentecostal" into "not identified", as a family catch-all that sits below the
  organized Pentecostal bodies. Unlike `non_denominational`/`sbc_church` this one
  IS a name-pattern bucket — but "Pentecostal" is a *family-reliable* signal (a church named
  "First Pentecostal" is almost certainly Pentecostal-family; the organized bodies AG /
  Foursquare / COGIC are carved out ahead of it in the classifier). `classify()` gets a
  pattern (`\bPentecostal\b` | `Pentecost[eé]s` | Fire-Baptized | Open Bible Standard, minus
  Baptist / the Oneness "Church of Jesus Christ" / PAW / BibleWay / Spanish "Pentecostal Unida"
  names); `FOLD_TO_CATHEDRAL` drops `pentecostal_church` (keeps `evangelical_church` / `mission`).
  The Oneness pattern also gained `Apost[oó]lica` + `Pentecost[a-zé]* Unida` (Spanish UPCI).
  **3,853 relabelled** `church_cathedral` → `pentecostal_church` + **136** → `oneness_apostolic_church`
  (Spanish Oneness cleanup). ~10-15% of the new bucket may be unnamed AG/COGIC affiliates —
  acceptable, they were "not identified" before. "Full Gospel" left OUT of the pattern (too broad:
  Word of Faith, Full Gospel Baptist Church Fellowship, Korean AG). `church_cathedral`
  **121,573 → 117,584**; identified rate **68.8 %**. Migration `add_pentecostal_church_bucket`;
  rollback `sync_archive.pentecostal_bucket_before_2026_09_06` (restores `category` by id).
- **2026-08-31 — `nazarene_church` filled from the Church of the Nazarene directory** (existing
  bucket, no new slug). `maps.nazarene.org/FindAChurch/` is an **ArcGIS** map; its layer REST
  query endpoint `.../ArcGIS/rest/services/Nazarene/NazareneChurches/MapServer/0/query`
  returns every church (`where=…Region='USA/Canada'`, page with `resultOffset`, maxRecordCount
  2000). 4,510 US churches with address + coords + website; the `name` field has **no "Church
  of the Nazarene" suffix** (it's implied — `naz_norm_name` strips it from both sides; inserts
  get it appended back). `naz_import` → `naz_match`. **402 relabelled** (364 from
  `church_cathedral` — generic-named Nazarene plants like "Sunrise Community Church"),
  **1,102 inserted** (coords + website). `nazarene_church` **3,123 → 4,602** (~+47%; directory
  4,510); 2,415 now have a website. `church_cathedral` 133,099 → **132,722**. Rollback:
  `naz_sync_relabel_before_2026_08_31`, delete `naz_sync_inserted_2026_08_31` ids. Staging:
  `naz_import`/`naz_match`/`naz_insert_plan`/`naz_sync_holdback_2026_08_31`.
- **2026-09-01 — The Episcopal Church filled from the Episcopal Asset Map** (`anglican_episcopal_church`,
  existing bucket, no new slug). TEC's parish directory is `episcopalassetmap.org` (Drupal +
  Leaflet Views). Two public no-auth endpoints joined on `nid`:
  `/search/places/batch?offset=N&limit=500&display=block_4` → `{nid,lat,lon,type}` for ~8,260
  map places; `/list?type[church]=church&page=N` → name/street/city/state, ~687 pages.
  **No ZIP in either feed.** `scripts/fetch-tec-churches.mjs` (Node fetch works — no Cloudflare)
  → `scripts/tec-churches.ndjson` (6,429 US parishes, committed). ~436 non-US diocese rows
  (Haiti, Latin America, Taiwan, Europe) filtered; PR/VI/GU/MP kept. `tec_import` → `tec_match`
  (no zip → Tier A region+city+`efca_norm_street2`; Tier GEO coord box ±0.004°; Tier B
  `tec_norm_name` sim + same city — the fn strips episcopal/anglican/church/parish/chapel/mission
  + stopwords from both sides). **870 relabelled** `church_cathedral` → `anglican_episcopal_church`
  (address/geo + name agree; many were Episcopal parishes with a place name or a sub-ministry
  row like "St Mark's Youth Group"). **1,134 inserted** (parishes absent from our data;
  deterministic id `md5('tec:'||nid)`; no ZIP). 376 held back — geo-collisions where a
  different congregation now holds the building, PO-box-only, building-shares (17 with ELCA —
  full communion). `anglican_episcopal_church` **6,320 → 8,317** (~+32%); `church_cathedral`
  132,722 → **131,859**; **table ~370,468**. Also set `bible_translation='NRSV'` on the ~5,990
  of those rows that matched the TEC directory and had no translation (precise re-application of
  the old blanket rule — see pipeline section). Rollback:
  `tec_sync_relabel_before_2026_09_01` (category), delete `tec_sync_inserted_2026_09_01` ids,
  `tec_sync_nrsv_before_2026_09_01` (translation). Staging: `tec_import`/`tec_ch`/`tec_match`/
  `tec_plan`/`tec_insert_plan`/`tec_sync_holdback_2026_09_01`, fn `tec_norm_name`.
- **2026-09-01 — Free Methodist Church USA filled from `fmcusa.org`** (`methodist_church`,
  existing bucket — no new slug). `fmcusa.org/find-a-church` is WP + "WP Google Map Gold"; the
  entire marker set is inlined as base64 JSON in `window.wpgmp.mapdata13` (also in the raw HTML,
  so Node works) — decode → `places[]` with title, address, city/state/postal_code, coords, and
  `extra_fields` (conference, status, phone, email, website). `scripts/fetch-freemethodist-churches.mjs`
  → `scripts/freemethodist-churches.ndjson` (815 US congregations, committed; `address` is
  sometimes "street City ST ZIP" — split at the trailing city/state/zip). Has ZIP + coords, so
  `fmc_match` is a clean Tier A (region+zip5+`efca_norm_street2`) / GEO / Tier B (`fmc_norm_name`
  + city). **177 relabelled** `church_cathedral` → `methodist_church` (FM plants named "X
  Community Church" / "The Table Church" etc.). **200 inserted** (`md5('fmc:'||id)`, ZIP + coords
  + non-social website). 94 held back (geo-collisions, dup addresses, PO boxes). `methodist_church`
  **24,414 → 24,789**; `church_cathedral` 131,859 → **131,684**; **table ~370,668.** Commits
  bffd657 (fetch+data) / <this>. Rollback: `fmc_sync_relabel_before_2026_09_01` (category),
  delete `fmc_sync_inserted_2026_09_01` ids. Staging: `fmc_import`/`fmc_ch`/`fmc_match`/`fmc_plan`/
  `fmc_insert_plan`/`fmc_sync_holdback_2026_09_01`, fn `fmc_norm_name`. (FMC-USA has no single
  official pulpit translation — no bulk `bible_translation` applied.)
- **2026-09-01 — The Wesleyan Church filled from `secure.wesleyan.org`** (`methodist_church`,
  existing bucket — no new slug; the label is already "Methodist / Wesleyan"). The
  `wesleyan.org/find-a-church` page embeds `secure.wesleyan.org/findachurch/frame`, whose search
  hits one no-auth JSON endpoint: `GET /findachurch/codes?latitude&longitude&distance=<mi>` —
  `distance=4000` from the US centroid returns the whole set (~1,540, no pagination). Fields:
  name, website, phone, `mailing_address` / `formatted_address` ("street, city, ST zip
  country|county" — inconsistent tail). `scripts/fetch-wesleyan-churches.mjs` parses to a US
  state + 5-digit zip → **1,426** US congregations (~97 Canadian, 19 no-address dropped).
  `wes_match` = Tier A (region+zip5+`efca_norm_street2`) / GEO ±0.004° / Tier B (`wes_norm_name`
  + city). **Names are often "City CampusName"** with no "Wesleyan" — address/geo carry most
  matches. **317 relabelled** `church_cathedral` → `methodist_church`. **245 inserted**
  (`md5('wes:'||region||':'||city||':'||name||':'||street)` — the feed has no stable id).
  **176 held back** — 100 geo-collisions, **68 PO-box-only** (unusually high; rural holiness
  churches, worth a later pass since they carry real coords), 8 dupes. `methodist_church`
  **24,789 → 25,347**; `church_cathedral` 131,397 → **131,084**; **table ~371,198.** Commits
  3830435 (fetch+data) / <this>. Rollback: `wes_sync_relabel_before_2026_09_01` (category),
  delete `wes_sync_inserted_2026_09_01` ids. Staging: `wes_import`/`wes_ch`/`wes_match`/`wes_plan`/
  `wes_insert_plan`/`wes_sync_holdback_2026_09_01`, fn `wes_norm_name`. (No mandated translation
  — no default. With the FMC sync, `methodist_church` grew +933 this day.)
- **2026-09-01 — Converge (Baptist General Conference) filled from `converge.org`** (`baptist_church`,
  existing bucket — no new slug; Converge is the former BGC, Swedish Baptist heritage). The
  `converge.org/churches` HTML is bot-protected but its data endpoint is open:
  `GET /wp-json/ak/v1/churches` → one JSON array (~1,720) of {id, name, address, state, region
  (Converge's 10 US districts), website, lat, lng}. `scripts/fetch-converge-churches.mjs` parses
  address to a US state + 5-digit zip → **1,391** US churches (~326 no-address / "Coming Soon!"
  plants / international dropped). **Only ~24% of names contain "Baptist"** (Converge brands
  generically — "Awaken Church", "Flood Church"), so address/geo tiers do the work.
  `cvg_match` over `baptist_church` + `church_cathedral` + `bible_church`; Tier A
  (region+zip5+`efca_norm_street2`) / GEO ±0.004° / Tier B. **497 relabelled** → `baptist_church`
  (478 from `church_cathedral`, 19 from `bible_church` — mostly campus/language-suffix name
  variants of the same church). **330 inserted** (`md5('cvg:'||id)`). 237 held back (185
  geo-collisions, 47 dup addresses). `baptist_church` **52,295 → 53,116**; `church_cathedral`
  131,084 → **130,612**; `bible_church` 3,500 → **3,481**; **table ~371,528.** Commits 23eecec
  (fetch+data) / <this>. Rollback: `cvg_sync_relabel_before_2026_09_01` (category), delete
  `cvg_sync_inserted_2026_09_01` ids. Staging: `cvg_import`/`cvg_ch`/`cvg_match`/`cvg_plan`/
  `cvg_insert_plan`/`cvg_sync_holdback_2026_09_01`, fn `cvg_norm_name`. (Converge has no mandated
  translation — no default.)
- **2026-09-01 — Orthodox Presbyterian Church filled from `opc.org`** (`presbyterian_church`,
  existing bucket — no new slug). `opc.org/locator.html` is a POST form; `scripts/fetch-opc-churches.mjs`
  POSTs `state=<ST>` for all 50 states + DC and parses the returned HTML church cards
  (`<table class="churchCard">` — name in `<h2>` as "NAME - City, ST", address from `<h4>Address</h4>`
  or `<h4>Meeting At</h4>`, **coords from the embedded `/maps/place/…/@lat,lng` Google Maps link**).
  **328** congregations (57 have no coords — the older `&ll=` map format or none; all have
  street + zip). Names render ALL-CAPS and are often a single word ("Grace", "Providence") →
  title-cased; the `<h2>` "- City, ST" tail is stripped; inserts get " Orthodox Presbyterian
  Church" appended unless the name already carries a church word. `opc_match` over
  `presbyterian_church` + `church_cathedral`; GEO ±0.004° dominates (Tier A rarely fires — OPC
  "Meeting At" strings carry venue names / parentheticals). **35 relabelled** `church_cathedral`
  → `presbyterian_church`, **101 inserted** (`md5('opc:'||id)`), 29 held back. `presbyterian_church`
  **10,433 → 10,569**; `church_cathedral` 130,612 → **130,577**; **table ~371,629.** Commits
  2c54705 (fetch+data) / <this>. Rollback: `opc_sync_relabel_before_2026_09_01` (category),
  delete `opc_sync_inserted_2026_09_01` ids. Staging: `opc_import`/`opc_ch`/`opc_match`/`opc_plan`/
  `opc_insert_plan`/`opc_sync_holdback_2026_09_01`, fn `opc_norm_name`. (~15 inserts have a venue
  name in `address` or a doubled "…Reformed Orthodox Presbyterian Church" name — cosmetic, worth
  a cleanup pass. OPC has no mandated translation — no default.)
- **2026-09-01 — Associate Reformed Presbyterian Church filled from `arpchurch.org`**
  (`presbyterian_church`, existing bucket — no new slug). Same shape as RCA: WP Store Locator
  whose `store_search` AJAX ignores `search_radius`, so `scripts/fetch-arp-churches.mjs` lists
  all **269** via `/wp-json/wp/v2/wpsl_stores` then scrapes each `/churches/<slug>/` for its
  inline `wpslMap_N.locations[0]` (8-way concurrent). **255** US congregations w/ full address +
  coords (2 parse failures, ~12 non-US). ARP is a Carolina-Piedmont Scots-Irish body — NC 68 /
  SC 57 / FL 23. Names decode HTML entities in staging. `arp_match` over `presbyterian_church`
  + `reformed_church` + `church_cathedral`; Tier A (region+zip5+`efca_norm_street2`) / GEO
  ±0.004° / B name+city. **72 relabelled** `church_cathedral` → `presbyterian_church`
  ("Mount Zion ARP Church" → our "Mt Zion", etc.), **+ 16 more** via a name-pattern sweep of
  `church_cathedral` rows explicitly named "… ARP Church" that the feed missed (closed/merged;
  archived with `arp_id = null`). **69 inserted** (`md5('arp:'||id)`; generic names get " ARP
  Church" suffix). 23 held back. `presbyterian_church` **10,569 → 10,726**; `church_cathedral`
  130,577 → **130,489**; **table ~371,698.** Commits f266072 (fetch+data) /
  <this>. Rollback: `arp_sync_relabel_before_2026_09_01` (category), delete
  `arp_sync_inserted_2026_09_01` ids. Staging: `arp_import`/`arp_ch`/`arp_match`/`arp_plan`/
  `arp_insert_plan`/`arp_sync_holdback_2026_09_01`, fn `arp_norm_name`. (Same venue-name-in-address
  blemish as OPC on ~6 church-plant inserts. No mandated translation — no default. With the OPC
  sync, `presbyterian_church` grew +293 this day.)
- **2026-09-01 — Reformed Church in America filled from `rca.org`** (`reformed_church`, existing
  bucket — no new slug). `rca.org/find-an-rca-church` is WP Store Locator; the `store_search`
  AJAX is slow (~2.5s) and 100-capped, so: list every store via
  `/wp-json/wp/v2/wpsl_stores?per_page=100&page=N` (858; WP post id == WPSL store id;
  `X-WP-Total` = count), then scrape each `/churches/<slug>/` detail page for its inline
  `var wpslMap_… = {…"locations":[{store,address,city,state,zip,lat,lng,id}]}`.
  `scripts/fetch-rca-churches.mjs` (8-way concurrent) → `scripts/rca-churches.ndjson`
  (**662** US congregations w/ full address + coords; ~86 stores have an empty locations array —
  no address in the locator, skipped; ~110 Canadian). `rca_match` = Tier A
  (region+zip5+`efca_norm_street2`) / GEO ±0.004° / Tier B (`rca_norm_name` + city).
  **140 relabelled** `church_cathedral` → `reformed_church` (RCA plants named "The Community
  Church" / "Hesed", or matched via a sub-ministry row). **156 inserted** (`md5('rca:'||id)`,
  zip + coords). 82 held back (geo-collisions, dup addresses). `reformed_church` **1,188 → 1,481**;
  `church_cathedral` 131,684 → **131,547**; **table ~370,824.** Commits 1b78bd8 (fetch+data) /
  <this>. Rollback: `rca_sync_relabel_before_2026_09_01` (category), delete
  `rca_sync_inserted_2026_09_01` ids. Staging: `rca_import`/`rca_ch`/`rca_match`/`rca_plan`/
  `rca_insert_plan`/`rca_sync_holdback_2026_09_01`, fn `rca_norm_name`. (RCA splits between an
  evangelical/NIV Midwest wing and a mainline/NRSV eastern wing — no translation default.)
- **2026-09-01 — Christian Reformed Church filled from `crcna.org`** (`reformed_church`, existing
  bucket — no new slug). `crcna.org/churches/feed` is one no-auth **GeoJSON FeatureCollection**
  (~1,800 features: `geometry.coordinates` [lng,lat] as strings; `properties` = id, name,
  previousName, koreanName, street, city, state, status, languages[]; **no ZIP**). Keep
  `status == "Active"` and drop Canadian provinces → **685** US congregations.
  `scripts/fetch-crc-churches.mjs` → `scripts/crc-churches.ndjson`. `crc_match` = Tier A
  (region+city+`efca_norm_street2`) / GEO ±0.004° / Tier B (`crc_norm_name` on name **or
  previousName** + city). **151 relabelled** `church_cathedral` → `reformed_church` (CRC plants
  named "Hope Church" / "CrossWay Church" / Spanish & Korean congregations). **129 inserted**
  (`md5('crc:'||id)`, coords, no ZIP). 104 held back. `reformed_church` **1,481 → 1,760**;
  `church_cathedral` 131,547 → **131,397**; **table ~370,953.** Commits 8b56b0d (fetch+data) /
  <this>. Rollback: `crc_sync_relabel_before_2026_09_01` (category), delete
  `crc_sync_inserted_2026_09_01` ids. Staging: `crc_import`/`crc_ch`/`crc_match`/`crc_plan`/
  `crc_insert_plan`/`crc_sync_holdback_2026_09_01`, fn `crc_norm_name`. (CRC has no mandated
  translation — historically NIV-heavy but no default applied. Combined with the RCA sync above,
  `reformed_church` grew 1,188 → 1,760 this day.)
- **2026-08-31 — `christian_missionary_alliance` filled from the C&MA locator** (existing
  bucket, no new slug). `cmalliance.org/churches/` → `GET /rest/map/churches-nearby?lat=39.8
  &lng=-98.5&radius=99999&limit=5000` — one open JSON call, US center + huge radius returns
  all 1,939 (`churches[]`: name, `address` as one string, coords, phone, email, website,
  `churchcode`). `cma_import` → `cma_match` (Tier A region+zip5+street; GEO coords; B name+city).
  **466 relabelled** (429 from `church_cathedral` at name_sim ≥ 0.35, 29 from `bible_church`;
  the 123 name-disagree `church_cathedral` matches → holdback, NOT auto-flipped, because C&MA
  has heavy ethnic building-sharing — Vietnamese/Cambodian/Hmong/Spanish Alliance congregations
  in shared halls). **584 inserted** (coords + website), 164 held back. `christian_missionary_alliance`
  **~700 → 1,753** (~2.5×; directory has 1,939); 1,102 have a website. `church_cathedral`
  133,622 → **133,187**. Rollback: `cma_sync_relabel_before_2026_08_31`, delete
  `cma_sync_inserted_2026_08_31` ids. Staging: `cma_import`/`cma_match`/`cma_insert_plan`/
  `cma_sync_holdback_2026_08_31`.
- **2026-08-31 — `foursquare_church` filled from the Foursquare (ICFG) locator** (existing
  bucket, no new slug). `foursquare.org/locator/` is WordPress with a clean REST endpoint
  `GET /wp-json/locator/v1/locations?state=<ST>&type[]=Church` → JSON array per state (name,
  street, city, state, coords, phone, email, website, district; **`shipping_zip` field is
  always empty** — no zip). 1,365 churches → `fsq_import` → `fsq_match` (no zip, so Tier A =
  region + city + normalised street; Tier GEO = coordinate proximity + name; Tier B name+city).
  **463 relabelled** (mostly from `church_cathedral` — the directory names churches "[City]
  Foursquare Church" but the congregation brands as "Revolution Church" / "Life Center" / etc.;
  exact street+city match is strong enough to flip even when names disagree), **393 inserted**
  (coords + website from the feed), 105 held back (building shares). `foursquare_church`
  **457 → 1,309** (~2.9×; directory has 1,365); 782 now have a website. `church_cathedral`
  134,081 → **133,622**. Rollback: `fsq_sync_relabel_before_2026_08_31`, delete
  `fsq_sync_inserted_2026_08_31` ids. Staging: `fsq_import`/`fsq_match`/`fsq_insert_plan`/
  `fsq_sync_holdback_2026_08_31`.
- **2026-08-31 — `assembly_of_god_church` filled from the AG directory** (existing bucket, no
  new slug). `ag.org`'s church directory is server-rendered HTML, searchable by state with
  page pagination, **behind Cloudflare** — the Node fetcher (`scripts/fetch-ag-churches.mjs`)
  gets 403'd, so the pull ran through the in-app browser (holds the CF clearance cookie);
  result committed as `scripts/ag-churches.ndjson` (`{guid,name,street,city,state,zip,phone}`,
  the address was one `"<street> <city>"` run split at the last street-suffix token — ~18%
  kept the whole run as `street` + blank `city`, backfilled from same-zip locality for the
  inserts). 12,696 US churches → `ag_import` → `ag_match` (Tier A region+zip5+street; **Tier AL**
  loose = house# + zip5 + first street token, for the blank-city rows; Tier B name+city).
  **2,880 relabelled** (2,751 from `church_cathedral` — many AG churches are named "X Church" /
  "Christian Life Center" / "Iglesia … Asambleas de Dios" and sat in "not identified"),
  **4,850 inserted**, 480 held back. `assembly_of_god_church` **4,224 → 11,901** (~2.8×; AG's
  real US footprint is ~12,700). Rollback: `ag_sync_relabel_before_2026_08_31`, delete
  `ag_sync_inserted_2026_08_31` ids. Staging: `ag_import` / `ag_match` / `ag_insert_plan` /
  `ag_sync_holdback_2026_08_31`.
  - **Re-match 2026-09-05** (same `ag-churches.ndjson`, loose street key, `church_cathedral` only):
    AG church names diverge hard from ours ("Bethel Assembly of God" ↔ our "Bethel Church",
    "Aliento de Vida", Spanish "Templo …"), so address matches averaged name_sim ~0.14. Applied
    where `name_sim ≥ 0.22` **or** a core-content-word match after stripping "assembly/of/god/
    church/iglesia/…" ≥ 0.35, with an other-denomination-in-our-name guard. **+769 relabelled**
    `church_cathedral` → `assembly_of_god_church` (12,003 → 12,772). `church_cathedral` **121,880**.
    Rollback `sync_archive.ag_rematch_relabel_before_2026_09_05`.

**2026-09-05 — combined re-match of the 10 smaller directory scrapes** (`scripts/build-denom-rematch.mjs`
→ `scripts/denom-rematch.ndjson`): ARP, Converge, CRC, Foursquare, Free Methodist, Nazarene, OPC,
RCA, TEC, Wesleyan — all have coords, so **geo-matched** (±0.0026°) against `church_cathedral`.
Lesson repeated from the OSM `evangelical` tier: tight distance alone catches building-shares
("St. Luke's, Seattle" ↔ "Pangea"; "Bethel ARP" ↔ a Christadelphian mission) — so required
`name_sim ≥ 0.45` (or ≥ 0.30 at < 45 m) + an other-denomination guard. **+307 relabelled**:
`anglican_episcopal_church` 128 (TEC, also → NRSV), `nazarene_church` 53, `baptist_church` 40
(Converge), `reformed_church` 36 (CRC/RCA), `methodist_church` 31 (FMC/Wesleyan),
`foursquare_church` 17, `presbyterian_church` 2 (ARP/OPC, → ESV). `church_cathedral` **121,573**;
identified rate **67.8 %**. Rollback `sync_archive.dr_relabel_before_2026_09_05` (restores
`category` + `bible_translation` + notes by id). These directories were mostly consumed by their
first syncs — the yield tail is thin; SBC (+627) and AG (+769) were the meaningful re-matches.

**Buckets sourced from the denomination's own official church directory** (not name-pattern /
crowdsourced — these rows are as authoritative as the denomination's own records, modulo the
directory's own staleness): **`evangelical_free_church`** (EFCA, `data.efca.org`, 2026-08-30),
**`sbc_church`** (SBC, `churches.sbc.net`, 2026-08-31),
**`assembly_of_god_church`** (bulk of it — AG, `ag.org` directory, 2026-08-31),
**`foursquare_church`** (bulk of it — Foursquare/ICFG, `foursquare.org/locator/`, 2026-08-31),
**`christian_missionary_alliance`** (bulk of it — C&MA, `cmalliance.org`, 2026-08-31),
**`nazarene_church`** (bulk of it — Church of the Nazarene, ArcGIS layer, 2026-08-31),
**`anglican_episcopal_church`** (the TEC slice of it — The Episcopal Church, `episcopalassetmap.org`,
2026-09-01; ACNA / Continuing Anglican rows in the bucket are *not* directory-sourced), the
**Free Methodist + Wesleyan slices of `methodist_church`** (FMC-USA `fmcusa.org` + The Wesleyan
Church `secure.wesleyan.org`, 2026-09-01), the **RCA + CRC slices of `reformed_church`**
(Reformed Church in America `rca.org` + Christian Reformed Church `crcna.org`, 2026-09-01), and
the **Converge/BGC slice of `baptist_church`** (`converge.org`, 2026-09-01), and the **OPC + ARP
slices of `presbyterian_church`** (Orthodox Presbyterian Church `opc.org` + Associate Reformed
Presbyterian `arpchurch.org`, 2026-09-01).
Idea for later (not built): mark these with an asterisk in the
`/church-finder` denomination breakdown table. Mechanism when wanted: a `Set` of
directory-synced slugs that `CountTable` checks — no schema change.

**Sync scratch/rollback tables — 2026-09-01 cleanup.** The free-tier DB hit its 500 MB limit
and Supabase flagged a Critical `rls_disabled_in_public` advisor: all ~129 sync-pipeline tables
had been created in `public` with no RLS (browser-`anon`-writable) and the 8 `<denom>_ch`
tables (filtered copies of `churches`) were ~284 MB of pure waste. Fixed: the `_ch` +
`_import` / `_match` / `_plan` / `_insert_plan` staging tables and every `*_norm_name` /
`efca_*` helper function were **dropped** (recreatable from the committed
`scripts/*-churches.ndjson` + migration history). The 64 rollback/audit tables — every
`*_sync_relabel_before_*`, `*_sync_inserted_*`, `*_sync_holdback_*`, `tec_sync_nrsv_before_*`,
`efca_orphans_*`, and the 11 `archive_removed_*_2026_08_30` — were **moved to a private
`sync_archive` schema** (PostgREST doesn't serve it; not advisor-flagged). So every "Rollback:"
line above is still valid but the table now lives at `sync_archive.<name>`. DB 535 → 192 MB;
`public` holds only `churches`, `church_suggestions`, the two count views, and `pg_trgm`.
**Any future sync must create its tables in `sync_archive`, not `public`, and must not leave a
`_ch`-style projection behind** (`TEMP` table, or drop it right after building `_match`).

**Every category in the live data is now either `church_cathedral` ("Denomination not
identified") or a `denominationOptions` value** (31 distinct values live — `church_cathedral`
plus all 30 dropdown categories, every one now populated), so `humanizeCategory` just
builds a `{value: label}` map from `denominationOptions` and reads the label straight off it —
the breakdown table mirrors the dropdown exactly. The 2026-08 overhaul
got there by folding `pentecostal_church` / `evangelical_church` / `mission` (descriptors, not a
specific body) into `church_cathedral`, merging `wesleyan_church` into `methodist_church`
("Methodist / Wesleyan") and `anglican_church` + `episcopal_church` into
`anglican_episcopal_church` ("Anglican / Episcopal"), and deleting the
`convents_and_monasteries` bucket outright (religious communities, not congregations).

Then a **broad name-classifier rescue** moved ~22,000 rows *out* of `church_cathedral` whose name
clearly states a denomination the classifier knows — ~15,000 "X Baptist Church" (→ `baptist_church`),
~5,000 "X Episcopal Church" (→ `anglican_episcopal_church`), ~700 "X Alliance Church"
(→ `christian_missionary_alliance`, previously an empty dropdown slot), plus Church of God 896,
Nazarene 253, COGIC 202, Reformed 107, Wesleyan 97, and ~350 smaller. Most were filed under a
vague `prim_category` in the source data and never hit the name classifier;
`add-refined-category-column.js` now re-runs `classify()` as a fallback whenever a row would
otherwise land on `church_cathedral`, and its `CATCH_ALL_PATTERNS` gained generic `\bEpiscopal\b`
(after Methodist), `\bAlliance Church\b`, and `\bBaptist\b` (last, so specific denominations win;
excludes "St. ___ the Baptist" patron-saint naming) entries. So a regen reproduces the rescue.

**2026-09-01 — OpenStreetMap denomination cross-match** (`scripts/fetch-osm-church-denominations.mjs`):
pulled every US `amenity=place_of_worship` with a `denomination` tag from the Overpass API,
state by state — **115,605** POIs → `scripts/osm-church-denominations.ndjson` (committed).
A regex map turns the 700+ raw OSM `denomination` values into our slugs (excluding LDS / JW /
Christian Science / Unitarian / Unity etc. — bodies removed from the directory — and vague tags
like bare `pentecostal`/`evangelical`). Matched by **coordinate proximity** (Manhattan-degree
box) against the `church_cathedral` rows, name-corroborated with `pg_trgm`. **Only the
tight+name-agreeing tier was applied: 3,634 relabelled** (catholic 1,464, baptist 833,
methodist 381, lutheran 164, presbyterian 149, …). ~32,000 candidates held back — 17k where
coords aren't tight, 10k where two nearby OSM POIs disagree on denomination, 5k where the
tight-coord OSM name doesn't match ours (usually a *different* congregation now in / next to
the building). `church_cathedral` 130,489 → **126,855**; identified rate **64.9 % → 65.9 %**.
Cross-matching two independently-geocoded church datasets is inherently noisier than a
denomination's own roster — the held 32k live in `sync_archive.osm_relabel_plan` (with coords,
both names, and the hold reason) for a future review pass, ideally with website verification.
Rollback: `sync_archive.osm_sync_relabel_before_2026_09_01` (restore `category` by id). The
~1,450 OSM POIs tagged `nondenominational` were **not** applied (the project only assigns
`non_denominational` via per-church verification).
- **Salvage pass** (same day): +447 more from the held `name_disagrees` tier where OSM says
  catholic/orthodox at tight coords and our name carries an unambiguous Catholic/Orthodox
  devotional pattern (`St X` / `Our Lady` / `Parish` / `orthodox` …) — trigram had failed on
  "St" vs "Saint" and on parish-merger renames. `catholic_church` 20,836 → 21,282.
- **Catholic → NABRE** re-run: all `catholic_church` rows with no translation (1,501 pre-OSM +
  the OSM/salvage additions) got NABRE with the standard "denominational default" note.
  `sync_archive.catholic_nabre_before_2026_09_01` is the rollback. Translation coverage
  7.3 % → 7.8 % (~29,100 rows). `church_cathedral` after both OSM passes: **126,408**;
  identified rate **66.0 %**.
- **Phase 2** — `scripts/fetch-osm-church-details.mjs` re-ran the same Overpass query keeping the
  `addr:*` / `website` / `phone` tags (the first pass only kept name + coords). 115,605 rows →
  `scripts/osm-church-details.ndjson`. Coordinate-matched against the *whole* `churches` table
  (per-state batched geo-join — the un-batched join times the connector out):
  - **Website backfill: 15,272** — OSM has a website, our row has none, tight coord/name match.
    `churches.website` populated 7.5k → ~24.4k (3×). Rollback
    `sync_archive.osm_website_before_2026_09_01`.
  - **Net-new inserts: 4,340** — OSM rows with a mapped denomination + `housenumber`+`street` +
    no church within ~200 m + not a diocesan office / institutional chapel + not a
    region+zip+street or region+city+name dup. `id = md5('osm:'||osm)`; Catholic ones get NABRE.
    Table 371,698 → **376,038**; identified rate **66.4 %**. Rollback
    `sync_archive.osm_sync_inserted_2026_09_01` (delete ids).
  All OSM staging lives in `sync_archive` (`osm_relabel_plan` keeps the ~31k unresolved relabel
  candidates; `osm_insert_plan` the insert holdbacks). The big derived tables (`osm_details`,
  `ch_all`, `ch_keys`, `osm_geopairs`, `osm_ch_match`) were dropped after — recreatable from the
  two committed ndjson files.

**2026-09-05 — `non_denominational` push + mainline translation defaults.** The
`non_denominational` bucket went 101 → **3,268** via three sources (the "populated only by
per-church verification" rule is relaxed to "an external directory or an OSM mapper explicitly
classified it as non-denominational/independent" — still never a bare name pattern):
- **OSM `denomination=nondenominational` tag** — the ~1,450 POIs held back on 2026-09-01.
  `scripts/osm-nondenom.json` (filtered from `osm-church-details.ndjson`), coord-matched to
  `church_cathedral` (±0.0020°). **783 relabelled** (within ~90 m *or* name sim ≥ 0.35).
  Rollback `sync_archive.osm_nondenom_relabel_before_2026_09_05`.
- **usachurches.org** "Non-Denominational / Independent" directory (2,890 listings; permissive
  robots.txt, ToU restricts *commercial* redistribution only). `scripts/fetch-usachurches-nondenom.mjs`
  (category pages → name/street/city/state) + `-details.mjs` (detail pages → coords from the
  embedded Google-Maps link, ZIP, website; 2,890/2,890 coords+zip, 1,817 websites). Both `.ndjson`
  committed. Applied against `church_cathedral`: **977** relabelled on name+city+state, **+396**
  more on the geo re-match, **+39** on name+zip5. **995 net-new inserts** (`id = md5('uc:'||slug)`;
  "X Bible Church" names → `bible_church`, rest → `non_denominational`; 196 name+zip dup-risk held
  out). **909 websites** backfilled onto matched rows. Rollbacks: `sync_archive.uc_nondenom_*_before_2026_09_05`
  (relabel / georelabel / namezip_relabel / website) + `uc_nondenom_inserted_2026_09_05` (delete ids).
- **Church-planting networks** (`scripts/fetch-church-networks.mjs`, `.ndjson` committed): **ARC**
  (Association of Related Churches — Storepoint widget `160fafe6488211`, 1,352 US, coords+addr+website)
  + **GCC** (Great Commission Collective — WP Store Locator `store_search`, 56 US). Every ARC/GCC
  member is a non-denominational plant, so this is a clean signal. Geo-matched to the whole table:
  **541 relabelled** `church_cathedral` → `non_denominational`, **379 net-new inserts**
  (`id = md5('net:'||source||':'||ext_id)`), **739 websites** backfilled. Rollbacks
  `sync_archive.net_relabel_before_2026_09_05` / `net_website_before_2026_09_05` / `net_inserted_2026_09_05`.
  (Acts 29 skipped — its members are Reformed Baptist / PCA / nondenominational in a mix, not a
  clean signal. Every Nation — Ninja-Tables church list, data endpoint not cracked; ~300 US, minor.)
- **OSM `evangelical` / `protestant` / `christian` tags** (`scripts/osm-evang-protestant.json`) —
  1,992 POIs where the mapper knew it was Protestant but *not* the body. Lower-confidence tier:
  drop any name with a specific-denomination/movement signal (→ ~1,070 candidates), route
  "X Bible Church/Chapel" → `bible_church`, tight geo-match to `church_cathedral` (±0.0018°) **and
  require `name_sim ≥ 0.45`** (pure-distance matches were catching building-shares) **and our row's
  name also carries no denom signal**. **394 relabelled** (391 `non_denominational` + 3 `bible_church`).
  Rollback `sync_archive.osm_ep_relabel_before_2026_09_05`.
  Combined 2026-09-05: `non_denominational` **101 → 4,575**; table **377,412**; `church_cathedral`
  **123,276**; identified rate **67.3 %**; website coverage ~27.0k.
- **PCA + OPC → ESV** (translation, not denomination): the PCA/OPC congregations matched to their
  own directories during the 2026-08-31 / 09-01 syncs (then folded into `presbyterian_church`)
  were tagged ESV — the PCA is the denomination most identified with the ESV; OPC uses ESV/NASB
  with ESV the plurality. **1,904 rows** (1,768 PCA + 136 OPC). Rollback
  `sync_archive.pca_opc_esv_before_2026_09_02`. Translation coverage 8.0 % → **8.5 %** (ESV
  29 → 1,933). ACNA (~770) was **not** done — genuinely split ESV/NKJV/NRSV across its wings,
  doesn't clear the "~99 % aligned" bar. LCMS→ESV (~6k `lutheran_church` rows) is a clean rule
  but needs their access-gated locator to identify the rows — left alone.

**2026-08 taxonomy overhaul** (`scripts/apply-taxonomy-2026-08.mjs`, one-off; deleted rows
archived verbatim to `scripts/removed-rows-2026-08-28.csv`):
- **Removed entirely** (~9,240 rows, archived to `removed-rows-2026-08-28.csv`) — nothing that
  isn't a historic-Christian congregation: the whole Latter Day Saint movement (~6,320 LDS /
  Mormon + ~375 RLDS / Community of Christ), ~510 Christian Science, ~490 Jehovah's Witnesses,
  ~580 Unitarian Universalist, ~290 New Thought (Unity / Religious Science / Divine Science),
  ~75 Scientology, ~100 other-faith centres miscatalogued as churches, ~490
  `convents_and_monasteries` (religious communities, not congregations), and 5 joke/junk rows.
  None of the religious bodies holds to historic Christian doctrine by any mainstream
  tradition's (Catholic, Orthodox, or Protestant) definition. Applied directly against Supabase
  *and* to `churches-combined.csv`; the classifier's LDS / `Church of Christ, Scientist`
  patterns were deleted so a reload can't resurrect them, and `apply-taxonomy-2026-08.mjs`
  carries name patterns for all of the above with NOT clauses sparing e.g. "Community of Christ
  Lutheran Church", "Jehovah Jireh" Christian churches, the "Unity Fellowship" denomination,
  Primitive Baptist Universalists, Messianic congregations, and "... Mandir" South-Asian
  Christian churches.
- **Five name-identifiable splits** (~21K rows re-tagged): `Missionary Baptist` → out of the
  generic Baptist bucket (~8,800); `African Methodist` / `AME` / `A.M.E.` / `AMEZ` / `AMEC` /
  `UAME` / `Christian Methodist Episcopal` → `methodist_ame` (~4,150 — this emptied the old
  `episcopal_church` bucket, which was ~96% AME); Coptic/Armenian/Ethiopian/etc. → 
  `oriental_orthodox_church` (~620); a filtered `Apostolic` + UPCI/PAW/Oneness →
  `oneness_apostolic_church` (~4,000, excluding New Apostolic Church and the Anabaptist
  Apostolic Christian Church); `Bible Church` (not "X Bible Baptist/Presbyterian") →
  `bible_church` (~3,700). Bare "CME" is deliberately NOT matched (870 false positives).

Still-relevant classifier rules: "Reformed Baptist" routes to `baptist_church` before the
generic `Reformed` pattern (it's Baptist theologically, not Reformed-family). COGIC stays its
own category (historically distinct, ~2,000 rows); Church of God of Prophecy stays folded into
generic `church_of_god` (split from Cleveland TN in 1917, but reads the same on a form).
Southern/Independent Baptist can't be split by name (~400 explicit matches each against the
bucket, unlike Missionary Baptist). **Southern Baptist WAS carved out 2026-08-31 via a
directory sync** (`sbc_church`, see the taxonomy section above) — 20,201 rows, from the SBC's
own church locator, not a name pattern. What's left in `baptist_church` — relabelled
*"Baptist (Mainstream / Southern / American)"* → *"…(Southern / Independent / other)"* →
*"Baptist (Independent / other)"* over the day — is independent Baptists, unmatched SBC
churches, ABCUSA/moderate, and unaffiliated; no further name-based split is planned. The
historical "clears ~100+ name matches" bar still applies to any *new* catch-all category.
("Bible Church (Independent / Dispensational)" was trimmed to "Bible Church (Independent)" the
same day — label only.)

`AddChurchForm` used to carry a "For Christian churches only" scope note; it was removed 2026-08
(the "What churches are listed here?" `<details>` on the page already covers scope).

**The editorial line** (as of 2026-09-06, spelled out in the "What churches are listed here?"
`<details>` on `/church-finder`): the directory is **Trinitarian Protestant** — the historic
Reformation traditions and the movements that grew from them. Inclusion test: *the Trinity —
one God in three persons, Father, Son, and Holy Spirit — and the Bible as the final authority.*
(The `<details>` copy was trimmed to this on 2026-09-09 — the standalone "Jesus Christ is God"
clause was redundant once the test names the Trinity. Substance unchanged: Oneness is still out.)

Earlier the line was broader — "the historic Christian traditions (Catholic, Orthodox,
Protestant)" with a deliberately two-part, *non*-Trinitarian test ("Jesus is God + the Bible is
authoritative"). That was narrowed on 2026-09-06 (owner call). The reasoning: the site's
subject is the *Protestant translation conversation* — which English Bible a congregation
chooses, and why — and that doesn't apply the same way where the translation is fixed by the
bishops (Catholic/Orthodox) or where the church is outside the Nicene boundary (Oneness). The
in-depth translation profiles are all Protestant anyway — and the same day they were expanded
from 9 to 13 (added NRSVue, CEB, EHV, AMP); EHV was then cut 2026-09-07 (weak constituency, absent
from the translation-comparison genre — see the `translationOptions` note above), leaving 12.
(`translationOptions` matches, except it lists "NRSV" where the profile is "NRSVue" — deliberate,
see that note.) Consequences of the narrowing: the
table dropped from ~377K to ~348K rows, translation coverage from ~8.5 % to ~2.8 % (NABRE was
70 % of it), and the "Catholic, Orthodox, Protestant" copy on `/church-finder` (both the visible
line and the page metadata) became "Protestant". `denominationOptions` 34 → 30 (dropped
`catholic_church`, `orthodox_church`, `oriental_orthodox_church`, `oneness_apostolic_church`);
`translationOptions` 16 → 13 (dropped NABRE, OSB, Douay-Rheims — then the same day the four new
profiles were added, keeping it at 13; EHV cut 2026-09-07 → 12). Rollback for the ~29,700-row
delete: `sync_archive.archive_removed_nonprotestant_2026_09_06` (migration
`remove_catholic_orthodox_oneness`).

**Still Protestant-adjacent but borderline, left in:** Churches of Christ / Disciples (Stone–
Campbell — non-creedal, "just Christian"), Quaker (liberal meetings are barely creedal), and
Seventh-day Adventist (idiosyncratic, sabbatarian). All three descend from the Protestant world
and affirm the three-part test in principle; audit if the line ever tightens further. The
classifier (`add-refined-category-column.js`) still *classifies* Catholic/Orthodox/Oneness
names so a CSV regeneration can identify and delete them — but a regeneration must run that
delete step (there is no live removal script; the CSV is a stale, lossy path anyway).

**Bible verse comparison dataset** (`data/verseComparisonList.json`, `data/verseComparisons.json`,
`scripts/fetchVerseComparisons.mjs` / `retryFailedVerses.mjs`): 502 verses with fetched KJV/NET
text — a **separate** dataset from `/verses`, prepared for a future page, not read by anything
in the app yet. These scripts are the only remaining code that can use `ESV_API_KEY` /
`API_BIBLE_KEY`, and only to extend this dataset. It was fetched with the *old* normalization
(quote-stripping etc.), so if a page ever renders it, regenerate it with `scripts/verse-clean.mjs`
first and re-check counts against the publisher limits (502 verses is at the ESV/NIV/NLT ceiling —
see [[project_bible_guide_noncommercial]]).

## Environment variables

The app needs only the two Supabase vars. No Bible-API keys — `/verses` text is cached
(`data/cachedVerses.json`).

`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are required for the Church
Finder to actually query data (without them it shows a "not configured" notice instead of
crashing). Both are safe to expose to the browser — the anon key is read-only via RLS.
Vercel env var changes require a manual redeploy to take effect (Deployments tab → ⋯ →
Redeploy) - saving them in the dashboard alone does not rebuild the site.
