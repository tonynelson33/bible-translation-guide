/**
 * Content for /manuscripts ("Where the Bible's text comes from"). Kept as data so the
 * page component stays presentational.
 *
 * House rules for this page (the owner asked for it to be readable by someone meeting
 * the subject for the first time):
 * - Every date says "about" when it is an estimate, and every date carries AD or BC.
 * - "Scholars got access" (not "found"): several of these were never lost, so the field
 *   records when scholars could actually study each one.
 * - Every manuscript card answers the same questions in the same order.
 *
 * Sources checked 2026-11 (re-check before changing a figure):
 * - NT manuscript counts: INTF Münster, "How Many Greek New Testament Manuscripts Are
 *   There REALLY? The Latest Numbers" (Leggett & Paulson, 29 Sept 2023): 135 papyri,
 *   283 majuscules, 2,860 minuscules, 2,422 lectionaries = 5,700.
 * - TR vs MT ~1,800 differences and CT vs MT ~6,500: Wallace, "Some Second Thoughts on
 *   the Majority Text" (1989), as widely cited.
 * - Septuagint: Rahlfs's 1914 Verzeichnis lists over 1,500 manuscripts.
 * - Dead Sea Scrolls: ~230 biblical manuscripts, every book except Esther, found
 *   1947–1956 in 11 caves (Israel Antiquities Authority / standard references).
 * - Aleppo Codex: ~294 of an estimated 487 pages survive (~60%).
 * - The three OT example verses in `otExamples` were checked against each translation's
 *   text on Bible Gateway, 2026-11.
 */
import type { HistoryImage } from "./englishBibleHistory";
import { historyImages } from "./englishBibleHistory";

export type Family = "Alexandrian" | "Byzantine" | "Western" | "Caesarean" | "Mixed" | "Too small to tell";

/** "Partly" = they had it only indirectly or barely used it; the note says how. */
export type KjvHad = "Yes" | "No" | "Partly";

export interface ManuscriptEntry {
  id: string;
  name: string;
  /** One plain sentence: what this is. */
  what: string;
  family?: Family;
  familyNote?: string;
  language: string;
  material: string;
  contains: string;
  written: string;
  access: string;
  kjv: KjvHad;
  kjvNote: string;
  image?: HistoryImage;
}

