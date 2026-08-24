import type { Translation } from "./types";
import lsbCachedVerses from "@/data/lsbCachedVerses.json";

export interface VerseFetchResult {
  translationId: string;
  status: "ok" | "unavailable" | "error";
  text: string | null;
  attribution: string | null;
  message?: string;
}

interface VerseRef {
  reference: string; // e.g. "John 3:16"
  apiBibleVerseId: string; // e.g. "JHN.3.16"
}

const FETCH_TIMEOUT_MS = 8000;

function withTimeout(): AbortSignal {
  return AbortSignal.timeout(FETCH_TIMEOUT_MS);
}

async function fetchFromBibleApiCom(
  translation: Translation,
  verse: VerseRef
): Promise<VerseFetchResult> {
  const code = translation.abbreviation.toLowerCase();
  const url = `https://bible-api.com/${encodeURIComponent(verse.reference)}?translation=${code}`;
  try {
    const res = await fetch(url, { signal: withTimeout(), next: { revalidate: 3600 } });
    if (!res.ok) {
      return {
        translationId: translation.id,
        status: "error",
        text: null,
        attribution: null,
        message: `bible-api.com returned HTTP ${res.status}.`,
      };
    }
    const data = await res.json();
    if (!data?.text) {
      return {
        translationId: translation.id,
        status: "error",
        text: null,
        attribution: null,
        message: "bible-api.com response did not include verse text.",
      };
    }
    return {
      translationId: translation.id,
      status: "ok",
      text: String(data.text).trim(),
      attribution: "Public domain. Text served via bible-api.com.",
    };
  } catch {
    return {
      translationId: translation.id,
      status: "error",
      text: null,
      attribution: null,
      message: "Could not reach bible-api.com.",
    };
  }
}

