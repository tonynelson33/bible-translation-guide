/**
 * The four translation-philosophy zones as a slim bar — the site's recurring
 * visual motif. Formal (blue), the balanced middle that holds both Optimal
 * and Mixed (teal, still one zone, not split — they share the balanced
 * middle by design), Dynamic (amber), and Paraphrase (stone, added
 * 2026-09-18 alongside The Message). Widths echo how the twenty-six cluster
 * on the full spectrum (components/TranslationSpectrum.tsx). The bar itself
 * stays decorative (aria-hidden); pass `showLabels` to add the zone names
 * above it and each zone's method below, both as real, readable text — used
 * on the landing page but not the footer, which keeps the plain unlabeled
 * strip.
 */
const ZONES = [
  { name: "Formal", method: "word-for-word", flex: 3, bg: "bg-blue-300" },
  { name: "Balanced", method: "optimal + mixed", flex: 2.1, bg: "bg-teal-300" },
  { name: "Dynamic", method: "thought-for-thought", flex: 2.4, bg: "bg-amber-300" },
  { name: "Paraphrase", method: "freely restated", flex: 0.6, bg: "bg-stone-300" },
];

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
      {showLabels && (
        <div className="flex text-[11px] font-medium text-neutral-600">
          {ZONES.map((z) => (
            <span key={z.name} className="text-center" style={{ flex: z.flex }}>
              {z.name}
            </span>
          ))}
        </div>
      )}
      <div className={`mt-1 flex overflow-hidden rounded-full ${className || "h-1.5"}`} aria-hidden="true">
        {ZONES.map((z) => (
          <span key={z.name} className={z.bg} style={{ flex: z.flex }} />
        ))}
      </div>
      {showLabels && (
        <div className="mt-1.5 flex text-[11px] text-neutral-500">
          {ZONES.map((z) => (
            <span key={z.name} className="text-center" style={{ flex: z.flex }}>
              {z.method}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
