import type { HoverTooltipState } from "@/lib/useHoverTooltip";

/**
 * Presentational half of the site's hover popups — `Tooltip` and the SVG
 * diagrams (`TranslationSpectrum`, `TranslationFamilyTree`) each drive one of
 * these from their own `useHoverTooltip` state. `light` is the white-on-paper
 * look used on the verse comparison rows and both spectrum diagrams; `dark`
 * (the default) is used everywhere else — rankings, the comparison table,
 * profile pages, and the tier chips.
 */
export default function TooltipBubble({
  state,
  variant = "dark",
}: {
  state: HoverTooltipState | null;
  variant?: "dark" | "light";
}) {
  if (!state) return null;
  return (
    <span
      role="tooltip"
      className={`pointer-events-none fixed z-50 w-56 -translate-x-1/2 rounded px-2.5 py-1.5 text-center text-xs font-normal normal-case leading-snug shadow-lg ${
        variant === "light"
          ? "border border-neutral-200 bg-white text-neutral-800"
          : "bg-neutral-900 text-white"
      } ${state.placement === "above" ? "-translate-y-full" : ""}`}
      style={{ top: state.top, left: state.left }}
    >
      {state.text}
    </span>
  );
}
