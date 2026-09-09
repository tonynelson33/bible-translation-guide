/**
 * Content for /history. The timeline is the visual spine of the page; the
 * narrative sections below it go deeper. Kept as data so the page component
 * stays presentational. Dates and figures follow standard reference works;
 * the Tyndale-in-the-KJV percentage is the usual cited range (Daniell, Nielson
 * & Skousen), not an exact figure.
 */

/**
 * A public-domain image for the history page. Files live in public/history/,
 * pulled from Wikimedia Commons; every one is old enough to be public domain.
 * `credit` is shown in the caption even though PD needs no attribution — it is
 * good practice and tells the reader what they are looking at.
 */
export interface HistoryImage {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  credit: string;
}

export const historyImages: Record<string, HistoryImage> = {
  lindisfarneGloss: {
    src: "/history/lindisfarne-gloss.jpg",
    width: 760,
    height: 804,
    alt: "A column of the Lindisfarne Gospels: large Latin letters with a smaller, cramped Old English translation written above every line.",
    caption:
      "The Lindisfarne Gospels, with Aldred’s word-for-word Old English gloss squeezed in above the Latin around 970 — the oldest surviving English translation of the Gospels.",
    credit: "Lindisfarne, c. 700; gloss c. 970. British Library — public domain.",
  },
  wycliffe1382: {
    src: "/history/wycliffe-john.jpg",
    width: 620,
    height: 1043,
    alt: "The opening of John's Gospel in a handwritten Wycliffite Bible, Middle English in a gothic book hand with a gold and colour initial.",
    caption:
      "The opening of John in a Wycliffite Bible — the first complete English Bible, copied by hand from the Latin Vulgate and owned at the risk of a heresy charge.",
    credit: "England, late 14th century — public domain.",
  },
  erasmus1516: {
    src: "/history/erasmus-1516-text.jpg",
    width: 660,
    height: 994,
    alt: "The last page of Erasmus's 1516 Greek New Testament — the end of Revelation, set with his Greek in one column and his own Latin translation beside it.",
    caption:
      "The final page of Erasmus’s 1516 Greek New Testament — the end of Revelation, his Greek beside his own Latin. It was the first Greek New Testament in print, and the root of the Textus Receptus.",
    credit: "Johann Froben, Basel, 1516 — public domain.",
  },
  coverdale1535: {
    src: "/history/coverdale-1535-title.jpg",
    width: 660,
    height: 1006,
    alt: "The woodcut title border of the 1535 Coverdale Bible: small biblical scenes down both sides, Henry VIII enthroned at the foot handing out books.",
    caption:
      "The 1535 Coverdale Bible, the first complete Bible printed in English. The title border is attributed to Hans Holbein the Younger.",
    credit: "1535 — public domain.",
  },
  greatBible1539: {
    src: "/history/great-bible-1539-title.jpg",
    width: 660,
    height: 966,
    alt: "The 1539 Great Bible title page: Henry VIII enthroned at the top passing Bibles to bishops and nobles, ranks of grateful subjects below.",
    caption:
      "The 1539 Great Bible — the first English Bible authorized for reading in churches. Henry VIII, at the top, hands the Word down through Cranmer and Cromwell to the crowd.",
    credit: "Grafton & Whitchurch, London, 1539 — public domain.",
  },
  bishops1568: {
    src: "/history/bishops-bible-1568.jpg",
    width: 660,
    height: 967,
    alt: "An engraved portrait of Queen Elizabeth I in a decorated oval frame, flanked by allegorical figures, from the 1568 Bishops' Bible.",
    caption:
      "Elizabeth I on the title page of the 1568 Bishops’ Bible — the Church of England’s answer to the Geneva Bible, and the text the King James translators were told to revise.",
    credit: "Engraving by Franz Hogenberg, 1568 — public domain.",
  },
  estienne1551: {
    src: "/history/estienne-1551-nt.jpg",
    width: 540,
    height: 887,
    alt: "The title page of Robert Estienne's 1551 Greek and Latin New Testament, with his olive-tree printer's device.",
    caption:
      "Estienne’s 1551 New Testament — a Textus Receptus edition, and the first to carry numbered verses.",
    credit: "Robert Estienne, Geneva, 1551 — public domain.",
  },
  papyrus52: {
    src: "/history/papyrus-52.jpg",
    width: 349,
    height: 549,
    alt: "Rylands Papyrus 52: a small, ragged fragment of brown papyrus with a few lines of Greek visible along each broken edge.",
    caption:
      "Rylands Papyrus 𝔓52, a fragment of John copied around AD 125 — the oldest known piece of any New Testament book.",
    credit: "John Rylands Library, Manchester — public domain.",
  },
  boreelianus: {
    src: "/history/codex-boreelianus.jpg",
    width: 560,
    height: 819,
    alt: "An illuminated Byzantine Gospel page: the start of Mark under a decorated headpiece, with a large ornamented initial beside columns of Greek majuscule.",
    caption:
      "Codex Boreelianus, a ninth-century Byzantine Gospel book — the kind of later, majority manuscript the Byzantine and Majority-Text readings come from.",
    credit: "9th century — public domain.",
  },
  leningrad: {
    src: "/history/leningrad-codex.jpg",
    width: 660,
    height: 729,
    alt: "A three-column page of the Leningrad Codex: pointed Hebrew consonantal text with tiny masoretic notes filling the margins between and around the columns.",
    caption:
      "The Leningrad Codex, finished in 1008 — the oldest complete manuscript of the Hebrew Bible, and the base text behind most modern Old Testaments.",
    credit: "Cairo, 1008 — public domain.",
  },
  tyndale1526: {
    src: "/history/tyndale-john-1526.jpg",
    width: 720,
    height: 1168,
    alt: "The opening of the Gospel of John in Tyndale's 1526 New Testament, printed in blackletter with a large decorated initial.",
    caption:
      "The Gospel of John in Tyndale’s 1526 New Testament — the first printed English New Testament, translated straight from the Greek.",
    credit: "Printed by Peter Schöffer, Worms, 1526. British Library Board — public domain.",
  },
  geneva1560: {
    src: "/history/geneva-bible-1560.png",
    width: 1148,
    height: 986,
    alt: "A woodcut of the Israelites camped at the shore of the Red Sea, a pillar of cloud rising from the water, Pharaoh's chariots and spearmen approaching from the right.",
    caption:
      "The title-page woodcut of the 1560 Geneva Bible: Israel at the Red Sea, the pillar of cloud between them and Pharaoh’s army — the Exodus scene the Geneva exiles chose for their Bible.",
    credit: "Geneva, 1560 — public domain.",
  },
  kjv1611: {
    src: "/history/kjv-1611-title-page.jpg",
    width: 500,
    height: 782,
    alt: "The engraved title page of the 1611 King James Bible, with Moses and Aaron beside the central panel and the apostles ranged around it.",
    caption:
      "The engraved title page of the 1611 King James Version, designed by Cornelis Boel.",
    credit: "Printed by Robert Barker, London, 1611 — public domain.",
  },
  kjv1611Genesis: {
    src: "/history/kjv-1611-genesis.jpg",
    width: 680,
    height: 978,
    alt: "The first page of Genesis in the 1611 King James Bible: a woodcut headpiece over “THE FIRST BOOKE OF MOSES, called GENESIS,” a large decorated initial, and two columns of black-letter type with cross-references down the centre.",
    caption:
      "And the inside: the first page of Genesis in the 1611 edition — black-letter type, a decorated “In the beginning,” and cross-references running down the middle.",
    credit: "Printed by Robert Barker, London, 1611 — public domain.",
  },
  codexSinaiticus: {
    src: "/history/codex-sinaiticus.jpg",
    width: 960,
    height: 1121,
    alt: "A page of Codex Sinaiticus reproduced in Greek capitals across four narrow columns, with an editor's notes in the margins.",
    caption:
      "A page of Codex Sinaiticus, a Greek Bible copied in the fourth century — one of the two oldest substantially complete copies that survive. Shown in Tischendorf’s line-for-line facsimile.",
    credit: "Constantin von Tischendorf, facsimile edition, 1862 — public domain.",
  },
  isaiahScroll: {
    src: "/history/great-isaiah-scroll.jpg",
    width: 1280,
    height: 404,
    alt: "The Great Isaiah Scroll unrolled and photographed in three long sections against black, columns of Hebrew script running across the tan parchment, edges worn and stitched sheets visible.",
    caption:
      "The Great Isaiah Scroll — a complete copy of Isaiah written around 125 BC and found near Qumran in 1947, roughly a thousand years older than the next-oldest Hebrew copy.",
    credit: "The Israel Museum, Jerusalem; photograph by Ardon Bar-Hama — public domain.",
  },
};

