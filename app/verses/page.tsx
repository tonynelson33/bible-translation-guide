import type { Metadata } from "next";
import VersePicker from "@/components/VersePicker";
import VerseCard from "@/components/VerseCard";
import { sampleVerses, translations, getSampleVerse } from "@/lib/data";
import { fetchVerseForTranslation } from "@/lib/verseProviders";

export const metadata: Metadata = {
  title: "Sample Verse Comparison",
  alternates: { canonical: "/verses" },
};

// This page compares a fixed set of sample verses (data/verses.json), so their
// text for every translation is stored in data/cachedVerses.json rather than
// fetched from a live API — each translation's handful of verses is well within
// its publisher's free-quotation allowance for this non-commercial site, with
// the required attribution alongside. See data/cachedVerses.README.md.

export default function VersesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const requestedId = typeof searchParams.verse === "string" ? searchParams.verse : undefined;
  const verse = (requestedId && getSampleVerse(requestedId)) || sampleVerses[0];

  const results = translations.map((t) => fetchVerseForTranslation(t, verse));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-3xl">
        <h1 className="font-serif text-3xl font-semibold text-brand-900 sm:text-4xl">
          Sample Verse Comparison
        </h1>
        <p className="mt-3 text-neutral-600">
          Pick a well-known verse and see how each translation renders it, side by side.
        </p>
      </div>

      <div className="mb-8">
        <VersePicker verses={sampleVerses} selectedId={verse.id} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {translations.map((t) => {
          const result = results.find((r) => r.translationId === t.id)!;
          return <VerseCard key={t.id} translation={t} result={result} />;
        })}
      </div>

      <p className="mt-8 max-w-3xl text-xs leading-snug text-neutral-400">
        Each translation is quoted here under its publisher&apos;s permissions for
        non-commercial use, with the required copyright notice shown beneath the text.
      </p>
    </div>
  );
}
