import type { Metadata } from "next";
import Link from "next/link";
import TranslationSpectrum from "@/components/TranslationSpectrum";
import SpectrumStrip from "@/components/SpectrumStrip";
import { translations } from "@/lib/data";
import { philosophyGlossary } from "@/lib/glossary";
import { rankingCategories } from "@/lib/rankings";

export const metadata: Metadata = {
  title: "Compare Bible Translations",
  description:
    "There's no single best English Bible translation — it depends on why you're reading. Compare twelve major translations on how literally they render the original, how they read, where their text comes from, and who each one might be best for.",
  alternates: { canonical: "/" },
};

// The twelve, ordered most literal to most readable — the same order as the
// spectrum, so the two sections echo each other.
const literalOrder =
  rankingCategories.find((c) => c.slug === "literal")?.entries.map((e) => e.id) ?? [];
const orderedTranslations = [...translations].sort(
  (a, b) => literalOrder.indexOf(a.id) - literalOrder.indexOf(b.id),
);

const entryCards = [
  {
    href: "/compare",
    title: "Compare all twelve",
    body: "The full table — philosophy, reading level, textual basis, publisher, and more, sortable by any column.",
  },
  {
    href: "/verses",
    title: "Read a verse in every version",
    body: "Pick a popular passage and read all twelve side by side, ordered word-for-word to thought-for-thought.",
  },
  {
    href: "/church-finder",
    title: "Find your church",
    body: "Look up a U.S. church, and help us by updating its denomination and translation. For most churches, the pulpit translation isn't known yet.",
  },
  {
    href: "/faq",
    title: "Common questions",
    body: "What “accurate” means, why there are so many, what the manuscripts are, what changed since the KJV.",
  },
];

export default function HomePage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="mx-auto max-w-3xl pt-14 pb-4 sm:pt-20">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gild-700">
          English Bible Translations
        </p>
        <h1 className="mt-4 font-display text-4xl font-medium leading-[1.1] text-brand-900 sm:text-5xl">
          Which Bible translation should you read?
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-neutral-700">
          There&rsquo;s no single best answer &mdash; it depends on why you&rsquo;re reading. This
          site lays out twelve major English translations: how literally each renders the original,
          how it reads, where its text comes from, and who it might be best for.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/compare"
            className="rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
          >
            Compare the translations
          </Link>
          <Link
            href="/church-finder"
            className="rounded-lg border border-gild-300 bg-gild-50 px-5 py-2.5 text-sm font-semibold text-gild-800 transition-colors hover:bg-gild-100"
          >
            Find your church
          </Link>
        </div>
      </section>

      {/* Philosophy band — decorative restatement of the spectrum */}
      <section className="mx-auto mt-10 max-w-3xl">
        <SpectrumStrip className="h-2" />
        <div className="mt-1.5 flex justify-between text-xs text-neutral-500">
          <span>word-for-word</span>
          <span>thought-for-thought</span>
        </div>
      </section>

      {/* Entry cards */}
      <section className="mx-auto mt-12 max-w-3xl">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {entryCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-xl border border-neutral-200 bg-white p-5 transition-colors hover:border-gild-300 hover:bg-gild-50/40"
            >
              <h2 className="font-display text-lg font-semibold text-brand-900">
                {card.title}
                <span
                  aria-hidden="true"
                  className="ml-1 inline-block text-gild-600 transition-transform group-hover:translate-x-0.5"
                >
                  &rarr;
                </span>
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">{card.body}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Spectrum */}
      <section className="mx-auto mt-16 max-w-4xl border-t border-neutral-200 pt-10">
        <h2 className="font-display text-2xl font-semibold text-brand-900">Where each one lands</h2>
        <p className="mt-2 max-w-2xl text-neutral-700">
          Translations sit on a spectrum from word-for-word to thought-for-thought. It&rsquo;s a
          choice of method, not a measure of quality &mdash; every translation here is a serious work
          by a scholarly committee.
        </p>
        <TranslationSpectrum standalone />
        <Link
          href="/rankings"
          className="mt-4 inline-block text-sm font-medium text-brand-700 hover:underline"
        >
          See the full rankings, by purpose &rarr;
        </Link>
      </section>

      {/* The twelve */}
      <section className="mx-auto mt-16 max-w-3xl border-t border-neutral-200 pt-10">
        <h2 className="font-display text-2xl font-semibold text-brand-900">The twelve</h2>
        <p className="mt-2 text-neutral-700">
          Ordered word-for-word to thought-for-thought, like the spectrum above &mdash; read down
          the left column, then the right. Open any one for a full profile.
        </p>
        <ul className="mt-6 sm:columns-2 sm:gap-3">
          {orderedTranslations.map((t) => (
            <li key={t.id} className="mb-3 break-inside-avoid">
              <Link
                href={`/translations/${t.id}`}
                className="flex w-full items-baseline gap-3 rounded-lg border border-neutral-200 bg-white px-4 py-3 transition-colors hover:border-gild-300 hover:bg-gild-50/40"
              >
                <span className="flex-shrink-0 font-display text-lg font-semibold text-brand-900">
                  {t.abbreviation}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm text-neutral-600">{t.name}</span>
                <span
                  className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${philosophyGlossary[t.philosophy].className}`}
                >
                  {t.philosophy}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Closing */}
      <section className="mx-auto mt-16 max-w-3xl border-t border-neutral-200 py-10">
        <p className="text-sm leading-relaxed text-neutral-500">
          BibleTranslationGuide is a non-commercial project with no affiliation to any publisher. It
          covers the 66-book Protestant canon and the translations most used in Protestant churches.
          For the questions behind all of this &mdash; the manuscripts, the KJV, why the wording
          changes &mdash; see{" "}
          <Link href="/faq" className="font-medium text-brand-700 hover:underline">
            the FAQ
          </Link>{" "}
          and{" "}
          <Link href="/differences" className="font-medium text-brand-700 hover:underline">
            translation differences
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
