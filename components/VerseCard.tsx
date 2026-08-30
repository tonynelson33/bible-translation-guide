import Link from "next/link";
import type { Translation } from "@/lib/types";
import type { VerseFetchResult } from "@/lib/verseProviders";

export default function VerseCard({
  translation,
  result,
}: {
  translation: Translation;
  result: VerseFetchResult;
}) {
  return (
    <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-5">
      <div className="mb-3 flex items-baseline justify-between">
        <Link href={`/translations/${translation.id}`} className="font-semibold text-brand-800 hover:underline">
          {translation.abbreviation}
        </Link>
        <span className="text-xs text-neutral-400">{translation.name}</span>
      </div>

      {result.status === "ok" && result.text ? (
        <>
          {/* text is reproduced exactly as the publisher's source returns it —
              no quote marks are added here (the source keeps its own) */}
          <p className="font-serif text-lg leading-relaxed text-neutral-800">{result.text}</p>
          {result.attribution && (
            <p className="mt-3 text-xs leading-snug text-neutral-400">{result.attribution}</p>
          )}
        </>
      ) : (
        <div className="rounded-md bg-neutral-50 px-3 py-3 text-sm text-neutral-500">
          <p className="font-medium text-neutral-600">Text unavailable</p>
          <p className="mt-1">{result.message}</p>
        </div>
      )}
    </div>
  );
}
