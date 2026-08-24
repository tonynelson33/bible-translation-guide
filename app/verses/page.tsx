import type { Metadata } from "next";
import VersePicker from "@/components/VersePicker";
import VerseCard from "@/components/VerseCard";
import { sampleVerses, translations, getSampleVerse } from "@/lib/data";
import { fetchVerseForTranslation } from "@/lib/verseProviders";

export const metadata: Metadata = {
  title: "Sample Verse Comparison",
  alternates: { canonical: "/verses" },
};

// Verse text is fetched live from external Bible APIs on each request, per
// translation:
//   - KJV  -> bible-api.com (public domain, no key needed)
//   - ESV  -> api.esv.org (needs a free ESV_API_KEY env var)
//   - NET  -> labs.bible.org (free, no key needed)
//   - NIV, NASB, CSB -> scripture.api.bible (needs a free API_BIBLE_KEY env
//     var; the free Starter plan only allows 3 copyrighted translations
//     active at once, so only pick the ones you've actually enabled)
//   - NLT, NKJV -> configured for scripture.api.bible but no Bible ID has
//     been confirmed yet for the free plan; add one via lib/types.ts /
//     data/translations.json once verified
//   - LSB -> no known free public API as of mid-2026; needs manual sourcing
// See lib/verseProviders.ts for the fetch logic and README.md for setup.

export default async function VersesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const requestedId = typeof searchParams.verse === "string" ? searchParams.verse : undefined;
  const verse = (requestedId && getSampleVerse(requestedId)) || sampleVerses[0];

  const results = await Promise.all(
    translations.map((t) => fetchVerseForTranslation(t, verse))
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-3xl">
        <h1 className="font-serif text-3xl font-semibold text-brand-900 sm:text-4xl">
          Sample Verse Comparison
        </h1>
        <p className="mt-3 text-neutral-600">
          Pick a well-known verse and see how each translation renders it, fetched live from
          each publisher&apos;s or aggregator&apos;s Bible text API.
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

      <p className="mt-8 max-w-3xl text-sm text-neutral-500">
        Some translations require a free API key to be configured in this deployment&apos;s
        environment variables before their text will appear here — see the project README for
        setup instructions.
      </p>
    </div>
  );
}
