// Shared verse-text cleanup for the one-off fetch scripts.
//
// PRINCIPLE: the words and punctuation of a verse are reproduced EXACTLY as the
// source API returns them — every quotation mark, dash, semicolon. Nothing is
// added, substituted, or removed from the sentence. We only:
//   - drop editorial furniture that isn't the verse: chapter/verse numbers,
//     footnote reference markers, section headings, and Psalm superscriptions
//   - collapse whitespace (including poetic line breaks) so the verse renders
//     on one line in a comparison card — standard practice for quoting a verse
//     inline, and not a change to the text itself.

const SUPERSCRIPTION = /^(A|To the choirmaster\.?)[^.]*\bof David\.?\s*/i;

/** bible-api.com (KJV), labs.bible.org (NET), api.scripture.api.bible */
export function cleanPlain(raw) {
  if (!raw) return null;
  return raw
    .replace(/<[^>]+>/g, " ") // labs.bible.org wraps OT quotes in <b>…</b>
    .replace(SUPERSCRIPTION, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * api.esv.org text endpoint. Fetch it with include-headings=false,
 * include-footnotes=false, include-verse-numbers=false,
 * include-passage-references=false — then this only needs to drop the Psalm
 * superscription and flatten whitespace. The leading “ that the ESV puts on
 * quoted speech (John 3:16 etc.) is KEPT.
 */
export function cleanEsv(raw) {
  if (!raw) return null;
  return raw.replace(SUPERSCRIPTION, "").replace(/\s+/g, " ").trim();
}
