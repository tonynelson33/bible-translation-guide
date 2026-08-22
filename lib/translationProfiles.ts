export interface TranslationProfile {
  /** One-sentence editorial summary shown under the title. */
  tagline: string;
  /** Overview paragraphs — history, sponsoring body, translation approach. */
  overview: string[];
  /** Short bullet list of what sets this translation apart. */
  distinctives: string[];
  /** Who this translation tends to suit well. */
  goodFor: string[];
  /** Optional "fun fact" style notes on specific, memorable renderings — shown above the sample verse. */
  worthKnowing?: string[];
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
    worthKnowing: [
      "The CSB is one of the few modern translations to keep the Hebrew word wadi rather than translating it as “brook” or “valley” — as in “the Wadi Cherith,” where Elijah hid (1 Kings 17:3), or “the wadi of Kishon” (1 Kings 18:40). A wadi is a streambed that only carries water part of the year, so the choice paints a more precise picture of the terrain than “brook” does.",
      "One of its most recognizable renderings is John 3:16, translated as “For God loved the world in this way: He gave his one and only Son...” rather than the familiar “For God so loved the world...” The underlying Greek word there normally describes the manner of an action — the way something is done — rather than its degree, so the CSB is translating it to highlight how God loved the world (by giving his Son) rather than how much.",
    ],
  },

  esv: {
    tagline: "A formal, word-for-word translation designed for close study, without losing its literary voice.",
    overview: [
      "The English Standard Version is published by Crossway and produced by a translation oversight committee of evangelical scholars. First released in 2001 and most recently revised in 2016, it was built as a revision of the 1971 edition of the Revised Standard Version (RSV) — reworked line by line to align it with a more formal, “essentially literal” translation philosophy while keeping much of the RSV's literary quality.",
      "The ESV aims to be as literal as it can be while still reading as natural English — favoring word-for-word correspondence to the original Hebrew, Aramaic, and Greek wherever that's readable, and adjusting only where a strictly literal rendering would be genuinely unclear to a modern reader.",
      "On gender language, the ESV takes a traditional approach: it translates generic masculine terms — “brothers,” “man,” “he” — as they appear in the original text, without adding inclusive alternatives like “brothers and sisters.” The idea is to let the English wording match the original wording as closely as possible and leave it to the reader, in context, to recognize when a passage is addressing everyone.",
      "The ESV has become one of the most widely used translations in English-speaking evangelicalism since its release, especially in Reformed and broadly Reformed circles, and is the base text for the popular ESV Study Bible and a large library of ESV-based commentaries and devotionals.",
    ],
    distinctives: [
      "A revision of the 1971 Revised Standard Version, reworked into a more formal, essentially literal translation while preserving much of the RSV's literary quality.",
      "At a 10th-grade reading level, it sits between highly literal translations like the NASB and more conversational ones like the NIV or CSB.",
      "Keeps traditional, generic masculine language throughout rather than adding inclusive alternatives — one of the more literal approaches to gender language among modern translations.",
      "Underpins the widely used ESV Study Bible and a large library of ESV-based commentaries, devotionals, and study resources.",
    ],
    goodFor: [
      "Pastors, seminary students, and small-group leaders who want a formal, word-for-word translation to preach and teach from closely.",
      "Personal Bible reading and Scripture memorization for readers who want precision without the archaic language of the KJV.",
      "Households and churches already using the ESV Study Bible or other ESV-based study and devotional resources, since so much of that library is built around this specific text.",
    ],
    worthKnowing: [
      "In the summer of 2016, Crossway announced that the ESV's wording would become permanently fixed from then on — unchanging in all future printings, similar to how the KJV has stood since 1769. About a month later, Crossway reversed course and said the ESV would remain open to future revisions after all, keeping the door open for the kind of periodic updates most other translations receive.",
    ],
  },

  kjv: {
    tagline: "The original English translation whose language still echoes through English idiom, hymnody, and worship four centuries later.",
    overview: [
      "The King James Version — also known as the Authorized Version — was commissioned by King James I of England and first published in 1611. It's the oldest translation on this site by far, and remains one of the most widely recognized and read English Bibles today, more than four hundred years after its release.",
      "The work was carried out by 47 scholars organized into six translation companies working at Westminster, Oxford, and Cambridge, each assigned a different section of Scripture, with Archbishop Richard Bancroft overseeing the project. The translators drew on earlier English Bibles — including Tyndale's New Testament and the Geneva Bible — as a starting point rather than beginning from nothing.",
      "It's translated in a formal, word-for-word style from the Textus Receptus, a Greek New Testament text tradition compiled in the 16th century — a different textual lineage from the modern critical text that most newer translations, including its own successor the NKJV's marginal notes, now draw from.",
      "Its gender language is traditional simply because it predates the modern conversation about it by centuries: it renders the generic masculine language of its source text — “brethren,” generic “he,” “man” — directly, in the same Early Modern English idiom as the rest of the translation.",
      "The KJV remains the best-selling Bible translation of all time and continues to be widely used today, especially in traditional and liturgical congregations, and its phrasing is woven deeply into English literature, hymnody, and everyday idiom.",
    ],
    distinctives: [
      "Produced by 47 scholars working in six teams at Westminster, Oxford, and Cambridge, commissioned by King James I and first published in 1611.",
      "Translated from the Textus Receptus, a Greek New Testament text tradition distinct from the modern critical text used by most other major translations today.",
      "Fully in the public domain, so it can be freely copied, quoted, and republished without permission or restriction.",
      "At a 12th-grade reading level, its Early Modern English vocabulary and sentence structure make it the most formal, least conversational translation on this site.",
    ],
    goodFor: [
      "Traditional and liturgical congregations, especially those with a long-standing King James heritage in their worship and preaching.",
      "Readers who value the KJV's literary cadence and its enormous influence on English devotional writing, hymnody, and idiom.",
      "Anyone wanting Scripture that's fully public domain — freely quotable and reproducible without any copyright restriction.",
    ],
    worthKnowing: [
      "The King James Version most people read today isn't quite the original 1611 printing. In 1769, Oxford scholar Benjamin Blayney standardized its spelling and punctuation — correcting tens of thousands of small inconsistencies across earlier printings — without changing the wording itself. That 1769 edition is the text virtually all modern KJV Bibles use.",
      "Many everyday English expressions actually originated in the KJV's phrasing — “the writing on the wall” (Daniel 5), “a drop in the bucket” (Isaiah 40:15), “the powers that be” (Romans 13:1), and “a man after his own heart” (1 Samuel 13:14) all trace back to this translation, entering the language so thoroughly that most people who use them today don't realize they're quoting Scripture.",
    ],
  },

  niv: {
    tagline: "A thought-for-thought translation designed to read as clear, natural English for as wide an audience as possible.",
    overview: [
      "The New International Version is produced by the Committee on Bible Translation (CBT), a self-governing, international, and interdenominational group of biblical scholars, and published by Biblica and Zondervan. First published in 1978, it quickly became one of the best-selling and most widely read English Bible translations of the modern era.",
      "The NIV takes a dynamic, thought-for-thought approach: rather than tracking the original languages word for word, it prioritizes clear, natural English phrasing that conveys the same meaning a first-century reader would have understood — translated directly from the Hebrew, Aramaic, and Greek by scholars from the US, UK, Canada, Australia, and New Zealand.",
      "The CBT has continued to update the text since 1978 to keep pace with changes in English usage, including a 1984 revision and a more thoroughly gender-inclusive edition, the Today's New International Version (TNIV), published in 2005. The current 2011 edition builds on both the original NIV and the TNIV, incorporating some — though not all — of the gender-language changes the TNIV had introduced.",
      "On gender language, the current NIV takes an inclusive approach: where the original audience clearly included both men and women, it generally prefers gender-neutral wording — translating generic “man” as “human beings” or “people,” for instance, or recasting a generic singular “he” as a plural construction when that keeps the original meaning intact.",
      "The NIV has been the best-selling modern English Bible translation for most of the past several decades, with an enormous ecosystem of NIV-based study Bibles, commentaries, and church curricula built around it.",
    ],
    distinctives: [
      "Translated fresh from the original languages by an international, interdenominational committee, rather than being a revision of an earlier English translation.",
      "Undergoes periodic updates to keep pace with changes in English usage — the current 2011 text is the translation's fourth major edition since 1978.",
      "At a 7th-8th grade reading level, one of the more readable translations on this site while still translating directly from the original languages.",
      "One of the most widely used Bible translations in English-language ministry, and a common default translation across Bible apps and websites.",
    ],
    goodFor: [
      "New believers and general readers who want an accurate translation that reads naturally in contemporary English.",
      "Churches and small groups looking for the most widely used modern English translation, with an enormous library of NIV-based study Bibles, commentaries, and curricula already built around it.",
      "Family and youth ministry settings where clarity and readability matter as much as accuracy.",
    ],
    worthKnowing: [
      "The “International” in its name is literal: the Committee on Bible Translation intentionally drew scholars from the US, Canada, the UK, Australia, and New Zealand, aiming for English that would read naturally across English-speaking countries rather than favoring the phrasing of any one region.",
    ],
  },

  nlt: {
    tagline: "A clear, conversational translation designed to read as naturally as everyday storytelling.",
    overview: [
      "The New Living Translation is published by Tyndale House and grew out of The Living Bible, the personal paraphrase Kenneth Taylor originally wrote at his kitchen table in the 1960s so his ten children could follow along during family Bible reading. Tyndale published that paraphrase in 1971, and by the late 1980s assembled a team of about 90 evangelical scholars to turn it into a genuine translation from the original Hebrew, Aramaic, and Greek — released as the New Living Translation in 1996 and revised in 2004, 2007, and 2015.",
      "The NLT uses a dynamic, thought-for-thought approach: its translators worked directly from the original languages, aiming to express each passage's meaning in clear, natural, contemporary English rather than reproducing the original's exact sentence structure.",
      "On gender language, the NLT takes a moderate approach, similar to several other modern translations: where the original Hebrew or Greek is clearly addressing both men and women, it translates that inclusively — “brothers and sisters” rather than just “brothers,” for instance — while keeping masculine wording wherever a passage addresses men specifically or refers to God.",
      "At a 6th-grade reading level, the NLT is the most readable translation on this site without being a paraphrase like its predecessor, which has made it a popular choice for personal reading, family devotions, and outreach to readers less familiar with church language.",
    ],
    distinctives: [
      "Began as a revision of Kenneth Taylor's The Living Bible (1971) — Tyndale's team of roughly 90 scholars turned that personal paraphrase into a full translation from the original languages rather than simply updating its English.",
      "At a 6th-grade reading level, it's the most readable translation on this site, while still translating directly from the original languages rather than paraphrasing an existing English text.",
      "Uses natural, story-like prose that reads more like contemporary narrative writing, which is part of why it's popular for read-through-the-Bible plans.",
      "Backed by the large NLT Study Bible and other Tyndale devotional resources built specifically around this text.",
    ],
    goodFor: [
      "New believers, children, and family devotions, where a comfortable 6th-grade reading level keeps Scripture approachable without becoming a paraphrase.",
      "Personal daily reading and read-through-the-Bible plans, since its natural, story-like prose is easy to read in longer stretches.",
      "Outreach and evangelism settings, where the NLT's clarity is often a deliberate first choice for readers less familiar with church language.",
    ],
  },

  lsb: {
    tagline: "An update of the NASB tradition designed to be the most consistently literal English translation available.",
    overview: [
      "The Legacy Standard Bible is the newest translation on this site, first published in 2021. It grew out of a concern from John MacArthur and colleagues at The Master's Seminary that the NASB 1995 edition — the translation many conservative pastors and seminaries had relied on for decades — might eventually be phased out in favor of a more moderate revision. The LSB is a joint project of the Lockman Foundation, Three Sixteen Publishing, and the John MacArthur Charitable Trust, with a translation committee drawn from scholars and preachers at The Master's Seminary and The Master's University.",
      "Rather than a translation built from scratch, the LSB is explicitly framed as a direct update of the NASB 1995 text — aiming to “more fully implement” that translation's already strict, word-for-word philosophy, tighten its consistency, and modernize a small amount of archaic wording.",
      "On gender language, the LSB takes a traditional approach: it keeps the same generic masculine wording pattern as the NASB 1995 and the ESV, deliberately choosing not to adopt the more moderate, gender-inclusive language introduced in the NASB's later 2020 update.",
      "As the newest and least widely available translation on this site, the LSB doesn't yet have the decades-deep library of study Bibles and commentaries that older translations have built up — its use so far is concentrated mainly within Reformed and complementarian ministry circles connected to MacArthur's teaching ministry.",
    ],
    distinctives: [
      "A direct update of the NASB 1995 edition, produced to preserve and “more fully implement” that translation's strict literal philosophy for future generations.",
      "Restores the Hebrew divine name Yahweh in the Old Testament rather than the traditional “Lord” — a choice shared with the NASB tradition but dropped by many modern translations.",
      "Translates the Greek word doulos consistently as “slave” rather than “bondservant” or “servant,” aiming to preserve the full weight of the term's original meaning.",
      "Capitalizes pronouns referring to God (He, His, Him) throughout, a formatting convention several other modern translations have moved away from.",
      "Still the newest translation on this site — it doesn't yet have a major study Bible ecosystem, and it currently has no free public Bible-text API.",
    ],
    goodFor: [
      "Readers and preachers who already value the NASB's literal tradition and want the most consistently literal translation available today.",
      "Word studies and expository preaching where matching English words consistently to their underlying Hebrew or Greek terms matters.",
      "Churches and ministries connected to Grace Community Church, The Master's Seminary, or John MacArthur's teaching ministry, where the LSB is the primary pulpit text.",
    ],
    worthKnowing: [
      "The LSB exists partly because of a fork in the road for the NASB. When the Lockman Foundation released a 2020 update to the NASB that introduced some moderate, gender-inclusive language, John MacArthur and The Master's Seminary partnered with Lockman to instead continue developing the NASB 1995 text along its original, fully traditional path — that separate project became the LSB.",
    ],
  },

  nkjv: {
    tagline: "The King James's language modernized, without changing the underlying text it's translated from.",
    overview: [
      "The New King James Version is published by Thomas Nelson and was commissioned in 1975 under executive editor Arthur Farstad. More than 130 scholars, editors, and church leaders worked on it over seven years — one of the largest translation committees ever assembled for an English Bible — with the New Testament published in 1979, the Psalms in 1980, and the complete Bible in 1982, followed by a minor revision in 1984.",
      "Rather than translating from scratch, the NKJV set out to update the King James Version's language while deliberately keeping the same underlying textual tradition: the Textus Receptus and Majority Text, rather than the modern critical Greek text most other contemporary translations use. In practice, that means modernizing the KJV's archaic pronouns (“thee,” “thou”) and verb endings (“-eth,” “-est”) while preserving much of its sentence structure and literary rhythm — and noting in the margin where the Majority Text and the modern critical text differ, rather than silently choosing one.",
      "Its gender language stays traditional, consistent with the KJV it updates: generic masculine terms are translated as they appear in the original text, without inclusive alternatives.",
      "The NKJV remains one of the top-selling English translations, especially popular among readers who love the King James's literary tradition but want its grammar and vocabulary in contemporary English.",
    ],
    distinctives: [
      "Commissioned in 1975 and produced by more than 130 scholars, editors, and church leaders — one of the largest translation committees ever assembled for an English Bible.",
      "Deliberately kept the same Textus Receptus and Majority Text textual tradition as the original KJV, rather than switching to the modern critical Greek text most other contemporary translations use.",
      "Modernizes the KJV's archaic pronouns (“thee,” “thou”) and verb endings (“-eth,” “-est”) while preserving much of its sentence structure and literary rhythm.",
      "Notes in the margin where the Majority Text and the modern critical text differ, rather than silently picking one reading.",
    ],
    goodFor: [
      "Readers who love the King James's tradition and cadence but want its archaic pronouns and verb endings modernized.",
      "Churches moving on from the KJV that want to keep the same underlying textual tradition rather than switching to the modern critical text.",
      "Personal reading and preaching for those who want a formal, literal translation with a more traditional feel than the ESV or NASB.",
    ],
    worthKnowing: [
      "The NKJV's original executive editor, Arthur Farstad, later began the translation project that eventually became the Christian Standard Bible — though after his death in 1998, that project changed direction and moved to the modern critical text the NKJV had deliberately kept its distance from.",
    ],
  },

  nasb: {
    tagline: "A formally precise, word-for-word translation long regarded as the standard for close Bible study.",
    overview: [
      "The New American Standard Bible is sponsored by the Lockman Foundation, a nonprofit organization. Launched in 1959 as a revision of the American Standard Version (1901), it aimed to preserve the ASV's precision in more contemporary English while incorporating newer manuscript discoveries — the New Testament was published in 1963 and the complete Bible in 1971, followed by revisions in 1977, 1995, and 2020.",
      "The NASB has long been regarded as the most strictly literal major English translation, prioritizing word-for-word correspondence to the original Hebrew, Aramaic, and Greek even where that produces a more formal, less conversational sentence. It's long been a standard reference for seminary word studies and close personal study for exactly this reason.",
      "On gender language, the 2020 update introduced a moderate shift: where the original Greek or Hebrew is clearly addressing both men and women, the NASB now adds “and sisters” in italics to make that inclusion explicit, while keeping the rest of its wording as literal as ever. Earlier editions, including the long-standard 1995 text, used the traditional generic masculine throughout.",
      "The NASB has long been a standard for pastors, seminary students, and serious personal study, and remains widely used alongside the NASB Study Bible and other Lockman-published study resources.",
    ],
    distinctives: [
      "A revision of the American Standard Version (1901), begun in 1959 by the Lockman Foundation to preserve the ASV's precision in more contemporary English.",
      "Long regarded as the most literal major English translation — its word-for-word philosophy has made it a standard reference for seminary word studies for decades.",
      "Italicizes any English word added for clarity or grammar that has no direct equivalent in the original Hebrew or Greek, more consistently than almost any other translation.",
      "Capitalizes pronouns referring to God (He, His, Him) throughout.",
      "The 2020 update modestly adjusted gender language and modernized some archaic wording, while keeping its strict formal-equivalence approach intact.",
    ],
    goodFor: [
      "Seminary students, pastors, and serious Bible students who want the most literal word-for-word rendering available for close study.",
      "Readers doing verse-by-verse expository study, where knowing exactly which English words were added for clarity (marked in italics) matters.",
      "Longtime NASB readers who prefer the 2020 update's lightly modernized language over switching to a different translation altogether.",
    ],
    worthKnowing: [
      "The NASB's 1995 edition has its own modern offshoot. When the 2020 update introduced moderate, gender-inclusive language, John MacArthur and The Master's Seminary partnered with the Lockman Foundation to continue developing the 1995 text along its original, fully traditional path instead — that separate project became the Legacy Standard Bible (LSB).",
    ],
  },

  net: {
    tagline: "A modern translation built around its own extensive footnotes, showing the reasoning behind nearly every rendering.",
    overview: [
      "The New English Translation is published by Biblical Studies Press and began in 1995, growing out of a conversation among scholars at the Society of Biblical Literature's annual meeting. It was created specifically to be freely distributed on the internet — early beta versions were posted online for public feedback starting in the late 1990s, well before that was a common approach, with the first full print edition following in 2005 and a revision in 2019.",
      "The NET describes its own approach as mixed: it leans formal by default, staying close to the wording of the original Hebrew, Aramaic, and Greek, while adjusting toward more natural English where a strictly literal rendering would be unclear. Its real signature, though, is its footnotes — the NET Bible's Full Notes Edition carries more than 60,000 translators' notes explaining word choices, alternate readings, and textual variants verse by verse, effectively functioning as a built-in commentary alongside the translation itself.",
      "On gender language, the NET takes a moderate approach: where the original text is clearly addressing both men and women, it generally translates that inclusively, while keeping masculine wording wherever a passage is addressing men specifically or referring to God.",
      "The NET has remained freely available online since its earliest beta versions, under a copyright that permits free downloading and broad reuse — unusual for a modern translation still under active copyright, and a direct reflection of its original mission to make a serious, scholarly translation freely accessible to anyone.",
    ],
    distinctives: [
      "One of the first Bible translations created specifically for free distribution on the internet — early beta versions were posted online for public feedback starting in the late 1990s.",
      "Its Full Notes Edition carries more than 60,000 translators' notes — more supporting footnotes than any other major English translation — explaining word choices, alternate readings, and textual variants verse by verse.",
      "Does not use a red-letter convention for the words of Jesus, unlike most other translations on this site.",
      "Available for free download and broad reuse under a permissive copyright license, reflecting its original mission to make a serious, scholarly translation freely accessible.",
    ],
    goodFor: [
      "Personal in-depth Bible study, thanks to its unmatched footnotes explaining translation decisions, alternate readings, and textual variants verse by verse.",
      "Students and teachers who want to see the translators' reasoning, not just their conclusions — useful for sermon prep or seminary-level work.",
      "Anyone who wants a free, high-quality translation with its extensive notes available online at no cost.",
    ],
  },
};
