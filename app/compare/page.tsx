import type { Metadata } from "next";
import Link from "next/link";
import ComparisonTable from "@/components/ComparisonTable";
import { translations } from "@/lib/data";

export const metadata: Metadata = {
  title: "Compare All Translations",
  description:
    "A sortable side-by-side table of twelve widely used English Bible translations — translation philosophy, reading level, NT textual basis, gender-language approach, publisher, and more.",
  alternates: { canonical: "/compare" },
};

export default function ComparePage() {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-4 max-w-3xl">
        <h1 className="font-display text-3xl font-semibold text-brand-900 sm:text-4xl">
          Compare the translations
        </h1>
        <p className="mt-3 text-neutral-700">
          Twelve widely used English translations, side by side. Tap any column heading to sort;
          tap a translation to open its full profile.
        </p>
      </div>

      <div className="mb-4 max-w-5xl overflow-x-auto whitespace-nowrap rounded-lg border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-neutral-700">
        Attend a church?{" "}
        <Link href="/church-finder" className="font-medium text-brand-700 hover:underline">
          Find it in the Church Finder
        </Link>{" "}
        and confirm its denomination and which Bible it uses — or add it if it&apos;s missing.
      </div>

      <ComparisonTable translations={translations} />

      <p className="mt-3 text-sm text-neutral-500">
        <sup className="text-brand-600">†</sup> Quote limits and some fields marked &ldquo;verify&rdquo;
        should be confirmed against current publisher documentation before relying on them.
      </p>
    </div>
  );
}
