import type { Metadata } from "next";
import Link from "next/link";
import type { Philosophy } from "@/lib/types";
import { translations } from "@/lib/data";
import { translationLinks } from "@/lib/buyLinks";

export const metadata: Metadata = {
  title: "Buy",
  alternates: { canonical: "/buy" },
};

const monogramStyles: Record<Philosophy, string> = {
  Formal: "bg-indigo-600",
  Dynamic: "bg-amber-600",
  Optimal: "bg-teal-600",
  Mixed: "bg-purple-600",
};

function Monogram({ abbreviation, philosophy }: { abbreviation: string; philosophy: Philosophy }) {
  return (
    <span
      className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white ${monogramStyles[philosophy]}`}
    >
      {abbreviation}
    </span>
  );
}

function BuyIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-4 w-4">
      <path d="M6 2a1 1 0 00-1 1v1H3.5a1 1 0 00-.995.9l-1 10A1 1 0 002.5 16h15a1 1 0 00.995-1.1l-1-10A1 1 0 0016.5 4H15V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm1 5a1 1 0 112 0 2 2 0 104 0 1 1 0 112 0 4 4 0 01-8 0z" />
    </svg>
  );
}

function ReadIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-4 w-4">
      <path d="M10.75 4.5a5.5 5.5 0 013.5-1.25 5.5 5.5 0 013.5.9v9.5a4.5 4.5 0 00-3.5-.9 4.5 4.5 0 00-3.5 1.25V4.5zM9.25 4.5a5.5 5.5 0 00-3.5-1.25 5.5 5.5 0 00-3.5.9v9.5a4.5 4.5 0 013.5-.9 4.5 4.5 0 013.5 1.25V4.5z" />
    </svg>
  );
}

function LinkRow({
  icon,
  label,
  links,
}: {
  icon: React.ReactNode;
  label: string;
  links: { label: string; url: string }[];
}) {
  if (links.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-neutral-400">
        {icon}
        {label}
      </span>
      {links.map((link) => (
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
  );
}

export default function BuyPage() {
  const sorted = [...translations].sort((a, b) => a.abbreviation.localeCompare(b.abbreviation));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-semibold text-brand-900 sm:text-4xl">Where to Buy</h1>
      <p className="mt-3 max-w-2xl text-neutral-600">
        Print and digital editions of each translation — from the publisher directly where one
        exists, plus major retailers — alongside free ways to read the full text online. These are
        plain links: no affiliate tracking, no cut for this site.
      </p>

      <ul className="mt-8 space-y-4">
        {sorted.map((t) => {
          const links = translationLinks[t.id];
          return (
            <li key={t.id} className="rounded-lg border border-neutral-200 bg-white p-4">
              <div className="flex items-center gap-3">
                <Monogram abbreviation={t.abbreviation} philosophy={t.philosophy} />
                <Link href={`/translations/${t.id}`} className="min-w-0">
                  <span className="block font-semibold text-brand-800 hover:underline">
                    {t.abbreviation}
                  </span>
                  <span className="block text-sm text-neutral-500">{t.name}</span>
                </Link>
              </div>
              {links && (
                <div className="mt-3 space-y-2 sm:pl-14">
                  <LinkRow icon={<BuyIcon />} label="Buy" links={links.buy} />
                  <LinkRow icon={<ReadIcon />} label="Read Free" links={links.readFree} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
