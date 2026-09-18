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
 * NRSVue, CEB, and AMP were added 2026-09-06 (EHV was added then cut 2026-09-07 —
 * tiny constituency already served by NIV / ESV / CSB, and absent from the
 * translation-comparison genre). In "Most Literal" 2026-09-07, NET was moved to
 * just past the CSB: its literal renderings live in its footnotes, so the main
 * text reads freer than its "Mixed" label — which is where published spectrum
 * charts put it. In "Best for Serious Study" 2026-09-09, NRSVue was moved from
 * 3rd to below the LSB (5th): the category is pitched at a self-directed lay
 * student, and NRSVue's study ecosystem assumes a seminary or university.
 * "Best Overall Balance" is computed from the other lists.
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
          "#1 on ECPA's September 2026 bestseller list, and has been the best-selling modern English translation for most of the past several decades.",
      },
      {
        id: "esv",
        blurb:
          "#2 on ECPA's September 2026 bestseller list — a fixture near the top of the charts for years, especially strong in Reformed and broadly evangelical retail.",
      },
      {
        id: "kjv",
        blurb:
          "#3 on ECPA's September 2026 bestseller list, and remains the best-selling Bible translation of all time by a wide margin thanks to a 400-year head start and being fully public domain.",
      },
      { id: "nlt", blurb: "#4 on ECPA's September 2026 bestseller list, right behind the KJV — and in parts of 2025, Christian-retail data briefly had it outselling the NIV, a reminder of how much this list moves." },
      { id: "nkjv", blurb: "#5 on ECPA's September 2026 bestseller list, popular with readers who want the King James tradition in modern grammar." },
      { id: "csb", blurb: "One of the fastest-growing translations in recent years — 7th overall on ECPA's September 2026 bestseller list." },
      { id: "nirv", blurb: "8th overall on ECPA's September 2026 bestseller list — a hard, current chart position, not just a general impression of use, for a translation built specifically for children and developing readers." },
      { id: "nasb", blurb: "9th overall on ECPA's September 2026 bestseller list — a perennial top-ten seller, even though its audience is more specialized than the translations above it." },
      { id: "nrsvue", blurb: "10th overall on ECPA's September 2026 bestseller list, listed there as “New Revised Standard Version” — the standard translation of mainline Protestant churches and the academic world, with a much larger everyday footprint across seminaries, universities, and mainline pews than its retail rank alone suggests." },
      { id: "cev", blurb: "Doesn't chart on ECPA's print bestseller list, but independent readership surveys have put it among the ten most-read English translations in the US in recent years — reach through literacy ministries, schools, and outreach that print-retail sales data doesn't fully capture." },
      { id: "bsb", blurb: "Doesn't chart on ECPA's print bestseller list (it's barely sold in print at all), but it's a dominant option in Bible apps and on YouVersion specifically because it's free and public domain — real digital usage a print chart can't see." },
      { id: "gnt", blurb: "Historically one of the best-selling English Bibles of the 20th century — over 200 million copies distributed since 1966 — though its current ECPA print-chart presence is a shadow of that peak; strongest today in literacy and outreach ministry rather than general retail." },
      { id: "amp", blurb: "A steady mid-list seller for decades, with a following among charismatic readers and study-Bible shoppers that keeps it on ECPA's monthly lists." },
      { id: "message", blurb: "A genuine crossover bestseller in its own right — tens of millions of copies sold since 2002 — even though as a paraphrase it sits outside the translation-vs-translation comparison the rest of this category otherwise makes." },
      { id: "lsb", blurb: "Sales concentrated in Reformed and MacArthur-affiliated ministry circles rather than the general market." },
      { id: "web", blurb: "No hard sales number — it's free and public domain by design, not sold through retail the way a copyrighted translation is — but a long track record (published 1997) and broad reach through free Bible apps and websites." },
      { id: "ceb", blurb: "Sells steadily into United Methodist and other mainline congregations, but has little presence in the evangelical retail that drives the bestseller lists." },
      { id: "isv", blurb: "A modest but real digital footprint — over 5 million New Testament downloads since its 2011 release — without the retail or app presence of the larger translations above it." },
      { id: "gw", blurb: "A steady, if modest, presence in Lutheran Church–Missouri Synod circles and among readers who found it through Bible apps, without a single standout usage number." },
      { id: "ncv", blurb: "Real, ongoing use in children's and family Bibles under its Everyday Bible and Youth Bible branding, though it doesn't chart on general bestseller lists." },
      { id: "mev", blurb: "A newer entrant (2014) with a real, if smaller, following among charismatic and Pentecostal readers who want the King James tradition in fully contemporary English." },
      { id: "net", blurb: "Doesn't chart on print bestseller lists at all — it was built for free online distribution from day one, not retail sales." },
      { id: "leb", blurb: "No print edition exists at all — its whole reach is digital, mainly among Logos Bible Software users doing original-language study." },
      { id: "voice", blurb: "A real if modest release (2012), better known for its screenplay format and the controversy it drew than for broad everyday use." },
      { id: "lsv", blurb: "Very new (2020) with a small but genuine following among readers specifically seeking a Majority-Text-influenced, maximally literal translation." },
      { id: "msb", blurb: "The newest and most niche translation on this site — a natural draw only for readers specifically interested in a modern Majority Text New Testament." },
    ],
    note: "Positions 1-9 follow ECPA's September 2026 monthly bestseller list in order (NIV, ESV, KJV, NLT, NKJV, CSB, NIrV, NASB, and NRSVue — listed there as “New Revised Standard Version”); that list also includes Reina Valera, a Spanish translation, at 6th overall, which isn't profiled on this site. Everything below 9th here blends real but differently-shaped usage evidence — readership surveys, digital-download counts, app rankings, historical print totals, denominational and ministry footprints — since most of these translations are free, digital-first, or otherwise outside the print-retail channel ECPA's chart measures; each entry's blurb says what kind of evidence it's actually resting on. Exact chart order shifts month to month (ECPA compiles it from Circana BookScan retail data), so treat the top nine as a general picture rather than a fixed, permanent order, and check ECPA's current list for the latest.",
  },
  {
    slug: "literal",
    title: "Most Literal / Word for Word",
    tabLabel: "Most Literal",
    criteria:
      "Which translations stick closest to the exact words and grammar of the original Hebrew, Aramaic, and Greek — based on each translation's stated philosophy (Formal, Optimal, Mixed, or Dynamic) and its reputation among close readers.",
    entries: [
      {
        id: "lsv",
        blurb:
          "Explicitly built to be the most literal English Bible currently available — even more consistently word-for-word than the NASB or LSB, preserving original word order and verb tense wherever English grammar allows.",
      },
      {
        id: "lsb",
        blurb:
          "Built explicitly to “more fully implement” the NASB's already-literal philosophy — consistent word-for-word renderings, like doulos as “slave” every time, are its whole reason for existing.",
      },
      {
        id: "leb",
        blurb:
          "Built from interlinear-translation work specifically for transparency with the Hebrew and Greek — corner brackets even flag its own idioms, so a reader can see exactly where the English departs from a literal rendering.",
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
      { id: "web", blurb: "A light modernization of the 1901 ASV's own formal wording — literal by inheritance rather than by a fresh maximally-literal effort, so it reads a shade freer than the ASV-descended NASB or LSB." },
      { id: "kjv", blurb: "Formal and word-for-word from the Textus Receptus, though its 17th-century English can obscure just how literal the underlying choices are." },
      { id: "nkjv", blurb: "Keeps the KJV's same literal, word-for-word approach and textual tradition, just in modernized grammar." },
      { id: "mev", blurb: "A fresh formal-equivalence translation in the same Textus Receptus tradition as the KJV and NKJV, aiming for comparable word-for-word rigor in fully contemporary English." },
      { id: "amp", blurb: "Its base text sits in the formal NASB family — spectrum charts often place it near the top — but the bracketed strings of alternate meanings add words that aren't in the original, so the text as printed reads less literally than its foundation." },
      { id: "nrsvue", blurb: "Formal by design and in the word-for-word RSV line, but its systematic use of inclusive language — often pluralizing a singular “he” to “they” — is a deliberate step away from matching the exact grammatical forms." },
      { id: "bsb", blurb: "“Optimal equivalence” with a slight lean toward literality — reviewers place it stylistically between the ESV and the CSB." },
      { id: "msb", blurb: "Shares the BSB's exact translation philosophy and team — the same optimal-equivalence approach, just with a Majority Text New Testament instead of the Critical Text." },
      { id: "isv", blurb: "Self-described “Literal-Idiomatic” — a deliberate middle path, but one that leans toward the formal side of that path more than the CSB does." },
      { id: "csb", blurb: "“Optimal equivalence” is explicitly a middle path — it leans formal or dynamic verse by verse rather than committing to literalness as a rule." },
      { id: "gw", blurb: "“Closest natural equivalence” sits in the same optimal middle path as the CSB, but leans further toward natural, idiomatic phrasing than toward word-for-word structure." },
      { id: "net", blurb: "The literal renderings and the harder calls live in its 60,000 footnotes, so the main text you actually read is free enough to land just past the CSB — more so than its “Mixed” label suggests." },
      { id: "niv", blurb: "Dynamic by design — prioritizes natural phrasing over word-for-word correspondence." },
      { id: "nirv", blurb: "The NIV's own text and method at a third-grade reading level — simplified vocabulary, not a separate philosophy, so it tracks right alongside the NIV rather than reading more freely." },
      { id: "ceb", blurb: "Dynamic and pitched at a 7th-grade reading level, generally a little freer with the wording than the NIV." },
      { id: "ncv", blurb: "Dynamic and pitched even more plainly than the CEB, at a 5th-grade level, with short sentences that trade some structural correspondence for clarity." },
      { id: "nlt", blurb: "A genuine translation, but one built to prioritize clarity over matching the original's exact wording." },
      { id: "gnt", blurb: "Dynamic “common language” translation willing to paraphrase theologically loaded terms for plain clarity — “young woman” at Isaiah 7:14 rather than “virgin” is the best-known example." },
      { id: "cev", blurb: "Dynamic and deliberately the plainest genuine translation here at a 4th-grade level, tested by reading it aloud to listeners rather than just checking it on the page." },
      { id: "voice", blurb: "Dynamic, and freer still in practice — its screenplay format adds italicized narrative bridges and expanded phrasing beyond what a standard thought-for-thought translation includes." },
      { id: "message", blurb: "Not really on this word-for-word-to-thought-for-thought axis at all — a genuine paraphrase that restates each passage freely in Eugene Peterson's own words, well beyond even the Voice's expanded phrasing above it. Ranked here, last, for completeness rather than because it's meaningfully “freer” than the Voice on the same scale — the two aren't measuring the same thing." },
    ],
    note: "This mostly follows each translation's own stated philosophy — the Formal / Optimal / Mixed / Dynamic field in the comparison table — plus the broad agreement of published “translation spectrum” charts. The tiers are well settled; the order within each is finer judgment. AMP and NRSVue are genuine edge cases (see their entries), the NET is placed by how its readable main text lands rather than by its “Mixed” label, and the NIrV tracks the NIV rather than reading more freely since it's the same underlying text at a simpler vocabulary. “More literal” describes a method, not accuracy or quality — everything here is a real translation by competent scholars. The Message sits last not because it's the “freest” translation in a continuous line with the rest, but because it's a genuine paraphrase, not positioned on the Formal-to-Dynamic axis this ranking measures at all — see its own profile.",
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
      { id: "mev", blurb: "A fresh translation in the same formal, KJV-adjacent tradition as the NKJV, with comparable potential for a memorable cadence — but far too new (2014) to have any real memory-verse tradition behind it." },
      { id: "niv", blurb: "Being the translation most people around you already know makes group memorization and recitation easier." },
      { id: "nirv", blurb: "The NIV's own familiar wording at a third-grade level — a real option for children's Scripture memory specifically, if not for the precision adult programs look for." },
      { id: "csb", blurb: "Used in some LifeWay children's and student curricula for Scripture memory, with clear, consistent phrasing." },
      { id: "lsb", blurb: "Its consistent, literal renderings suit precision-focused memorization, though it's too new to have an established memory-verse tradition yet." },
      { id: "web", blurb: "Formal and reasonably consistent by inheritance from the ASV, but with no organized memory-verse tradition of its own." },
      { id: "lsv", blurb: "About as consistent, word-for-word as a translation gets — the tradeoff is that its unusual present-tense narrative style and total lack of any memory-verse tradition make it an unfamiliar shape to recite." },
      { id: "nrsvue", blurb: "No real memory-verse tradition, and reshaping familiar singular lines for inclusive language (“Blessed are those…”) works against the crisp, fixed phrasing that memorization rewards." },
      { id: "leb", blurb: "Built for study alongside the Hebrew and Greek, with corner-bracket and italic markup throughout — not shaped for reciting from memory at all." },
      { id: "ceb", blurb: "Plain vocabulary helps, but its loose, conversational phrasing gives exact wording less of a fixed shape to hold onto." },
      { id: "ncv", blurb: "Short, plain sentences make individual verses easy enough for a child to hold in mind, without a memory-verse tradition built specifically around it." },
      { id: "gnt", blurb: "Simple, common-language phrasing helps recall for beginning readers, but its willingness to paraphrase key terms for clarity works against exact, consistent wording." },
      { id: "cev", blurb: "The plainest genuine translation here, which helps a first memory verse stick — but its very free phrasing means the next printing or context might not say it exactly the same way." },
      { id: "bsb", blurb: "Reasonably consistent optimal-equivalence phrasing, with no memory-verse tradition of its own yet." },
      { id: "isv", blurb: "Similar story to the BSB — a real, moderately literal option with no established memorization tradition behind it." },
      { id: "gw", blurb: "Natural, easy phrasing helps a verse stick initially, though its more flexible wording gives it less of a fixed shape than a formal translation." },
      { id: "msb", blurb: "Shares the BSB's phrasing and consistency, with an even smaller footprint and no memory-verse tradition at all." },
      { id: "nlt", blurb: "Its more flexible, thought-for-thought phrasing makes exact word-for-word recall harder than with a more literal translation." },
      { id: "voice", blurb: "Its screenplay format doesn't even use quotation marks for dialogue, and its expanded, narrative-bridge phrasing is about as far from a fixed, memorizable verse shape as this list gets." },
      { id: "net", blurb: "Built as a study tool, not a memory-verse text — its main text isn't designed or marketed around fixed, memorable pew phrasing." },
      { id: "amp", blurb: "The brackets and alternate-word strings make a verse almost impossible to fix in memory in any single form." },
      { id: "message", blurb: "As a paraphrase, it restates a passage in Peterson's own words rather than fixed wording at all — genuinely valuable for other reasons, but the wrong tool for memorizing an exact verse." },
    ],
    note: "Two things drive this: consistency — memorize a verse and it should match every printing and cross-reference — and cadence, since rhythmic prose is genuinely easier to recall (the KJV's real edge). Familiarity matters for group recitation, and a handful of translations have decades of memory-verse programs built around them. A newer translation can be well-suited to memorizing and still rank low here purely for lack of that tradition, which is why so many of the newer or smaller translations cluster in the lower half regardless of how literal or consistent their wording actually is.",
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
        blurb: "Natural, story-like prose at a 6th-grade level makes it easy to read in longer stretches, which is exactly what it was designed for — and it has the deepest devotional-resource ecosystem of any easy-reading translation here.",
      },
      {
        id: "cev",
        blurb: "The lowest reading level of any genuine translation on this site (4th grade), and specifically tested by reading it aloud to real listeners — a strong claim on exactly what this category measures, even though its devotional following is smaller than the NLT's.",
      },
      {
        id: "gnt",
        blurb: "Built from the ground up as a “common language” translation — plain enough for non-native speakers and readers with little church background, at a 5th-6th grade level.",
      },
      {
        id: "ncv",
        blurb: "A 5th-grade reading level with short, plain sentences — descends from a Bible originally built for deaf readers and children, so real clarity was never assumed rather than added later.",
      },
      {
        id: "ceb",
        blurb: "Built for a comfortable 7th-grade reading level and tested with reading groups before release — smooth, contemporary sentences with no churchy vocabulary in the way.",
      },
      {
        id: "gw",
        blurb: "A 3rd-4th grade level achieved through natural English rhythm and phrasing, not just simple vocabulary — genuinely easy to sit and read.",
      },
      {
        id: "nirv",
        blurb: "A 3rd-grade reading level, the easiest on this whole list — the NIV's own familiar wording simplified specifically for developing readers, which makes it a strong pick for kids or new readers even in an otherwise adult devotional list.",
      },
      {
        id: "csb",
        blurb: "Reads naturally aloud without drifting into paraphrase — comfortable for a daily reading plan without losing precision.",
      },
      { id: "niv", blurb: "Clear, contemporary English at a 7th-8th grade level, and the translation most readers already have some familiarity with." },
      { id: "voice", blurb: "Its screenplay-style dialogue and narrative-bridge phrasing genuinely read easily at a middle-school level — the unconventional format is more a devotional-discussion tool than a barrier." },
      { id: "net", blurb: "A readable main text at a 7th-grade level — the footnotes are there if you want them, but they don't have to slow down a devotional read." },
      { id: "nkjv", blurb: "A more traditional register than the translations above it, but still a 7th-grade reading level once the KJV's archaic grammar is modernized." },
      { id: "mev", blurb: "Fully contemporary grammar in the KJV tradition, but its formal, word-for-word style keeps it a denser daily read than the translations above it." },
      { id: "bsb", blurb: "A moderate 8th-9th grade level — readable day to day, without being built around ease the way the translations above it are." },
      { id: "isv", blurb: "A 7th-8th grade “Literal-Idiomatic” read — comfortable enough for daily reading, without being the easiest option here." },
      { id: "esv", blurb: "Widely used for daily reading plans and Scripture apps, even though its more literal phrasing makes it a slightly denser read than the Dynamic translations." },
      { id: "nrsvue", blurb: "Its formal, academic register and habit of reshaping sentences for inclusive language make it a slightly heavier read than the evangelical formal translations." },
      { id: "kjv", blurb: "Many readers still prefer it for daily devotions out of familiarity and tradition, despite its 12th-grade reading level." },
      { id: "web", blurb: "A formal, ASV-descended reading level (9th-10th grade) — readable, but denser than any of the Dynamic or Optimal translations above it." },
      { id: "nasb", blurb: "Its precision is better suited to study than to easy daily reading — a dense, formal text at an 11th-grade level." },
      { id: "lsb", blurb: "The newest and most literal translation here, with the fewest devotional resources — reading plans, daily-verse apps — built around it so far." },
      { id: "msb", blurb: "Shares the BSB's moderate reading level, with an even smaller devotional following given how new and niche it is." },
      { id: "leb", blurb: "Built for study alongside the Hebrew and Greek, not for sitting and reading — corner brackets and italics throughout work against a natural devotional flow." },
      { id: "lsv", blurb: "Its maximally literal, present-tense narrative style makes for a genuinely unusual daily-reading experience — a high reading level and a real departure from how most devotional prose flows." },
      { id: "amp", blurb: "The bracketed alternate meanings that make it a useful study tool also make it almost impossible to read in a natural flow — the wrong tool for sitting and reading." },
      { id: "message", blurb: "Conversational, easy-flowing prose that reads like a book — genuinely excellent for devotional reading on its own terms, though as a paraphrase it's doing something different from the translations around it on this list." },
    ],
    note: "Close to a straight readability ranking: reading grade level from the comparison table, adjusted for how natural the prose sounds aloud (the NKJV's grade level is low but its register is formal, so it sits lower than the number alone) and, at the very top, for which translations were specifically designed and tested for easy reading rather than just landing at an easy grade level. It runs roughly opposite to Most Literal — but not exactly: the KJV is near the formal end there and near the bottom here, because archaic vocabulary is a readability problem that literalness alone doesn't capture. Easy to read is not the same as good for depth — check Best for Serious Study for that question instead.",
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
      { id: "nrsvue", blurb: "The pulpit and lectionary Bible across most of mainline Protestantism — Episcopal, ELCA, PC(USA), United Methodist, UCC — and built in the RSV tradition to be read aloud in worship." },
      { id: "nasb", blurb: "A longtime favorite for expository, verse-by-verse preaching, where matching the original wording closely matters more than natural cadence." },
      { id: "nkjv", blurb: "The KJV's cadence and textual tradition without the archaic vocabulary — a common pulpit choice for churches moving on from the King James English but not the tradition behind it." },
      { id: "kjv", blurb: "Still one of the most-preached-from Bibles in the country — independent Baptist, Pentecostal, Holiness, and traditional Black-church pulpits especially — with a cadence built for reading aloud. The cost for exposition is the 1611 vocabulary the preacher keeps having to translate." },
      { id: "ceb", blurb: "Turns up in mainline pulpits, often alongside the NRSVue, for its smooth read-aloud quality — though its looser wording gives an expositor less to work with." },
      { id: "lsb", blurb: "The primary pulpit text at Grace Community Church and other MacArthur-affiliated churches, though not yet in wide use beyond those circles." },
      { id: "mev", blurb: "A real, if narrow, pulpit following in charismatic and Pentecostal circles specifically, as a fully contemporary alternative to the KJV/NKJV tradition." },
      { id: "bsb", blurb: "Free and app-accessible enough that a pastor could put it in every hand, but it hasn't established itself as anyone's primary pulpit translation yet." },
      { id: "nlt", blurb: "Sometimes used in outreach-oriented or seeker-friendly preaching contexts where accessibility is the priority, but less common as a primary pulpit Bible." },
      { id: "web", blurb: "Its public-domain status makes it a natural fit for churches that specifically want a free, freely-reprintable pulpit Bible, but it has no broader denominational or pulpit tradition beyond that niche." },
      { id: "gnt", blurb: "Its plain, oral-friendly prose reads well aloud, but its willingness to paraphrase theologically loaded terms makes it a poor base for close exposition." },
      { id: "isv", blurb: "Readable enough to preach from, without any real pulpit tradition established around it yet." },
      { id: "gw", blurb: "Natural, easy-to-read-aloud phrasing, but essentially no denominational or pulpit tradition outside some Lutheran Church–Missouri Synod circles." },
      { id: "cev", blurb: "Built for oral clarity, which helps a public reading — but its very simple, paraphrase-adjacent wording gives an expositor little to build close exposition on." },
      { id: "ncv", blurb: "Easy to read aloud, but pitched at a reading level and audience (children, new readers) that isn't really what a weekly expository sermon calls for." },
      { id: "nirv", blurb: "Its third-grade simplification works against building a verse-by-verse sermon on precise wording, even though the underlying NIV text preaches well." },
      { id: "voice", blurb: "Its screenplay format genuinely shines in dramatic public readings with multiple voices, but that's a different use than a pastor's weekly expository sermon." },
      { id: "net", blurb: "Built as a study tool with extensive footnotes rather than a pew or pulpit Bible — it's rarely anyone's primary preaching text." },
      { id: "lsv", blurb: "Maximally literal, which gives a preacher plenty of precision to work with, but its unusual present-tense narrative style and total lack of pulpit tradition make it an unfamiliar sound from the front of a room." },
      { id: "leb", blurb: "Built for study alongside the original languages, not for reading aloud to a congregation — bracket and italic markup throughout works against it." },
      { id: "msb", blurb: "Too new and too niche to have any pulpit presence yet, sharing the BSB's otherwise-reasonable read-aloud quality." },
      { id: "amp", blurb: "You can't read the bracketed alternate meanings aloud, and almost no one preaches from it as a primary text — a reference to consult, not a pulpit Bible." },
      { id: "message", blurb: "Some pastors quote it for a fresh, attention-grabbing turn of phrase alongside a primary translation, but as a paraphrase it's not built to be anyone's base preaching text." },
    ],
    note: "This weighs three things: whether the text is precise enough to build a verse-by-verse sermon on, whether it reads well aloud, and whether it's what the congregation already has open. It is not a count of which Bible is used in the most pulpits — that's Most Popular. The KJV in particular is preached from far more widely than its spot here suggests; it ranks lower because the archaic vocabulary works against close exposition. Denominational lectionary and official choices (NRSVue, ESV, CSB) do much of the sorting at the top; most of the newer or smaller translations cluster lower simply for lack of any established pulpit tradition, regardless of translation quality.",
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
        id: "leb",
        blurb: "Built from interlinear-translation work with the explicit goal of “unparalleled transparency with the original language text” — corner brackets and italics show exactly where the English tracks, or departs from, the Hebrew and Greek, verse by verse.",
      },
      {
        id: "nasb",
        blurb: "Long the standard for close, word-for-word study, especially for readers doing original-language word studies or comparing translations line by line.",
      },
      { id: "esv", blurb: "The base text for the widely used ESV Study Bible, backed by one of the largest libraries of study notes and commentaries built around any single translation." },
      { id: "lsb", blurb: "Maximally literal and internally consistent, which appeals to readers doing detailed word studies — though its study-resource library is still young." },
      { id: "lsv", blurb: "About as literal and internally consistent as a translation gets, with no smoothing of verb tense or word order — useful for exactly that reason, even without a study-Bible apparatus built around it." },
      {
        id: "nrsvue",
        blurb: "The default translation of academic biblical studies — the text behind the New Oxford Annotated and HarperCollins study Bibles, with formal wording and a serious set of text-critical footnotes. Its ecosystem assumes a seminary or university setting, which is why it sits below the evangelical study Bibles for a self-directed lay reader.",
      },
      { id: "nkjv", blurb: "Formal and marginal-note-heavy about where the Majority Text and the modern Critical Text differ, which suits textually-minded study." },
      { id: "bsb", blurb: "Every word links back to its Hebrew or Greek root — a direct legacy of its origin alongside Bible Hub's interlinear tools — genuinely useful for word-level study even without a traditional study-Bible edition." },
      { id: "msb", blurb: "Shares the BSB's interlinear word-linking and its Old Testament outright — useful in the same way, with the added angle of a Majority Text New Testament to compare against." },
      { id: "isv", blurb: "Its Isaiah translation draws on a dedicated fresh reading of the Great Isaiah Scroll from the Dead Sea Scrolls — a real, specific scholarly resource most translations don't have." },
      { id: "csb", blurb: "The CSB Study Bible and CSB Apologetics Study Bible give it a real study apparatus, even though its main text prioritizes readability over maximal literalness." },
      { id: "niv", blurb: "The NIV Study Bible is one of the best-selling study Bibles ever made — strong supporting material, even though the translation itself is Dynamic, not word-for-word." },
      { id: "kjv", blurb: "The hub of the classic lay-study toolkit — Strong's Concordance, Treasury of Scripture Knowledge, and centuries of verse-keyed commentary are all built on it, and it flags translator-supplied words in italics. What holds it back for this specific question: the Textus Receptus base rather than the older manuscripts scholars now follow, plus 1611 vocabulary that can quietly mislead." },
      { id: "mev", blurb: "A fresh, formal translation from the same source texts as the KJV, but too new to have any study-Bible ecosystem built around it yet." },
      { id: "web", blurb: "Formal and reasonably literal by inheritance from the ASV, without any dedicated study-Bible apparatus of its own." },
      { id: "amp", blurb: "Purpose-built to expose the range of meaning in a word without a lexicon — useful for that, as long as you remember that a word's list of possible meanings isn't the same as what it means in context." },
      { id: "ceb", blurb: "The CEB Study Bible is a solid mainline resource, but the translation itself is built for reading ease rather than word-level precision." },
      { id: "gw", blurb: "Its “closest natural equivalence” method prioritizes readability over the kind of literal, one-to-one correspondence close word studies rely on." },
      { id: "nlt", blurb: "Built for clarity and accessibility first — a fine translation for understanding a passage's meaning, but not the first choice for granular word-level study." },
      { id: "nirv", blurb: "The NIV's own text simplified for younger and developing readers — not built for granular study, though the underlying NIV Study Bible material still applies to its parent translation." },
      { id: "ncv", blurb: "Built for clarity at a 5th-grade level, which is the opposite design goal from close word-level study." },
      { id: "gnt", blurb: "Its willingness to paraphrase theologically loaded terms for plain clarity makes it a poor choice when the exact original wording is what you're trying to study." },
      { id: "cev", blurb: "The plainest genuine translation here — excellent for a first read, but its very free phrasing gives a close reader little to compare against the original text." },
      { id: "voice", blurb: "Its expanded, screenplay-style phrasing adds narrative material beyond the original text, which works against using it for precise word-level study." },
      { id: "message", blurb: "A genuine paraphrase, not a study tool — valuable for seeing a passage's meaning restated freshly, not for tracking exactly what the underlying Hebrew or Greek says." },
    ],
    note: "Three things feed this and they don't always agree: how closely the wording tracks the original, how thoroughly the translation footnotes its own choices (NET is far ahead, with the LEB's interlinear transparency a different but comparably serious approach to the same goal), and the size of the surrounding library of study Bibles and commentaries — ESV and NIV for the evangelical world, NRSVue for the academic one. A translation can rank on any one of the three, which is why the NIV places mid-pack despite its dynamic text, and why several newer or smaller translations here (BSB, MSB, LSV) rank on literalness or interlinear transparency alone, without any surrounding study-Bible ecosystem yet. It's pitched at a self-directed lay student; a scholar's list would lean harder on the original languages.",
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
          "The best average across the four use cases — 2nd for preaching, 3rd for memorization, 4th for serious study, and no worse than 16th (daily devotions, where formal translations generally sit lower). No single specialty, and no real weakness.",
      },
      {
        id: "csb",
        blurb:
          "Wins Best for Preaching outright, plus 8th for both daily devotions and memorization — held back a little by a middling 12th for study.",
      },
      {
        id: "nasb",
        blurb:
          "2nd for memorization and 3rd for serious study on the strength of its precision; a 20th-place finish for daily devotions is what keeps it off the very top.",
      },
      { id: "nkjv", blurb: "The most even spread on the page: 4th to 12th in all four categories, without ever leading one." },
      { id: "niv", blurb: "No category win, but 3rd for preaching, 6th for memorization, 9th for devotions, and 13th for study — the most consistently useful of the group even when it's not the best." },
      { id: "kjv", blurb: "A clear #1 for memorization and 7th for preaching, weighed against weaker 18th and 14th finishes for devotions and study — the archaic text is the drag on the everyday-use side." },
      { id: "nrsvue", blurb: "Carried by a 4th for preaching, the mainline lectionary Bible, and a 7th for serious study; the formal register and inclusive-language phrasing land it lower — 17th and 12th — for personal reading and memorization." },
      { id: "mev", blurb: "A real 5th-place finish for memorization on the strength of its formal, KJV-adjacent cadence, but too new for an established tradition in the other three — 10th to 15th across preaching, study, and devotions." },
      { id: "lsb", blurb: "5th for study on the back of its precision, but 9th for both memorization and preaching, and 21st for daily devotions — the two most public-facing categories are where its youth shows." },
      { id: "ceb", blurb: "A strong 5th for daily devotions carries an otherwise middling set of finishes — 8th to 18th in the other three." },
      { id: "bsb", blurb: "A real 9th for study on the strength of its interlinear word-linking, with 11th to 18th finishes everywhere else — solid, unspecialized, and still building a track record." },
      { id: "nirv", blurb: "A strong 7th for both memorization and devotions on the strength of the NIV's own familiar, simplified text, but 19th and 21st for preaching and study — its third-grade level works against both." },
      { id: "nlt", blurb: "#1 for daily devotions and nowhere else near the top — its thought-for-thought wording lands 20th to 22nd for study, preaching, and memorization." },
      { id: "gnt", blurb: "3rd for daily devotions on real oral-clarity credentials, but its willingness to paraphrase for plain clarity costs it everywhere else — 14th to 23rd across the other three." },
      { id: "net", blurb: "The #1 translation for serious study, but 21st for preaching and 24th for memorization — the notes that make it exceptional don't help when the text is read aloud." },
      { id: "web", blurb: "A workmanlike, unspecialized spread — 10th to 19th in all four categories — carried mainly by its formal, ASV-descended consistency rather than any single standout use." },
      { id: "ncv", blurb: "A strong 4th for daily devotions from its plain, 5th-grade prose, but 15th to 22nd everywhere else." },
      { id: "cev", blurb: "A very strong 2nd for daily devotions — the lowest reading level of any genuine translation here — but 17th to 24th in the other three categories, where its very free wording works against it." },
      { id: "isv", blurb: "A balanced but unspecialized 11th to 19th across all four categories — no weakness, but no clear strength either." },
      { id: "leb", blurb: "A strong 2nd for serious study on the strength of its original-language transparency, but 23rd for both devotions and preaching — built for study, not for reading aloud or reciting." },
      { id: "gw", blurb: "A real 6th for daily devotions from its natural, easy phrasing, but 15th to 20th elsewhere." },
      { id: "lsv", blurb: "A genuine 6th for serious study on the strength of its extreme literalness, but 22nd to 24th for devotions and preaching — the same maximal literalness and unusual present-tense style that helps study works against everyday reading and reciting." },
      { id: "msb", blurb: "10th for study, sharing the BSB's interlinear word-linking, but 21st to 24th elsewhere — too new and too niche for any broader track record yet." },
      { id: "voice", blurb: "A real 10th for daily devotions thanks to its easy, dialogue-driven prose, but 20th to 25th in the other three — its screenplay format is a devotional and discussion strength, not a study or memorization one." },
      { id: "amp", blurb: "A reference tool rather than an everyday Bible — last or near-last in three of the four categories, and 17th in the other (serious study, where its bracketed alternate meanings are at least genuinely useful)." },
      { id: "message", blurb: "Last in all four categories — not a mark against it so much as a reminder that a paraphrase is answering a different question than the translation-vs-translation comparison this list makes; see its own profile for what it's actually good at." },
    ],
    note: "This list averages each translation's placement in the four categories above that measure how well it serves a single use — memorization, daily devotions, preaching, and serious study — computed directly from those four rankings, not re-judged independently. Most Popular and Most Literal are left out: they describe what a translation is, not how well it works for you. Ties go to the translation with the stronger single-category finish.",
  },
];
