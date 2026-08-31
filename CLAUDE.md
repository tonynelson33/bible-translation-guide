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

**Sample verses** (`/verses` page, and the sample-verse block on translation-profile pages):
`/verses` compares a **fixed** set of 5 sample verses (`data/verses.json`), so their text is
**cached, not fetched live**. `data/cachedVerses.json` holds `{ [translationId]: { attribution,
verses: { [reference]: text } } }` for all 9 translations, and `lib/verseProviders.ts`'s
`fetchVerseForTranslation` is a plain synchronous lookup — no API keys, no rate limits, no
network. A translation with no entry for a verse returns `status: "unavailable"` (renders as a
"Text unavailable" card via `components/VerseCard.tsx`), never throws.

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

**Placeholder pages** (`/rankings`, `/buy`, `/translations/[slug]`) all render the shared
`components/ComingSoon.tsx` — real content/logic is intentionally not built yet.
`/church-finder` is NOT a placeholder — it's a real, working feature (below).

**`/blog`** (nav + footer label "Videos") is a curated library of ~10 embedded YouTube videos
on translation history, philosophy, Textus Receptus vs. Critical Text, gender language, and
choosing a Bible — two tiers ("Start here" / "Go deeper"). Static server component, video list
inlined in `app/blog/page.tsx`. Embeds use `youtube-nocookie.com` (no cookies until play) and
`loading="lazy"`. The route stayed `/blog` to avoid churning nav/footer/sitemap. Videos were
picked to be instructive and non-polemical and to represent both the Critical Text and
Majority/Byzantine (KJV-underlying) text positions; re-check embeds periodically since uploads
get pulled or have embedding disabled.

**Why Translations Differ** (`/differences`, nav label "Differences"): the 84 verses where
translations most visibly disagree (from `data/verseComparisonList.json`, category "Translation
Difference" — 85 minus Leviticus 6:25, which reads the same in KJV and ESV and was dropped
2026-08 from the JSON *and the source xlsx*). Grouped into **Part 1 — Manuscript Differences**
(Textus Receptus / Byzantine vs. critical text; Masoretic OT vs. Septuagint / Dead Sea Scrolls)
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

