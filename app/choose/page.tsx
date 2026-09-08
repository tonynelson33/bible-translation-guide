import type { Metadata } from "next";
import Link from "next/link";
import { getTranslation } from "@/lib/data";
import { philosophyGlossary } from "@/lib/glossary";
import { scenarios } from "@/lib/chooseGuide";

export const metadata: Metadata = {
  title: "How to Choose a Translation",
  description:
    "A short, purpose-first guide to picking an English Bible translation — for close study, daily reading, reading aloud, memorization, a new reader, or as a bridge from the King James.",
  alternates: { canonical: "/choose" },
};

export default function ChoosePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold text-brand-900 sm:text-4xl">
        How to choose a translation
      </h1>
      <p className="mt-3 leading-relaxed text-neutral-700">
        There is no single best English Bible &mdash; the right one depends on what you&rsquo;re
        going to do with it. Find the row that sounds like you. Every pick here is a serious
        translation; the notes are about fit, not quality.
      </p>
      <p className="mt-3 leading-relaxed text-neutral-700">
        If you only take one thing away: for most people, <strong>a formal translation and a
        readable one, used together</strong>, beats agonizing over a single choice. The{" "}
        <Link href="/rankings" className="font-medium text-brand-700 hover:underline">
          rankings
        </Link>{" "}
        rank all twelve on each of these purposes in more detail.
      </p>

      <nav className="mt-6 rounded-lg border border-neutral-200 bg-white p-4 text-sm">
        <ul className="space-y-1">
          {scenarios.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="text-neutral-600 hover:text-brand-700 hover:underline"
              >
                Reading {s.situation}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-12 space-y-14">
        {scenarios.map((scenario) => (
          <section key={scenario.id} id={scenario.id} className="scroll-mt-20">
            <h2 className="font-display text-2xl font-semibold text-brand-900">
              Reading {scenario.situation}
            </h2>
            <p className="mt-2 leading-relaxed text-neutral-700">{scenario.lead}</p>

            <ol className="mt-5 space-y-3">
              {scenario.picks.map((pick, i) => {
                const t = getTranslation(pick.id);
                if (!t) return null;
                return (
                  <li
                    key={pick.id}
                    className="flex gap-4 rounded-lg border border-neutral-200 bg-white p-4"
                  >
                    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gild-100 text-sm font-semibold text-gild-800">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <Link
                          href={`/translations/${t.id}`}
                          className="font-display text-lg font-semibold text-brand-900 hover:underline"
                        >
                          {t.abbreviation}
                        </Link>
                        <span className="text-sm text-neutral-500">{t.name}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${philosophyGlossary[t.philosophy].className}`}
                        >
                          {t.philosophy}
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-neutral-700">{pick.why}</p>
                    </div>
                  </li>
                );
              })}
            </ol>

            {scenario.caveat && (
              <p className="mt-3 text-sm leading-relaxed text-neutral-500">{scenario.caveat}</p>
            )}
          </section>
        ))}
      </div>

      <div className="mt-14 rounded-lg border border-gild-200 bg-gild-50 px-5 py-4 text-sm leading-relaxed text-neutral-700">
        Next: read the{" "}
        <Link href="/compare" className="font-medium text-gild-700 hover:underline">
          full profile
        </Link>{" "}
        of anything on your shortlist, or{" "}
        <Link href="/verses" className="font-medium text-gild-700 hover:underline">
          compare a familiar verse
        </Link>{" "}
        across all twelve to hear how each one sounds.
      </div>
    </div>
  );
}
