export interface RankingEntry {
  /** Translation id (data/translations.json). */
  id: string;
  /** One or two sentences on why it earned this spot. */
  blurb: string;
}

export interface RankingCategory {
  slug: string;
  title: string;
  /** What this category is actually measuring. */
  criteria: string;
  entries: RankingEntry[];
  /** Trailing context/caveat shown after the ranked list. */
  note?: string;
}

/**
 * Curated, criteria-based picks — not a single objective score. Each list is
 * grounded in the comparison data (data/translations.json), the glossary
 * definitions (lib/glossary.ts), and each translation's own profile
 * (lib/translationProfiles.ts).
 */
export const rankingCategories: RankingCategory[] = [
  {
    slug: "popular",
    title: "Most Popular",
    criteria:
      "Which translations consistently show up near the top of U.S. Christian retail bestseller charts.",
    entries: [
      {
        id: "niv",
        blurb:
          "The best-selling modern English translation for most of the past several decades, and still reliably in the top two or three spots on most current bestseller lists.",
      },
      {
        id: "nlt",
        blurb:
          "Has been neck-and-neck with the NIV recently — in parts of 2025, Christian retail unit-sales data actually had the NLT edging ahead of it.",
      },
      {
        id: "kjv",
        blurb:
          "The best-selling Bible translation of all time by a wide margin, thanks to a 400-year head start and being fully public domain — and it still holds a top spot on current charts.",
      },
    ],
    note: "ESV, NKJV, CSB, and NASB also regularly land in the industry's top ten bestseller list; exact order shifts from month to month. NET and LSB, by contrast, don't typically appear on these charts at all — NET because it was built for free online distribution rather than print sales, and LSB because it's the newest translation on this site, published in 2021.",
  },
  {
    slug: "personal-study",
    title: "Best for Personal Study",
    criteria:
      "Which translations give a careful reader the most help digging into what the original text actually says.",
    entries: [
      {
        id: "net",
        blurb:
          "Its Full Notes Edition carries more than 60,000 translators' notes — more than any other translation here — walking through word choices, alternate readings, and textual variants verse by verse.",
      },
      {
        id: "nasb",
        blurb:
          "Long the standard for close, word-for-word study, especially for readers doing original-language word studies or comparing translations line by line.",
      },
      {
        id: "esv",
        blurb:
          "The base text for the widely used ESV Study Bible, backed by one of the largest libraries of study notes, commentaries, and devotionals built around any single translation.",
      },
    ],
  },
  {
    slug: "pastors",
    title: "Best for Pastors",
    criteria:
      "Which translations hold up best in the pulpit — accurate enough to preach expositionally, natural enough to read aloud.",
    entries: [
      {
        id: "csb",
        blurb:
          "Its “optimal equivalence” approach was built around exactly this tradeoff, aiming for language that reads naturally aloud without losing precision.",
      },
      {
        id: "esv",
        blurb:
          "A standard preaching and teaching text in Reformed and broadly Reformed pulpits, valued for staying close to the original wording.",
      },
      {
        id: "niv",
        blurb:
          "The most broadly familiar translation to congregations — useful when a pastor wants the text they're preaching from to match what's already in the pews.",
      },
    ],
  },
  {
    slug: "balance",
    title: "Best Overall Balance",
    criteria:
      "Which translations avoid leaning hard toward either strict literalism or loose paraphrase, using this site's own Formal/Dynamic/Optimal philosophy labels and reading levels as a guide.",
    entries: [
      {
        id: "csb",
        blurb:
          "The only translation on this site classified “Optimal” rather than Formal or Dynamic — its whole method is leaning formal or dynamic verse by verse, whichever best balances accuracy and readability.",
      },
      {
        id: "niv",
        blurb:
          "A Dynamic translation that stays at a similar 7th-8th grade reading level to the CSB, without drifting as far toward the more paraphrase-like end of readability.",
      },
      {
        id: "nlt",
        blurb:
          "Reads more easily than most translations here, but its 90-scholar committee translated it directly from the original languages rather than paraphrasing an existing English text — a genuine translation, not a paraphrase.",
      },
    ],
  },
];
