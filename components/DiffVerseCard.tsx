import {
  type ShownVerse,
  TRANSLATION_LABEL,
  TRANSLATION_TAG,
  verseText,
} from "@/lib/translationDifferences";

export default function DiffVerseCard({
  verse,
  showTag,
}: {
  verse: ShownVerse;
  /** show the "Textus Receptus" / "Critical text" tag under each label (NT manuscript sections only) */
  showTag: boolean;
}) {
  return (
    <li className="rounded-lg border border-neutral-200 bg-white p-4 sm:p-5">
      <p className="font-serif text-lg font-semibold text-brand-900">{verse.reference}</p>

      <div className="mt-3 divide-y divide-neutral-100">
        {verse.show.map((id) => {
          const text = verseText(verse.reference, id);
          return (
            <div key={id} className="grid grid-cols-[4rem_1fr] gap-x-3 py-2 sm:grid-cols-[6rem_1fr]">
              <div className="text-right">
                <span className="text-sm font-semibold text-brand-800">{TRANSLATION_LABEL[id]}</span>
                {showTag && (
                  <span className="block text-[10px] uppercase tracking-wide text-neutral-400">
                    {TRANSLATION_TAG[id]}
                  </span>
                )}
              </div>
              {text ? (
                <p className="font-serif text-neutral-800">{text}</p>
              ) : (
                <p className="text-sm italic text-neutral-400">
                  — verse number skipped; text in a footnote —
                </p>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-3 border-t border-neutral-100 pt-3 text-sm text-neutral-600">{verse.note}</p>
    </li>
  );
}
