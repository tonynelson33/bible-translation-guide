export interface RankingEntry {
  /** Translation id (data/translations.json). */
  id: string;
  /** Rationale — fuller for the top 3 (shown as gold/silver/bronze), a single short sentence for 4-12. */
  blurb: string;
}

export interface RankingCategory {
  slug: string;
  /** Full heading shown above the list. */
  title: string;
  /** Short label for the tab button. */
  tabLabel: string;
  /** What this category is actually measuring. */
  criteria: string;
  /** All 12 translations, ranked best to worst for this criterion. */
  entries: RankingEntry[];
  /** Trailing context/caveat shown after the ranked list. */
  note?: string;
}

/** The tab selected by default when the page loads. */
export const defaultRankingSlug = "balance";

/**
 * Curated, criteria-based picks — not a single objective score. Each list is
 * grounded in the comparison data (data/translations.json), the glossary
 * definitions (lib/glossary.ts), and each translation's own profile
 * (lib/translationProfiles.ts).
 *
 * NRSV, CEB, and AMP were added 2026-09-06 (EHV was added then cut 2026-09-07 —
 * tiny constituency already served by NIV / ESV / CSB, and absent from the
 * translation-comparison genre). In "Most Literal" 2026-09-07, NET was moved to
 * just past the CSB: its literal renderings live in its footnotes, so the main
 * text reads freer than its "Mixed" label — which is where published spectrum
 * charts put it. "Best Overall Balance" is computed from the other lists.
 */