**Church Finder** (`/church-finder`): search ~350,000 U.S. churches by church name, denomination,
city+state, or zip, showing each one's confirmed Bible translation where known. Backed by a Supabase Postgres
project (`churches` table, ~349,700 rows — US only, and non-congregations (parsonages,
rectories, cemeteries, schools/daycares, camps/retreats, bookstores) removed 2026-08-30 — with
33 distinct `category` values: `church_cathedral` plus all 32 dropdown categories, every one of
which now has rows; RLS enabled with a public SELECT-only
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

Only ~6% of churches have a confirmed `bible_translation` so far (~21,500 rows — ~19,600
Catholic → NABRE, ~1,800 mainline → NRSV, the rest per-church research) — this is inherently a
long-tail research problem (see "Church data pipeline" below), not a bug. Most results
correctly show "Not identified" for the translation (same label the result card and the
breakdown tables use for an unknown denomination or translation).

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
fixed 32-entry US master taxonomy (NOT a mirror of `churches.category`; see "Denomination
taxonomy" below), and `translationOptions` covers the 9 this site profiles plus 13 more,
since a church may use one this site doesn't. The list is scoped to translations a
meaningful number of US congregations actually use *from the pulpit / in worship*:
- `NRSV` and `NRSVue` are both listed — NRSV is still the lectionary Bible in most Episcopal /
  ELCA / PC(USA) / UMC / UCC / Disciples parishes; NRSVue (2021) is the successor most haven't
  physically adopted. (`NRSV` was briefly excluded as "superseded" — that was wrong.)
- `EHV` (Evangelical Heritage Version) is listed for WELS Lutherans — the one big Lutheran body
  with no other correct option (LCMS→ESV, ELCA→NRSV are both covered).
- Deliberately excluded: editions genuinely out of print (HCSB→CSB, NAB→NABRE, JB→NJB,
  TLB→NLT), study/personal Bibles that aren't pulpit translations (AMP is a borderline legacy
  entry; RSV-2CE, Darby), and paraphrases (MSG, TPT, The Voice, NIrV, The Clear Word). ASV is
  out too — even Churches of Christ have moved to NKJV/ESV.

Every submission lands with `status = 'pending'`;
there's no admin UI for review yet, so review/merge into `churches` happens by hand via the
Supabase dashboard's Table Editor.

The home page (`app/page.tsx` callout) and site footer (`components/SiteFooter.tsx`, "Add your
church →") both link into `/church-finder` specifically to drive these submissions — without
that the feature is buried and users don't know they can correct their own church's entry.

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
`components/CountTable.tsx`. `/church-finder` is a 3-column layout (`lg:flex-row`):
Denominations table on the left, Bible Translations table on the right, and the search form +
results + `AddChurchForm` in the middle. On mobile the columns stack search-first, then the two
tables (explicit `order-1/2/3` + `lg:order-*` — `order-first` was unreliable). Both views are created
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
  - `catholic_church` → NABRE (~19,600 rows; USCCB Lectionary for Mass) — via
    `fill-denominational-translations.js`.
  - `disciples_of_christ_church` → NRSV (~137) and `congregational_church` rows whose *name*
    says "United Church of Christ" → NRSV (~1,580) — mainline bodies, NRSV in their worship
    resources. Disciples is in `fill-denominational-translations.js`; the UCC-by-name rule was
    applied straight against Supabase (it keys off the name, not `refined_category`) and is
    only documented in that script's header. Bare-"Congregational Church" rows were left alone
    (a real minority are CCCC / NACCC, not UCC).
  - The old `episcopal_church` → NRSV rule was **removed** — that bucket became
    `anglican_episcopal_church` (mixed: TEC uses NRSV, ACNA / Continuing Anglican don't). Its
    leftover values — ~1,822 African Methodist Episcopal rows the classifier had mis-bucketed
    as `episcopal_church`, plus ~86 real Anglican/Episcopal rows — were **cleared to NULL**
    against Supabase in 2026-08. LDS / Christian Science (both KJV) went out with their rows.
  - ~71 `NRSV` rows on `presbyterian_church` / `lutheran_church` are per-church research (PC(USA)
    / ELCA confirmed individually), not a bulk default — left as-is.
- **Per-church research** (`add-translation-column.js`, `KNOWN_TRANSLATIONS` map): for
  denominations split across sub-bodies with different standards - e.g. Lutheran (LCMS→ESV,
  ELCA→NRSV, WELS→EHV, but LCMC/NALC/ELS have no official stance) and Presbyterian (PC(USA)→NRSV,
  but PCA/OPC/ECO/Cumberland don't). ~100 churches done this way as of this writing (25 LCMS→ESV,
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

`denominationOptions` is a **fixed 32-entry US master taxonomy**, not a projection of what's in
the data. Several labels split or merge the underlying buckets:
- Where a label maps 1:1 onto a slug, `value` *is* that slug (so an edit suggestion merges
  without a translation step).
- Splits the source names *can* distinguish are real categories, populated by the classifier:
  `missionary_baptist_church`, `methodist_ame`, `oriental_orthodox_church`,
  `oneness_apostolic_church`, `bible_church` (added in the 2026-08 overhaul), plus
  `plymouth_brethren_church` (populated 2026-08-30 by a "Gospel Hall" pattern).
- `non_denominational` (101 rows as of 2026-08-30) is populated only by per-church verification,
  never a name pattern — a sample proved ~35-45% of generic-named "X Community Church" rows are
  quietly SBC / AG / EFCA / Converge / etc. See the overnight-grind log.
- **Merged 2026-08-30** (all empty or unenforceable by name): `church_of_god_holiness` +
  `church_of_god` → one "Church of God" (Anderson/Holiness vs Cleveland/Pentecostal is
  invisible in a bare "Church of God" name); the two `non_denominational*` tiers → one
  "Non-denominational".
- **Added 2026-08-30**: `evangelical_free_church` ("Evangelical Free Church (EFCA)", ~1,600
  congregations nationally, 461 rows so far) — populated by an "Evangelical Free" name pattern
  plus individually-researched "X Community Church" rows.

**Every category in the live data is now either `church_cathedral` ("Denomination not
identified") or a `denominationOptions` value** (33 distinct values live — `church_cathedral`
plus all 32 dropdown categories, every one now populated), so `humanizeCategory` just
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
Southern/Independent Baptist were never split — rarely spelled out in the name (~400 explicit
matches each against a 55K+ bucket), unlike Missionary Baptist. The historical "clears ~100+
name matches" bar still applies to any *new* catch-all category.

`AddChurchForm` used to carry a "For Christian churches only" scope note; it was removed 2026-08
(the "What churches are listed here?" `<details>` on the page already covers scope). If you ever
re-add a scope line, avoid "Bible-believing" — evangelical-Protestant terminology that would read
as excluding Catholic/Orthodox visitors, a large share of classified churches.

**The editorial line** (spelled out in the "What churches are listed here?" `<details>` on
`/church-finder`): the directory carries the historic Christian traditions — Catholic, Orthodox,
Protestant — and the working test for inclusion is *"Jesus Christ is God, and the Bible is God's
authoritative word."* That is deliberately **not** "affirms the Trinity / the Nicene creeds" —
that framing would contradict the `oneness_apostolic_church` dropdown category (Oneness
Pentecostals reject the Trinity by definition, ~4K churches) and doesn't fit the non-creedal
traditions (Churches of Christ, Disciples, Anabaptists, Quakers). The two-part test is what the
removals actually screened on: LDS, Jehovah's Witnesses, Christian Science, Unitarian
Universalism, and New Thought each fail the deity-of-Christ half and/or add another scripture;
Oneness Pentecostals pass both, so they stay. If someone later wants a strictly Trinitarian
scope, that's a real change — it means removing Oneness (and auditing Quaker / "Church of God").

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
