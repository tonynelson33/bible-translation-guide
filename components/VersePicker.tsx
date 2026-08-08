"use client";

import { useRouter } from "next/navigation";
import type { SampleVerse } from "@/lib/data";

export default function VersePicker({
  verses,
  selectedId,
}: {
  verses: SampleVerse[];
  selectedId: string;
}) {
  const router = useRouter();

  return (
    <label className="flex flex-col gap-1 text-sm font-medium text-neutral-700">
      Choose a verse
      <select
        value={selectedId}
        onChange={(e) => router.push(`/verses?verse=${e.target.value}`)}
        className="w-full max-w-xs rounded-md border border-neutral-300 bg-white px-3 py-2 text-base text-neutral-900 shadow-sm focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600 sm:text-sm"
      >
        {verses.map((v) => (
          <option key={v.id} value={v.id}>
            {v.reference}
          </option>
        ))}
      </select>
    </label>
  );
}
