import type { Metadata } from "next";
import Link from "next/link";
import type { Philosophy } from "@/lib/types";
import { translations } from "@/lib/data";
import { philosophyGlossary } from "@/lib/glossary";
import { translationLinks } from "@/lib/buyLinks";

export const metadata: Metadata = {
  title: "Where to Buy",
  description:
    "Where to buy print and digital editions of each of the twelve translations — publisher stores and major retailers — plus the ones you can read in full, free, online. Plain links, no affiliate tracking.",
  alternates: { canonical: "/buy" },
};

const monogramStyles: Record<Philosophy, string> = {
  Formal: "bg-indigo-600",
  Dynamic: "bg-amber-600",
  Optimal: "bg-teal-600",
  Mixed: "bg-teal-600",
};

// The two translations with a free story beyond the universal Bible Gateway /
// YouVersion access every translation on this page has.
const officiallyFree: Record<string, string> = {
  kjv: "public domain — free to read, copy, and print in any form",
  net: "the full text and all 60,000 translator's notes, free by design at bible.org",
};

function Monogram({ abbreviation, philosophy }: { abbreviation: string; philosophy: Philosophy }) {
  return (
    <span
      className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg font-display text-xs font-bold tracking-tight text-white ${monogramStyles[philosophy]}`}
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
      <span className="flex w-20 flex-shrink-0 items-center gap-1 text-xs font-semibold uppercase tracking-wide text-neutral-400">
        {icon}
        {label}
      </span>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm font-medium text-brand-700 hover:border-brand-300 hover:bg-brand-50"
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
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gild-700">
        Print &amp; digital
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-brand-900 sm:text-4xl">
        Where to buy
      </h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-neutral-700">
        For each translation, the publisher&rsquo;s own store where there is one, plus the major
        retailers, and the places to read the full text free are all provided below. They&rsquo;re
        plain outbound links &mdash; no affiliate tracking, and this site takes no cut.
      </p>

      {/* Free to read */}
      <div className="mt-8 rounded-xl border border-gild-200 bg-gild-50/60 p-5">
        <h2 className="font-display text-lg font-semibold text-brand-900">
          You don&rsquo;t have to buy one to read it
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-700">
          Every translation here can be read in full, free, at{" "}
          <a
            href="https://www.biblegateway.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-gild-700 hover:underline"
          >
            Bible Gateway
          </a>{" "}
          or in the{" "}
          <a
            href="https://www.bible.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-gild-700 hover:underline"
          >
            YouVersion
          </a>{" "}
          app. The <Link href="/translations/kjv" className="font-medium text-gild-700 hover:underline">KJV</Link>{" "}
          is public domain &mdash; free to read, copy, and print in any form. The{" "}
          <Link href="/translations/net" className="font-medium text-gild-700 hover:underline">NET</Link>,
          with its 60,000 translator&rsquo;s notes, is free by design at bible.org.
        </p>
      </div>

      {/* Translation vs. edition */}
      <p className="mt-8 max-w-2xl text-sm leading-relaxed text-neutral-500">
        Each of these is a <em>translation</em>, not one book. Every one is sold in dozens of
        editions &mdash; study, compact, large-print, journaling, children&rsquo;s, digital &mdash;
        from a few dollars up past a hundred for premium leather. Pick the translation first; the
        links below open a store&rsquo;s full range for it.
      </p>

      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-500">
        <strong className="font-semibold text-neutral-700">Prefer to listen?</strong> Most of these
        have a narrated audio edition &mdash; free in the YouVersion app where it&rsquo;s offered,
        and as standalone or dramatized recordings (the NKJV&rsquo;s is <em>The Word of Promise</em>)
        from the publishers linked below.
      </p>

      <ul className="mt-8 space-y-4">
        {sorted.map((t) => {
          const links = translationLinks[t.id];
          const free = officiallyFree[t.id];
          return (
            <li key={t.id} className="rounded-lg border border-neutral-200 bg-white p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <Monogram abbreviation={t.abbreviation} philosophy={t.philosophy} />
                <div className="min-w-0 flex-1">
                  <Link href={`/translations/${t.id}`} className="group inline-block">
                    <span className="font-display text-lg font-semibold text-brand-900 group-hover:underline">
                      {t.abbreviation}
                    </span>
                    <span className="ml-2 text-sm text-neutral-500">{t.name}</span>
                  </Link>
                  <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-500">
                    <span>{t.publisher}</span>
                    <span className="text-neutral-300">&middot;</span>
                    <span>{t.firstPublishedYear}</span>
                    <span className="text-neutral-300">&middot;</span>
                    <span>reads at grade {t.gradeLevel}</span>
                    <span
                      className={`ml-0.5 inline-block rounded-full px-2 py-0.5 text-[0.7rem] font-medium ${philosophyGlossary[t.philosophy].className}`}
                    >
                      {t.philosophy}
                    </span>
                  </p>
                </div>
              </div>

              {links && (
                <div className="mt-4 space-y-2 sm:pl-[3.75rem]">
                  <LinkRow icon={<BuyIcon />} label="Buy" links={links.buy} />
                  <LinkRow icon={<ReadIcon />} label="Read free" links={links.readFree} />
                  {free && (
                    <p className="pt-0.5 text-xs text-neutral-400 sm:pl-[5.5rem]">Free in full: {free}.</p>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <p className="mt-8 text-sm leading-relaxed text-neutral-500">
        Not sure which one? <Link href="/rankings" className="font-medium text-brand-700 hover:underline">The rankings</Link>{" "}
        sort the twelve by purpose, and <Link href="/compare" className="font-medium text-brand-700 hover:underline">the table</Link>{" "}
        lines up their reading levels and textual basis side by side.
      </p>
    </div>
  );
}
