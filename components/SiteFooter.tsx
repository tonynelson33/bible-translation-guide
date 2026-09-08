import Link from "next/link";
import SpectrumStrip from "./SpectrumStrip";

const columns: { heading: string; links: { href: string; label: string }[] }[] = [
  {
    heading: "Compare",
    links: [
      { href: "/compare", label: "All translations" },
      { href: "/verses", label: "Verses side by side" },
      { href: "/rankings", label: "Rankings" },
    ],
  },
  {
    heading: "Learn",
    links: [
      { href: "/history", label: "How we got the Bible" },
      { href: "/choose", label: "How to choose" },
      { href: "/differences", label: "Why translations differ" },
      { href: "/faq", label: "FAQ" },
      { href: "/blog", label: "Videos" },
    ],
  },
  {
    heading: "More",
    links: [
      { href: "/church-finder", label: "Church Finder" },
      { href: "/buy", label: "Where to buy" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-neutral-200 bg-neutral-50">
      <div className="px-4 py-10 sm:px-6 lg:px-8">
        <SpectrumStrip className="mb-8 h-1.5 max-w-[16rem]" />

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded bg-brand-700 font-display text-lg font-semibold text-white">
                B
              </span>
              <span className="text-sm font-semibold tracking-tight text-brand-900">
                BibleTranslationGuide
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-neutral-500">
              A non-commercial guide to the twelve English translations most used in Protestant
              churches.
            </p>
            <Link
              href="/church-finder"
              className="mt-3 inline-block text-sm font-medium text-gild-700 hover:text-gild-800"
            >
              Add your church &rarr;
            </Link>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                {col.heading}
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-neutral-600 hover:text-brand-700">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-10 border-t border-neutral-200 pt-6 text-sm text-neutral-500">
          &copy; {new Date().getFullYear()} BibleTranslationGuide. Scripture quotations remain the
          property of their respective publishers.
        </p>
      </div>
    </footer>
  );
}
