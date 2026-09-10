"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { translations } from "@/lib/data";

type NavLink = { href: string; label: string };

// Desktop order: Home · At a Glance · Church Finder · Translations ▾ · Verses · Rankings · Learn ▾ · Buy.
// The logo also links home; the explicit "Home" is there because people look for
// it. Church Finder rides high because it's the most distinctive feature; the
// learning pages are grouped under one menu so the bar stays short. "Verses"
// stays short here; the page itself is titled "Comparison of Popular Verses".
const beforeTranslations: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/compare", label: "At a Glance" },
  { href: "/church-finder", label: "Church Finder" },
];

const afterTranslations: NavLink[] = [
  { href: "/verses", label: "Verses" },
  { href: "/rankings", label: "Rankings" },
];

const learnLinks: NavLink[] = [
  { href: "/history", label: "How We Got the English Bible" },
  { href: "/differences", label: "Translation Differences" },
  { href: "/blog", label: "Videos" },
  { href: "/faq", label: "FAQ" },
  { href: "/glossary", label: "Glossary" },
  { href: "/about", label: "About This Site" },
];

const afterLearn: NavLink[] = [{ href: "/buy", label: "Where to Buy" }];

const sortedTranslations = [...translations].sort((a, b) =>
  a.abbreviation.localeCompare(b.abbreviation),
);

// px-2.5 (not px-3): the bar carries eight items at the lg breakpoint once
// "Home" is in, and the tighter padding keeps a gap between the logo and the
// first link at 1024px.
const linkClass = (active: boolean) =>
  `rounded px-2.5 py-2 text-sm font-medium transition-colors hover:bg-brand-50 hover:text-brand-800 ${
    active ? "text-brand-800" : "text-neutral-600"
  }`;

function ChevronDown() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function NavDropdown({
  label,
  active,
  children,
  width,
  align = "left",
}: {
  label: string;
  active: boolean;
  children: React.ReactNode;
  width: string;
  /** "right" keeps a menu near the end of the bar from opening off-screen. */
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1 ${linkClass(active)}`}
        aria-expanded={open}
      >
        {label}
        <ChevronDown />
      </button>
      {open && (
        <div
          className={`absolute top-full ${
            align === "right" ? "right-0" : "left-0"
          } ${width} rounded-md border border-neutral-200 bg-white py-2 shadow-lg`}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  const learnActive = learnLinks.some((l) => isActive(l.href));

  const dropdownItemClass =
    "block whitespace-nowrap px-4 py-1.5 text-sm text-neutral-700 hover:bg-brand-50 hover:text-brand-800";

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-paper/95 backdrop-blur">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded bg-brand-700 font-display text-lg font-semibold text-white">
            B
          </span>
          <span className="text-base font-semibold tracking-tight text-brand-900">
            BibleTranslationGuide
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {beforeTranslations.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(isActive(link.href))}>
              {link.label}
            </Link>
          ))}

          <NavDropdown
            label="Translations"
            active={isActive("/translations")}
            width="w-72"
          >
            {sortedTranslations.map((t) => (
              <Link key={t.id} href={`/translations/${t.id}`} className={dropdownItemClass}>
                {t.abbreviation} — {t.name}
              </Link>
            ))}
          </NavDropdown>

          {afterTranslations.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(isActive(link.href))}>
              {link.label}
            </Link>
          ))}

          <NavDropdown label="Learn" active={learnActive} width="w-72" align="right">
            {learnLinks.map((link) => (
              <Link key={link.href} href={link.href} className={dropdownItemClass}>
                {link.label}
              </Link>
            ))}
          </NavDropdown>

          {afterLearn.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(isActive(link.href))}>
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
        <nav className="border-t border-neutral-200 bg-paper px-4 py-3 lg:hidden">
          <ul className="flex flex-col gap-1">
            {[...beforeTranslations, ...afterTranslations, ...afterLearn].map((link) => (
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
                Learn
              </p>
              <ul className="flex flex-col gap-0.5">
                {learnLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded px-2 py-1.5 text-sm text-neutral-600 hover:bg-brand-50 hover:text-brand-800"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

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
