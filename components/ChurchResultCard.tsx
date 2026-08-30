import type { Church } from "@/lib/churches";
import { humanizeCategory } from "@/lib/churches";
import Tooltip from "./Tooltip";
import SuggestCorrectionForm from "./SuggestCorrectionForm";

export default function ChurchResultCard({ church }: { church: Church }) {
  return (
    <li className="rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5">
      <p className="font-semibold text-brand-900">{church.name}</p>
      <p className="text-sm text-neutral-600">
        {church.address}, {church.locality}, {church.region}
        {church.zip ? ` ${church.zip}` : ""}
      </p>

      <dl className="mt-1.5 text-sm">
        <div className="flex gap-1.5">
          <dt className="font-medium text-neutral-500">Denomination:</dt>
          <dd className="font-semibold text-neutral-900">{humanizeCategory(church.category)}</dd>
        </div>
        <div className="flex gap-1.5">
          <dt className="font-medium text-neutral-500">Translation:</dt>
          <dd>
            {church.bibleTranslation ? (
              church.bibleTranslationNotes ? (
                <Tooltip text={church.bibleTranslationNotes}>
                  <span className="cursor-help font-semibold text-brand-800 underline decoration-dotted underline-offset-2">
                    {church.bibleTranslation}
                  </span>
                </Tooltip>
              ) : (
                <span className="font-semibold text-brand-800">{church.bibleTranslation}</span>
              )
            ) : (
              <span className="text-neutral-500">Not yet confirmed</span>
            )}
          </dd>
        </div>
      </dl>

      <SuggestCorrectionForm church={church} />
    </li>
  );
}
