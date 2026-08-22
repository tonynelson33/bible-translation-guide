export interface RankingEntry {
  /** Translation id (data/translations.json). */
  id: string;
  /** Rationale — fuller for the top 3 (shown as gold/silver/bronze), a single short sentence for 4-9. */
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
  /** All 9 translations, ranked best to worst for this criterion. */
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
      { id: "lsb", blurb: "The newest translation here by far (2021), with sales concentrated in Reformed and MacArthur-affiliated ministry circles rather than the general market." },
      { id: "net", blurb: "Doesn't chart on print bestseller lists at all — it was built for free online distribution from day one, not retail sales." },
    ],
    note: "Positions 1-6 follow ECPA's 2024 year-end bestseller list in order (NIV, ESV, KJV, NLT, NKJV, CSB); NASB, LSB, and NET's exact positions are less precisely documented. Exact order also shifts some month to month, so treat this as a general picture rather than a fixed, permanent order.",
  },
  {
    slug: "literal",
    title: "Most Literal / Word for Word",
    tabLabel: "Most Literal",
    criteria:
      "Which translations stick closest to the exact words and grammar of the original Hebrew, Aramaic, and Greek — based on each translation's stated philosophy (Formal, Dynamic, Optimal, or Mixed) and its reputation among close readers.",
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
      { id: "net", blurb: "Its “Mixed” approach defaults to literal phrasing before adjusting for clarity — more literal than a Dynamic translation, but less consistently literal than the Formal group above it." },
      { id: "csb", blurb: "“Optimal equivalence” is explicitly a middle path — it leans formal or dynamic verse by verse rather than committing to literalness as a rule." },
      { id: "niv", blurb: "Dynamic by design — prioritizes natural phrasing over word-for-word correspondence." },
      { id: "nlt", blurb: "The least literal translation here — a genuine translation, but one built to prioritize clarity over matching the original's exact wording." },
    ],
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
        id: "esv",
        blurb: "The base text for the widely used ESV Study Bible, backed by one of the largest libraries of study notes and commentaries built around any single translation.",
      },
      { id: "lsb", blurb: "Maximally literal and internally consistent, which appeals to readers doing detailed word studies — though its study-resource library is still young." },
      { id: "nkjv", blurb: "Formal and marginal-note-heavy about where the Majority Text and modern critical text differ, which suits textually-minded study." },
      { id: "csb", blurb: "The CSB Study Bible and CSB Apologetics Study Bible give it a real study apparatus, even though its main text prioritizes readability over maximal literalness." },
      { id: "niv", blurb: "The NIV Study Bible is one of the best-selling study Bibles ever made — strong supporting material, even though the translation itself is Dynamic rather than literal." },
      { id: "kjv", blurb: "Centuries of classic commentary (Matthew Henry, Spurgeon, and others) are keyed to the KJV, though its older manuscript basis and archaic English add friction for modern study." },
      { id: "nlt", blurb: "Built for clarity and accessibility first — a fine translation for understanding a passage's meaning, but not the first choice for granular word-level study." },
    ],
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
        id: "csb",
        blurb: "Reads naturally aloud without drifting into paraphrase — comfortable for a daily reading plan without losing precision.",
      },
      {
        id: "niv",
        blurb: "Clear, contemporary English at a 7th-8th grade level, and the translation most readers already have some familiarity with.",
      },
      { id: "net", blurb: "A readable main text at a 7th-grade level — the footnotes are there if you want them, but they don't have to slow down a devotional read." },
      { id: "nkjv", blurb: "A more traditional register than the translations above it, but still a 7th-grade reading level once the KJV's archaic grammar is modernized." },
      { id: "esv", blurb: "Widely used for daily reading plans and Scripture apps, even though its more literal phrasing makes it a slightly denser read than the Dynamic translations." },
      { id: "kjv", blurb: "Many readers still prefer it for daily devotions out of familiarity and tradition, despite its 12th-grade reading level." },
      { id: "nasb", blurb: "Its precision is better suited to study than to easy daily reading — a dense, formal text at an 11th-grade level." },
      { id: "lsb", blurb: "The newest and most literal translation here, with the fewest devotional resources — reading plans, daily-verse apps — built around it so far." },
    ],
  },
  {
    slug: "preaching",
    title: "Best for Preaching / From the Pulpit",
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
      { id: "nasb", blurb: "A longtime favorite for expository, verse-by-verse preaching, where matching the original wording closely matters more than natural cadence." },
      { id: "nkjv", blurb: "A common pulpit choice for churches moving on from the KJV that still want a formal, traditional-feeling text." },
      { id: "kjv", blurb: "Still the pulpit Bible in many traditional and liturgical congregations, valued for its familiarity and cadence over readability." },
      { id: "lsb", blurb: "The primary pulpit text at Grace Community Church and other MacArthur-affiliated churches, though not yet in wide use beyond those circles." },
      { id: "nlt", blurb: "Sometimes used in outreach-oriented or seeker-friendly preaching contexts where accessibility is the priority, but less common as a primary pulpit Bible." },
      { id: "net", blurb: "Built as a study tool with extensive footnotes rather than a pew or pulpit Bible — it's rarely anyone's primary preaching text." },
    ],
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
      { id: "nlt", blurb: "Its more flexible, thought-for-thought phrasing makes exact word-for-word recall harder than with a more literal translation." },
      { id: "net", blurb: "Built as a study tool, not a memory-verse text — its main text isn't designed or marketed around fixed, memorable pew phrasing." },
    ],
  },
  {
    slug: "balance",
    title: "Best Overall Balance",
    tabLabel: "Overall Balance",
    criteria: "Which translations would serve you best in all areas if you could only have one.",
    entries: [
      {
        id: "esv",
        blurb:
          "The best average across study, daily devotions, preaching, and memorization — top three in three of the four, and no worse than 6th in the other (daily devotions). No single specialty, but no real weakness either.",
      },
      {
        id: "csb",
        blurb:
          "Ties NASB for the next-best average, but wins the tiebreak with an outright #1 for preaching — the only one of the two that actually leads a category rather than just running close behind.",
      },
      {
        id: "nasb",
        blurb:
          "Ties CSB for the next-best average — top-two finishes for study and memorization, held back mainly by a weaker showing for daily devotions.",
      },
      { id: "nkjv", blurb: "The most even performer of the rest — solidly mid-pack in study, devotions, and preaching, with a strong 4th for memorization." },
      { id: "niv", blurb: "Strong showings for daily devotions and preaching keep its average respectable, even though it's the weakest of this group for serious study." },
      { id: "kjv", blurb: "Its #1 finish for memorization is offset by weaker showings for study and daily devotions." },
      { id: "net", blurb: "Its #1 finish for serious study doesn't carry over — it's near the bottom for preaching and memorization, the two most public-facing use cases here." },
      { id: "nlt", blurb: "Its #1 finish for daily devotions is the high point — everywhere else on this page, its looser wording holds it back." },
      { id: "lsb", blurb: "The most literal translation on this site, but that precision doesn't translate into a lead in study, devotions, preaching, or memorization specifically." },
    ],
  },
];
