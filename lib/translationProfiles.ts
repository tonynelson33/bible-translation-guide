export interface TranslationProfile {
  /** One-sentence editorial summary shown under the title. */
  tagline: string;
  /** Overview paragraphs — history, sponsoring body, translation approach. */
  overview: string[];
  /** Short bullet list of what sets this translation apart. */
  distinctives: string[];
  /** Who this translation tends to suit well. */
  goodFor: string[];
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
      "Its roots go back further than most readers realize: the project began in 1984 under Arthur Farstad, the general editor of the New King James Version, who originally envisioned it continuing in the same Received Text tradition as the KJV and NKJV. After Farstad died in 1998, editor Edwin Blum took over a team of roughly 100 scholars from about 20 denominations — and the project shifted to the modern critical Greek text instead, the textual family the CSB still uses today. The Bible published as the HCSB in 2004 (revised 2009) was substantially reworked and relaunched as the CSB in 2017, under translation oversight co-chairs Thomas Schreiner and David Allen.",
      "The CSB describes its own method as “optimal equivalence”: rather than committing wholesale to either strict word-for-word translation or thought-for-thought paraphrase, translators lean formal or dynamic verse by verse, aiming for the best balance of accuracy and natural, readable English in each case.",
      "On gender language, the CSB takes what this site labels a moderate approach: where the original Hebrew or Greek is clearly addressing both men and women — like the Greek word for “brothers” used to open a letter to an entire congregation — the CSB renders it inclusively as “brothers and sisters” or “everyone,” while keeping masculine wording wherever a passage is addressing men specifically or referring to God. It's a translation decision about matching who the original text was written to, not a statement on today's gender debates. The 2020 update refined a small number of these renderings without changing the translation's overall philosophy or textual basis.",
    ],
    distinctives: [
      "Bolds Old Testament quotations that appear in the New Testament, so cross-references are easy to spot at a glance while reading.",
      "Renders the Hebrew divine name (YHWH) as “Lord” in the traditional style throughout — a reversal from its predecessor, the HCSB, which had rendered it “Yahweh” roughly 600 times in the Old Testament.",
      "Targets roughly a 7th-8th grade reading level — more readable than formal translations like the ESV or NASB, without moving as far toward paraphrase as the NLT.",
      "Used as the base text for the CSB Study Bible and widely adopted in Southern Baptist and other evangelical churches for preaching and small groups.",
    ],
    goodFor: [
      "Readers who want a translation that's comfortable to read aloud and easy to follow, but still stays close to the original wording.",
      "Small groups, youth ministry, and sermon preparation where a moderate reading level helps.",
      "Anyone who likes being able to spot Old Testament quotations in the New Testament without a cross-reference footnote.",
    ],
  },
};
