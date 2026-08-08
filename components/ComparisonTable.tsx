"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Translation } from "@/lib/types";
import { compareValues, gradeLevelSortValue, quoteLimitSortValue } from "@/lib/sort";
import YesNoIcon from "./YesNoIcon";
import InfoTooltip from "./InfoTooltip";

type SortDirection = "asc" | "desc";

interface ColumnDef {
  key: string;
  label: React.ReactNode;
  sortValue: (t: Translation) => string | number | boolean;
  render: (t: Translation) => React.ReactNode;
  align?: "left" | "center";
  minWidth?: string;
}

function verifyMark(t: Translation, field: string) {
  if (t.verifyFields?.includes(field)) {
    return (
      <sup className="ml-0.5 text-brand-600" title="Flagged for manual verification before launch">
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
    render: (t) => (
      <Link href={`/translations/${t.id}`} className="block">
        <span className="block font-semibold text-brand-800">{t.abbreviation}</span>
        <span className="block text-xs text-neutral-500">{t.name}</span>
      </Link>
    ),
  },
  {
    key: "latestRevisionYear",
    label: "Latest Revision",
    sortValue: (t) => t.latestRevisionYear,
    minWidth: "8rem",
    render: (t) => (
      <div>
        <span className="block text-lg font-bold text-neutral-900">{t.latestRevisionYear}</span>
        <span className="block text-xs text-neutral-500">first published {t.firstPublishedYear}</span>
      </div>
    ),
  },
  {
    key: "gradeLevel",
    label: "Reading Grade Level",
    sortValue: (t) => gradeLevelSortValue(t.gradeLevel),
    render: (t) => (
      <span>
        {t.gradeLevel}
        {verifyMark(t, "gradeLevel")}
      </span>
    ),
  },
  {
    key: "philosophy",
    label: "Translation Philosophy",
    sortValue: (t) => t.philosophy,
    render: (t) => (
      <span className="inline-block rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-800">
        {t.philosophy}
      </span>
    ),
  },
  {
    key: "textualBasis",
    label: "NT Textual Basis",
    sortValue: (t) => t.textualBasis,
    render: (t) => <span>{t.textualBasis}</span>,
  },
  {
    key: "publisher",
    label: "Publisher",
    sortValue: (t) => t.publisher,
    render: (t) => <span>{t.publisher}</span>,
  },
  {
    key: "quoteLimit",
    label: "Quote Limit w/o Permission",
    sortValue: (t) => quoteLimitSortValue(t.quoteLimit),
    render: (t) => (
      <span>
        {t.quoteLimit}
        {verifyMark(t, "quoteLimit")}
      </span>
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
    render: (t) => (
      <span className="inline-block rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-700">
        {t.genderApproachLabel ?? t.genderApproach}
      </span>
    ),
  },
  {
    key: "redLetter",
    label: "Red Letter Edition",
    sortValue: (t) => t.redLetter,
    align: "center",
    render: (t) => <YesNoIcon value={t.redLetter} label="Red letter edition available" />,
  },
  {
    key: "otMarking",
    label: "Marks OT Quotations in NT",
    sortValue: (t) => t.otMarking.marks,
    align: "center",
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
    render: (t) => (
      <YesNoIcon value={t.italicizesTranslatorWords} label="Italicizes translator-supplied words" />
    ),
  },
  {
    key: "capitalizesDeityPronouns",
    label: "Capitalizes Deity Pronouns",
    sortValue: (t) => t.capitalizesDeityPronouns,
    align: "center",
    render: (t) => (
      <YesNoIcon value={t.capitalizesDeityPronouns} label="Capitalizes deity pronouns" />
    ),
  },
  {
    key: "quotationMarksForDialogue",
    label: "Uses Quotation Marks for Dialogue",
    sortValue: (t) => t.quotationMarksForDialogue,
    align: "center",
    render: (t) => (
      <YesNoIcon value={t.quotationMarksForDialogue} label="Uses quotation marks for dialogue" />
    ),
  },
];

export default function ComparisonTable({ translations }: { translations: Translation[] }) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>("asc");

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
    <div className="overflow-x-auto rounded-lg border border-neutral-200">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr className="bg-neutral-50">
            {columns.map((col, i) => {
              const isSticky = i === 0;
              const isActive = sortKey === col.key;
              return (
                <th
                  key={col.key}
                  scope="col"
                  style={col.minWidth ? { minWidth: col.minWidth } : undefined}
                  className={`whitespace-nowrap border-b border-neutral-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500 ${
                    isSticky
                      ? "sticky left-0 z-20 bg-neutral-50 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]"
                      : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleSort(col.key)}
                    className="flex items-center gap-1 normal-case tracking-normal text-neutral-600 hover:text-brand-800"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide">{col.label}</span>
                    <span className="flex h-3 w-3 flex-col justify-center text-[8px] leading-none text-neutral-400">
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
                    className={`border-b border-neutral-100 px-4 py-3 align-middle text-neutral-700 ${
                      col.align === "center" ? "text-center" : "text-left"
                    } ${isSticky ? "sticky left-0 z-10 bg-white shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]" : ""}`}
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
