import Link from "next/link";
import type { RankingCategory } from "@/lib/rankings";
import { getTranslation } from "@/lib/data";

function RankBadge({ rank }: { rank: number }) {
  return (
    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-700 text-sm font-bold text-white">
      {rank}
    </span>
  );
}

function CategorySection({ category }: { category: RankingCategory }) {
  return (
    <section className="mt-10 first:mt-0">
      <h2 className="font-serif text-2xl font-semibold text-brand-900">{category.title}</h2>
      <p className="mt-1 max-w-2xl text-sm text-neutral-600">{category.criteria}</p>
      <ul className="mt-4 space-y-3">
        {category.entries.map((entry, i) => {
          const translation = getTranslation(entry.id);
          if (!translation) return null;
          return (
            <li
              key={entry.id}
              className="flex gap-3 rounded-lg border border-neutral-200 bg-white p-4"
            >
              <RankBadge rank={i + 1} />
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
        })}
      </ul>
      {category.note && (
        <p className="mt-3 text-sm leading-relaxed text-neutral-500">{category.note}</p>
      )}
    </section>
  );
}

export default function RankingsPage({ categories }: { categories: RankingCategory[] }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-semibold text-brand-900 sm:text-4xl">Rankings</h1>
      <p className="mt-3 max-w-2xl text-neutral-600">
        A few curated, criteria-based picks pulled from the comparison data and each translation's
        profile. There's no single “best” translation — it depends on what you're using it for —
        so each list below judges by a different, stated criterion rather than one overall score.
      </p>

      {categories.map((category) => (
        <CategorySection key={category.slug} category={category} />
      ))}

      <p className="mt-10 max-w-2xl text-sm text-neutral-500">
        Popularity figures are based on the Evangelical Christian Publishers Association's (ECPA)
        monthly Bible translation bestseller data, current as of late 2025. Exact rank order shifts
        from month to month, so treat “Most Popular” as a general picture rather than a fixed,
        permanent order.
      </p>
    </div>
  );
}
