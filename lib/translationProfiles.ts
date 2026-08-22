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
      "A modern “optimal equivalence” translation designed to be read naturally aloud without drifting into paraphrase.",
    overview: [
      "The Christian Standard Bible is a revision of the Holman Christian Standard Bible (HCSB), released in 2017 and updated again in 2020. It's published by Holman Bible Publishers — the publishing arm of LifeWay Christian Resources — and produced by a translation oversight committee of evangelical scholars from multiple denominations.",
      "Its roots go back further than most readers realize. The project began in 1984 under Arthur Farstad, general editor of the New King James Version, who originally planned to keep it in the same Received Text tradition as the KJV and NKJV. After Farstad died in 1998, editor Edwin Blum took over a team of roughly 100 scholars from about 20 denominations and steered the project toward the modern critical Greek text instead — the textual family the CSB still uses today. What was published as the HCSB in 2004 (revised in 2009) was substantially reworked and relaunched as the CSB in 2017, under translation oversight co-chairs Thomas Schreiner and David Allen.",
      "The CSB describes its own method as “optimal equivalence”: rather than committing wholesale to strict word-for-word translation or thought-for-thought paraphrase, translators lean more formal or more dynamic verse by verse, whichever best balances accuracy with natural, readable English.",
      "The CSB also takes a moderate approach to gender language. When the original Hebrew or Greek is clearly addressing both men and women — the Greek word for “brothers,” for instance, was routinely used to open a letter to an entire congregation — the CSB translates it inclusively, as “brothers and sisters” or “everyone” (about 151 places, versus the HCSB's consistent use of “brothers”). Wherever a passage addresses men specifically, or refers to God, the traditional masculine wording stays. In other words, it's a decision about matching who the original author was writing to, not a stance on modern conversations about gender — and the 2020 update simply refined a handful of these renderings without changing the CSB's overall philosophy or textual basis.",
      "Since its 2017 launch, the CSB has also become one of the fastest-growing English translations on the market. It broke into the industry's top five best-selling translations within a few years, and for several months in 2023 it ranked as the second best-selling Bible translation in the U.S. — behind only the NIV — according to Evangelical Christian Publishers Association sales data.",
    ],
    distinctives: [
      "Bolds Old Testament quotations that appear in the New Testament, so cross-references are easy to spot at a glance while reading.",
      "Renders the Hebrew divine name (YHWH) as “Lord,” the traditional style — a change from its predecessor, the HCSB, which had rendered it “Yahweh” roughly 600 times in the Old Testament.",
      "Targets roughly a 7th-8th grade reading level — more readable than formal translations like the ESV or NASB, without moving as far toward paraphrase as the NLT.",
      "Translated from the same critical-text family as most modern translations — the Nestle-Aland/UBS Greek New Testament and the Biblia Hebraica Stuttgartensia Old Testament — putting it in the same textual lineage as the ESV, NIV, and NASB.",
      "Anchors a growing shelf of study editions, including the CSB Study Bible, the CSB Apologetics Study Bible, the CSB Tony Evans Study Bible, and the CSB She Reads Truth Bible, and is widely used in Southern Baptist and other evangelical churches for preaching and small groups.",
    ],
    goodFor: [
      "Pastors and teachers who need a text accurate enough to preach expositionally from, but natural enough to read aloud to a congregation without stumbling over stiff phrasing.",
      "Personal and family Bible reading, where a 7th-8th grade level keeps it comfortable for teens and adults alike without drifting into paraphrase.",
      "Churches and small groups already using LifeWay curriculum — Sunday School material, VBS, and the CSB Study Bible are all built around this translation.",
    ],
  },
};
