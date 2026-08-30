import type { Metadata } from "next";
import ChurchSearch from "@/components/ChurchSearch";
import CountTable from "@/components/CountTable";
import {
  searchChurches,
  validateSearchParams,
  getDenominationCounts,
  getTranslationCounts,
  type ChurchSearchParams,
} from "@/lib/churches";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Church Finder",
  description:
    "Search 350,000+ U.S. Christian churches by city or zip and see which Bible translation each one uses. Covers the historic traditions — Catholic, Orthodox, and Protestant.",
  alternates: { canonical: "/church-finder" },
};

// The breakdown-table counts and search results come from Supabase. Render on
// every request (no Data Cache) so church-data edits — including ones made
// straight against the DB — show up immediately, not up to an hour later or
// only on the next deploy. The 3 queries per view are cheap at this traffic.
export const dynamic = "force-dynamic";

export default async function ChurchFinderPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const str = (v: string | string[] | undefined) => (typeof v === "string" ? v : undefined);
  const initialParams: ChurchSearchParams = {
    name: str(searchParams.name),
    city: str(searchParams.city),
    state: str(searchParams.state)?.toUpperCase(),
    zip: str(searchParams.zip),
    denomination: str(searchParams.denomination),
  };
  const initialPage = Math.max(1, Number(str(searchParams.page)) || 1);
  const canSearch = validateSearchParams(initialParams) === null;

  const initialResult = canSearch
    ? await searchChurches(initialParams)
    : { churches: [], total: 0 };
  const [denominationCounts, translationCounts] = supabase
    ? await Promise.all([getDenominationCounts(), getTranslationCounts()])
    : [[], []];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-semibold text-brand-900 sm:text-4xl">
        Church Finder
      </h1>
      <p className="mt-3 max-w-3xl text-neutral-600">
        Search over 351,000 U.S. churches by name, denomination, city, or zip code. Where we&apos;ve confirmed which
        Bible translation a church or its denomination uses, it&apos;s shown below — most
        churches don&apos;t have this confirmed yet, since it&apos;s researched one at a time.
      </p>

      <details className="mt-4 max-w-3xl">
        <summary className="cursor-pointer text-sm font-medium text-brand-700 hover:underline">
          What churches are listed here?
        </summary>
        <div className="mt-2 space-y-2 text-sm text-neutral-600">
          <p>
            Churches from the historic Christian traditions — Catholic, Orthodox, and Protestant.
            The common thread, and the line for what&apos;s included, is that Jesus Christ is God
            and the Bible is God&apos;s authoritative word.
          </p>
          <p>
            Nearly half of listings still show &ldquo;Denomination not identified&rdquo; — the
            source data didn&apos;t specify one. Those get sorted out by hand over time, along
            with corrections and new churches people submit.
          </p>
        </div>
      </details>

      {!supabase ? (
        <p className="mt-8 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Church Finder isn&apos;t configured for this deployment yet — add{" "}
          <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your environment
          variables.
        </p>
      ) : (
        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* left column — denominations */}
          <div className="order-2 lg:order-1 lg:w-80 lg:shrink-0">
            <CountTable title="Denominations" rows={denominationCounts} />
          </div>

          {/* middle column — search, results, add-a-church */}
          <div className="order-1 min-w-0 lg:order-2 lg:flex-1">
            <ChurchSearch
              initialParams={initialParams}
              initialResult={initialResult}
              initialPage={initialPage}
              denominations={denominationCounts}
            />
          </div>

          {/* right column — bible translations */}
          <div className="order-3 lg:order-3 lg:w-72 lg:shrink-0">
            <CountTable title="Bible Translations" rows={translationCounts} />
          </div>
        </div>
      )}
    </div>
  );
}
