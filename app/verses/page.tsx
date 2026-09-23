import type { Metadata } from "next";
import VerseComparisonList from "@/components/VerseComparisonList";
import { sampleVerses, translations, getSampleVerse } from "@/lib/data";
import { compareReferences } from "@/lib/bibleOrder";
import { rankingCategories } from "@/lib/rankings";
import { fetchVerseForTranslation } from "@/lib/verseProviders";

export const metadata: Metadata = {
  title: "Comparison of Popular Verses",
  description:
    "Read a well-known passage in all twenty-six English translations at once, lined up from word-for-word at the top to thought-for-thought at the bottom.",
  alternates: { canonical: "/verses" },
};

// This page compares a fixed set of sample verses (data/verses.json), so their
// text for every translation is stored in data/cachedVerses.json rather than
// fetched from a live API — each translation's handful of verses is well within
// its publisher's free-quotation allowance for this non-commercial site, with
// the required attribution shown on the page. See data/cachedVerses.README.md.

// One column, word-for-word at the top to thought-for-thought at the bottom, so
// neighbouring rows are the translations most alike — word choices easy to scan.
// Order is taken from the "Most Literal" ranking (lib/rankings.ts). A translation
// absent from that category (just The Message, a paraphrase) has no rank to
// inherit — indexOf(-1) would otherwise sort it first, not last, so it's pinned
// to the end instead.
const literalOrder =
  rankingCategories.find((c) => c.slug === "literal")?.entries.map((e) => e.id) ?? [];
const literalRank = (id: string) => {
  const i = literalOrder.indexOf(id);
  return i === -1 ? literalOrder.length : i;
};

const orderedTranslations = [...translations].sort(
  (a, b) => literalRank(a.id) - literalRank(b.id),
);

// The picker lists verses in Bible order (Genesis first); the page still
// opens on John 3:16 when no verse is chosen.
const versesInBibleOrder = [...sampleVerses].sort((a, b) =>
  compareReferences(a.reference, b.reference),
);
const defaultVerse = getSampleVerse("john-3-16") ?? versesInBibleOrder[0];

export default function VersesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const requestedId = typeof searchParams.verse === "string" ? searchParams.verse : undefined;
  const verse = (requestedId && getSampleVerse(requestedId)) || defaultVerse;

  const rows = orderedTranslations.map((t) => ({
    translation: t,
    result: fetchVerseForTranslation(t, verse),
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-brand-900 sm:text-4xl">
          Comparison of Popular Verses
        </h1>
        <p className="mt-3 max-w-2xl text-neutral-600">
          Pick a well-known passage and read down the list. It runs word-for-word at the top to
          thought-for-thought at the bottom, so the rows closest together are the ones most alike.
        </p>
      </div>

      <VerseComparisonList rows={rows} verses={versesInBibleOrder} selectedVerseId={verse.id} />

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