async function fetchFromEsvApi(
  translation: Translation,
  verse: VerseRef
): Promise<VerseFetchResult> {
  const apiKey = process.env.ESV_API_KEY;
  if (!apiKey) {
    return {
      translationId: translation.id,
      status: "unavailable",
      text: null,
      attribution: null,
      message:
        "ESV_API_KEY is not set. Sign up for a free account and API application at api.esv.org, then add the key to your environment variables.",
    };
  }
  const url = `https://api.esv.org/v3/passage/text/?q=${encodeURIComponent(
    verse.reference
  )}&include-headings=false&include-footnotes=false&include-verse-numbers=false&include-short-copyright=false&include-passage-references=false`;
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Token ${apiKey}` },
      signal: withTimeout(),
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      return {
        translationId: translation.id,
        status: "error",
        text: null,
        attribution: null,
        message: `ESV API returned HTTP ${res.status}.`,
      };
    }
    const data = await res.json();
    const text = data?.passages?.[0]?.trim();
    if (!text) {
      return {
        translationId: translation.id,
        status: "error",
        text: null,
        attribution: null,
        message: "ESV API response did not include passage text.",
      };
    }
    return {
      translationId: translation.id,
      status: "ok",
      text,
      attribution:
        "Scripture quotations marked ESV are from the ESV® Bible (The Holy Bible, English Standard Version®), copyright © 2001 by Crossway. Used by permission. All rights reserved. (Verify exact required wording against Crossway's current permissions page before launch.)",
    };
  } catch {
    return {
      translationId: translation.id,
      status: "error",
      text: null,
      attribution: null,
      message: "Could not reach api.esv.org.",
    };
  }
}

async function fetchFromNetBible(
  translation: Translation,
  verse: VerseRef
): Promise<VerseFetchResult> {
  const url = `https://labs.bible.org/api/?passage=${encodeURIComponent(
    verse.reference
  )}&type=json`;
  try {
    const res = await fetch(url, { signal: withTimeout(), next: { revalidate: 3600 } });
    if (!res.ok) {
      return {
        translationId: translation.id,
        status: "error",
        text: null,
        attribution: null,
        message: `NET Bible web service returned HTTP ${res.status}.`,
      };
    }
    const data = await res.json();
    const text = Array.isArray(data)
      ? data.map((v: { text?: string }) => v.text ?? "").join(" ").trim()
      : "";
    if (!text) {
      return {
        translationId: translation.id,
        status: "error",
        text: null,
        attribution: null,
        message: "NET Bible web service response did not include verse text.",
      };
    }
    return {
      translationId: translation.id,
      status: "ok",
      text,
      attribution:
        "NET Bible® copyright © 1996-2017 by Biblical Studies Press, L.L.C. Used by permission, all rights reserved. (Verify exact required wording against bible.org's current terms before launch.)",
    };
  } catch {
    return {
      translationId: translation.id,
      status: "error",
      text: null,
      attribution: null,
      message: "Could not reach labs.bible.org.",
    };
  }
}

async function fetchFromApiBible(
  translation: Translation,
  verse: VerseRef
): Promise<VerseFetchResult> {
  const apiKey = process.env.API_BIBLE_KEY;
  const bibleId = translation.verseApi.apiBibleId;
  if (!apiKey || !bibleId) {
    return {
      translationId: translation.id,
      status: "unavailable",
      text: null,
      attribution: null,
      message:
        translation.verseApi.note ??
        "Not configured for scripture.api.bible. Set API_BIBLE_KEY and an apiBibleId for this translation.",
    };
  }
  const url = `https://api.scripture.api.bible/v1/bibles/${bibleId}/verses/${verse.apiBibleVerseId}?content-type=text&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=false&include-verse-spans=false`;
  try {
    const res = await fetch(url, {
      headers: { "api-key": apiKey },
      signal: withTimeout(),
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      return {
        translationId: translation.id,
        status: "error",
        text: null,
        attribution: null,
        message: `api.scripture.api.bible returned HTTP ${res.status}. This translation may not be enabled on your account's plan.`,
      };
    }
    const data = await res.json();
    const text = data?.data?.content?.trim();
    if (!text) {
      return {
        translationId: translation.id,
        status: "error",
        text: null,
        attribution: null,
        message: "api.scripture.api.bible response did not include verse text.",
      };
    }
    return {
      translationId: translation.id,
      status: "ok",
      text,
      attribution:
        data?.data?.copyright ??
        `${translation.name}, served via scripture.api.bible. Confirm required copyright/attribution text with the publisher.`,
    };
  } catch {
    return {
      translationId: translation.id,
      status: "error",
      text: null,
      attribution: null,
      message: "Could not reach api.scripture.api.bible.",
    };
  }
}

/**
 * Serves verse text sourced by hand from read.lsbible.org (see data/lsbCachedVerses.json)
 * rather than a live API — the LSB has no public API, and this site isn't built for
 * automated access. Only covers the 5 sample verses on /verses; well within Lockman's
 * published permission to store up to 1,000 LSB verses electronically with attribution.
 */
function fetchFromCache(translation: Translation, verse: VerseRef): VerseFetchResult {
  const text = (lsbCachedVerses as Record<string, string>)[verse.reference];
  if (!text) {
    return {
      translationId: translation.id,
      status: "unavailable",
      text: null,
      attribution: null,
      message: `No cached text for ${verse.reference} yet — only the sample verses on this page have been sourced.`,
    };
  }
  return {
    translationId: translation.id,
    status: "ok",
    text,
    attribution:
      "Scripture quotations taken from the (LSB®) Legacy Standard Bible®, Copyright © 2021 by The Lockman Foundation. Used by permission. All rights reserved.",
  };
}

export async function fetchVerseForTranslation(
  translation: Translation,
  verse: VerseRef
): Promise<VerseFetchResult> {
  switch (translation.verseApi.provider) {
    case "bible-api":
      return fetchFromBibleApiCom(translation, verse);
    case "esv-api":
      return fetchFromEsvApi(translation, verse);
    case "net-bible":
      return fetchFromNetBible(translation, verse);
    case "api-bible":
      return fetchFromApiBible(translation, verse);
    case "cached":
      return fetchFromCache(translation, verse);
    case "unavailable":
    default:
      return {
        translationId: translation.id,
        status: "unavailable",
        text: null,
        attribution: null,
        message: translation.verseApi.note ?? "No text source configured for this translation yet.",
      };
  }
}
