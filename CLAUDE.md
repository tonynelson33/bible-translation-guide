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

**Live verse fetching** (`/verses` page): Scripture text is fetched live, not hardcoded — with
one deliberate exception (LSB, see below). Each translation's `verseApi` config in
`data/translations.json` names a `provider`, and `lib/verseProviders.ts` has one adapter
function per provider:

- `bible-api` → bible-api.com (KJV; public domain, no key)
- `esv-api` → api.esv.org (needs `ESV_API_KEY` env var)
- `net-bible` → labs.bible.org (no key needed)
- `api-bible` → scripture.api.bible (needs `API_BIBLE_KEY` env var + a per-translation
  `apiBibleId`; the free Starter plan only allows 3 copyrighted translations active at once —
  currently configured for NIV, CSB, NASB)
- `cached` → currently just LSB. No public API exists, and read.lsbible.org isn't built for
  automated access (its search doesn't respond to scripted interaction, and direct requests to
  it get rate-limited). The 5 sample verses were instead sourced by hand — via a real browser
  session, not a scraper — from read.lsbible.org's `read-lsbible.vercel.app/ref-tagger?ref=`
  passage-lookup route, and are served from `data/lsbCachedVerses.json`. This is within
  Lockman's published permission to store up to 1,000 LSB verses electronically with
  attribution (see their Permission to Quote page), but only covers these 5 verses — anything
  else still shows "Text unavailable." Don't build an automated scraper against
  read.lsbible.org; if more LSB verses are needed later, source them by hand the same way, or
  reach out to Lockman/316 Publishing about an official source.
- `unavailable` → no known free source at all (currently none — every translation has at least
  a live API or a cached fallback)

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

**Church Finder** (`/church-finder`): search ~351,000 U.S. churches by city+state or zip,
showing each one's confirmed Bible translation where known. Backed by a Supabase Postgres
project (`churches` table, ~351K rows, RLS enabled with a public SELECT-only policy — the
`NEXT_PUBLIC_SUPABASE_ANON_KEY` exposed to the browser cannot write). `lib/supabase.ts` creates
the client (returns `null` if env vars are unset, so the page shows a setup notice instead of
crashing); `lib/churches.ts` has the search function and `humanizeCategory()` for turning
category slugs like `baptist_church` into display labels. `app/church-finder/page.tsx` follows
the same searchParams-driven Server Component pattern as `/verses`.

Only ~8% of churches have a confirmed `bible_translation` so far — this is inherently a
long-tail research problem (see "Church data pipeline" below), not a bug. Most results
correctly show "Not yet confirmed."

**Crowdsourced corrections**: since the `churches` table is public-SELECT-only (the anon key
can't write to it), user submissions go into a separate `church_suggestions` table instead —
RLS allows anon `insert` only, no `select`/`update`/`delete`, so submitters can't read anyone
else's suggestions and there's no way to write directly into `churches` from the browser.
`components/SuggestCorrectionForm.tsx` (inline on each `ChurchResultCard`, for editing an
existing church's denomination/translation) and `components/AddChurchForm.tsx` (on the page
itself, for a church not in the directory) both call helpers in `lib/churchSuggestions.ts`.
Dropdown options for both forms live in `lib/suggestionOptions.ts` — `denominationOptions` is a
fixed 33-entry US master taxonomy (NOT a mirror of `churches.category`; see "Denomination
taxonomy" below), and translations cover the 9 this site profiles plus ~14 more,
since a church may use one this site doesn't. Deliberately excludes translations either fully
superseded by a current edition already in the list (HCSB→CSB, NAB→NABRE, JB→NJB, TLB→NLT,
NRSV→NRSVue) or rarely an actual pulpit translation even where real use exists (ASV — now
essentially historical; MSG, NIrV, The Voice, NLV — devotional/children's/missions use, not
typically a church's primary pulpit Bible). Every submission lands with `status = 'pending'`;
there's no admin UI for review yet, so review/merge into `churches` happens by hand via the
Supabase dashboard's Table Editor.

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
`components/CountTable.tsx` side by side at the top of `/church-finder`. Both views are created
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
- **Bulk denominational defaults** (`fill-denominational-translations.js`): only Catholic
  (NABRE) now. LDS and Christian Science (both KJV) were dropped with those rows; Episcopal
  (NRSV) was dropped because `episcopal_church` merged into `anglican_episcopal_church`, which
  also holds ACNA / Continuing Anglican parishes (not NRSV). See "Denomination taxonomy" below.
- **Per-church research** (`add-translation-column.js`, `KNOWN_TRANSLATIONS` map): for
  denominations split across sub-bodies with different standards - e.g. Lutheran (LCMS→ESV,
  ELCA→NRSV, but WELS/LCMC/NALC/ELS have no official stance) and Presbyterian (PC(USA)→NRSV,
  but PCA/OPC/ECO/Cumberland don't). ~160 churches done this way as of this writing, via real
  web search per church (never guessed) - about 80-90% hit rate once the specific synod is
  confirmed via an official source (locator.lcms.org, pcusa.org, etc.). This is genuinely slow
  (one church at a time) and the ~351K total dwarfs what's been researched - continuing this is
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

`denominationOptions` is a **fixed 33-entry US master taxonomy**, not a projection of what's in
the data. Several labels split or merge the underlying buckets:
- Where a label maps 1:1 onto a slug, `value` *is* that slug (so an edit suggestion merges
  without a translation step).
- Splits the source names *can* distinguish are real categories, populated by the classifier:
  `missionary_baptist_church`, `methodist_ame`, `oriental_orthodox_church`,
  `oneness_apostolic_church`, `bible_church` (all added in the 2026-08 overhaul below).
- Splits the names *can't* distinguish carry a descriptive slug with zero rows until manual
  review populates it: `church_of_god_holiness`, `non_denominational` /
  `non_denominational_charismatic`, `plymouth_brethren_church`.

**Every category in the live data is now either `church_cathedral` ("Denomination not
identified") or a `denominationOptions` value**, so `humanizeCategory` just reads the label off
`denominationOptions` and the breakdown table mirrors the dropdown exactly. The 2026-08 overhaul
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
- **Removed entirely** (~9,200 rows, archived to `removed-rows-2026-08-28.csv`) — nothing that
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

`AddChurchForm` states "For Christian churches only" as a plain, low-key scope note; deliberately
avoids "Bible-believing" (evangelical-Protestant terminology that would read as excluding
Catholic/Orthodox visitors, a large share of classified churches).

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