export interface TimelineEntry {
  year: string;
  title: string;
  detail: string;
  /** Pull the eye to the load-bearing moments. */
  major?: boolean;
  /** Usually one; the KJV entry carries its title page and a text page. */
  images?: HistoryImage[];
}

export const timeline: TimelineEntry[] = [
  {
    year: "c. 970",
    title: "Old English glosses",
    detail:
      "Anglo-Saxon scribes write English word-for-word between the lines of Latin gospels — the gloss added to the Lindisfarne Gospels is the famous example. There is still no continuous English Bible.",
    images: [historyImages.lindisfarneGloss],
  },
  {
    year: "1382",
    title: "The Wycliffe Bible",
    detail:
      "The first complete English Bible, translated from the Latin Vulgate by John Wycliffe and his circle and copied by hand. The church condemned it; owning one could be treated as heresy. Decades after his death Wycliffe's bones were dug up and burned.",
    major: true,
    images: [historyImages.wycliffe1382],
  },
  {
    year: "1516",
    title: "Erasmus prints the Greek New Testament",
    detail:
      "For the first time the Greek text is available in print. Erasmus worked from a handful of late medieval manuscripts; his text, lightly revised, became known as the Textus Receptus and stood behind every Protestant translation for the next 350 years.",
    images: [historyImages.erasmus1516],
  },
  {
    year: "1526",
    title: "Tyndale's New Testament",
    detail:
      "William Tyndale produces the first English New Testament translated directly from Greek, and the first to be printed. Copies are smuggled into England in bales of cloth. He goes on to translate much of the Old Testament from Hebrew before he is betrayed, strangled, and burned near Brussels in 1536.",
    major: true,
    images: [historyImages.tyndale1526],
  },
  {
    year: "1535",
    title: "The Coverdale Bible",
    detail:
      "Miles Coverdale publishes the first complete printed English Bible, filling the gaps Tyndale never reached by working from Latin and German. The Psalms in the Book of Common Prayer are still his.",
    images: [historyImages.coverdale1535],
  },
  {
    year: "1539",
    title: "The Great Bible",
    detail:
      "The first English Bible authorized for public reading in churches, chained to the lectern so it could not be carried off. Largely Tyndale and Coverdale, lightly revised.",
    images: [historyImages.greatBible1539],
  },
  {
    year: "1560",
    title: "The Geneva Bible",
    detail:
      "Made by English Protestants who had fled to Geneva. The first English Bible with numbered verses, printed in readable roman type, and heavily annotated — effectively the first study Bible. It was the Bible of Shakespeare, the Puritans, and the Mayflower.",
    major: true,
    images: [historyImages.geneva1560],
  },
  {
    year: "1568",
    title: "The Bishops' Bible",
    detail:
      "The Church of England's official answer to the Geneva Bible's pointed marginal notes. Never much loved, but it became the starting text for the King James translators.",
    images: [historyImages.bishops1568],
  },
  {
    year: "1611",
    title: "The King James Version",
    detail:
      "Commissioned by James I and produced by about 47 scholars in six companies. They revised the Bishops' Bible against the Hebrew and Greek — but leaned so heavily on Tyndale that most studies put 75–85% of the KJV New Testament in his words. The text most people read today is a lightly modernized 1769 edition.",
    major: true,
    images: [historyImages.kjv1611, historyImages.kjv1611Genesis],
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
  image?: HistoryImage;
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
    image: historyImages.codexSinaiticus,
  },
];
