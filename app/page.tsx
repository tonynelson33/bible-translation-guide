import ComparisonTable from "@/components/ComparisonTable";
import { translations } from "@/lib/data";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-3xl">
        <h1 className="font-serif text-3xl font-semibold text-brand-900 sm:text-4xl">
          Compare Bible Translations
        </h1>
        <p className="mt-3 text-neutral-600">
          A side-by-side look at nine widely used English translations — ESV, KJV, NIV, NLT,
          CSB, LSB, NKJV, NASB, and NET — across translation philosophy, reading level, textual
          basis, and editorial conventions. Click any column header to sort.
        </p>
      </div>

      <ComparisonTable translations={translations} />

      <p className="mt-6 max-w-3xl text-sm text-neutral-500">
        <sup className="text-brand-600">†</sup> Quote limits and some fields marked &ldquo;verify&rdquo;
        should be confirmed against current publisher documentation before relying on them.
      </p>
    </div>
  );
}
