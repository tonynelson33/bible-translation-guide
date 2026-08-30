import { type ShownVerse, TRANSLATION_LABEL, verseText } from "@/lib/translationDifferences";

export default function DiffVerseCard({ verse }: { verse: ShownVerse }) {
  return (
    <li className="mb-4 break-inside-avoid">
      <p className="font-serif text-[15px] font-semibold text-brand-900">{verse.reference}</p>
      <dl className="mt-0.5">
        {verse.show.map((id) => {
          const text = verseText(verse.reference, id);
          return (
            <div key={id} className="flex gap-2 leading-snug">
              <dt className="w-10 shrink-0 pt-px text-right text-[11px] font-semibold uppercase tracking-wide text-brand-700">
                {TRANSLATION_LABEL[id]}
              </dt>
              <dd className="font-serif text-[15px] text-neutral-800">
                {text ?? <span className="text-neutral-400">— verse number skipped —</span>}
              </dd>
            </div>
          );
        })}
      </dl>
      <p className="mt-1 text-xs leading-snug text-neutral-500">{verse.note}</p>
    </li>
  );
}