export const otManuscripts: ManuscriptEntry[] = [
  {
    id: "masoretic",
    name: "The Masoretic Text",
    what: "The standard Hebrew text of the Old Testament, copied and guarded by Jewish scribes for centuries. Every translation on this site starts from it.",
    language: "Hebrew, with a few chapters in Aramaic",
    material: "Parchment (animal skin); later copies also on paper",
    contains:
      "The whole Old Testament. Thousands of handwritten copies and fragments survive, almost all from the Middle Ages.",
    written:
      "The oldest complete copy, the Leningrad Codex, was finished in AD 1008. The Aleppo Codex is older (about AD 930), but only about 60% of it survives.",
    access:
      "Never lost. Jewish communities kept using and copying it. The Leningrad Codex went to a public library in St. Petersburg, Russia, in 1863. The Aleppo Codex reached Israel in 1958.",
    kjv: "Yes",
    kjvNote:
      "Through a printed Hebrew Bible from 1524–25, made from later medieval copies. They did not have the Aleppo or Leningrad codex.",
    image: historyImages.leningrad,
  },
  {
    id: "dead-sea-scrolls",
    name: "The Dead Sea Scrolls",
    what: "Ancient Jewish scrolls hidden in caves near the Dead Sea. They include the oldest copies of Old Testament books ever found.",
    language: "Mostly Hebrew; some Aramaic and Greek",
    material: "Mostly parchment; some papyrus",
    contains:
      "Over 900 scrolls in all, mostly in fragments. About 230 are copies of Old Testament books. Every book except Esther shows up at least once.",
    written: "Between about 250 BC and AD 70.",
    access:
      "Found between 1947 and 1956 in 11 caves near Qumran. Most were not fully published until the 1990s and 2000s.",
    kjv: "No",
    kjvNote: "They were found more than 300 years after the KJV.",
    image: historyImages.isaiahScroll,
  },
  {
    id: "septuagint",
    name: "The Septuagint",
    what: "A translation of the Hebrew Scriptures into Greek, made by Jews in Egypt before the time of Jesus. The early church used it, and New Testament writers often quote it.",
    language: "Greek",
    material: "Papyrus and parchment",
    contains:
      "The whole Old Testament in Greek. Over 1,500 copies and fragments had been catalogued by 1914, and more are known today. The most complete copies are inside three great Greek Bibles: Codex Vaticanus, Codex Sinaiticus and Codex Alexandrinus.",
    written:
      "Translated in stages, starting with the first five books in the 200s BC. The oldest surviving fragments are from about 150 BC. The complete copies are from the AD 300s and 400s.",
    access:
      "Never lost. It has always been the Old Testament of the Greek-speaking church.",
    kjv: "Yes",
    kjvNote: "In printed form. The translators consulted it alongside the Hebrew.",
  },
  {
    id: "samaritan",
    name: "The Samaritan Pentateuch",
    what: "The Samaritans’ own copy of the first five books of the Bible, kept separately from the Jewish copies for many centuries.",
    language: "Hebrew, written in the Samaritan alphabet",
    material: "Parchment",
    contains:
      "Only the first five books (Genesis to Deuteronomy). It differs from the Masoretic Text in about 6,000 places, most of them spelling.",
    written: "The oldest surviving copies are no earlier than about AD 1000.",
    access: "The first copy reached Europe in 1616.",
    kjv: "No",
    kjvNote: "It reached Europe five years after the KJV was published.",
  },
  {
    id: "geniza",
    name: "The Cairo Geniza",
    what: "A storeroom in a Cairo synagogue where worn-out writings were set aside instead of being thrown away, for hundreds of years.",
    language: "Mostly Hebrew; also Aramaic and Arabic",
    material: "Parchment and paper",
    contains:
      "About 400,000 fragments of every kind of writing, including many pieces of Hebrew Bibles.",
    written: "Mostly between about AD 900 and 1300.",
    access: "Most of it was brought to Cambridge University in 1896–97.",
    kjv: "No",
    kjvNote: "It was opened to scholars almost 300 years later.",
  },
];

export interface ManuscriptKind {
  name: string;
  count: string;
  description: string;
}

/** INTF, 29 Sept 2023. Rounded the way the page states them. */
export const ntKinds: ManuscriptKind[] = [
  {
    name: "Papyri",
    count: "about 135",
    description:
      "Copies on papyrus. They include the oldest New Testament copies we have, some from the AD 100s and 200s. Most are fragments, and almost all were found in Egypt.",
  },
  {
    name: "Majuscules",
    count: "about 280",
    description:
      "Copies on parchment written in all capital letters, mostly from the AD 300s to 900s. Some are nearly complete Bibles.",
  },
  {
    name: "Minuscules",
    count: "about 2,860",
    description:
      "Copies in a faster lower-case handwriting that took over from the AD 800s. Most are from the Middle Ages.",
  },
  {
    name: "Lectionaries",
    count: "about 2,420",
    description:
      "Church reading books. Instead of running in order, they arrange passages for each day’s service. Most are from the Middle Ages.",
  },
];

