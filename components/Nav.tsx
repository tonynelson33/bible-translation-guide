"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { translations } from "@/lib/data";

const primaryLinks = [
  { href: "/", label: "Home" },
  { href: "/verses", label: "Sample Verses" },
  { href: "/rankings", label: "Rankings" },
  { href: "/blog", label: "Blog" },
  { href: "/church-finder", label: "Church Finder" },
  { href: "/buy", label: "Buy" },
];

const sortedTranslations = [...translations].sort((a, b) =>
  a.abbreviation.localeCompare(b.abbreviation),
);

export default function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [translationsOpen, setTranslationsOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded bg-brand-700 font-serif text-lg font-semibold text-white">
            B
          </span>
          <span className="text-base font-semibold tracking-tight text-brand-900">
            BibleTranslationGuide
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {primaryLinks.slice(0, 2).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded px-3 py-2 text-sm font-medium transition-colors hover:bg-brand-50 hover:text-brand-800 ${
                isActive(link.href) ? "text-brand-800" : "text-neutral-600"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div
            className="relative"
            onMouseEnter={() => setTranslationsOpen(true)}
            onMouseLeave={() => setTranslationsOpen(false)}
          >
            <button
              type="button"
              onClick={() => setTranslationsOpen((v) => !v)}
              className={`flex items-center gap-1 rounded px-3 py-2 text-sm font-medium transition-colors hover:bg-brand-50 hover:text-brand-800 ${
                isActive("/translations") ? "text-brand-800" : "text-neutral-600"
              }`}
              aria-expanded={translationsOpen}
            >
              Translations
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {translationsOpen && (
              <div className="absolute left-0 top-full w-72 rounded-md border border-neutral-200 bg-white py-2 shadow-lg">
                {sortedTranslations.map((t) => (
                  <Link
                    key={t.id}
                    href={`/translations/${t.id}`}
                    className="block whitespace-nowrap px-4 py-1.5 text-sm text-neutral-700 hover:bg-brand-50 hover:text-brand-800"
                  >
                    {t.abbreviation} — {t.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {primaryLinks.slice(2).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded px-3 py-2 text-sm font-medium transition-colors hover:bg-brand-50 hover:text-brand-800 ${
                isActive(link.href) ? "text-brand-800" : "text-neutral-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded p-2 text-neutral-600 hover:bg-brand-50 lg:hidden"
          aria-expanded={mobileOpen}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <nav className="border-t border-neutral-200 bg-white px-4 py-3 lg:hidden">
          <ul className="flex flex-col gap-1">
            {primaryLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded px-2 py-2 text-sm font-medium text-neutral-700 hover:bg-brand-50 hover:text-brand-800"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mt-2 border-t border-neutral-100 pt-2">
              <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                Translations
              </p>
              <ul className="grid grid-cols-2 gap-1">
                {sortedTranslations.map((t) => (
                  <li key={t.id}>
                    <Link
                      href={`/translations/${t.id}`}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded px-2 py-1.5 text-sm text-neutral-600 hover:bg-brand-50 hover:text-brand-800"
                    >
                      {t.abbreviation}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
