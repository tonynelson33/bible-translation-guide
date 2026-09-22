// Shown instantly on navigation while the page's four Supabase queries run —
// /church-finder is force-dynamic (see page.tsx) so there's no static shell
// to show otherwise, and a blank tab makes the live-query time feel worse
// than it is. Proportions roughly match the real 3-column layout so nothing
// jumps around when the real content swaps in.
export default function ChurchFinderLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold text-brand-900 sm:text-4xl">
        Church Finder
      </h1>
      <p className="mt-3 max-w-3xl text-neutral-600">
        Search U.S. Protestant churches by name, denomination, city, or zip code.
      </p>

      <div className="mt-6 flex animate-pulse flex-col gap-6 lg:flex-row lg:items-start">
        <div className="min-w-0 space-y-4 lg:flex-1">
          <div className="h-44 rounded-lg border border-neutral-200 bg-neutral-100" />
          <div className="h-28 rounded-lg border border-neutral-200 bg-neutral-100" />
        </div>
        <div className="lg:w-80 lg:shrink-0">
          <div className="h-80 rounded-lg border border-neutral-200 bg-neutral-100" />
        </div>
        <div className="lg:w-72 lg:shrink-0">
          <div className="h-80 rounded-lg border border-neutral-200 bg-neutral-100" />
        </div>
      </div>
    </div>
  );
}
