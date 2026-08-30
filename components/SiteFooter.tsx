import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="px-4 py-8 text-sm text-neutral-500 sm:px-6 lg:px-8">
        <p className="mb-4">
          <Link href="/church-finder" className="font-medium text-brand-700 hover:text-brand-800">
            Add your church →
          </Link>
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} BibleTranslationGuide. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/" className="hover:text-brand-700">Home</Link>
            <Link href="/verses" className="hover:text-brand-700">Sample Verses</Link>
            <Link href="/rankings" className="hover:text-brand-700">Rankings</Link>
            <Link href="/blog" className="hover:text-brand-700">Videos</Link>
            <Link href="/differences" className="hover:text-brand-700">Differences</Link>
            <Link href="/church-finder" className="hover:text-brand-700">Church Finder</Link>
            <Link href="/buy" className="hover:text-brand-700">Buy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
