"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { HistoryImage as HistoryImageData } from "@/lib/englishBibleHistory";

/**
 * Wraps a thumbnail in a button that opens the full source scan in a
 * dismissible full-screen overlay — for the /history images, where the detail
 * is the point. Click the backdrop, the ✕, or press Escape to close. The
 * overlay drops the archival sepia filter so the scan reads true.
 */
export default function ImageZoom({
  image,
  children,
  className = "",
}: {
  image: HistoryImageData;
  /** the thumbnail markup (must be valid inside a <button>) */
  children: ReactNode;
  /** classes for the trigger button */
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Enlarge: ${image.alt}`}
        className={`group relative cursor-zoom-in appearance-none border-0 bg-transparent p-0 ${className}`}
      >
        {children}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-brand-900/70 text-white opacity-0 transition group-hover:opacity-100"
        >
          <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5">
            <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M12.5 12.5 L17 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M8.5 6 V11 M6 8.5 H11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={image.alt}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/90 p-4 sm:p-10"
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-3xl leading-none text-white hover:bg-white/20"
          >
            &times;
          </button>
          {/* Plain <img> so the click loads the full source scan, not a
              responsive variant sized for the thumbnail slot. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[82vh] w-auto max-w-full cursor-default rounded-sm object-contain shadow-2xl"
          />
          <figcaption
            onClick={(e) => e.stopPropagation()}
            className="max-w-xl cursor-default text-center text-xs leading-snug text-neutral-300"
          >
            {image.caption}
            <span className="mt-1 block text-[0.7rem] text-neutral-500">{image.credit}</span>
          </figcaption>
        </div>
      )}
    </>
  );
}
