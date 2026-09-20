"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { searchIndex, searchItems, type SearchItem, type SearchItemType } from "@/lib/searchIndex";

const GROUP_ORDER: SearchItemType[] = ["Translation", "Question", "Glossary", "Page"];
const GROUP_LABEL: Record<SearchItemType, string> = {
  Translation: "Translations",
  Question: "FAQ",
  Glossary: "Glossary",
  Page: "Pages",
};
const MAX_PER_GROUP = 5;

function SearchIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
      <path d="M13.5 13.5 L18 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Site-wide quick search: translations, FAQ questions, glossary terms, and
 * pages (lib/searchIndex.ts). Deliberately type-ahead-and-pick, not a
 * search-results page — the whole index is small enough that a couple of
 * typed letters narrows it to a handful of items, so there's nothing a
 * results page would add. One instance lives in Nav.tsx, positioned so its
 * trigger button sits with whichever of the desktop nav / mobile menu button
 * is visible at the current breakpoint.
 */
export default function SiteSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = useMemo(() => searchItems(query, searchIndex), [query]);

  const grouped = useMemo(() => {
    const byType = new Map<SearchItemType, SearchItem[]>();
    for (const item of results) {
      const list = byType.get(item.type) ?? [];
      if (list.length < MAX_PER_GROUP) list.push(item);
      byType.set(item.type, list);
    }
    return GROUP_ORDER.map((type) => ({ type, items: byType.get(type) ?? [] })).filter(
      (g) => g.items.length > 0,
    );
  }, [results]);

  const flatResults = useMemo(() => grouped.flatMap((g) => g.items), [grouped]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) {
        const tag = (e.target as HTMLElement | null)?.tagName;
        const typing = tag === "INPUT" || tag === "TEXTAREA";
        const isShortcut = (e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing);
        if (isShortcut) {
          e.preventDefault();
          setOpen(true);
        }
        return;
      }
      if (e.key === "Escape") {
        close();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, flatResults.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = flatResults[activeIndex];
        if (item) go(item);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, flatResults, activeIndex]);

  function go(item: SearchItem) {
    close();
    const hash = item.href.split("#")[1];
    router.push(item.href);
    if (hash) {
      // Confirmed by testing: router.push() to a hash on a long page (e.g.
      // an FAQ question well down /faq) doesn't reliably scroll to it —
      // works fine near the top of a page, silently fails further down,
      // presumably a race with the new page's layout still settling. A
      // <Link> click handles this itself; router.push() from plain code
      // doesn't, so poll briefly for the target to exist and scroll to it
      // ourselves once it does. scroll-mt-* on the anchor elements themselves
      // still supplies the sticky-nav offset.
      let attempts = 0;
      const tryScroll = () => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ block: "start" });
        } else if (attempts++ < 20) {
          setTimeout(tryScroll, 50);
        }
      };
      setTimeout(tryScroll, 50);
    }
  }

  function close() {
    setOpen(false);
    setQuery("");
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search the site"
        title="Search (Ctrl/Cmd+K)"
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded text-neutral-600 transition-colors hover:bg-brand-50 hover:text-brand-800"
      >
        <SearchIcon />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          onClick={close}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 pt-20 sm:pt-28"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[70vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
          >
            <div className="flex flex-shrink-0 items-center gap-2 border-b border-neutral-200 px-4 py-3">
              <SearchIcon className="h-4 w-4 flex-shrink-0 text-neutral-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search translations, questions, terms…"
                className="w-full border-0 p-0 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:ring-0"
              />
              <button
                type="button"
                onClick={close}
                aria-label="Close search"
                className="flex-shrink-0 rounded border border-neutral-200 px-1.5 py-0.5 text-xs font-medium text-neutral-400 hover:text-neutral-600"
              >
                Esc
              </button>
            </div>

            <div className="overflow-y-auto py-2">
              {query.trim() === "" ? (
                <p className="px-4 py-6 text-center text-sm text-neutral-400">
                  Try a translation, an abbreviation, or a topic like &ldquo;gender language&rdquo;
                  or &ldquo;textus receptus.&rdquo;
                </p>
              ) : flatResults.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-neutral-400">
                  No matches for &ldquo;{query}.&rdquo;
                </p>
              ) : (
                grouped.map((group) => (
                  <div key={group.type} className="px-2 py-1">
                    <p className="px-2 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                      {GROUP_LABEL[group.type]}
                    </p>
                    {group.items.map((item) => {
                      const idx = flatResults.indexOf(item);
                      return (
                        <button
                          key={item.type + item.href + item.title}
                          type="button"
                          onClick={() => go(item)}
                          onMouseEnter={() => setActiveIndex(idx)}
                          className={`block w-full rounded-lg px-2 py-2 text-left transition-colors ${
                            idx === activeIndex ? "bg-brand-50" : ""
                          }`}
                        >
                          <span className="block truncate text-sm font-medium text-brand-900">
                            {item.title}
                          </span>
                          {item.subtitle && (
                            <span className="block truncate text-xs text-neutral-500">
                              {item.subtitle}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