export const ntManuscripts: ManuscriptEntry[] = [
  {
    id: "p52",
    name: "Papyrus 52",
    what: "A scrap of John’s Gospel about the size of a credit card. It is usually called the oldest surviving piece of the New Testament.",
    family: "Too small to tell",
    language: "Greek",
    material: "Papyrus",
    contains: "A few verses of John 18.",
    written: "Sometime in the AD 100s. A common estimate is AD 125–175, but experts’ estimates vary.",
    access: "Bought in Egypt in 1920. Identified and published in 1935.",
    kjv: "No",
    kjvNote: "It was identified over 300 years after the KJV.",
    image: historyImages.papyrus52,
  },
  {
    id: "p46",
    name: "Papyrus 46",
    what: "The oldest surviving collection of Paul’s letters.",
    family: "Alexandrian",
    familyNote: "Mostly",
    language: "Greek",
    material: "Papyrus",
    contains: "Most of Paul’s letters, with pages missing.",
    written: "About AD 200. Experts’ estimates vary.",
    access: "Bought in Egypt in the early 1930s and published soon after.",
    kjv: "No",
    kjvNote: "It surfaced in the 1930s.",
  },
  {
    id: "p66",
    name: "Papyrus 66",
    what: "An early copy of John’s Gospel in book form.",
    family: "Alexandrian",
    familyNote: "Mostly",
    language: "Greek",
    material: "Papyrus",
    contains: "Most of John.",
    written: "About AD 200.",
    access: "Found in Egypt and bought in the 1950s.",
    kjv: "No",
    kjvNote: "It surfaced in the 1950s.",
  },
  {
    id: "p75",
    name: "Papyrus 75",
    what: "An early copy of Luke and John. Its wording is very close to Codex Vaticanus, though it is about a hundred years older.",
    family: "Alexandrian",
    language: "Greek",
    material: "Papyrus",
    contains: "Large parts of Luke and John.",
    written: "About AD 200–225.",
    access: "Bought in the 1950s. Published in 1961.",
    kjv: "No",
    kjvNote: "It surfaced in the 1950s.",
  },
  {
    id: "vaticanus",
    name: "Codex Vaticanus",
    what: "One of the two oldest nearly complete Bibles in Greek, kept in the Vatican Library in Rome.",
    family: "Alexandrian",
    language: "Greek",
    material: "Parchment",
    contains: "Most of the Old and New Testaments. The end of the New Testament is lost.",
    written: "About AD 300–350.",
    access:
      "In the Vatican Library since at least the 1400s, but closely guarded. Scholars got a reliable full edition only in 1867, and photographs in 1889–90.",
    kjv: "No",
    kjvNote: "It existed in Rome, but no usable copy of its text was available.",
  },
  {
    id: "sinaiticus",
    name: "Codex Sinaiticus",
    what: "The other of the two oldest nearly complete Bibles in Greek. Of the two, it is the one with the whole New Testament.",
    family: "Alexandrian",
    familyNote: "Mostly",
    language: "Greek",
    material: "Parchment",
    contains: "The whole New Testament and much of the Old.",
    written: "About AD 330–360.",
    access:
      "Found at St. Catherine’s Monastery at Mount Sinai: some pages in 1844, most of it in 1859. Published in 1862.",
    kjv: "No",
    kjvNote: "It was found about 250 years after the KJV.",
    image: historyImages.codexSinaiticus,
  },
  {
    id: "alexandrinus",
    name: "Codex Alexandrinus",
    what: "A nearly complete Greek Bible, given to King Charles I of England.",
    family: "Mixed",
    familyNote: "Byzantine in the Gospels, Alexandrian elsewhere",
    language: "Greek",
    material: "Parchment",
    contains: "Nearly the whole Bible.",
    written: "About AD 400–450.",
    access: "Reached England in 1627.",
    kjv: "No",
    kjvNote: "It arrived 16 years after the KJV was published.",
  },
  {
    id: "bezae",
    name: "Codex Bezae",
    what: "A Bible manuscript with Greek on one page and Latin on the facing page. It is the best-known Western copy.",
    family: "Western",
    language: "Greek and Latin",
    material: "Parchment",
    contains: "The Gospels and Acts.",
    written: "About AD 400. Experts’ estimates vary.",
    access:
      "The scholar Theodore Beza obtained it in 1562 and gave it to Cambridge University in 1581.",
    kjv: "Partly",
    kjvNote:
      "Beza owned it, but he seldom followed it in his printed Greek New Testament, which the KJV translators used.",
  },
  {
    id: "washingtonianus",
    name: "Codex Washingtonianus",
    what: "An early copy of the Gospels, now in Washington, D.C.",
    family: "Mixed",
    familyNote: "Different families in different parts",
    language: "Greek",
    material: "Parchment",
    contains: "The four Gospels.",
    written: "About AD 400.",
    access: "Bought in Egypt in 1906 by the American collector Charles Freer.",
    kjv: "No",
    kjvNote: "It surfaced in 1906.",
  },
  {
    id: "koridethi",
    name: "Codex Koridethi",
    what: "A Gospel book named after Koridethi, a monastery where it was kept for a time. It is the best-known Caesarean copy.",
    family: "Caesarean",
    familyNote: "In Mark; Byzantine elsewhere",
    language: "Greek",
    material: "Parchment",
    contains: "The four Gospels.",
    written: "About AD 800–900.",
    access:
      "Kept in churches in the Caucasus region for centuries. Published in 1913, and now in Tbilisi, Georgia.",
    kjv: "No",
    kjvNote: "It was published in 1913.",
  },
  {
    id: "minuscules",
    name: "The medieval minuscules",
    what: "Thousands of hand-copied New Testaments from the Middle Ages. Erasmus built his printed Greek text from a handful of them.",
    family: "Byzantine",
    familyNote: "Mostly",
    language: "Greek",
    material: "Parchment; later also paper",
    contains: "Anything from one book to the whole New Testament.",
    written: "Mostly between about AD 900 and 1500.",
    access:
      "Never lost. They were copied and read in Greek churches. Many reached Western Europe in the 1400s and 1500s.",
    kjv: "Yes",
    kjvNote: "Through Erasmus’s printed text and the later editions based on it.",
  },
];

