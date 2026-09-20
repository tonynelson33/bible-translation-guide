/**
 * "Septuagint (LXX)" -> "septuagint"; drops parentheticals rather than keeping
 * their punctuation, so anchors and search hrefs stay short and stable.
 *
 * Lives here rather than in app/glossary/page.tsx so lib/searchIndex.ts can
 * import it without pulling in that page's `metadata` export — Next.js
 * refuses to bundle any file that exports `metadata` into a client
 * component's module graph, and SiteSearch (which needs this function) is
 * a client component.
 */
export function slugifyGlossaryTerm(term: string) {
  return term
    .replace(/\([^)]*\)/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
