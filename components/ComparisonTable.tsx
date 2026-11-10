"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Translation } from "@/lib/types";
import { compareValues, gradeLevelSortValue, quoteLimitSortValue } from "@/lib/sort";
import { genderApproachGlossary, philosophyGlossary } from "@/lib/glossary";
import YesNoIcon from "./YesNoIcon";
import PrintEditionMark, { printEditionSortValue } from "./PrintEditionMark";
import InfoTooltip from "./InfoTooltip";
import Tooltip from "./Tooltip";

type SortDirection = "asc" | "desc";

interface ColumnDef {
  key: string;
  label: React.ReactNode;
  sortValue: (t: Translation) => string | number | boolean;
  render: (t: Translation) => React.ReactNode;
  align?: "left" | "center";
  /** Column width in rem. The table's own width is the sum of these (see `otherColumnsWidth`). */
  width: number;
}

function verifyMark(t: Translation, field: string) {
  if (t.verifyFields?.includes(field)) {
    return (
      <sup
        className="ml-0.5 text-brand-600"
        title="Not fully confirmed against current publisher documentation"
      >
        †
      </sup>
    );
  }
  return null;
}

const columns: ColumnDef[] = [
  {
    key: "name",
    label: "Translation",
    sortValue: (t) => t.name,
    align: "left",
    // Not read: the real width is `--name-col` on the <table>, 8rem on phones and 13rem
    // from `sm`. This column is sticky, so on a phone every pixel it takes is one the
    // scrolling columns lose.
    width: 13,
    render: (t) => (
      <Link href={`/translations/${t.id}`} className="block">
        <span className="block whitespace-nowrap text-base font-extrabold text-brand-900">
          {t.abbreviation}
        </span>
        <span className="block text-[11px] leading-tight text-neutral-500 sm:text-xs">
          {t.name}
        </span>
      </Link>
    ),
  },
  {
    key: "firstPublishedYear",
    label: "First Published",
    sortValue: (t) => t.firstPublishedYear,
    width: 7,
    // NRSVue's year is the NRSV's (1989): one translation under a new name. Labelled so the
    // 1989 doesn't read as an error next to its 2021 latest revision.
    render: (t) => (
      <span className="whitespace-nowrap text-neutral-700">
        {t.firstPublishedYear}
        {t.id === "nrsvue" && <span className="text-xs text-neutral-500"> (as NRSV)</span>}
      </span>
    ),
  },
  {
    key: "latestRevisionYear",
    label: "Latest Revision",
    sortValue: (t) => t.latestRevisionYear,
    width: 6.5,
    render: (t) => <span className="font-normal text-neutral-700">{t.latestRevisionYear}</span>,
  },
  {
    key: "gradeLevel",
    label: "Reading Grade Level",
    sortValue: (t) => gradeLevelSortValue(t.gradeLevel),
    width: 7,
    render: (t) => (
      <span>
        {t.gradeLevel}
        {verifyMark(t, "gradeLevel")}
      </span>
    ),
  },
  {
    key: "textualBasis",
    label: "NT Textual Basis",
    sortValue: (t) => t.textualBasis,
    width: 8.5,
    render: (t) => <span>{t.textualBasis}</span>,
  },
  {
    key: "philosophy",
    label: "Translation Philosophy",
    sortValue: (t) => t.philosophy,
    width: 8.5,
    render: (t) => (
      <Tooltip text={philosophyGlossary[t.philosophy].description}>
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${philosophyGlossary[t.philosophy].className}`}
        >
          {t.philosophy}
        </span>
      </Tooltip>
    ),
  },
  {
    key: "genderApproach",
    label: (
      <span className="inline-flex items-center">
        Gender Language Approach
        <InfoTooltip text="This column is an editorial characterization — more subjective than the other fields, based on publisher preface language and general reception." />
      </span>
    ),
    sortValue: (t) => t.genderApproach,
    width: 8.5,
    render: (t) => (
      <Tooltip text={genderApproachGlossary[t.genderApproach].description}>
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${genderApproachGlossary[t.genderApproach].className}`}
        >
          {t.genderApproachLabel ?? t.genderApproach}
        </span>
      </Tooltip>
    ),
  },
  {
    key: "publisher",
    label: "Publisher",
    sortValue: (t) => t.publisher,
    width: 11,
    render: (t) => <span>{t.publisher}</span>,
  },
  {
    key: "quoteLimit",
    label: "Quote Limit w/o Permission",
    sortValue: (t) => quoteLimitSortValue(t.quoteLimit),
    width: 7.5,
    render: (t) => (
      <span>
        {t.quoteLimit}
        {verifyMark(t, "quoteLimit")}
      </span>
    ),
  },
  {
    key: "printEdition",
    label: "Print Edition Available",
    sortValue: (t) => printEditionSortValue(t.printEdition),
    align: "center",
    width: 6.5,
    render: (t) => <PrintEditionMark value={t.printEdition} />,
  },
  {
    key: "redLetter",
    label: "Red Letter Edition",
    sortValue: (t) => t.redLetter,
    align: "center",
    width: 6,
    render: (t) => (
      <span className="inline-flex items-center">
        <YesNoIcon value={t.redLetter} label="Red letter edition available" />
        {verifyMark(t, "redLetter")}
      </span>
    ),
  },
  {
    key: "otMarking",
    label: "Marks OT Quotations in NT",
    sortValue: (t) => t.otMarking.marks,
    align: "center",
    width: 8,
    render: (t) => (
      <div className="flex flex-col items-center">
        <YesNoIcon value={t.otMarking.marks} label="Marks OT quotations in NT" />
        {t.otMarking.marks && t.otMarking.method && (
          <span className="mt-0.5 text-xs text-neutral-500">{t.otMarking.method}</span>
        )}
      </div>
    ),
  },
  {
    key: "italicizesTranslatorWords",
    label: "Italicizes Translator-Supplied Words",
    sortValue: (t) => t.italicizesTranslatorWords,
    align: "center",
    width: 8.5,
    render: (t) => (
      <span className="inline-flex items-center">
        <YesNoIcon value={t.italicizesTranslatorWords} label="Italicizes translator-supplied words" />
        {verifyMark(t, "italicizesTranslatorWords")}
      </span>
    ),
  },
  {
    key: "capitalizesDeityPronouns",
    label: "Capitalizes Deity Pronouns",
    sortValue: (t) => t.capitalizesDeityPronouns,
    align: "center",
    width: 8,
    render: (t) => (
      <YesNoIcon value={t.capitalizesDeityPronouns} label="Capitalizes deity pronouns" />
    ),
  },
  {
    key: "quotationMarksForDialogue",
    label: "Uses Quotation Marks for Dialogue",
    sortValue: (t) => t.quotationMarksForDialogue,
    align: "center",
    width: 7.5,
    render: (t) => (
      <YesNoIcon value={t.quotationMarksForDialogue} label="Uses quotation marks for dialogue" />
    ),
  },
];

