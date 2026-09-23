"use client";

import { useState } from "react";
import Link from "next/link";
import VersePicker from "@/components/VersePicker";
import Tooltip from "@/components/Tooltip";
import { philosophyGlossary, textOnlyClass } from "@/lib/glossary";
import type { SampleVerse } from "@/lib/data";
import type { Translation } from "@/lib/types";
import type { VerseFetchResult } from "@/lib/verseProviders";

type Row = { translation: Translation; result: VerseFetchResult };

const MIN_FONT_PX = 11;
const MAX_FONT_PX = 19;
const DEFAULT_FONT_PX = 15;
const FONT_STEP_PX = 2;

// The abbreviation link's own size — one step above its old flat text-xs
// default. It tracks increases to the verse text size 1:1 (so it keeps
// pace visually) but has a floor at its own default: dialing the verse
// text down shouldn't shrink the abbreviation past a legible size just
// because it's sitting next to smaller text.
const ABBR_DEFAULT_FONT_PX = 14;
const abbrFontPx = (fontPx: number) => ABBR_DEFAULT_FONT_PX + Math.max(0, fontPx - DEFAULT_FONT_PX);

/**
 * The /verses page's whole interactive body: the verse picker and text-size
 * controls in a left column, the checkbox panel for narrowing which
 * translations show to its right (added once there were 26 rows to scroll
 * through and comparing "just these few" needed the rest out of the way),
 * and the comparison rows full-width below both. VersePicker lives here
 * (rather than back in the server page) so it can sit in the same flex row
 * as the checkbox panel — they need to size against each other. Client-only
 * (visibility and text size are viewing preferences, not part of the page's
 * URL/shareable state, so they reset on reload rather than round-tripping
 * through the server); the verse itself is still chosen via VersePicker's
 * own URL param, which is why it's the one piece here backed by server data
 * (verses, selectedVerseId) rather than local state. The checkbox panel is
 * alphabetical by abbreviation (for finding one translation quickly) even
 * though the rows below stay in literal-to-freest order, like every other
 * list on the site.
 */
export default function VerseComparisonList({
  rows,
  verses,
  selectedVerseId,
}: {
  rows: Row[];
  verses: SampleVerse[];
  selectedVerseId: string;
}) {
  const [visible, setVisible] = useState<Set<string>>(() => new Set(rows.map((r) => r.translation.id)));
  const [fontPx, setFontPx] = useState(DEFAULT_FONT_PX);

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

  const pickerRows = [...rows].sort((a, b) =>
    a.translation.abbreviation.localeCompare(b.translation.abbreviation),
  );
  const shownRows = rows.filter((r) => visible.has(r.translation.id));

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
        <div className="lg:w-64 lg:shrink-0">
          <VersePicker verses={verses} selectedId={selectedVerseId} />
          <div className="mt-3 flex items-center gap-1.5">
            <span className="text-xs text-neutral-500">Text size</span>
            <button
              type="button"
              onClick={() => setFontPx((s) => Math.max(MIN_FONT_PX, s - FONT_STEP_PX))}
              disabled={fontPx <= MIN_FONT_PX}
              aria-label="Decrease verse text size"
              title="Decrease verse text size"
              className="rounded border border-neutral-300 px-1.5 py-0.5 text-xs font-semibold text-neutral-600 hover:border-neutral-400 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              A
            </button>
            <button
              type="button"
              onClick={() => setFontPx((s) => Math.min(MAX_FONT_PX, s + FONT_STEP_PX))}
              disabled={fontPx >= MAX_FONT_PX}
              aria-label="Increase verse text size"
              title="Increase verse text size"
              className="rounded border border-neutral-300 px-1.5 py-0.5 text-base font-semibold text-neutral-600 hover:border-neutral-400 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              A
            </button>
          </div>
        </div>

        <div className="min-w-0 flex-1 rounded-lg border border-neutral-200 bg-white p-3">
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
          <div className="mt-2 grid grid-cols-[repeat(auto-fill,minmax(82px,1fr))] gap-x-3 gap-y-1.5">
            {pickerRows.map(({ translation: t }) => (
              <Tooltip key={t.id} text={t.name} variant="light">
                <label className="flex items-center gap-1.5 text-sm text-neutral-600 hover:text-neutral-900">
                  <input
                    type="checkbox"
                    checked={visible.has(t.id)}
                    onChange={() => toggle(t.id)}
                    className="h-3.5 w-3.5 rounded border-neutral-300 text-brand-700 focus:ring-brand-600"
                  />
                  {t.abbreviation}
                </label>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>

      {shownRows.length === 0 ? (
        <p className="border-y border-neutral-200 py-6 text-center text-sm text-neutral-500">
          No translations selected — check at least one above to compare.
        </p>
      ) : (
        <div className="divide-y divide-neutral-200 border-y border-neutral-200">
          {shownRows.map(({ translation: t, result }) => (
            <div key={t.id} className="py-0.5 sm:grid sm:grid-cols-[3rem_1fr] sm:items-center sm:gap-x-3">
              <Tooltip text={`${t.name} — ${t.philosophy}`} variant="light">
                <Link
                  href={`/translations/${t.id}`}
                  style={{ fontSize: abbrFontPx(fontPx) }}
                  className={`font-semibold hover:underline ${textOnlyClass(philosophyGlossary[t.philosophy].className)}`}
                >
                  {t.abbreviation}
                </Link>
              </Tooltip>
              {result.status === "ok" && result.text ? (
                <p
                  className="font-serif leading-tight text-neutral-800"
                  style={{ fontSize: fontPx }}
                >
                  {result.text}
                </p>
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
