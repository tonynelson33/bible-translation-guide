"use client";

import { useRef, type ReactNode } from "react";
import { useHoverTooltip } from "@/lib/useHoverTooltip";
import TooltipBubble from "./TooltipBubble";

/**
 * Positions its popup with `fixed` (viewport-relative) instead of `absolute`, so it
 * isn't clipped by the comparison table's `overflow-x-auto` wrapper — an `overflow-x`
 * other than `visible` forces `overflow-y` to compute to `auto` too, which clips any
 * `absolute` popup that pops upward out of the row.
 */
export default function Tooltip({
  text,
  children,
  variant = "dark",
}: {
  text: string;
  children: ReactNode;
  variant?: "dark" | "light";
}) {
  const triggerRef = useRef<HTMLSpanElement>(null);
  const { state, show, hide } = useHoverTooltip();

  function handleShow() {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) show(rect, text);
  }

  return (
    <span
      ref={triggerRef}
      className="cursor-help"
      onMouseEnter={handleShow}
      onMouseLeave={hide}
      onFocus={handleShow}
      onBlur={hide}
      tabIndex={0}
    >
      {children}
      <TooltipBubble state={state} variant={variant} />
    </span>
  );
}
