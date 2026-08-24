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
 * resolve to real content before being added.
 *
 * "Official" doesn't always mean the publisher's own branded domain: NIV's
 * publisher Zondervan and CSB's publisher Holman are both part of larger
 * groups (HarperCollins Christian Publishing and LifeWay Christian
 * Resources respectively) that run their own storefronts — FaithGateway and
 * LifeWay.com — so those are used instead of a nonexistent Zondervan.com or
 * Holman-branded store.
 *
 * A couple of intentional gaps remain:
 *  - NET doesn't operate its own store, but has an official free-reading
 *    site (bible.org).
 *  - LSB isn't available on Bible Gateway at all.
 *  - KJV has no single publisher (public domain), so there's no "official"
 *    buy link for it — just retailers.
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
      { label: "FaithGateway (official)", url: "https://faithgateway.com/collections/niv-bibles" },
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
      { label: "LifeWay (official)", url: "https://www.lifeway.com/en/shop/bibles/csb" },
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
