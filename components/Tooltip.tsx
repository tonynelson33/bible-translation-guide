"use client";

import { useRef, useState, type ReactNode } from "react";

/**
 * Positions its popup with `fixed` (viewport-relative) instead of `absolute`, so it
 * isn't clipped by the comparison table's `overflow-x-auto` wrapper — an `overflow-x`
 * other than `visible` forces `overflow-y` to compute to `auto` too, which clips any
 * `absolute` popup that pops upward out of the row.
 */
export default function Tooltip({ text, children }: { text: string; children: ReactNode }) {
  const triggerRef = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number; placement: "above" | "below" } | null>(
    null,
  );

  const TOOLTIP_WIDTH = 224; // w-56
  const VIEWPORT_MARGIN = 8;

  function show() {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    // Flip below the trigger when there isn't enough room above (e.g. a sticky header
    // sitting close to the top of the viewport) so the popup never runs off-screen.
    const placement = rect.top < 70 ? "below" : "above";
    const top = placement === "above" ? rect.top - 8 : rect.bottom + 8;
    // Clamp horizontally so the popup never runs off the left/right edge of the screen.
    const halfWidth = TOOLTIP_WIDTH / 2;
    const idealLeft = rect.left + rect.width / 2;
    const left = Math.min(
      Math.max(idealLeft, halfWidth + VIEWPORT_MARGIN),
      window.innerWidth - halfWidth - VIEWPORT_MARGIN,
    );
    setPos({ top, left, placement });
  }

  function hide() {
    setPos(null);
  }

  return (
    <span
      ref={triggerRef}
      className="cursor-help"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      tabIndex={0}
    >
      {children}
      {pos && (
        <span
          role="tooltip"
          className={`pointer-events-none fixed z-50 w-56 -translate-x-1/2 rounded bg-neutral-900 px-2.5 py-1.5 text-center text-xs font-normal normal-case leading-snug text-white shadow-lg ${
            pos.placement === "above" ? "-translate-y-full" : ""
          }`}
          style={{ top: pos.top, left: pos.left }}
        >
          {text}
        </span>
      )}
    </span>
  );
}