export interface FamilyEntry {
  name: Family;
  disputed?: boolean;
  where: string;
  oldest: string;
  language: string;
  howMany: string;
  examples: string;
  style: string;
  image?: HistoryImage;
}

export const families: FamilyEntry[] = [
  {
    name: "Alexandrian",
    where: "Egypt. It is named after the city of Alexandria.",
    oldest: "About AD 200.",
    language: "Greek (also early translations into Coptic, the language of Egypt)",
    howMany: "A few dozen copies, but they include most of the oldest ones.",
    examples: "Papyrus 66, Papyrus 75, Codex Vaticanus, Codex Sinaiticus",
    style: "Tends to have shorter, plainer wording.",
  },
  {
    name: "Western",
    where: "The western Mediterranean: Rome, North Africa and Gaul (France).",
    oldest:
      "Its readings are quoted by church writers in the late AD 100s. The surviving copies are from about AD 300 on.",
    language: "Greek, Latin and Syriac",
    howMany: "Only a handful in Greek. More in the early Latin translations.",
    examples: "Codex Bezae and the early Latin translations",
    style: "Tends to rephrase and expand.",
  },
  {
    name: "Caesarean",
    disputed: true,
    where: "Possibly Caesarea, a city in what is now Israel.",
    oldest: "About AD 200–250, if it is a real family.",
    language: "Greek (also early Armenian and Georgian translations)",
    howMany: "A few dozen at most, and only in the Gospels (mostly Mark).",
    examples: "Codex Koridethi, and two small groups of related minuscules (called Family 1 and Family 13)",
    style:
      "Sits between Alexandrian and Western. Many scholars now doubt it is a real family at all.",
  },
  {
    name: "Byzantine",
    where: "Constantinople (today’s Istanbul) and the Greek-speaking East.",
    oldest: "About AD 400–450, in the Gospels of Codex Alexandrinus. Most copies are from AD 800 on.",
    language: "Greek",
    howMany:
      "Roughly 4,500 to 5,000 or more. Most estimates say 80–90% or more of all the copies.",
    examples: "Codex Alexandrinus (Gospels), Codex Boreelianus, and most of the medieval minuscules",
    style:
      "Tends to have fuller, smoother wording. It was the standard text of the Greek church for about a thousand years.",
    image: historyImages.boreelianus,
  },
];

export interface TimelineRow {
  label: string;
  /** Years; BC as negative numbers. */
  writtenFrom: number;
  writtenTo: number;
  writtenLabel: string;
  access: number;
  accessLabel: string;
}

