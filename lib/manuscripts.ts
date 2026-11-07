/**
 * Content for /manuscripts ("Bible Manuscripts 101"). Kept as data so the page component
 * stays presentational.
 *
 * House rules for this page (the owner asked for it to be readable by someone meeting
 * the subject for the first time, and for tables over long cards so readers don't skim):
 * - Every date says "about" when it is an estimate, and every date carries AD or BC.
 * - "Scholars got access" (not "found"): several of these were never lost, so the field
 *   records when scholars could actually study each one.
 * - Every row answers the same questions in the same order, ending with "Did the KJV
 *   translators have it?". Table cells stay short.
 *
 * Sources checked 2026-11 (re-check before changing a figure):
 * - NT manuscript counts: INTF Münster, "How Many Greek New Testament Manuscripts Are
 *   There REALLY? The Latest Numbers" (Leggett & Paulson, 29 Sept 2023): 135 papyri,
 *   283 majuscules, 2,860 minuscules, 2,422 lectionaries = 5,700. The post says the
 *   listed copies date "from the late second century to the eighteenth century".
 * - OT: no official tally exists. Goshen-Gottstein's estimate of Hebrew manuscripts and
 *   fragments "runs into the tens of thousands", most of them Cairo Geniza fragments.
 * - Byzantine share: estimates run 80–90% or more (Robinson & Pierpont say 90%+).
 *   80–90% of 5,700 = about 4,560–5,130, which is where "4,500 to 5,000" comes from,
 *   and why the unsorted remainder is "roughly 500 to 1,000".
 * - TR vs MT ~1,800 differences and CT vs MT ~6,500: Wallace, "Some Second Thoughts on
 *   the Majority Text" (1989), as widely cited.
 * - Septuagint: Rahlfs's 1914 Verzeichnis lists over 1,500 manuscripts.
 * - Dead Sea Scrolls: ~230 biblical manuscripts, every book except Esther, found
 *   1947–1956 in 11 caves.
 * - Aleppo Codex: ~294 of an estimated 487 pages survive (~60%).
 * - Erasmus: about seven manuscripts (GA 1, 1rK/2814, 2e, 2ap, 4ap, 7p, 817), copied
 *   10th–15th century; Revelation from 2814 alone, missing its last leaf (Rev 22:16–21).
 * - The three OT example verses in `otExamples` were checked against each translation's
 *   text on Bible Gateway, 2026-11.
 */

export type Family = "Alexandrian" | "Byzantine" | "Western" | "Caesarean" | "Mixed" | "Too small to tell";

/** "Partly" = they had it only indirectly or barely used it; the note says how. */
export type KjvHad = "Yes" | "No" | "Partly";

export interface ManuscriptRow {
  id: string;
  name: string;
  /** One short plain line under the name. */
  what: string;
  family?: Family;
  familyNote?: string;
  language: string;
  /** What it contains, and (for the OT groups) how many copies. */
  contains: string;
  written: string;
  access: string;
  kjv: KjvHad;
  kjvNote?: string;
}

