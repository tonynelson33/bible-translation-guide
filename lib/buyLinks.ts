export interface BuyLink {
  label: string;
  url: string;
}

/**
 * Plain outbound links to retailers that carry each translation — no
 * affiliate tracking. Keyed by translation id (data/translations.json).
 * Christianbook.com has a dedicated category page for most translations
 * (christianbook.com/page/bibles/translations/{code}), verified working for
 * everything except LSB, which isn't carried there — 316 Publishing (linked
 * from lsbible.org itself) is used instead.
 */
export const buyLinks: Record<string, BuyLink[]> = {
  esv: [
    { label: "Amazon", url: "https://www.amazon.com/s?k=ESV+Bible" },
    { label: "Christianbook.com", url: "https://www.christianbook.com/page/bibles/translations/esv" },
  ],
  kjv: [
    { label: "Amazon", url: "https://www.amazon.com/s?k=KJV+Bible" },
    { label: "Christianbook.com", url: "https://www.christianbook.com/page/bibles/translations/kjv" },
  ],
  niv: [
    { label: "Amazon", url: "https://www.amazon.com/s?k=NIV+Bible" },
    { label: "Christianbook.com", url: "https://www.christianbook.com/page/bibles/translations/niv" },
  ],
  nlt: [
    { label: "Amazon", url: "https://www.amazon.com/s?k=NLT+Bible" },
    { label: "Christianbook.com", url: "https://www.christianbook.com/page/bibles/translations/nlt" },
  ],
  csb: [
    { label: "Amazon", url: "https://www.amazon.com/s?k=CSB+Bible" },
    { label: "Christianbook.com", url: "https://www.christianbook.com/page/bibles/translations/csb" },
  ],
  lsb: [
    { label: "Amazon", url: "https://www.amazon.com/s?k=Legacy+Standard+Bible" },
    { label: "316 Publishing (official)", url: "https://316publishing.com/collections/legacy-standard-bible" },
  ],
  nkjv: [
    { label: "Amazon", url: "https://www.amazon.com/s?k=NKJV+Bible" },
    { label: "Christianbook.com", url: "https://www.christianbook.com/page/bibles/translations/nkjv" },
  ],
  nasb: [
    { label: "Amazon", url: "https://www.amazon.com/s?k=NASB+Bible" },
    { label: "Christianbook.com", url: "https://www.christianbook.com/page/bibles/translations/nasb" },
  ],
  net: [
    { label: "Amazon", url: "https://www.amazon.com/s?k=NET+Bible" },
    { label: "Christianbook.com", url: "https://www.christianbook.com/page/bibles/translations/net" },
  ],
};
