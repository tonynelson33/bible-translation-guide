import type { Translation } from "./types";
import cachedVerses from "@/data/cachedVerses.json";

export interface VerseFetchResult {
  translationId: string;
  status: "ok" | "unavailable" | "error";
  text: string | null;
  attribution: string | null;
  message?: string;
}

interface VerseRef {
  reference: string; // e.g. "John 3:16"
}

type CacheEntry = { attribution: string; verses: Record<string, string> };

/**
 * The /verses and translation-profile pages compare a fixed, curated set of
 * sample verses, so their text is stored in data/cachedVerses.json rather than
 * fetched from a live API. Each translation's five verses sit well within its
 * publisher's free-quotation allowance for this non-commercial site, with the
 * required copyright notice in `attribution`. Sourcing is documented in
 * data/cachedVerses.README.md. To add a sample verse, add its text for every
 * translation in cachedVerses.json (and the reference to data/verses.json).
 */
export function fetchVerseForTranslation(
  translation: Translation,
  verse: VerseRef,
): VerseFetchResult {
  const entry = (cachedVerses as Record<string, CacheEntry>)[translation.id];
  const text = entry?.verses[verse.reference];

  if (!entry || !text) {
    return {
      translationId: translation.id,
      status: "unavailable",
      text: null,
      attribution: null,
      message: `No cached text for ${translation.abbreviation} ${verse.reference} — only the sample verses on this page have been sourced.`,
    };
  }

  return {
    translationId: translation.id,
    status: "ok",
    text,
    attribution: entry.attribution,
  };
}
