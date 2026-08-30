"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  searchChurches,
  validateSearchParams,
  PAGE_SIZE,
  RESULTS_LIMIT,
  type ChurchSearchParams,
  type ChurchSearchResult,
  type CountRow,
} from "@/lib/churches";
import { US_STATES } from "@/lib/usStates";
import ChurchResultCard from "./ChurchResultCard";
import AddChurchForm from "./AddChurchForm";

const inputClass =
  "rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400";

export default function ChurchSearch({
  initialParams,
  initialResult,
  initialPage,
  denominations,
}: {
  initialParams: ChurchSearchParams;
  initialResult: ChurchSearchResult;
  initialPage: number;
  denominations: CountRow[];
}) {
  const [name, setName] = useState(initialParams.name ?? "");
  const [city, setCity] = useState(initialParams.city ?? "");
  const [state, setState] = useState(initialParams.state ?? "");
  const [zip, setZip] = useState(initialParams.zip ?? "");
  const [denomination, setDenomination] = useState(initialParams.denomination ?? "");

  const hadInitialSearch = validateSearchParams(initialParams) === null;
  const [result, setResult] = useState<ChurchSearchResult>(initialResult);
  const [activeParams, setActiveParams] = useState<ChurchSearchParams>(initialParams);
  const [searched, setSearched] = useState(hadInitialSearch);
  const [page, setPage] = useState(hadInitialSearch ? initialPage : 1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const zipActive = zip.trim().length > 0;

  // Real denomination buckets only (drop the "not identified" catch-all), A–Z.
  const denomOptions = useMemo(
    () => denominations.filter((d) => d.value).sort((a, b) => a.label.localeCompare(b.label)),
    [denominations],
  );
  const denomLabel = (slug?: string) =>
    denomOptions.find((d) => d.value === slug)?.label ?? null;

  function describe(p: ChurchSearchParams): string {
    const where = p.zip
      ? `zip ${p.zip}`
      : p.city
        ? p.state
          ? `${p.city}, ${p.state}`
          : p.city
        : p.state
          ? US_STATES.find((s) => s.code === p.state)?.name ?? p.state
          : null;
    const dl = denomLabel(p.denomination);
    if (dl && where) return ` — ${dl} · ${where}`;
    if (dl) return ` — ${dl}`;
    if (where) return ` in ${where}`;
    return "";
  }

  // Push the current query into the URL bar without a Next navigation, so the
  // page stays put (no RSC refetch, no scroll jump) but the link is shareable
  // and a manual refresh re-runs the same search server-side.
  function syncUrl(params: ChurchSearchParams, pageNum: number) {
    const qs = new URLSearchParams();
    if (params.name) qs.set("name", params.name);
    if (params.denomination) qs.set("denomination", params.denomination);
    if (params.zip) qs.set("zip", params.zip);
    else {
      if (params.city) qs.set("city", params.city);
      if (params.state) qs.set("state", params.state);
    }
    if (pageNum > 1) qs.set("page", String(pageNum));
    const query = qs.toString();
    window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const params: ChurchSearchParams = zipActive
      ? { name: name.trim(), denomination, zip: zip.trim() }
      : { name: name.trim(), denomination, city: city.trim(), state: state.trim() };

    const validationError = validateSearchParams(params);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setLoading(true);
    const res = await searchChurches(params);
    setResult(res);
    setActiveParams(params);
    setSearched(true);
    setPage(1);
    setLoading(false);
    syncUrl(params, 1);
  }

  const totalPages = Math.max(1, Math.ceil(result.churches.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageRows = result.churches.slice(pageStart, pageStart + PAGE_SIZE);

  function goToPage(next: number) {
    const clamped = Math.min(Math.max(next, 1), totalPages);
    setPage(clamped);
    syncUrl(activeParams, clamped);
  }

  const capped = result.total > RESULTS_LIMIT;
  const narrowHint = activeParams.name
    ? "narrow it down further"
    : activeParams.denomination
      ? "add a church name to narrow it down"
      : "add a church name or denomination to narrow it down";

  return (
    <div className="flex flex-col gap-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4"
      >
        <div className="flex flex-wrap items-end gap-2">
          <label className="flex flex-col gap-1 text-sm font-medium text-neutral-700">
            Church name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Grace Baptist"
              className={`w-56 ${inputClass}`}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-neutral-700">
            Denomination
            <select
              value={denomination}
              onChange={(e) => setDenomination(e.target.value)}
              className={`w-56 ${inputClass}`}
            >
              <option value="">Any denomination</option>
              {denomOptions.map((d) => (
                <option key={d.value} value={d.value as string}>
                  {d.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-neutral-700">
            City
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={zipActive}
              placeholder="e.g. Austin"
              className={`w-40 ${inputClass}`}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-neutral-700">
            State
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              disabled={zipActive}
              className={`w-40 ${inputClass}`}
            >
              <option value="">Any state</option>
              {US_STATES.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <span className="pb-2 text-sm text-neutral-400">or</span>
          <label className="flex flex-col gap-1 text-sm font-medium text-neutral-700">
            Zip code
            <input
              type="text"
              inputMode="numeric"
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
              placeholder="78701"
              className={`w-24 ${inputClass}`}
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Searching…" : "Search"}
          </button>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {zipActive && (
          <p className="text-xs text-neutral-400">
            Searching by zip code — city and state are ignored.
          </p>
        )}
      </form>

      {searched && !loading && (
        <div>
          {result.total === 0 ? (
            <p className="text-neutral-500">
              No churches found for that search. Try a different name, denomination, city, or zip
              code.
            </p>
          ) : (
            <>
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <p className="text-sm text-neutral-600">
                  <span className="font-medium text-neutral-800">
                    {result.total.toLocaleString()}{" "}
                    {result.total === 1 ? "church" : "churches"}
                  </span>
                  {describe(activeParams)}
                  {result.churches.length > PAGE_SIZE && (
                    <>
                      {" "}
                      — showing {pageStart + 1}–{pageStart + pageRows.length}
                    </>
                  )}
                  {capped && (
                    <span className="text-neutral-400"> (first {RESULTS_LIMIT} shown — {narrowHint})</span>
                  )}
                </p>
                {totalPages > 1 && (
                  <div className="flex items-center gap-2 text-sm">
                    <button
                      type="button"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="rounded border border-neutral-300 px-2 py-0.5 text-neutral-600 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Previous page"
                    >
                      ‹
                    </button>
                    <span className="tabular-nums text-neutral-500">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      type="button"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="rounded border border-neutral-300 px-2 py-0.5 text-neutral-600 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Next page"
                    >
                      ›
                    </button>
                  </div>
                )}
              </div>
              <ul className="flex flex-col gap-2">
                {pageRows.map((church) => (
                  <ChurchResultCard key={church.id} church={church} />
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      <AddChurchForm defaultOpen />
    </div>
  );
}
