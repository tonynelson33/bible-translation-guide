import type { Church } from "@/lib/churches";
import { humanizeCategory } from "@/lib/churches";
import Tooltip from "./Tooltip";
import SuggestCorrectionForm from "./SuggestCorrectionForm";

export default function ChurchResultCard({ church }: { church: Church }) {
  return (
    <li className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-brand-900">{church.name}</p>
          <p className="text-sm text-neutral-600">
            {church.address}, {church.locality}, {church.region}
            {church.zip ? ` ${church.zip}` : ""}
          </p>
        </div>
        <span className="inline-block whitespace-nowrap rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-700">
          {humanizeCategory(church.category)}
        </span>
      </div>

      <div className="mt-3 border-t border-neutral-100 pt-3 text-sm">
        <span className="font-medium text-neutral-500">Bible translation: </span>
        {church.bibleTranslation ? (
          church.bibleTranslationNotes ? (
            <Tooltip text={church.bibleTranslationNotes}>
              <span className="cursor-help underline decoration-dotted underline-offset-2 font-semibold text-brand-800">
                {church.bibleTranslation}
              </span>
            </Tooltip>
          ) : (
            <span className="font-semibold text-brand-800">{church.bibleTranslation}</span>
          )
        ) : (
          <span className="italic text-neutral-400">Not yet confirmed</span>
        )}
      </div>

      <SuggestCorrectionForm church={church} />
    </li>
  );
}