export const rankingCategories: RankingCategory[] = [
  {
    slug: "popular",
    title: "Most Popular / Most Used",
    tabLabel: "Most Popular",
    criteria:
      "Which translations show up most in U.S. Christian retail sales and everyday use, based on Evangelical Christian Publishers Association (ECPA) bestseller data.",
    entries: [
      {
        id: "niv",
        blurb:
          "The best-selling modern English translation for most of the past several decades, and still reliably in the top two or three spots on ECPA's monthly bestseller list.",
      },
      {
        id: "esv",
        blurb:
          "The runner-up on ECPA's 2024 year-end list — a fixture near the top of the charts for years, especially strong in Reformed and broadly evangelical retail.",
      },
      {
        id: "kjv",
        blurb:
          "Still holds a top-three spot on current bestseller charts, and remains the best-selling Bible translation of all time by a wide margin thanks to a 400-year head start and being fully public domain.",
      },
      { id: "nlt", blurb: "Right behind the KJV on the 2024 year-end list — and in parts of 2025, Christian-retail data briefly had it outselling the NIV, a reminder of how much this list moves." },
      { id: "nkjv", blurb: "Still a consistent top-ten seller, popular with readers who want the King James tradition in modern grammar." },
      { id: "csb", blurb: "One of the fastest-growing translations in recent years, breaking into the top six on ECPA's 2024 year-end list." },
      { id: "nasb", blurb: "A perennial top-ten seller, even though its audience is more specialized than the translations above it." },
      { id: "nrsv", blurb: "The standard translation of mainline Protestant churches and the academic world — modest retail numbers, but a large everyday footprint across seminaries, universities, and mainline pews." },
      { id: "amp", blurb: "A steady mid-list seller for decades, with a following among charismatic readers and study-Bible shoppers that keeps it on ECPA's monthly lists." },
      { id: "lsb", blurb: "The newest translation here by far (2021), with sales concentrated in Reformed and MacArthur-affiliated ministry circles rather than the general market." },
      { id: "ceb", blurb: "Sells steadily into United Methodist and other mainline congregations, but has little presence in the evangelical retail that drives the bestseller lists." },
      { id: "net", blurb: "Doesn't chart on print bestseller lists at all — it was built for free online distribution from day one, not retail sales." },
    ],
    note: "Positions 1-6 follow ECPA's 2024 year-end bestseller list in order (NIV, ESV, KJV, NLT, NKJV, CSB). Everything below that — NASB, NRSV, AMP, LSB, CEB, NET — blends occasional bestseller-list appearances with overall real-world use and is less precisely documented. Exact order also shifts month to month, so treat this as a general picture rather than a fixed, permanent order.",
  },
  {
    slug: "literal",
    title: "Most Literal / Word for Word",
    tabLabel: "Most Literal",
    criteria:
      "Which translations stick closest to the exact words and grammar of the original Hebrew, Aramaic, and Greek — based on each translation's stated philosophy (Formal, Optimal, Mixed, or Dynamic) and its reputation among close readers.",
    entries: [
      {
        id: "lsb",
        blurb:
          "Built explicitly to “more fully implement” the NASB's already-literal philosophy — consistent word-for-word renderings, like doulos as “slave” every time, are its whole reason for existing.",
      },
      {
        id: "nasb",
        blurb:
          "The long-standing benchmark for literalness among major English translations, and still the standard reference for seminary word studies.",
      },
      {
        id: "esv",
        blurb: "Formal and “essentially literal” by design, though more readable day-to-day than the NASB or LSB.",
      },
      { id: "kjv", blurb: "Formal and word-for-word from the Textus Receptus, though its 17th-century English can obscure just how literal the underlying choices are." },
      { id: "nkjv", blurb: "Keeps the KJV's same literal, word-for-word approach and textual tradition, just in modernized grammar." },
      { id: "amp", blurb: "Its base text sits in the formal NASB family — spectrum charts often place it near the top — but the bracketed strings of alternate meanings add words that aren't in the original, so the text as printed reads less literally than its foundation." },
      { id: "nrsv", blurb: "Formal by design and in the word-for-word RSV line, but its systematic use of inclusive language — often pluralizing a singular “he” to “they” — is a deliberate step away from matching the exact grammatical forms." },
      { id: "csb", blurb: "“Optimal equivalence” is explicitly a middle path — it leans formal or dynamic verse by verse rather than committing to literalness as a rule." },
      { id: "net", blurb: "The literal renderings and the harder calls live in its 60,000 footnotes, so the main text you actually read is free enough to land just past the CSB — more so than its “Mixed” label suggests." },
      { id: "niv", blurb: "Dynamic by design — prioritizes natural phrasing over word-for-word correspondence." },
      { id: "ceb", blurb: "Dynamic and pitched at a 7th-grade reading level, generally a little freer with the wording than the NIV." },
      { id: "nlt", blurb: "The least literal translation here — a genuine translation, but one built to prioritize clarity over matching the original's exact wording." },
    ],
    note: "This mostly follows each translation's own stated philosophy — the Formal / Optimal / Mixed / Dynamic field in the comparison table — plus the broad agreement of published “translation spectrum” charts. The three tiers are well settled; the order within each is finer judgment. AMP and NRSV are the genuine edge cases (see their entries), and the NET is placed by how its readable main text lands, not by its “Mixed” label — the literal renderings sit in its footnotes. “More literal” describes a method, not accuracy or quality — everything here is a real translation by competent scholars.",
  },
  {
    slug: "memorization",
    title: "Best for Memorization",
    tabLabel: "Memorization",
    criteria:
      "Which translations lend themselves to memorizing Scripture — precise, consistent wording and a cadence that's easy to recall.",
    entries: [
      {
        id: "kjv",
        blurb:
          "Generations of Christians memorized Scripture in the KJV, and it's not just familiarity — its rhythmic, poetic cadence genuinely makes text easier to recall, the same reason poetry memorizes more easily than prose.",
      },
      {
        id: "nasb",
        blurb:
          "Its precise, consistent word-for-word phrasing appeals to structured Scripture memory programs that care about exact wording — though that same precision can make its sentences less naturally rhythmic to recite than the KJV's.",
      },
      {
        id: "esv",
        blurb:
          "Increasingly the default for Scripture memory in Reformed and young-adult ministry circles — literal, consistent wording without the KJV's archaic vocabulary.",
      },
      { id: "nkjv", blurb: "Carries much of the KJV's memorable cadence, in grammar that's easier to commit to memory today." },
      { id: "niv", blurb: "Being the translation most people around you already know makes group memorization and recitation easier." },
      { id: "lsb", blurb: "Its consistent, literal renderings suit precision-focused memorization, though it's too new to have an established memory-verse tradition yet." },
      { id: "csb", blurb: "Used in some LifeWay children's and student curricula for Scripture memory, with clear, consistent phrasing." },
      { id: "nrsv", blurb: "No real memory-verse tradition, and reshaping familiar singular lines for inclusive language (“Blessed are those…”) works against the crisp, fixed phrasing that memorization rewards." },
      { id: "ceb", blurb: "Plain vocabulary helps, but its loose, conversational phrasing gives exact wording less of a fixed shape to hold onto." },
      { id: "nlt", blurb: "Its more flexible, thought-for-thought phrasing makes exact word-for-word recall harder than with a more literal translation." },
      { id: "net", blurb: "Built as a study tool, not a memory-verse text — its main text isn't designed or marketed around fixed, memorable pew phrasing." },
      { id: "amp", blurb: "The brackets and alternate-word strings make a verse almost impossible to fix in memory in any single form." },
    ],
    note: "Two things drive this: consistency — memorize a verse and it should match every printing and cross-reference — and cadence, since rhythmic prose is genuinely easier to recall (the KJV's real edge). Familiarity matters for group recitation, and a handful of translations have decades of memory-verse programs built around them. A newer translation can be well-suited to memorizing and still rank low here purely for lack of that tradition.",
  },
  {
    slug: "devotions",
    title: "Best for Daily Devotions",
    tabLabel: "Daily Devotions",
    criteria:
      "Which translations are easiest to sit down and read for a while — clear and natural enough that the words don't get in the way of the reading. This is largely a readability question, so it's also the list to check for a translation that's easier on kids, new believers, or readers still learning English, not devotional use specifically.",
    entries: [
      {
        id: "nlt",
        blurb: "Natural, story-like prose at a 6th-grade level makes it easy to read in longer stretches, which is exactly what it was designed for.",
      },
      {
        id: "ceb",
        blurb: "Built for a comfortable 7th-grade reading level and tested with reading groups before release — smooth, contemporary sentences with no churchy vocabulary in the way. About as easy as a genuine translation, rather than a paraphrase, gets.",
      },
      {
        id: "csb",
        blurb: "Reads naturally aloud without drifting into paraphrase — comfortable for a daily reading plan without losing precision.",
      },
      { id: "niv", blurb: "Clear, contemporary English at a 7th-8th grade level, and the translation most readers already have some familiarity with." },
      { id: "net", blurb: "A readable main text at a 7th-grade level — the footnotes are there if you want them, but they don't have to slow down a devotional read." },
      { id: "nkjv", blurb: "A more traditional register than the translations above it, but still a 7th-grade reading level once the KJV's archaic grammar is modernized." },
      { id: "esv", blurb: "Widely used for daily reading plans and Scripture apps, even though its more literal phrasing makes it a slightly denser read than the Dynamic translations." },
      { id: "nrsv", blurb: "Its formal, academic register and habit of reshaping sentences for inclusive language make it a slightly heavier read than the evangelical formal translations." },
      { id: "kjv", blurb: "Many readers still prefer it for daily devotions out of familiarity and tradition, despite its 12th-grade reading level." },
      { id: "nasb", blurb: "Its precision is better suited to study than to easy daily reading — a dense, formal text at an 11th-grade level." },
      { id: "lsb", blurb: "The newest and most literal translation here, with the fewest devotional resources — reading plans, daily-verse apps — built around it so far." },
      { id: "amp", blurb: "The bracketed alternate meanings that make it a useful study tool also make it almost impossible to read in a natural flow — the wrong tool for sitting and reading." },
    ],
    note: "Close to a straight readability ranking: reading grade level from the comparison table, adjusted for how natural the prose sounds aloud (the NKJV's grade level is low but its register is formal, so it sits lower than the number alone). It runs roughly opposite to Most Literal — but not exactly: the KJV is near the formal end there and near the bottom here, because archaic vocabulary is a readability problem that literalness alone doesn't capture. Easy to read is not the same as good for depth.",
  },
  {
    slug: "preaching",
    title: "Best for Preaching",
    tabLabel: "Preaching",
    criteria:
      "Which translations hold up best for a pastor — accurate enough to preach expositionally, natural enough to read aloud to a congregation.",
    entries: [
      {
        id: "csb",
        blurb: "Its “optimal equivalence” approach was built around exactly this tradeoff, aiming for language that reads naturally aloud without losing precision.",
      },
      {
        id: "esv",
        blurb: "A standard preaching and teaching text in Reformed and broadly Reformed pulpits, valued for staying close to the original wording.",
      },
      {
        id: "niv",
        blurb: "The most broadly familiar translation to congregations — useful when a pastor wants the text they're preaching from to match what's already in the pews.",
      },
      { id: "nrsv", blurb: "The pulpit and lectionary Bible across most of mainline Protestantism — Episcopal, ELCA, PC(USA), United Methodist, UCC — and built in the RSV tradition to be read aloud in worship." },
      { id: "nasb", blurb: "A longtime favorite for expository, verse-by-verse preaching, where matching the original wording closely matters more than natural cadence." },
      { id: "nkjv", blurb: "The KJV's cadence and textual tradition without the archaic vocabulary — a common pulpit choice for churches moving on from the King James English but not the tradition behind it." },
      { id: "kjv", blurb: "Still one of the most-preached-from Bibles in the country — independent Baptist, Pentecostal, Holiness, and traditional Black-church pulpits especially — with a cadence built for reading aloud. The cost for exposition is the 1611 vocabulary the preacher keeps having to translate." },
      { id: "ceb", blurb: "Turns up in mainline pulpits, often alongside the NRSV, for its smooth read-aloud quality — though its looser wording gives an expositor less to work with." },
      { id: "lsb", blurb: "The primary pulpit text at Grace Community Church and other MacArthur-affiliated churches, though not yet in wide use beyond those circles." },
      { id: "nlt", blurb: "Sometimes used in outreach-oriented or seeker-friendly preaching contexts where accessibility is the priority, but less common as a primary pulpit Bible." },
      { id: "net", blurb: "Built as a study tool with extensive footnotes rather than a pew or pulpit Bible — it's rarely anyone's primary preaching text." },
      { id: "amp", blurb: "You can't read the bracketed alternate meanings aloud, and almost no one preaches from it as a primary text — a reference to consult, not a pulpit Bible." },
    ],
    note: "This weighs three things: whether the text is precise enough to build a verse-by-verse sermon on, whether it reads well aloud, and whether it's what the congregation already has open. It is not a count of which Bible is used in the most pulpits — that's Most Popular. The KJV in particular is preached from far more widely than its spot here suggests; it ranks lower because the archaic vocabulary works against close exposition. Denominational lectionary and official choices (NRSV, ESV, CSB) do much of the sorting.",
  },
  {
    slug: "study",
    title: "Best for Serious Study",
    tabLabel: "Serious Study",
    criteria:
      "Which translations give a careful reader the most help digging into what the original text actually says — through literalness, footnotes, or a strong study-Bible ecosystem.",
    entries: [
      {
        id: "net",
        blurb: "Its Full Notes Edition carries more than 60,000 translators' notes — more than any other translation here — walking through word choices, alternate readings, and textual variants verse by verse.",
      },
      {
        id: "nasb",
        blurb: "Long the standard for close, word-for-word study, especially for readers doing original-language word studies or comparing translations line by line.",
      },
      {
        id: "nrsv",
        blurb: "The default translation of academic biblical studies — the text behind the New Oxford Annotated and HarperCollins study Bibles and the common version in most non-evangelical seminaries, with formal wording and a serious set of text-critical footnotes.",
      },
      { id: "esv", blurb: "The base text for the widely used ESV Study Bible, backed by one of the largest libraries of study notes and commentaries built around any single translation." },
      { id: "lsb", blurb: "Maximally literal and internally consistent, which appeals to readers doing detailed word studies — though its study-resource library is still young." },
      { id: "nkjv", blurb: "Formal and marginal-note-heavy about where the Majority Text and the modern Critical Text differ, which suits textually-minded study." },
      { id: "csb", blurb: "The CSB Study Bible and CSB Apologetics Study Bible give it a real study apparatus, even though its main text prioritizes readability over maximal literalness." },
      { id: "niv", blurb: "The NIV Study Bible is one of the best-selling study Bibles ever made — strong supporting material, even though the translation itself is Dynamic, not word-for-word." },
      { id: "kjv", blurb: "The hub of the classic lay-study toolkit — Strong's Concordance, Treasury of Scripture Knowledge, and centuries of verse-keyed commentary are all built on it, and it flags translator-supplied words in italics. What holds it back for this specific question: the Textus Receptus base rather than the older manuscripts scholars now follow, plus 1611 vocabulary that can quietly mislead." },
      { id: "amp", blurb: "Purpose-built to expose the range of meaning in a word without a lexicon — useful for that, as long as you remember that a word's list of possible meanings isn't the same as what it means in context." },
      { id: "ceb", blurb: "The CEB Study Bible is a solid mainline resource, but the translation itself is built for reading ease rather than word-level precision." },
      { id: "nlt", blurb: "Built for clarity and accessibility first — a fine translation for understanding a passage's meaning, but not the first choice for granular word-level study." },
    ],
    note: "Three things feed this and they don't always agree: how closely the wording tracks the original, how thoroughly the translation footnotes its own choices (NET is far ahead), and the size of the surrounding library of study Bibles and commentaries — ESV and NIV for the evangelical world, NRSV for the academic one. A translation can rank on any one of the three, which is why the NIV places mid-pack despite its dynamic text. It's pitched at a self-directed lay student; a scholar's list would lean harder on the original languages.",
  },
  {
    slug: "balance",
    title: "Best Overall Balance",
    tabLabel: "Overall Balance",
    criteria: "Which translations would serve you best across the four main areas if you could only have one.",
    entries: [
      {
        id: "esv",
        blurb:
          "The best average across the four use cases — 2nd for preaching, 3rd for memorization, 4th for serious study, and no worse than 7th (daily devotions). No single specialty, and no real weakness.",
      },
      {
        id: "csb",
        blurb:
          "The only translation here that wins a category outright (preaching), plus a 3rd for daily devotions — held back a little by a middling 7th for both study and memorization.",
      },
      {
        id: "nasb",
        blurb:
          "2nd for both serious study and memorization on the strength of its precision; a 10th-place finish for daily devotions is all that keeps it off the very top.",
      },
      { id: "niv", blurb: "No category win, but 3rd for preaching, 4th for devotions, 5th for memorization, and never lower than 8th — the most consistently useful of the group even when it's not the best." },
      { id: "nkjv", blurb: "The most even spread on the page: 4th to 6th in all four categories, without ever leading one." },
      { id: "nrsv", blurb: "Carried by a 3rd for serious study and a 4th for preaching; the formal register and inclusive-language phrasing land it 8th for both personal reading and memorization." },
      { id: "kjv", blurb: "A clear #1 for memorization and 7th for preaching, weighed against a pair of 9th-place finishes for study and daily reading — the archaic text is the drag on the everyday-use side." },
      { id: "net", blurb: "The #1 translation for serious study, but 11th for both preaching and memorization — the notes that make it exceptional don't help when the text is read aloud." },
      { id: "ceb", blurb: "A strong 2nd for daily devotions carries an otherwise low set of finishes — 8th to 11th in the other three." },
      { id: "lsb", blurb: "5th for study and 6th for memorization on the back of its precision, but 9th to 11th for the two most public-facing uses." },
      { id: "nlt", blurb: "#1 for daily devotions and nowhere else near the top — its thought-for-thought wording is last or near-last for study, preaching, and memorization." },
      { id: "amp", blurb: "A reference tool rather than an everyday Bible — last in three of the four categories, and 10th in the other." },
    ],
    note: "This list averages each translation's placement in the four categories above that measure how well it serves a single use — memorization, daily devotions, preaching, and serious study. Most Popular and Most Literal are left out: they describe what a translation is, not how well it works for you. Ties go to the translation with the stronger single-category finish.",
  },
];
