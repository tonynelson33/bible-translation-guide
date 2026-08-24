import type { Metadata } from "next";
import ComparisonTable from "@/components/ComparisonTable";
import { translations } from "@/lib/data";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <div className="px-4 py-4 sm:px-6 lg:px-8">
      <p className="mb-3 max-w-3xl text-neutral-600">
        A side-by-side look at nine of the most widely used English translations.
      </p>

      <ComparisonTable translations={translations} />

      <p className="mt-3 text-sm text-neutral-500">
        <sup className="text-brand-600">†</sup> Quote limits and some fields marked &ldquo;verify&rdquo;
        should be confirmed against current publisher documentation before relying on them.
      </p>
    </div>
  );
}
