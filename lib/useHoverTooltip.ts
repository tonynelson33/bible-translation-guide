"use client";

import { useState } from "react";

export interface HoverTooltipState {
  top: number;
  left: number;
  placement: "above" | "below";
  text: string;
}

const WIDTH = 224; // w-56
const VIEWPORT_MARGIN = 8;

/**
 * Shared show/hide + viewport-clamped positioning for the site's instant
 * hover popups (no native `title` delay). Used by the HTML `Tooltip`
 * component and by hand-hovered SVG diagrams, which can't wrap their nodes
 * in a `<span>` the way `Tooltip` wraps arbitrary children.
 */
export function useHoverTooltip() {
  const [state, setState] = useState<HoverTooltipState | null>(null);

  function show(rect: DOMRect, text: string) {
    // Flip below the trigger when there isn't enough room above (e.g. a sticky
    // header sitting close to the top of the viewport) so the popup never runs
    // off-screen.
    const placement: "above" | "below" = rect.top < 70 ? "below" : "above";
    const top = placement === "above" ? rect.top - 8 : rect.bottom + 8;
    // Clamp horizontally so the popup never runs off the left/right edge.
    const halfWidth = WIDTH / 2;
    const idealLeft = rect.left + rect.width / 2;
    const left = Math.min(
      Math.max(idealLeft, halfWidth + VIEWPORT_MARGIN),
      window.innerWidth - halfWidth - VIEWPORT_MARGIN,
    );
    setState({ top, left, placement, text });
  }

  function hide() {
    setState(null);
  }

  return { state, show, hide };
}