/** Only manuscripts with a solid "scholars got access" year. */
export const timelineRows: TimelineRow[] = [
  {
    label: "Dead Sea Scrolls",
    writtenFrom: -250,
    writtenTo: 70,
    writtenLabel: "about 250 BC – AD 70",
    access: 1947,
    accessLabel: "found 1947–56",
  },
  {
    label: "Papyrus 52",
    writtenFrom: 125,
    writtenTo: 175,
    writtenLabel: "about AD 125–175",
    access: 1935,
    accessLabel: "published 1935",
  },
  {
    label: "Papyrus 75",
    writtenFrom: 200,
    writtenTo: 225,
    writtenLabel: "about AD 200–225",
    access: 1961,
    accessLabel: "published 1961",
  },
  {
    label: "Codex Vaticanus",
    writtenFrom: 300,
    writtenTo: 350,
    writtenLabel: "about AD 300–350",
    access: 1867,
    accessLabel: "full edition 1867",
  },
  {
    label: "Codex Sinaiticus",
    writtenFrom: 330,
    writtenTo: 360,
    writtenLabel: "about AD 330–360",
    access: 1859,
    accessLabel: "found 1844 and 1859",
  },
  {
    label: "Codex Bezae",
    writtenFrom: 380,
    writtenTo: 420,
    writtenLabel: "about AD 400",
    access: 1562,
    accessLabel: "obtained by Beza 1562",
  },
  {
    label: "Codex Alexandrinus",
    writtenFrom: 400,
    writtenTo: 450,
    writtenLabel: "about AD 400–450",
    access: 1627,
    accessLabel: "reached England 1627",
  },
  {
    label: "Leningrad Codex (Hebrew)",
    writtenFrom: 1008,
    writtenTo: 1008,
    writtenLabel: "AD 1008",
    access: 1863,
    accessLabel: "public library 1863",
  },
  {
    label: "Erasmus’s manuscripts",
    writtenFrom: 900,
    writtenTo: 1500,
    writtenLabel: "about AD 900–1500",
    access: 1516,
    accessLabel: "printed 1516",
  },
];

/** The one reference line on the chart: the year the KJV was published. */
export const KJV_YEAR = 1611;

export interface OtExample {
  ref: string;
  difference: string;
  groups: { label: string; ids: string[] }[];
  note?: string;
}

/**
 * Checked against each translation's text on Bible Gateway, 2026-11. Ten of the most
 * widely used translations on the site, not all twenty-six.
 */
export const otExampleTranslations = ["kjv", "nkjv", "nasb", "lsb", "esv", "niv", "csb", "nlt", "nrsvue", "ceb"];

export const otExamples: OtExample[] = [
  {
    ref: "1 Samuel 10:27",
    difference:
      "A Dead Sea Scroll has a whole extra paragraph here. It explains that King Nahash had been gouging out the right eyes of Israelites. The Masoretic Text doesn’t have it.",
    groups: [
      { label: "Print the extra paragraph", ids: ["nlt", "nrsvue", "ceb"] },
      { label: "Leave it out, but mention it in a footnote", ids: ["nasb", "niv", "csb"] },
      { label: "Leave it out, with no footnote", ids: ["kjv", "nkjv", "lsb", "esv"] },
    ],
    note: "The NLT prints it in square brackets.",
  },
  {
    ref: "Deuteronomy 32:8",
    difference:
      "God set the nations’ boundaries “according to the number of the sons of Israel.” That is the Masoretic Text. A Dead Sea Scroll reads “sons of God” instead, and the Septuagint reads “angels of God.”",
    groups: [
      { label: "Follow the Scroll and the Septuagint", ids: ["esv", "nlt", "nrsvue", "ceb"] },
      { label: "Follow the Masoretic Text, with a footnote", ids: ["nkjv", "nasb", "lsb", "niv", "csb"] },
      { label: "Follow the Masoretic Text, with no footnote", ids: ["kjv"] },
    ],
  },
  {
    ref: "Psalm 22:16",
    difference:
      "Most Hebrew manuscripts have “like a lion” before “my hands and my feet.” The Septuagint, some Hebrew manuscripts and other early translations have a verb there instead, usually translated “they pierced.”",
    groups: [
      { label: "“They pierced” (or “pierce”)", ids: ["kjv", "nkjv", "nasb", "lsb", "esv", "niv", "csb", "nlt"] },
      { label: "Something else", ids: ["nrsvue", "ceb"] },
    ],
    note: "The NRSVue has “they bound” and notes that the Hebrew is uncertain. The CEB keeps “like a lion.”",
  },
];
