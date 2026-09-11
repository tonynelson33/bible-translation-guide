import type { Metadata } from "next";
import Link from "next/link";
import ComparisonTable from "@/components/ComparisonTable";
import { translations } from "@/lib/data";

export const metadata: Metadata = {
  title: "Full Comparison",
  description:
    "A sortable side-by-side table of twelve widely used English Bible translations — translation philosophy, reading level, NT textual basis, gender-language approach, publisher, and more.",
  alternates: { canonical: "/compare" },
};

export default function ComparePage() {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-5 max-w-4xl">
        <h1 className="font-display text-3xl font-semibold text-brand-900 sm:text-4xl">
          The full comparison
        </h1>
        <p className="mt-3 text-neutral-700">
          Twelve widely used English translations, side by side. Tap a column to sort, or a
          translation for its full profile.
        </p>
      </div>

      <ComparisonTable translations={translations} />

      <div className="mt-3 space-y-1 text-sm text-neutral-500">
        <p>
          <sup className="text-brand-600">†</sup> Quote limits and some fields marked
          &ldquo;verify&rdquo; should be confirmed against current publisher documentation before
          relying on them.
        </p>
        <p>
          &ldquo;NRSVue&rdquo; is the 2021 Updated Edition of the NRSV, which most publishers now
          serve as the current &ldquo;NRSV.&rdquo; See{" "}
          <Link href="/translations/nrsvue" className="text-brand-600 hover:underline">
            its profile
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
