/**
 * Content for /history. The timeline is the visual spine of the page; the
 * narrative sections below it go deeper. Kept as data so the page component
 * stays presentational. Dates and figures follow standard reference works;
 * the Tyndale-in-the-KJV percentage is the usual cited range (Daniell, Nielson
 * & Skousen), not an exact figure.
 */

export interface TimelineEntry {
  year: string;
  title: string;
  detail: string;
  /** Pull the eye to the load-bearing moments. */
  major?: boolean;
}

export const timeline: TimelineEntry[] = [
  {
    year: "c. 970",
    title: "Old English glosses",
    detail:
      "Anglo-Saxon scribes write English word-for-word between the lines of Latin gospels — the gloss added to the Lindisfarne Gospels is the famous example. There is still no continuous English Bible.",
  },
  {
    year: "1382",
    title: "The Wycliffe Bible",
    detail:
      "The first complete English Bible, translated from the Latin Vulgate by John Wycliffe and his circle and copied by hand. The church condemned it; owning one could be treated as heresy. Decades after his death Wycliffe's bones were dug up and burned.",
    major: true,
  },
  {
    year: "1516",
    title: "Erasmus prints the Greek New Testament",
    detail:
      "For the first time the Greek text is available in print. Erasmus worked from a handful of late medieval manuscripts; his text, lightly revised, became known as the Textus Receptus and stood behind every Protestant translation for the next 350 years.",
  },
  {
    year: "1526",
    title: "Tyndale's New Testament",
    detail:
      "William Tyndale produces the first English New Testament translated directly from Greek, and the first to be printed. Copies are smuggled into England in bales of cloth. He goes on to translate much of the Old Testament from Hebrew before he is betrayed, strangled, and burned near Brussels in 1536.",
    major: true,
  },
  {
    year: "1535",
    title: "The Coverdale Bible",
    detail:
      "Miles Coverdale publishes the first complete printed English Bible, filling the gaps Tyndale never reached by working from Latin and German. The Psalms in the Book of Common Prayer are still his.",
  },
  {
    year: "1539",
    title: "The Great Bible",
    detail:
      "The first English Bible authorized for public reading in churches, chained to the lectern so it could not be carried off. Largely Tyndale and Coverdale, lightly revised.",
  },
  {
    year: "1560",
    title: "The Geneva Bible",
    detail:
      "Made by English Protestants who had fled to Geneva. The first English Bible with numbered verses, printed in readable roman type, and heavily annotated — effectively the first study Bible. It was the Bible of Shakespeare, the Puritans, and the Mayflower.",
    major: true,
  },
  {
    year: "1568",
    title: "The Bishops' Bible",
    detail:
      "The Church of England's official answer to the Geneva Bible's pointed marginal notes. Never much loved, but it became the starting text for the King James translators.",
  },
  {
    year: "1611",
    title: "The King James Version",
    detail:
      "Commissioned by James I and produced by about 47 scholars in six companies. They revised the Bishops' Bible against the Hebrew and Greek — but leaned so heavily on Tyndale that most studies put 75–85% of the KJV New Testament in his words. The text most people read today is a lightly modernized 1769 edition.",
    major: true,
  },
  {
    year: "1885",
    title: "The Revised Version",
    detail:
      "The first official overhaul of the KJV, incorporating manuscript discoveries of the 1800s. Its American counterpart, the American Standard Version, followed in 1901.",
  },
  {
    year: "1952",
    title: "The Revised Standard Version",
    detail:
      "A thorough revision of the ASV in modern English. Controversial in conservative circles — partly over rendering Isaiah 7:14 as “young woman” rather than “virgin” — but it became the trunk from which both the ESV and the NRSV grew.",
    major: true,
  },
  {
    year: "1971–2017",
    title: "The modern translations",
    detail:
      "The NASB (1971), NIV (1978), NKJV (1982), NRSV (1989), NLT (1996), ESV (2001), and CSB (2017) arrive in quick succession — the product of better manuscripts, changing English, competing translation philosophies, and a competitive publishing market.",
    major: true,
  },
];

export interface HistorySection {
  id: string;
  heading: string;
  paragraphs: string[];
}

/**
 * One conceptual section; the NT / OT specifics are the two diagrams in
 * components/TextTraditions.tsx (kept there so the translation buckets stay
 * data-driven), which sit above this on the page.
 */
export const textPrimer: HistorySection[] = [
  {
    id: "manuscripts",
    heading: "Nobody has the originals",
    paragraphs: [
      "No original manuscript of any biblical book survives. What survives are copies — for the New Testament, around 5,800 in Greek alone, plus ancient translations and quotations in early Christian writers. They were copied by hand for over a thousand years before printing, and hand-copying introduces small differences: a repeated line, a slip of spelling, an explanatory note that a later scribe folds into the text.",
      "The work of comparing those copies to reconstruct the earliest recoverable wording is called textual criticism. It is the reason a modern Bible has footnotes like “some manuscripts read…”. The differences are real, but they are also mapped in detail, and none of them puts a core Christian teaching in doubt.",
    ],
  },
];
