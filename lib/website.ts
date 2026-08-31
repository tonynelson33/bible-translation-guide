/**
 * Church website helpers. Pure string functions — no DB import — so both the
 * client suggestion forms and the server-rendered result card can use them.
 */

/**
 * Normalises a submitted church website to a stored `https://…` URL, or null.
 * "https:// is assumed" — the submitter types just the host (+ path), with or
 * without `www.`; we keep `www.` only if they included it (forcing it breaks
 * apex-only domains and `.church` TLDs). Anything without a dot, or with a
 * space, is treated as not-a-URL and dropped.
 */
export function normalizeWebsite(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const v = raw
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");
  if (!v || /\s/.test(v) || !v.includes(".")) return null;
  return `https://${v}`;
}

/** Strips the scheme and any trailing slash, for use as visible link text. */
export function prettyWebsite(url: string): string {
  return url.replace(/^https?:\/\//i, "").replace(/\/+$/, "");
}