// The rem width of every column except the sticky name column.
const otherColumnsWidth = columns.slice(1).reduce((sum, c) => sum + c.width, 0);

export default function ComparisonTable({ translations }: { translations: Translation[] }) {
  const [sortKey, setSortKey] = useState<string | null>("firstPublishedYear");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const theadRef = useRef<HTMLTableSectionElement>(null);

  // The horizontal-scroll wrapper is a scroll container, which traps
  // `position: sticky` — the column headers can't pin to the viewport with CSS
  // alone. So translate the <thead> down as the table scrolls up under the
  // sticky nav, keeping the headings in view while you read down the rows.
  // Horizontal position is untouched, so it still tracks the wrapper's own
  // left-scroll, and with JS off the headers just scroll away normally.
  // The transform goes on each <th>, not the <thead>: iOS Safari doesn't carry a
  // <thead> transform onto the `position: sticky` name cell, which then scrolled away.
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const thead = theadRef.current;
    const header = document.querySelector("header");
    if (!wrapper || !thead) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const navH = header?.offsetHeight ?? 0;
      const rect = wrapper.getBoundingClientRect();
      const pinned = rect.top < navH && rect.bottom > navH + thead.offsetHeight;
      const transform = pinned ? `translateY(${navH - rect.top}px)` : "";
      for (const th of thead.querySelectorAll("th")) th.style.transform = transform;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const sorted = useMemo(() => {
    if (!sortKey) return translations;
    const column = columns.find((c) => c.key === sortKey);
    if (!column) return translations;
    const copy = [...translations];
    copy.sort((a, b) => {
      const result = compareValues(column.sortValue(a), column.sortValue(b));
      return sortDir === "asc" ? result : -result;
    });
    return copy;
  }, [translations, sortKey, sortDir]);

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  return (
    <div
      ref={wrapperRef}
      // `relative` makes this scroll box the containing block for the YesNoIcon `sr-only`
      // labels (position: absolute). Without it they escape the overflow clip and widen
      // the whole page on mobile.
      className="relative w-full min-w-0 overflow-x-auto rounded-lg border border-neutral-200"
    >
      {/* `table-fixed` only takes effect with an explicit table width. Without one the
          browser squeezes every column to its narrowest content and ignores the widths. */}
      <table
        className="min-w-full table-fixed border-collapse text-sm [--name-col:8rem] sm:[--name-col:13rem]"
        style={{ width: `calc(var(--name-col) + ${otherColumnsWidth}rem)` }}
      >
        <thead ref={theadRef} className="relative z-20">
          <tr className="bg-neutral-50">
            {columns.map((col, i) => {
              const isSticky = i === 0;
              const isActive = sortKey === col.key;
              return (
                <th
                  key={col.key}
                  scope="col"
                  style={{ width: i === 0 ? "var(--name-col)" : `${col.width}rem` }}
                  className={`border-b border-neutral-200 bg-neutral-50 px-2 [will-change:transform] py-2 text-left align-bottom text-xs font-bold uppercase tracking-wide text-neutral-600 sm:px-3 ${
                    isSticky
                      ? "sticky left-0 z-20 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1),0_5px_6px_-6px_rgba(0,0,0,0.18)]"
                      : "shadow-[0_5px_6px_-6px_rgba(0,0,0,0.18)]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleSort(col.key)}
                    className="flex w-full items-center gap-1 normal-case tracking-normal text-neutral-600 hover:text-brand-800"
                  >
                    <span className="min-w-0 flex-1 break-normal text-xs font-bold uppercase leading-tight tracking-wide">
                      {col.label}
                    </span>
                    <span className="flex h-3 w-3 flex-shrink-0 flex-col justify-center text-[8px] leading-none text-neutral-400">
                      <span className={isActive && sortDir === "asc" ? "text-brand-700" : ""}>▲</span>
                      <span className={isActive && sortDir === "desc" ? "text-brand-700" : ""}>▼</span>
                    </span>
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((t, rowIdx) => (
            <tr
              key={t.id}
              className={rowIdx % 2 === 0 ? "bg-white" : "bg-neutral-50/50"}
            >
              {columns.map((col, i) => {
                const isSticky = i === 0;
                return (
                  <td
                    key={col.key}
                    className={`border-b border-neutral-100 px-2 py-1.5 align-middle text-neutral-700 sm:px-3 ${
                      col.align === "center" ? "text-center" : "text-left"
                    } ${
                      isSticky
                        ? // Opaque stand-in for the row stripe (neutral-50 at 50% over white),
                          // so scrolled cells can't show through the sticky column.
                          `sticky left-0 z-10 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)] ${rowIdx % 2 === 0 ? "bg-white" : "bg-[#fdfdfd]"}`
                        : ""
                    }`}
                  >
                    {col.render(t)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
