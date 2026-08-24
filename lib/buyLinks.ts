export interface ExternalLink {
  label: string;
  url: string;
}

export interface TranslationLinks {
  /** Where to buy print/digital editions. */
  buy: ExternalLink[];
  /** Where to read the full text free online. */
  readFree: ExternalLink[];
}

/**
 * Plain outbound links — no affiliate tracking. Keyed by translation id
 * (data/translations.json). Every URL here was individually verified to
 * resolve to real content before being added; a few notable gaps are
 * intentional, not oversights:
 *  - NIV has no direct publisher storefront — Zondervan sells only through
 *    retailers, so there's no "official" buy link for it.
 *  - CSB and NET don't operate their own stores either, but both have an
 *    official free-reading site (read.csbible.com, bible.org).
 *  - LSB isn't available on Bible Gateway at all.
 *  - KJV has no single publisher (public domain), so there's no "official"
 *    buy link for it either — just retailers.
 */
export const translationLinks: Record<string, TranslationLinks> = {
  esv: {
    buy: [
      { label: "Crossway (official)", url: "https://www.crossway.org/bibles/" },
      { label: "Amazon", url: "https://www.amazon.com/s?k=ESV+Bible" },
      { label: "Christianbook.com", url: "https://www.christianbook.com/page/bibles/translations/esv" },
    ],
    readFree: [
      { label: "Bible Gateway", url: "https://www.biblegateway.com/passage/?search=John+3%3A16&version=ESV" },
      { label: "YouVersion", url: "https://www.bible.com/versions/59" },
    ],
  },
  kjv: {
    buy: [
      { label: "Amazon", url: "https://www.amazon.com/s?k=KJV+Bible" },
      { label: "Christianbook.com", url: "https://www.christianbook.com/page/bibles/translations/kjv" },
    ],
    readFree: [
      { label: "Bible Gateway", url: "https://www.biblegateway.com/passage/?search=John+3%3A16&version=KJV" },
      { label: "YouVersion", url: "https://www.bible.com/versions/547" },
    ],
  },
  niv: {
    buy: [
      { label: "Amazon", url: "https://www.amazon.com/s?k=NIV+Bible" },
      { label: "Christianbook.com", url: "https://www.christianbook.com/page/bibles/translations/niv" },
    ],
    readFree: [
      { label: "Bible Gateway", url: "https://www.biblegateway.com/passage/?search=John+3%3A16&version=NIV" },
      { label: "YouVersion", url: "https://www.bible.com/versions/111" },
    ],
  },
  nlt: {
    buy: [
      { label: "Tyndale (official)", url: "https://www.tyndale.com/bibles/nlt" },
      { label: "Amazon", url: "https://www.amazon.com/s?k=NLT+Bible" },
      { label: "Christianbook.com", url: "https://www.christianbook.com/page/bibles/translations/nlt" },
    ],
    readFree: [
      { label: "Bible Gateway", url: "https://www.biblegateway.com/passage/?search=John+3%3A16&version=NLT" },
      { label: "YouVersion", url: "https://www.bible.com/versions/116" },
    ],
  },
  csb: {
    buy: [
      { label: "Amazon", url: "https://www.amazon.com/s?k=CSB+Bible" },
      { label: "Christianbook.com", url: "https://www.christianbook.com/page/bibles/translations/csb" },
    ],
    readFree: [
      { label: "Read the CSB (official)", url: "https://read.csbible.com/" },
      { label: "Bible Gateway", url: "https://www.biblegateway.com/passage/?search=John+3%3A16&version=CSB" },
      { label: "YouVersion", url: "https://www.bible.com/versions/1713" },
    ],
  },
  lsb: {
    buy: [
      { label: "316 Publishing (official)", url: "https://316publishing.com/collections/legacy-standard-bible" },
      { label: "Amazon", url: "https://www.amazon.com/s?k=Legacy+Standard+Bible" },
    ],
    readFree: [
      { label: "LSBible.org (official)", url: "https://read.lsbible.org/" },
      { label: "YouVersion", url: "https://www.bible.com/versions/3345" },
    ],
  },
  nkjv: {
    buy: [
      { label: "Thomas Nelson (official)", url: "https://www.thomasnelsonbibles.com/productcat/nkjv-bibles/" },
      { label: "Amazon", url: "https://www.amazon.com/s?k=NKJV+Bible" },
      { label: "Christianbook.com", url: "https://www.christianbook.com/page/bibles/translations/nkjv" },
    ],
    readFree: [
      { label: "Bible Gateway", url: "https://www.biblegateway.com/passage/?search=John+3%3A16&version=NKJV" },
      { label: "YouVersion", url: "https://www.bible.com/versions/114" },
    ],
  },
  nasb: {
    buy: [
      { label: "Lockman Foundation (official)", url: "https://shop.lockman.org/collections/nasb" },
      { label: "Amazon", url: "https://www.amazon.com/s?k=NASB+Bible" },
      { label: "Christianbook.com", url: "https://www.christianbook.com/page/bibles/translations/nasb" },
    ],
    readFree: [
      { label: "Bible Gateway", url: "https://www.biblegateway.com/passage/?search=John+3%3A16&version=NASB" },
      { label: "YouVersion", url: "https://www.bible.com/versions/2692" },
    ],
  },
  net: {
    buy: [
      { label: "Amazon", url: "https://www.amazon.com/s?k=NET+Bible" },
      { label: "Christianbook.com", url: "https://www.christianbook.com/page/bibles/translations/net" },
    ],
    readFree: [
      { label: "Bible.org (official)", url: "https://bible.org/" },
      { label: "Bible Gateway", url: "https://www.biblegateway.com/passage/?search=John+3%3A16&version=NET" },
      { label: "YouVersion", url: "https://www.bible.com/versions/107" },
    ],
  },
};