export const otManuscripts: ManuscriptRow[] = [
  {
    id: "masoretic",
    name: "Masoretic Text",
    what: "The standard Hebrew text, copied by Jewish scribes. Every translation on this site starts from it.",
    language: "Hebrew (a few chapters in Aramaic)",
    contains:
      "The whole Old Testament. Thousands of medieval copies. Best known: the Leningrad Codex (complete) and the Aleppo Codex (about 60% survives).",
    written: "Leningrad Codex: AD 1008. Aleppo Codex: about AD 930.",
    access: "Never lost. Leningrad Codex in a public library since 1863; Aleppo Codex reached Israel in 1958.",
    kjv: "Yes",
    kjvNote: "Through a printed Hebrew Bible (1524–25) made from later copies.",
  },
  {
    id: "dead-sea-scrolls",
    name: "Dead Sea Scrolls",
    what: "Jewish scrolls hidden in caves near the Dead Sea. The oldest Old Testament manuscripts of any real size ever found.",
    language: "Mostly Hebrew; some Aramaic and Greek",
    contains:
      "About 230 biblical scrolls, mostly fragments, out of over 900 scrolls in all. Every book except Esther.",
    written: "About 250 BC to AD 70",
    access: "Found 1947–56. Most fully published only in the 1990s and 2000s.",
    kjv: "No",
  },
  {
    id: "septuagint",
    name: "Septuagint",
    what: "A Greek translation of the Hebrew Scriptures, begun by Jews in Egypt before the time of Jesus. The name means “seventy,” from an old story about 70 translators, so it is often written LXX. New Testament writers often quote it.",
    language: "Greek",
    contains:
      "The whole Old Testament. Over 1,500 copies and fragments were catalogued by 1914. The fullest are inside Vaticanus, Sinaiticus and Alexandrinus.",
    written: "Translated from the 200s BC. Oldest fragments: about 150 BC. Complete copies: AD 300s–400s.",
    access: "Never lost. The Greek church has always used it.",
    kjv: "Yes",
    kjvNote: "In printed form.",
  },
  {
    id: "samaritan",
    name: "Samaritan Pentateuch",
    what: "The Samaritans’ own copy of the first five books, kept apart from the Jewish copies for centuries.",
    language: "Hebrew, in the Samaritan alphabet",
    contains:
      "Genesis to Deuteronomy only. Differs from the Masoretic Text in about 6,000 places, mostly spelling.",
    written: "Oldest copies: no earlier than about AD 1000",
    access: "First copy reached Europe in 1616",
    kjv: "No",
  },
  {
    id: "geniza",
    name: "Cairo Geniza",
    what: "A synagogue storeroom in Cairo where worn-out writings were set aside for centuries instead of thrown away.",
    language: "Mostly Hebrew; also Aramaic and Arabic",
    contains:
      "About 400,000 fragments of every kind of writing, including many thousands of pieces of Hebrew Bibles.",
    written: "Mostly about AD 900–1300",
    access: "Most of it brought to Cambridge in 1896–97",
    kjv: "No",
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
      "Also called uncials. Copies on parchment written in all capital letters, mostly from the AD 300s to 900s. Some are nearly complete Bibles.",
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

export const ntManuscripts: ManuscriptRow[] = [
  {
    id: "p52",
    name: "Papyrus 52",
    what: "A scrap about the size of a credit card. Usually called the oldest piece of the New Testament.",
    family: "Too small to tell",
    language: "Greek",
    contains: "A few verses of John 18",
    written: "AD 100s (often given as about 125–175)",
    access: "Bought in Egypt 1920; identified 1935",
    kjv: "No",
  },
  {
    id: "p46",
    name: "Papyrus 46",
    what: "The oldest surviving collection of Paul’s letters.",
    family: "Alexandrian",
    language: "Greek",
    contains: "Most of Paul’s letters",
    written: "About AD 200",
    access: "Bought in Egypt in the early 1930s",
    kjv: "No",
  },
  {
    id: "p66",
    name: "Papyrus 66",
    what: "One of the earliest copies of John’s Gospel.",
    family: "Alexandrian",
    language: "Greek",
    contains: "Most of John",
    written: "About AD 200",
    access: "Bought in the 1950s",
    kjv: "No",
  },
  {
    id: "p75",
    name: "Papyrus 75",
    what: "Very close in wording to Codex Vaticanus, but about 100 years older.",
    family: "Alexandrian",
    language: "Greek",
    contains: "Large parts of Luke and John",
    written: "About AD 200–225",
    access: "Bought in the 1950s; published 1961",
    kjv: "No",
  },
  {
    id: "vaticanus",
    name: "Codex Vaticanus",
    what: "One of the two oldest nearly complete Greek Bibles.",
    family: "Alexandrian",
    language: "Greek",
    contains: "Most of the Bible; the end of the New Testament is lost",
    written: "About AD 300–350",
    access: "In the Vatican Library since the 1400s; first reliable edition 1867",
    kjv: "No",
    kjvNote: "No usable copy existed.",
  },
  {
    id: "sinaiticus",
    name: "Codex Sinaiticus",
    what: "The other of the two oldest nearly complete Greek Bibles, and the one with the whole New Testament.",
    family: "Alexandrian",
    language: "Greek",
    contains: "The whole New Testament and much of the Old",
    written: "About AD 330–360",
    access: "Found at a monastery at Mount Sinai, 1844 and 1859",
    kjv: "No",
  },
  {
    id: "alexandrinus",
    name: "Codex Alexandrinus",
    what: "A nearly complete Greek Bible, given to King Charles I of England.",
    family: "Mixed",
    familyNote: "Byzantine in the Gospels",
    language: "Greek",
    contains: "Nearly the whole Bible",
    written: "About AD 400–450",
    access: "Reached England 1627",
    kjv: "No",
    kjvNote: "Arrived 16 years too late.",
  },
  {
    id: "bezae",
    name: "Codex Bezae",
    what: "Greek on one page and Latin on the facing page.",
    family: "Western",
    language: "Greek and Latin",
    contains: "The Gospels and Acts",
    written: "About AD 400",
    access: "Obtained by Theodore Beza 1562",
    kjv: "Partly",
    kjvNote: "Beza owned it but seldom followed it.",
  },
  {
    id: "washingtonianus",
    name: "Codex Washingtonianus",
    what: "An early Gospel book, now in Washington, D.C.",
    family: "Mixed",
    familyNote: "Different families in different parts",
    language: "Greek",
    contains: "The four Gospels",
    written: "About AD 400",
    access: "Bought in Egypt 1906",
    kjv: "No",
  },
  {
    id: "koridethi",
    name: "Codex Koridethi",
    what: "Named after a monastery where it was once kept. The best-known Caesarean copy.",
    family: "Caesarean",
    familyNote: "In Mark",
    language: "Greek",
    contains: "The four Gospels",
    written: "About AD 800–900",
    access: "Kept in the Caucasus region; published 1913",
    kjv: "No",
  },
  {
    id: "minuscules",
    name: "The medieval minuscules",
    what: "Thousands of hand-copied New Testaments. Erasmus printed his Greek text from about seven of them.",
    family: "Byzantine",
    language: "Greek",
    contains: "Anything from one book to the whole New Testament",
    written: "Mostly about AD 900–1500",
    access: "Never lost; in use in Greek churches",
    kjv: "Yes",
    kjvNote: "Through Erasmus’s printed text.",
  },
];

export interface FamilyRow {
  name: string;
  family?: Family;
  where: string;
  oldest: string;
  howMany: string;
  examples: string;
  style: string;
}

/** Main families first (the owner asked for Byzantine and Alexandrian to lead). */
export const mainFamilies: FamilyRow[] = [
  {
    name: "Byzantine",
    family: "Byzantine",
    where: "Constantinople (today’s Istanbul) and the Greek-speaking East",
    oldest: "About AD 400–450. Most copies are from AD 800 on.",
    howMany: "Roughly 4,500 to 5,000 (80–90% of all copies)",
    examples: "Codex Alexandrinus (in the Gospels), most medieval minuscules",
    style: "Fuller, smoother wording. The standard text of the Greek church for about 1,000 years.",
  },
  {
    name: "Alexandrian",
    family: "Alexandrian",
    where: "Egypt, named after the city of Alexandria",
    oldest: "About AD 200",
    howMany: "A few dozen, but they include most of the oldest copies",
    examples: "Papyrus 66, Papyrus 75, Codex Vaticanus, Codex Sinaiticus",
    style: "Shorter, plainer wording.",
  },
];

export const minorFamilies: FamilyRow[] = [
  {
    name: "Western",
    family: "Western",
    where: "Rome, North Africa and Gaul (France)",
    oldest: "Quoted by church writers in the late AD 100s; copies from about AD 300",
    howMany: "A handful in Greek; more in early Latin translations",
    examples: "Codex Bezae",
    style: "Tends to rephrase and expand.",
  },
  {
    name: "Caesarean",
    family: "Caesarean",
    where: "Possibly Caesarea, in what is now Israel",
    oldest: "About AD 200–250, if it is a real family",
    howMany: "A few dozen at most, Gospels only",
    examples: "Codex Koridethi; two small groups called Family 1 and Family 13",
    style: "Between Alexandrian and Western. Many scholars doubt it is a real family.",
  },
];

export const unsortedRow: FamilyRow = {
  name: "Mixed or unsorted",
  where: "Everywhere",
  oldest: "All periods",
  howMany: "The rest: roughly 500 to 1,000",
  examples: "Codex Washingtonianus (mixed), Papyrus 52 (too small to tell)",
  style: "Copies that mix families, scraps too short to judge, and copies no one has studied closely.",
};

export interface TimelineRow {
  label: string;
  testament: "OT" | "NT";
  /** Years; BC as negative numbers. */
  writtenFrom: number;
  writtenTo: number;
  writtenLabel: string;
  access: number;
  accessLabel: string;
}

/** A selection of famous manuscripts with a solid "scholars got access" year. */
export const timelineRows: TimelineRow[] = [
  {
    label: "Dead Sea Scrolls",
    testament: "OT",
    writtenFrom: -250,
    writtenTo: 70,
    writtenLabel: "about 250 BC – AD 70",
    access: 1947,
    accessLabel: "found 1947–56",
  },
  {
    label: "Leningrad Codex",
    testament: "OT",
    writtenFrom: 1008,
    writtenTo: 1008,
    writtenLabel: "AD 1008",
    access: 1863,
    accessLabel: "public library 1863",
  },
  {
    label: "Papyrus 52",
    testament: "NT",
    writtenFrom: 125,
    writtenTo: 175,
    writtenLabel: "about AD 125–175",
    access: 1935,
    accessLabel: "identified 1935",
  },
  {
    label: "Papyrus 75",
    testament: "NT",
    writtenFrom: 200,
    writtenTo: 225,
    writtenLabel: "about AD 200–225",
    access: 1961,
    accessLabel: "published 1961",
  },
  {
    label: "Codex Vaticanus",
    testament: "NT",
    writtenFrom: 300,
    writtenTo: 350,
    writtenLabel: "about AD 300–350",
    access: 1867,
    accessLabel: "first reliable edition 1867",
  },
  {
    label: "Codex Sinaiticus",
    testament: "NT",
    writtenFrom: 330,
    writtenTo: 360,
    writtenLabel: "about AD 330–360",
    access: 1859,
    accessLabel: "found 1844 and 1859",
  },
  {
    label: "Codex Bezae",
    testament: "NT",
    writtenFrom: 380,
    writtenTo: 420,
    writtenLabel: "about AD 400",
    access: 1562,
    accessLabel: "obtained by Beza 1562",
  },
  {
    label: "Codex Alexandrinus",
    testament: "NT",
    writtenFrom: 400,
    writtenTo: 450,
    writtenLabel: "about AD 400–450",
    access: 1627,
    accessLabel: "reached England 1627",
  },
  {
    label: "Erasmus’s manuscripts",
    testament: "NT",
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
