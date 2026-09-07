import type { Metadata } from "next";
import Link from "next/link";
import VersePicker from "@/components/VersePicker";
import { sampleVerses, translations, getSampleVerse } from "@/lib/data";
import { rankingCategories } from "@/lib/rankings";
import { fetchVerseForTranslation } from "@/lib/verseProviders";

export const metadata: Metadata = {
  title: "Sample Verse Comparison",
  alternates: { canonical: "/verses" },
};

// This page compares a fixed set of sample verses (data/verses.json), so their
// text for every translation is stored in data/cachedVerses.json rather than
// fetched from a live API — each translation's handful of verses is well within
// its publisher's free-quotation allowance for this non-commercial site, with
// the required attribution shown on the page. See data/cachedVerses.README.md.

// One column, most literal at the top to freest at the bottom, so neighbouring
// rows are the translations most alike — makes the word choices easy to scan.
// Order is taken from the "Most Literal" ranking (lib/rankings.ts).
const literalOrder =
  rankingCategories.find((c) => c.slug === "literal")?.entries.map((e) => e.id) ?? [];

const orderedTranslations = [...translations].sort(
  (a, b) => literalOrder.indexOf(a.id) - literalOrder.indexOf(b.id),
);

export default function VersesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const requestedId = typeof searchParams.verse === "string" ? searchParams.verse : undefined;
  const verse = (requestedId && getSampleVerse(requestedId)) || sampleVerses[0];

  const rows = orderedTranslations.map((t) => ({
    translation: t,
    result: fetchVerseForTranslation(t, verse),
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold text-brand-900 sm:text-4xl">
          Sample Verse Comparison
        </h1>
        <p className="mt-3 text-neutral-600">
          Pick a verse and read down the list. It runs most literal at the top to freest at the
          bottom, so the rows closest together are the ones most alike.
        </p>
      </div>

      <div className="mb-8">
        <VersePicker verses={sampleVerses} selectedId={verse.id} />
      </div>

      <div className="divide-y divide-neutral-200 border-y border-neutral-200">
        {rows.map(({ translation: t, result }) => (
          <div key={t.id} className="py-4 sm:grid sm:grid-cols-[4rem_1fr] sm:gap-x-6">
            <Link
              href={`/translations/${t.id}`}
              title={t.name}
              className="text-sm font-semibold text-brand-800 hover:underline sm:pt-1"
            >
              {t.abbreviation}
            </Link>
            {result.status === "ok" && result.text ? (
              <p className="mt-1 font-serif text-lg leading-relaxed text-neutral-800 sm:mt-0">
                {result.text}
              </p>
            ) : (
              <p className="mt-1 text-sm text-neutral-500 sm:mt-0 sm:pt-1">
                Text unavailable{result.message ? ` — ${result.message}` : ""}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-1 text-xs leading-snug text-neutral-400">
        <p>
          Each translation is quoted under its publisher&apos;s permissions for non-commercial
          use, with the required copyright notice below.
        </p>
        {rows
          .filter(({ result }) => result.status === "ok" && result.attribution)
          .map(({ translation: t, result }) => (
            <p key={t.id}>
              <span className="font-semibold">{t.abbreviation}:</span> {result.attribution}
            </p>
          ))}
      </div>
    </div>
  );
}
