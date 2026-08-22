export interface TranslationProfile {
  /** One-sentence editorial summary shown under the title. */
  tagline: string;
  /** Overview paragraphs — history, sponsoring body, translation approach. */
  overview: string[];
  /** Short bullet list of what sets this translation apart. */
  distinctives: string[];
  /** Who this translation tends to suit well. */
  goodFor: string[];
  /** Honest tradeoffs or reasons to look elsewhere. */
  consider: string[];
}

/**
 * Keyed by translation id (data/translations.json). Only translations with an
 * entry here get the full profile page; others still fall back to ComingSoon
 * via app/translations/[slug]/page.tsx. Fill in one at a time.
 */
export const translationProfiles: Partial<Record<string, TranslationProfile>> = {
  csb: {
    tagline:
      "A modern “optimal equivalence” translation built to read naturally aloud without straying into paraphrase.",
    overview: [
      "The Christian Standard Bible is a revision of the Holman Christian Standard Bible (HCSB), released in 2017 and updated again in 2020. It's published by Holman Bible Publishers, the publishing arm of LifeWay Christian Resources, and produced by a translation oversight committee of evangelical scholars drawn from multiple denominations.",
      "The CSB describes its own method as “optimal equivalence”: rather than committing wholesale to either strict word-for-word translation or thought-for-thought paraphrase, translators lean formal or dynamic verse by verse, aiming for the best balance of accuracy and natural, readable English in each case.",
      "The 2020 update refined gender language in a small number of passages and revised some wording that had drawn criticism in the original HCSB, without changing the translation's overall philosophy or textual basis.",
    ],
    distinctives: [
      "Bolds Old Testament quotations that appear in the New Testament, so cross-references are easy to spot at a glance while reading.",
      "Targets roughly a 7th-8th grade reading level — more readable than formal translations like the ESV or NASB, without moving as far toward paraphrase as the NLT.",
      "Backed by a broad evangelical translation committee rather than a single denomination, though it's most closely associated with Southern Baptist publishing.",
      "Used as the base text for the CSB Study Bible and widely adopted in Southern Baptist and other evangelical churches for preaching and small groups.",
    ],
    goodFor: [
      "Readers who want a translation that's comfortable to read aloud and easy to follow, but still stays close to the original wording.",
      "Small groups, youth ministry, and sermon preparation where a moderate reading level helps.",
      "Anyone who likes being able to spot Old Testament quotations in the New Testament without a cross-reference footnote.",
    ],
    consider: [
      "It's newer and less widely known than long-established translations like the KJV, NIV, or NASB, so pew and study-resource availability can be more limited.",
      "If you want the most literal, word-for-word rendering for close word studies, a more formal translation like the ESV, NASB, or LSB may serve better.",
      "Its free quote allowance (1,000 verses) is generous but not unlimited — large-scale reproduction still needs publisher permission.",
    ],
  },
};
