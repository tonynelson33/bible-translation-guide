import type { Metadata } from "next";
import DiffVerseCard from "@/components/DiffVerseCard";
import {
  ATTRIBUTIONS,
  differenceParts,
  TOTAL_VERSES,
  TRANSLATION_LABEL,
  type TranslationId,
} from "@/lib/translationDifferences";

export const metadata: Metadata = {
  title: "Why Translations Differ",
  description:
    "The roughly 85 verses where English Bible translations most visibly disagree — bracketed verses, the Textus Receptus and the critical text, the Johannine Comma, 'virgin' vs 'young woman', and inclusive language — grouped and explained.",
  alternates: { canonical: "/differences" },
};

const ATTR_ORDER: TranslationId[] = ["kjv", "nkjv", "esv", "niv", "net"];

export default function DifferencesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-semibold text-brand-900 sm:text-4xl">
        Why translations differ
      </h1>
      <p className="mt-3 text-neutral-600">
        Most of the Bible reads the same in every English translation. But in about {TOTAL_VERSES}{" "}
        places the differences are visible enough that people notice — a verse in brackets, a
        footnote, a familiar phrase that&apos;s shorter than they remember. Those differences come
        from two things: which ancient copies a translation follows, and which English words the
        translators chose. This page walks through both.
      </p>

      {/* table of contents */}
      <nav className="mt-8 rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm">
        {differenceParts.map((part) => (
          <div key={part.id} className="mb-3 last:mb-0">
            <a href={`#${part.id}`} className="font-semibold text-brand-800 hover:underline">
              {part.title}
            </a>
            <ul className="mt-1 space-y-0.5 pl-4 text-neutral-600">
              {part.sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="hover:text-brand-700 hover:underline">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {differenceParts.map((part) => (
        <section key={part.id} id={part.id} className="mt-12 scroll-mt-20">
          <h2 className="font-serif text-2xl font-semibold text-brand-900">{part.title}</h2>
          <p className="mt-2 text-neutral-600">{part.intro}</p>

          {part.sections.map((section) => (
            <div key={section.id} id={section.id} className="mt-8 scroll-mt-20">
              <h3 className="font-serif text-xl font-semibold text-brand-900">{section.title}</h3>
              <p className="mt-2 text-sm text-neutral-600">{section.intro}</p>

              {section.shown && section.shown.length > 0 && (
                <ul className="mt-4 space-y-4">
                  {section.shown.map((v) => (
                    <DiffVerseCard key={v.reference} verse={v} />
                  ))}
                </ul>
              )}

              {section.referenced && section.referenced.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                    {section.shown?.length ? "Also in this group" : "The verses"}
                  </p>
                  <dl className="mt-2 space-y-2 text-sm">
                    {section.referenced.map((r) => (
                      <div key={r.reference}>
                        <dt className="font-semibold text-brand-800">{r.reference}</dt>
                        <dd className="text-neutral-600">{r.note}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          ))}
        </section>
      ))}

      <hr className="mt-12 border-neutral-200" />
      <div className="mt-6 space-y-1 text-xs leading-snug text-neutral-400">
        <p>
          Verse text is quoted under each publisher&apos;s permissions for non-commercial use.
          Where a verse is only described rather than quoted, no translation&apos;s wording is
          reproduced.
        </p>
        {ATTR_ORDER.map((id) => (
          <p key={id}>
            <span className="font-semibold">{TRANSLATION_LABEL[id]}:</span> {ATTRIBUTIONS[id]}
          </p>
        ))}
      </div>
    </div>
  );
}
