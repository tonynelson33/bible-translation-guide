"use client";

import { useRouter } from "next/navigation";
import type { SampleVerse } from "@/lib/data";
import { referenceSection } from "@/lib/bibleOrder";

export default function VersePicker({
  verses,
  selectedId,
}: {
  verses: SampleVerse[];
  selectedId: string;
}) {
  const router = useRouter();

  // verses arrive in Bible order, so each section is one contiguous run.
  const groups: { section: string; verses: SampleVerse[] }[] = [];
  for (const verse of verses) {
    const section = referenceSection(verse.reference);
    const last = groups[groups.length - 1];
    if (last && last.section === section) last.verses.push(verse);
    else groups.push({ section, verses: [verse] });
  }

  return (
    <label className="flex flex-col gap-1 text-sm font-medium text-neutral-700">
      Choose a verse
      <select
        value={selectedId}
        onChange={(e) => router.push(`/verses?verse=${e.target.value}`)}
        className="w-full max-w-xs rounded-md border border-neutral-300 bg-white px-3 py-2 text-base text-neutral-900 shadow-sm focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600 sm:text-sm"
      >
        {groups.map((group) => (
          <optgroup key={group.section} label={group.section}>
            {group.verses.map((v) => (
              <option key={v.id} value={v.id}>
                {v.reference}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </label>
  );
}
