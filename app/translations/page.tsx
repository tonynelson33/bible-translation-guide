import type { Metadata } from "next";
import Link from "next/link";
import { translations } from "@/lib/data";
import { translationProfiles } from "@/lib/translationProfiles";
import { philosophyGlossary } from "@/lib/glossary";

export const metadata: Metadata = {
  title: "All Translations",
  description:
    "All twenty-six English Bible translations this site covers, in alphabetical order, with a one-sentence summary of each — tap any one for its full profile.",
  alternates: { canonical: "/translations" },
};

// Alphabetical by abbreviation, matching the nav dropdown and mobile menu — the
// spectrum order (word-for-word to thought-for-thought) already lives on the
// homepage and in the rankings, so this page is for finding one by name instead.
const sortedTranslations = [...translations].sort((a, b) =>
  a.abbreviation.localeCompare(b.abbreviation),
);

export default function TranslationsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold text-brand-900 sm:text-4xl">
        All twenty-six translations
      </h1>
      <p className="mt-3 leading-relaxed text-neutral-700">
        In alphabetical order, with a one-sentence summary of each, so you don&rsquo;t have to
        open all twenty-six to get the gist. Tap any one for its full profile &mdash; history,
        distinctives, who it&rsquo;s a good fit for, and a sample verse. Sorted word-for-word to
        thought-for-thought instead? See the{" "}
        <Link href="/compare" className="font-medium text-brand-700 hover:underline">
          full comparison
        </Link>{" "}
        or the{" "}
        <Link href="/rankings" className="font-medium text-brand-700 hover:underline">
          rankings
        </Link>
        .
      </p>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {sortedTranslations.map((t) => {
          const tagline = translationProfiles[t.id]?.tagline;
          return (
            <li key={t.id}>
              <Link
                href={`/translations/${t.id}`}
                className="flex h-full flex-col rounded-lg border border-neutral-200 bg-white p-4 transition-colors hover:border-gild-300 hover:bg-gild-50/40"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-display text-lg font-semibold text-brand-900">
                    {t.abbreviation}
                  </span>
                  <span
                    className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${philosophyGlossary[t.philosophy].className}`}
                  >
                    {t.philosophy}
                  </span>
                </div>
                {t.abbreviation !== t.name && (
                  <p className="mt-0.5 text-sm text-neutral-500">{t.name}</p>
                )}
                {tagline && (
                  <p className="mt-2 text-sm leading-relaxed text-neutral-700">{tagline}</p>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
