/**
 * The four translation-philosophy bands as a slim, label-free bar — the site's
 * recurring visual motif. The widths echo how the twelve translations cluster
 * on the full spectrum (components/TranslationSpectrum.tsx): a wide formal band,
 * a narrow mediating middle, a broad dynamic band. Decorative, so aria-hidden.
 */
export default function SpectrumStrip({ className = "" }: { className?: string }) {
  // Caller sets the height (e.g. "h-1.5", "h-2").
  return (
    <div
      className={`flex overflow-hidden rounded-full ${className || "h-1.5"}`}
      aria-hidden="true"
    >
      <span className="flex-[3] bg-indigo-300" />
      <span className="flex-[1.2] bg-teal-300" />
      <span className="flex-[0.9] bg-purple-300" />
      <span className="flex-[2.4] bg-amber-300" />
    </div>
  );
}
