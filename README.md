# BibleTranslationGuide

A comparison site for thirteen widely used English Bible translations — CSB, ESV, KJV, NIV, NLT,
LSB, NKJV, NASB, NET, NRSV, CEB, EHV, and AMP. Built with Next.js (App Router) and Tailwind CSS.
The comparison data lives in static JSON files in `data/`; the Church Finder (`/church-finder`)
is backed by a Supabase Postgres database.

## Pages

- `/` — sortable comparison table (translations x editorial/textual attributes)
- `/verses` — pick a well-known verse and see it rendered side-by-side across all thirteen
  translations (text is cached in `data/cachedVerses.json`, not fetched live)
- `/translations/[slug]` — a full profile page per translation
- `/rankings` — criteria-based rankings across seven categories
- `/church-finder` — search ~348,000 U.S. Protestant churches by name / denomination / location
- `/blog` (nav label "Videos"), `/differences`, `/buy` — supporting content pages

## Getting started

Requires Node.js 18.18+ (LTS recommended) and npm.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Verse text sources (`/verses`)

`/verses` compares a **fixed** set of five sample verses (`data/verses.json`), so the text for
each translation is **cached, not fetched live** — `data/cachedVerses.json` holds the verse text
plus the publisher's required attribution for all thirteen translations, and
`lib/verseProviders.ts` is a plain synchronous lookup (no API keys, no network). Five verses per
translation is well inside every publisher's quote-without-permission allowance on this
non-commercial site. See `data/cachedVerses.README.md` for how each translation's text was
sourced and the fidelity rules for editing it.

## Environment

Copy `.env.example` to `.env.local`. The only variables the app uses are
`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (for the Church Finder — without
them that page shows a setup notice instead of crashing). No Bible-API keys are needed.

## Data

`data/translations.json` holds every field shown in the comparison table. Fields marked with a
`verifyFields` entry (shown with a † in the table) were filled in from publisher preface/copyright
pages as of mid-2026 but should be manually reconfirmed before launch — see the footer note on the
home page.

## Deploying to Vercel (free tier)

1. Push this repo to GitHub (see below).
2. In Vercel, "Add New Project" → import the GitHub repo → framework preset "Next.js" (auto-
   detected) → Deploy. No paid add-ons are required.
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` under Project Settings →
   Environment Variables (before or after the first deploy), then redeploy so the Church Finder
   can query data.
4. Once ready, connect the `bibletranslationguide.com` domain under Project Settings → Domains.

## Pushing to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```
