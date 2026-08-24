import type { Metadata } from "next";
import ChurchResultCard from "@/components/ChurchResultCard";
import { searchChurches } from "@/lib/churches";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Church Finder",
  alternates: { canonical: "/church-finder" },
};

export default async function ChurchFinderPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const city = typeof searchParams.city === "string" ? searchParams.city : undefined;
  const state = typeof searchParams.state === "string" ? searchParams.state : undefined;
  const zip = typeof searchParams.zip === "string" ? searchParams.zip : undefined;
  const hasSearched = Boolean(city || zip);

  const results = hasSearched ? await searchChurches({ city, state, zip }) : [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-semibold text-brand-900 sm:text-4xl">
        Church Finder
      </h1>
      <p className="mt-3 text-neutral-600">
        Search over 361,000 U.S. churches by city or zip code. Where we&apos;ve confirmed which
        Bible translation a church or its denomination uses, it&apos;s shown below — most
        churches don&apos;t have this confirmed yet, since it&apos;s researched one at a time.
      </p>

      {!supabase ? (
        <p className="mt-8 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Church Finder isn&apos;t configured for this deployment yet — add{" "}
          <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your environment
          variables.
        </p>
      ) : (
        <>
          <form className="mt-8 flex flex-wrap items-end gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
            <label className="flex flex-col gap-1 text-sm font-medium text-neutral-700">
              City
              <input
                type="text"
                name="city"
                defaultValue={city}
                placeholder="e.g. Austin"
                className="w-40 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-neutral-700">
              State
              <input
                type="text"
                name="state"
                defaultValue={state}
                placeholder="TX"
                maxLength={2}
                className="w-20 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm uppercase text-neutral-900 shadow-sm focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
              />
            </label>
            <span className="pb-2 text-sm text-neutral-400">or</span>
            <label className="flex flex-col gap-1 text-sm font-medium text-neutral-700">
              Zip code
              <input
                type="text"
                name="zip"
                defaultValue={zip}
                placeholder="78701"
                className="w-28 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
              />
            </label>
            <button
              type="submit"
              className="rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
            >
              Search
            </button>
          </form>

          {hasSearched && (
            <div className="mt-8">
              {results.length === 0 ? (
                <p className="text-neutral-500">
                  No churches found for that search. Try a different city or zip code.
                </p>
              ) : (
                <>
                  <p className="mb-3 text-sm text-neutral-500">
                    Showing {results.length} result{results.length === 1 ? "" : "s"}
                    {results.length === 30 ? " (first 30 — narrow your search for more precise results)" : ""}
                  </p>
                  <ul className="flex flex-col gap-3">
                    {results.map((church) => (
                      <ChurchResultCard key={church.id} church={church} />
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
