/**
 * The four translation-philosophy zones as a slim bar — the site's recurring
 * visual motif. Formal (indigo), the mediating middle that holds both
 * Optimal and Mixed (teal, still one zone, not split — they share the
 * mediating middle by design), Dynamic (amber), and Paraphrase (stone, added
 * 2026-09-18 alongside The Message). Widths echo how the twenty-six cluster
 * on the full spectrum (components/TranslationSpectrum.tsx). The bar itself
 * stays decorative (aria-hidden); pass `showLabels` to add the zone names
 * beneath it as real, readable text — used on the landing page but not the
 * footer, which keeps the plain unlabeled strip.
 */
export default function SpectrumStrip({
  className = "",
  showLabels = false,
}: {
  className?: string;
  showLabels?: boolean;
}) {
  // Caller sets the height (e.g. "h-1.5", "h-2").
  return (
    <div>
      <div className={`flex overflow-hidden rounded-full ${className || "h-1.5"}`} aria-hidden="true">
        <span className="flex-[3] bg-indigo-300" />
        <span className="flex-[2.1] bg-teal-300" />
        <span className="flex-[2.4] bg-amber-300" />
        <span className="flex-[0.6] bg-stone-300" />
      </div>
      {showLabels && (
        <div className="mt-1.5 flex text-[11px] font-medium text-neutral-500">
          <span className="flex-[3] text-center">Formal</span>
          <span className="flex-[2.1] text-center">Optimal &middot; Mixed</span>
          <span className="flex-[2.4] text-center">Dynamic</span>
          <span className="flex-[0.6] text-center">Paraphrase</span>
        </div>
      )}
    </div>
  );
}
