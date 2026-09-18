"use client";

import { useState } from "react";
import Link from "next/link";
import type { Translation } from "@/lib/types";
import type { VerseFetchResult } from "@/lib/verseProviders";

type Row = { translation: Translation; result: VerseFetchResult };

/**
 * The /verses comparison list, plus a checkbox panel above it for narrowing
 * which translations show — added once there were 26 rows to scroll through
 * and comparing "just these few" needed the rest out of the way. Client-only
 * (visibility is a viewing preference, not part of the page's URL/shareable
 * state, so it resets on reload rather than round-tripping through the
 * server); the verse itself is still chosen via VersePicker's own URL param.
 */
export default function VerseComparisonList({ rows }: { rows: Row[] }) {
  const [visible, setVisible] = useState<Set<string>>(() => new Set(rows.map((r) => r.translation.id)));

  const allOn = visible.size === rows.length;
  const someOn = visible.size > 0;

  function toggle(id: string) {
    setVisible((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setVisible(allOn ? new Set() : new Set(rows.map((r) => r.translation.id)));
  }

  const shownRows = rows.filter((r) => visible.has(r.translation.id));

  return (
    <>
      <div className="mb-6 rounded-lg border border-neutral-200 bg-white p-3">
        <label className="flex items-center gap-2 border-b border-neutral-100 pb-2 text-sm font-semibold text-neutral-700">
          <input
            type="checkbox"
            checked={allOn}
            ref={(el) => {
              if (el) el.indeterminate = someOn && !allOn;
            }}
            onChange={toggleAll}
            className="h-4 w-4 rounded border-neutral-300 text-brand-700 focus:ring-brand-600"
          />
          Show all ({visible.size}/{rows.length})
        </label>
        <div className="mt-2 grid grid-cols-3 gap-x-3 gap-y-1.5 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7">
          {rows.map(({ translation: t }) => (
            <label
              key={t.id}
              className="flex items-center gap-1.5 text-sm text-neutral-600 hover:text-neutral-900"
            >
              <input
                type="checkbox"
                checked={visible.has(t.id)}
                onChange={() => toggle(t.id)}
                className="h-3.5 w-3.5 rounded border-neutral-300 text-brand-700 focus:ring-brand-600"
              />
              {t.abbreviation}
            </label>
          ))}
        </div>
      </div>

      {shownRows.length === 0 ? (
        <p className="border-y border-neutral-200 py-6 text-center text-sm text-neutral-500">
          No translations selected — check at least one above to compare.
        </p>
      ) : (
        <div className="divide-y divide-neutral-100 border-y border-neutral-200">
          {shownRows.map(({ translation: t, result }) => (
            <div key={t.id} className="py-0.5 sm:grid sm:grid-cols-[3rem_1fr] sm:gap-x-3">
              <Link
                href={`/translations/${t.id}`}
                title={t.name}
                className="text-xs font-semibold text-brand-800 hover:underline"
              >
                {t.abbreviation}
              </Link>
              {result.status === "ok" && result.text ? (
                <p className="font-serif text-[13px] leading-tight text-neutral-800">{result.text}</p>
              ) : (
                <p className="text-xs text-neutral-500">
                  Text unavailable{result.message ? ` — ${result.message}` : ""}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
