"use client";

import { useState } from "react";
import Link from "next/link";
import type { RankingCategory, RankingEntry } from "@/lib/rankings";
import { getTranslation } from "@/lib/data";

const medalStyles = [
  "h-9 w-9 text-base bg-amber-400 text-amber-950", // gold
  "h-9 w-9 text-base bg-neutral-300 text-neutral-700", // silver
  "h-9 w-9 text-base bg-amber-700 text-amber-50", // bronze
];

function RankBadge({ rank }: { rank: number }) {
  const isMedal = rank <= 3;
  return (
    <span
      className={`flex flex-shrink-0 items-center justify-center rounded-full font-bold ${
        isMedal ? medalStyles[rank - 1] : "h-6 w-6 text-xs bg-neutral-100 text-neutral-500"
      }`}
    >
      {rank}
    </span>
  );
}

function TopEntry({ rank, entry }: { rank: number; entry: RankingEntry }) {
  const translation = getTranslation(entry.id);
  if (!translation) return null;
  return (
    <li className="flex gap-3 rounded-lg border border-neutral-200 bg-white p-4">
      <RankBadge rank={rank} />
      <div className="min-w-0">
        <Link
          href={`/translations/${translation.id}`}
          className="font-semibold text-brand-800 hover:underline"
        >
          {translation.abbreviation}
          <span className="font-normal text-neutral-500"> — {translation.name}</span>
        </Link>
        <p className="mt-1 text-sm leading-relaxed text-neutral-700">{entry.blurb}</p>
      </div>
    </li>
  );
}

function CompactEntry({ rank, entry }: { rank: number; entry: RankingEntry }) {
  const translation = getTranslation(entry.id);
  if (!translation) return null;
  return (
    <li className="flex items-center gap-3 border-b border-neutral-100 px-4 py-2.5 last:border-b-0">
      <RankBadge rank={rank} />
      <Link
        href={`/translations/${translation.id}`}
        className="flex-shrink-0 font-semibold text-brand-800 hover:underline"
      >
        {translation.abbreviation}
      </Link>
      <p className="min-w-0 text-sm leading-snug text-neutral-600">{entry.blurb}</p>
    </li>
  );
}

function TabButton({
  cat,
  isActive,
  onClick,
  featured = false,
}: {
  cat: RankingCategory;
  isActive: boolean;
  onClick: () => void;
  featured?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
        featured ? "ring-1 ring-inset ring-brand-300" : ""
      } ${
        isActive
          ? "bg-brand-700 text-white"
          : "bg-neutral-100 text-neutral-600 hover:bg-brand-50 hover:text-brand-800"
      }`}
    >
      {cat.tabLabel}
    </button>
  );
}

export default function RankingsPage({
  categories,
  defaultSlug,
}: {
  categories: RankingCategory[];
  defaultSlug: string;
}) {
  const [activeSlug, setActiveSlug] = useState(defaultSlug);
  const category = categories.find((c) => c.slug === activeSlug) ?? categories[0];
  const balanceCategory = categories.find((c) => c.slug === "balance");
  const otherCategories = categories.filter((c) => c.slug !== "balance");

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-center font-serif text-3xl font-semibold text-brand-900 sm:text-4xl">
        Rankings
      </h1>
      <p className="mx-auto mt-3 max-w-2xl text-center text-neutral-600">
        Pick a category to see how all nine translations stack up. There's no single “best”
        translation — it depends on what you're using it for — so each list judges by a different,
        stated criterion rather than one overall score.
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {otherCategories.map((cat) => (
          <TabButton
            key={cat.slug}
            cat={cat}
            isActive={cat.slug === activeSlug}
            onClick={() => setActiveSlug(cat.slug)}
          />
        ))}
      </div>
      {balanceCategory && (
        <div className="mt-2 flex justify-center">
          <TabButton
            cat={balanceCategory}
            isActive={balanceCategory.slug === activeSlug}
            onClick={() => setActiveSlug(balanceCategory.slug)}
            featured
          />
        </div>
      )}

      <section className="mt-8">
        <h2 className="font-serif text-2xl font-semibold text-brand-900">{category.title}</h2>
        <p className="mt-1 max-w-2xl text-sm text-neutral-600">{category.criteria}</p>

        <ul className="mt-4 space-y-3">
          {category.entries.slice(0, 3).map((entry, i) => (
            <TopEntry key={entry.id} rank={i + 1} entry={entry} />
          ))}
        </ul>

        <ol className="mt-3 overflow-hidden rounded-lg border border-neutral-200 bg-white">
          {category.entries.slice(3).map((entry, i) => (
            <CompactEntry key={entry.id} rank={i + 4} entry={entry} />
          ))}
        </ol>

        {category.note && (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-500">{category.note}</p>
        )}
      </section>
    </div>
  );
}
