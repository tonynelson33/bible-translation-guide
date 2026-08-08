# BibleTranslationGuide

A comparison site for nine widely used English Bible translations — ESV, KJV, NIV, NLT, CSB,
LSB, NKJV, NASB, and NET. Built with Next.js (App Router) and Tailwind CSS. No database — all
comparison data lives in static JSON files in `data/`.

## Pages

- `/` — sortable comparison table (translations x editorial/textual attributes)
- `/verses` — pick a well-known verse and see it rendered side-by-side across all nine
  translations, fetched live from each translation's Bible text API
- `/translations/[slug]` — placeholder profile page per translation
- `/rankings`, `/blog`, `/church-finder`, `/buy` — placeholder pages

## Getting started

Requires Node.js 18.18+ (LTS recommended) and npm.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Verse text sources (`/verses`)

Scripture text is **never** hardcoded — it's fetched at request time from each translation's own
API, per `lib/verseProviders.ts`:

| Translation | Source | API key needed? |
|---|---|---|
| KJV | [bible-api.com](https://bible-api.com) | No — public domain |
| ESV | [api.esv.org](https://api.esv.org) (Crossway) | Yes — free, non-commercial (`ESV_API_KEY`) |
| NET | [labs.bible.org](https://labs.bible.org/api_web_service) | No |
| NIV, NASB, CSB | [scripture.api.bible](https://scripture.api.bible) | Yes — free Starter plan (`API_BIBLE_KEY`) |
| NLT, NKJV | Configured for scripture.api.bible, but no Bible ID confirmed yet on the free plan | — |
| LSB | **No known free public API as of mid-2026** | — |

Important limitation: scripture.api.bible's free Starter plan only allows **3 copyrighted
translations active at once** on your account. This project defaults to NIV, NASB, and CSB. If
you'd rather have NLT or NKJV live instead, look up the current Bible ID for that translation via
`GET /v1/bibles` on your own api.bible account, add it to the corresponding entry's `apiBibleId`
in `data/translations.json`, and drop one of the other three.

If a translation's key/ID isn't configured, its card on `/verses` shows "Text unavailable" with
an explanation instead of failing — the page always renders for all nine translations.

Copy `.env.example` to `.env.local` and fill in whichever keys you have. All are optional; the
site builds and runs fine with none of them set.

## Data

`data/translations.json` holds every field shown in the comparison table. Fields marked with a
`verifyFields` entry (shown with a † in the table) were filled in from publisher preface/copyright
pages as of mid-2026 but should be manually reconfirmed before launch — see the footer note on the
home page.

## Deploying to Vercel (free tier)

1. Push this repo to GitHub (see below).
2. In Vercel, "Add New Project" → import the GitHub repo → framework preset "Next.js" (auto-
   detected) → Deploy. No paid add-ons are required.
3. If you have any of the API keys above, add them under Project Settings → Environment Variables
   before or after the first deploy, then redeploy.
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
