import type { Metadata } from "next";
import Link from "next/link";
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
