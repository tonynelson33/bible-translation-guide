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
 *  - KJV has no single publisher (public domain), so there's no "official"
 *    buy link for it — just retailers.
 *  - NRSVue is the same: the NCC licenses it to many houses, so no one store
 *    is "official."
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
      { label: "Bible Gateway", url: "https://www.biblegateway.com/passage/?search=John+3%3A16&version=LSB" },
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
  nrsvue: {
    // No single publisher — the NCC licenses the NRSVue to many houses (HarperOne,
    // Zondervan, Cambridge, Oxford, Hendrickson), so there's no one "official" store.
    buy: [
      { label: "Christianbook.com", url: "https://www.christianbook.com/page/bibles/translations/nrsv" },
      { label: "Amazon", url: "https://www.amazon.com/s?k=NRSVue+Bible" },
    ],
    readFree: [
      { label: "Bible Gateway", url: "https://www.biblegateway.com/passage/?search=John+3%3A16&version=NRSVUE" },
    ],
  },
  ceb: {
    buy: [
      { label: "Common English Bible (official)", url: "https://www.commonenglishbible.com/explore/shop" },
      { label: "Amazon", url: "https://www.amazon.com/s?k=Common+English+Bible" },
      { label: "Christianbook.com", url: "https://www.christianbook.com/page/bibles/translations/ceb" },
    ],
    readFree: [
      { label: "Read the CEB (official)", url: "https://www.commonenglishbible.com/explore/read-online" },
      { label: "Bible Gateway", url: "https://www.biblegateway.com/passage/?search=John+3%3A16&version=CEB" },
    ],
  },
  amp: {
    buy: [
      { label: "Lockman Foundation (official)", url: "https://shop.lockman.org/collections/amplified" },
      { label: "Amazon", url: "https://www.amazon.com/s?k=Amplified+Bible" },
      { label: "Christianbook.com", url: "https://www.christianbook.com/page/bibles/translations/amplified" },
    ],
    readFree: [
      { label: "Bible Gateway", url: "https://www.biblegateway.com/passage/?search=John+3%3A16&version=AMP" },
    ],
  },
  bsb: {
    buy: [
      { label: "Amazon", url: "https://www.amazon.com/s?k=Berean+Standard+Bible" },
    ],
    readFree: [
      { label: "Berean Bible (official)", url: "https://bereanbible.com/" },
      { label: "YouVersion", url: "https://www.bible.com/versions/3034-bsb-english-berean-standard-bible" },
    ],
  },
  web: {
    buy: [
      { label: "Amazon", url: "https://www.amazon.com/s?k=World+English+Bible" },
    ],
    readFree: [
      { label: "World English Bible (official)", url: "https://worldenglish.bible/" },
      { label: "YouVersion", url: "https://www.bible.com/versions/206-web-world-english-bible" },
    ],
  },
  gnt: {
    buy: [
      { label: "Bibles.com (American Bible Society, official)", url: "https://www.bibles.com/good-news-translation-gnt-bible-5.html" },
      { label: "Amazon", url: "https://www.amazon.com/s?k=Good+News+Translation+Bible" },
      { label: "Christianbook.com", url: "https://www.christianbook.com/page/bibles/translations/gnt" },
    ],
    readFree: [
      { label: "Bible Gateway", url: "https://www.biblegateway.com/passage/?search=John+3%3A16&version=GNT" },
      { label: "YouVersion", url: "https://www.bible.com/versions/68-gnt-good-news-translation" },
    ],
  },
  cev: {
    buy: [
      { label: "Amazon", url: "https://www.amazon.com/s?k=Contemporary+English+Version+Bible" },
      { label: "Christianbook.com", url: "https://www.christianbook.com/page/bibles/translations/cev" },
    ],
    readFree: [
      { label: "Bible Gateway", url: "https://www.biblegateway.com/passage/?search=John+3%3A16&version=CEV" },
      { label: "YouVersion", url: "https://www.bible.com/versions/392-cev-contemporary-english-version" },
    ],
  },
  nirv: {
    buy: [
      { label: "Amazon", url: "https://www.amazon.com/s?k=NIrV+Bible" },
      { label: "Christianbook.com", url: "https://www.christianbook.com/page/bibles/translations/nirv" },
    ],
    readFree: [
      { label: "Bible Gateway", url: "https://www.biblegateway.com/passage/?search=John+3%3A16&version=NIRV" },
      { label: "YouVersion", url: "https://www.bible.com/versions/110-nirv-new-international-readers-version" },
    ],
  },
  isv: {
    buy: [
      { label: "Amazon", url: "https://www.amazon.com/s?k=International+Standard+Version+Bible" },
    ],
    readFree: [
      { label: "ISV Foundation (official)", url: "https://isvbible.org/" },
      { label: "Bible Gateway", url: "https://www.biblegateway.com/passage/?search=John+3%3A16&version=ISV" },
    ],
  },
  gw: {
    buy: [
      { label: "Amazon", url: "https://www.amazon.com/s?k=GOD%27S+WORD+Translation+Bible" },
    ],
    readFree: [
      { label: "GOD'S WORD to the Nations (official)", url: "https://godsword.org/" },
      { label: "YouVersion", url: "https://www.bible.com/versions/70-gw-gods-word" },
    ],
  },
  ncv: {
    buy: [
      { label: "Amazon", url: "https://www.amazon.com/s?k=New+Century+Version+Bible" },
      { label: "Christianbook.com", url: "https://www.christianbook.com/page/bibles/translations/ncv" },
    ],
    readFree: [
      { label: "Bible Gateway", url: "https://www.biblegateway.com/passage/?search=John+3%3A16&version=NCV" },
      { label: "YouVersion", url: "https://www.bible.com/versions/105-ncv-new-century-version" },
    ],
  },
  mev: {
    buy: [
      { label: "Amazon", url: "https://www.amazon.com/s?k=Modern+English+Version+Bible" },
    ],
    readFree: [
      { label: "Bible Gateway", url: "https://www.biblegateway.com/passage/?search=John+3%3A16&version=MEV" },
      { label: "YouVersion", url: "https://www.bible.com/versions/1171-mev-modern-english-version" },
    ],
  },
  leb: {
    buy: [
      { label: "Lexham Press (official)", url: "https://lexhamenglishbible.com/" },
    ],
    readFree: [
      { label: "Bible Gateway", url: "https://www.biblegateway.com/passage/?search=John+3%3A16&version=LEB" },
      { label: "YouVersion", url: "https://www.bible.com/versions/90-leb-lexham-english-bible" },
    ],
  },
  voice: {
    buy: [
      { label: "Thomas Nelson (official)", url: "https://www.thomasnelsonbibles.com/the-voice/" },
      { label: "Amazon", url: "https://www.amazon.com/s?k=The+Voice+Bible" },
    ],
    readFree: [
      { label: "Bible Gateway", url: "https://www.biblegateway.com/passage/?search=John+3%3A16&version=VOICE" },
    ],
  },
  lsv: {
    buy: [
      { label: "Amazon", url: "https://www.amazon.com/s?k=Literal+Standard+Version+Bible" },
    ],
    readFree: [
      { label: "LSV Bible (official)", url: "https://www.lsvbible.com/" },
      { label: "Bible Hub", url: "https://biblehub.com/lsv/" },
    ],
  },
  msb: {
    buy: [
      { label: "Amazon", url: "https://www.amazon.com/s?k=Majority+Standard+Bible" },
    ],
    readFree: [
      { label: "Majority Bible (official)", url: "https://majoritybible.com/" },
      { label: "YouVersion", url: "https://www.bible.com/versions/4754-msb-majority-standard-bible" },
    ],
  },
};
