import type { Metadata } from "next";
import DiffVerseCard from "@/components/DiffVerseCard";
import {
  ATTRIBUTIONS,
  differenceParts,
  TOTAL_VERSES,
  TRANSLATION_LABEL,
  USED_TRANSLATIONS,
} from "@/lib/translationDifferences";

export const metadata: Metadata = {
  title: "Why Translations Differ",
  description:
    "The roughly 85 verses where English Bible translations most visibly disagree — bracketed verses, the Textus Receptus and the critical text, the Johannine Comma, 'virgin' vs 'young woman', and inclusive language — grouped and explained.",
  alternates: { canonical: "/differences" },
};

export default function DifferencesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <h1 className="font-serif text-3xl font-semibold text-brand-900 sm:text-4xl">
          Why translations differ
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600">
          Most of the Bible reads the same in every English translation. But in {TOTAL_VERSES}{" "}
          places the differences are visible enough that people notice — a verse in brackets, a
          footnote, a familiar phrase that&apos;s shorter than they remember. Those differences
          come from two things: which ancient copies a translation follows, and which English
          words the translators chose.
        </p>

        {/* table of contents */}
        <nav className="mt-5 rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm">
          {differenceParts.map((part) => (
            <div key={part.id} className="mb-3 last:mb-0">
              <a href={`#${part.id}`} className="font-semibold text-brand-800 hover:underline">
                {part.title}
              </a>
              <ol className="mt-1 space-y-0.5 pl-5 text-neutral-600">
                {part.sections.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="hover:text-brand-700 hover:underline">
                      {i + 1}) {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </nav>
      </div>

      {differenceParts.map((part) => (
        <section key={part.id} id={part.id} className="mt-10 scroll-mt-20">
          <h2 className="font-serif text-xl font-semibold text-brand-900">{part.title}</h2>
          <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-neutral-600">{part.intro}</p>

          {part.sections.map((section, sectionIndex) => (
            <div key={section.id} id={section.id} className="mt-7 scroll-mt-20">
              <h3 className="font-serif text-base font-semibold text-brand-900">
                {sectionIndex + 1}) {section.title}
              </h3>
              <p className="mt-1 max-w-3xl text-sm leading-relaxed text-neutral-500">
                {section.intro}
              </p>

              {section.shown && section.shown.length > 0 && (
                <ul className="mt-3 sm:columns-2 sm:gap-10 lg:gap-14">
                  {section.shown.map((v) => (
                    <DiffVerseCard key={v.reference} verse={v} />
                  ))}
                </ul>
              )}

              {section.referenced && section.referenced.length > 0 && (
                <dl className="mt-3 max-w-3xl text-sm leading-snug">
                  {section.referenced.map((r) => (
                    <div key={r.reference} className="mb-2">
                      <dt className="inline font-semibold text-brand-800">{r.reference} — </dt>
                      <dd className="inline text-neutral-600">{r.note}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          ))}
        </section>
      ))}

      <hr className="mt-10 border-neutral-200" />
      <div className="mt-5 max-w-3xl space-y-1 text-[11px] leading-snug text-neutral-400">
        <p>
          Verse text is quoted under each publisher&apos;s permissions for non-commercial use.
          Where a verse is only described rather than quoted, no translation&apos;s wording is
          reproduced.
        </p>
        {USED_TRANSLATIONS.map((id) => (
          <p key={id}>
            <span className="font-semibold">{TRANSLATION_LABEL[id]}:</span> {ATTRIBUTIONS[id]}
          </p>
        ))}
      </div>
    </div>
  );
}
