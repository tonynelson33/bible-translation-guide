import type { Metadata } from "next";
import Link from "next/link";
import { translations } from "@/lib/data";
import { buyLinks } from "@/lib/buyLinks";

export const metadata: Metadata = { title: "Buy" };

export default function BuyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-semibold text-brand-900 sm:text-4xl">Where to Buy</h1>
      <p className="mt-3 max-w-2xl text-neutral-600">
        Print and digital editions of each translation, from retailers that carry them. These are
        plain links — no affiliate tracking, no cut for this site.
      </p>

      <ul className="mt-8 space-y-3">
        {translations.map((t) => (
          <li
            key={t.id}
            className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <Link href={`/translations/${t.id}`} className="min-w-0">
              <span className="block font-semibold text-brand-800 hover:underline">
                {t.abbreviation}
              </span>
              <span className="block text-sm text-neutral-500">{t.name}</span>
            </Link>
            <div className="flex flex-shrink-0 flex-wrap gap-2">
              {buyLinks[t.id]?.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm font-medium text-brand-700 hover:border-brand-200 hover:bg-brand-50"
                >
                  {link.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
