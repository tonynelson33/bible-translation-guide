/**
 * The three translation-philosophy zones as a slim, label-free bar — the site's
 * recurring visual motif. Formal (indigo), the mediating middle that holds both
 * Optimal and Mixed (teal), and Dynamic (amber). Widths echo how the twelve
 * cluster on the full spectrum (components/TranslationSpectrum.tsx). Decorative,
 * so aria-hidden.
 */
export default function SpectrumStrip({ className = "" }: { className?: string }) {
  // Caller sets the height (e.g. "h-1.5", "h-2").
  return (
    <div
      className={`flex overflow-hidden rounded-full ${className || "h-1.5"}`}
      aria-hidden="true"
    >
      <span className="flex-[3] bg-indigo-300" />
      <span className="flex-[2.1] bg-teal-300" />
      <span className="flex-[2.4] bg-amber-300" />
    </div>
  );
}
