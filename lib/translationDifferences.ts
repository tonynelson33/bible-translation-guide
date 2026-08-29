import differenceVerses from "@/data/differenceVerses.json";
import cachedVerses from "@/data/cachedVerses.json";

/**
 * Content for /differences. The ~85 verses come from
 * data/verseComparisonList.json (category "Translation Difference"); most are
 * only described here, a curated ~25 are quoted from data/differenceVerses.json
 * (text fetched from official APIs, see scripts/fetch-difference-verses.mjs).
 *
 * Two top-level parts:
 *  A. manuscript differences (Textus Receptus / Byzantine vs. critical text;
 *     Masoretic OT vs. Septuagint / Dead Sea Scrolls)
 *  B. translation choices (undisputed text, different English)
 */

export type TranslationId = "kjv" | "esv" | "niv" | "nkjv" | "net";

export interface ShownVerse {
  reference: string;
  /** translation ids to display, in order */
  show: TranslationId[];
  /** what specifically differs, and (briefly) why */
  note: string;
}

export interface ReferencedVerse {
  /** a single verse, or a range shown as one line */
  reference: string;
  note: string;
}

export interface DiffSection {
  id: string;
  title: string;
  intro: string;
  shown?: ShownVerse[];
  referenced?: ReferencedVerse[];
}

export interface DiffPart {
  id: string;
  title: string;
  intro: string;
  sections: DiffSection[];
}

export const TRANSLATION_LABEL: Record<TranslationId, string> = {
  kjv: "KJV",
  nkjv: "NKJV",
  esv: "ESV",
  niv: "NIV",
  net: "NET",
};

/** short tag under each translation label on this page */
export const TRANSLATION_TAG: Record<TranslationId, string> = {
  kjv: "Textus Receptus",
  nkjv: "Textus Receptus",
  esv: "Critical text",
  niv: "Critical text",
  net: "Critical text",
};

export const ATTRIBUTIONS: Record<TranslationId, string> = {
  kjv: (cachedVerses as Record<string, { attribution: string }>).kjv.attribution,
  esv: (cachedVerses as Record<string, { attribution: string }>).esv.attribution,
  niv: (cachedVerses as Record<string, { attribution: string }>).niv.attribution,
  nkjv: (cachedVerses as Record<string, { attribution: string }>).nkjv.attribution,
  net: (cachedVerses as Record<string, { attribution: string }>).net.attribution,
};

/** verse text (null = the translation omits this verse from its running text) */
export function verseText(reference: string, id: TranslationId): string | null | undefined {
  return (differenceVerses as Record<string, Record<string, string | null>>)[reference]?.[id];
}

export const differenceParts: DiffPart[] = [
  {
    id: "manuscripts",
    title: "Part 1 — Which manuscripts?",
    intro:
      "The KJV and NKJV translate the New Testament from the Textus Receptus, a Greek text compiled in the 1500s from the Byzantine manuscript tradition. Most modern translations use a critical text that also weighs the oldest surviving manuscripts, some from the 300s and earlier, most of them discovered after 1600. Where the two traditions disagree you get bracketed verses, footnotes, and shorter or longer readings. The Old Testament has a parallel situation: the standard Hebrew (Masoretic) text versus older witnesses like the Greek Septuagint and the Dead Sea Scrolls.",
    sections: [
      {
        id: "long-passages",
        title: "Two long passages",
        intro:
          "Two well-known passages are missing from the earliest Greek manuscripts but present in the later Byzantine ones. Modern translations keep both — normally in brackets, with a note explaining the manuscript evidence.",
        shown: [
          {
            reference: "John 8:7",
            show: ["kjv", "esv", "niv"],
            note:
              "The verse itself reads much the same everywhere. The point is the setting: the ESV, NIV, and others print the whole story of the woman caught in adultery (John 7:53–8:11) in brackets, noting that the earliest manuscripts do not contain it and that some that do place it elsewhere.",
          },
          {
            reference: "Mark 16:16",
            show: ["kjv", "esv", "niv"],
            note:
              "One verse from the “longer ending” of Mark (16:9–20). The wording barely differs, but the ESV and NIV bracket verses 9–20 and note that the oldest manuscripts end the Gospel at verse 8; some translations also print a shorter alternate ending.",
          },
        ],
        referenced: [
          {
            reference: "John 7:53 – 8:11",
            note:
              "The woman caught in adultery. Absent from the earliest and best Greek manuscripts; the story is ancient and widely regarded as authentic tradition, but its place in John is uncertain. KJV and NKJV print it without qualification; most others bracket it.",
          },
          {
            reference: "Mark 16:9 – 20",
            note:
              "The “longer ending” of Mark. The two oldest complete manuscripts end at 16:8; later manuscripts, the majority, have these twelve verses. KJV and NKJV include them plainly; most others bracket them with a note.",
          },
        ],
      },
      {
        id: "whole-verses",
        title: "Whole verses",
        intro:
          "Each of these is a complete verse in the Textus Receptus that the earliest manuscripts do not have. Modern translations either skip the verse number — leaving a visible gap — or move it to a footnote. In almost every case the same thought appears elsewhere in Scripture.",
        shown: [
          {
            reference: "Matthew 17:21",
            show: ["kjv", "nkjv", "esv"],
            note:
              "“This kind goeth not out but by prayer and fasting.” KJV and NKJV have it; the ESV and NIV go straight from verse 20 to verse 22. The parallel in Mark 9:29 carries the same teaching.",
          },
          {
            reference: "Acts 8:37",
            show: ["kjv", "nkjv", "esv"],
            note:
              "The Ethiopian official’s confession of faith before his baptism (“I believe that Jesus Christ is the Son of God”). In KJV and NKJV; footnoted or omitted elsewhere. It is quoted by writers as early as the 2nd century but absent from the earliest manuscripts of Acts.",
          },
          {
            reference: "Matthew 18:11",
            show: ["kjv", "nkjv", "esv"],
            note:
              "“For the Son of man is come to save that which was lost.” The same sentence is uncontested in Luke 19:10.",
          },
        ],
        referenced: [
          { reference: "Matthew 23:14", note: "A woe about devouring widows’ houses; paralleled in Mark 12:40 and Luke 20:47." },
          { reference: "Mark 7:16", note: "“If any man have ears to hear, let him hear” — a refrain that appears many times elsewhere." },
          { reference: "Mark 9:44 and 9:46", note: "Both repeat verse 48 (“their worm dieth not”); modern texts keep only verse 48." },
          { reference: "Mark 11:26", note: "On forgiveness; the same teaching is in Matthew 6:15." },
          { reference: "Mark 15:28", note: "“He was numbered with the transgressors” (Isaiah 53:12); Jesus applies that verse to himself in Luke 22:37." },
          { reference: "Luke 17:36", note: "“Two men shall be in the field”; the previous verse already has the pattern." },
          { reference: "Luke 23:17", note: "Pilate’s custom of releasing a prisoner at the feast; stated plainly in Matthew 27:15 and Mark 15:6." },
          { reference: "Acts 15:34", note: "A note that Silas stayed on at Antioch." },
          { reference: "Acts 24:7", note: "An expansion about the commander Lysias intervening." },
          { reference: "Acts 28:29", note: "A note that the Jews left arguing among themselves." },
          { reference: "Romans 16:24", note: "A grace-benediction repeating the one in verse 20." },
        ],
      },
      {
        id: "phrases",
        title: "Missing phrases",
        intro:
          "Here it is not a whole verse but a clause or phrase — the Byzantine text is longer, the critical text shorter.",
        shown: [
          {
            reference: "Luke 22:44",
            show: ["kjv", "nkjv", "esv"],
            note:
              "The angel strengthening Jesus and his sweat “like great drops of blood” (verses 43–44). KJV and NKJV print it plainly; the ESV encloses it in double brackets, the NIV footnotes it. The manuscript evidence is genuinely divided on this one.",
          },
          {
            reference: "Colossians 1:14",
            show: ["kjv", "nkjv", "esv"],
            note:
              "KJV and NKJV: “redemption through his blood.” The critical text has just “redemption.” The phrase “through his blood” is uncontested in the parallel at Ephesians 1:7.",
          },
          {
            reference: "Matthew 6:13",
            show: ["kjv", "nkjv", "esv"],
            note:
              "The closing doxology of the Lord’s Prayer — “For thine is the kingdom, and the power, and the glory, for ever.” In KJV and NKJV; the ESV and NIV end at “deliver us from evil,” with the doxology in a footnote.",
          },
          {
            reference: "Romans 8:1",
            show: ["kjv", "nkjv", "esv"],
            note:
              "KJV and NKJV add “who walk not after the flesh, but after the Spirit” to the end of the verse. That exact clause appears in verse 4 without dispute.",
          },
        ],
        referenced: [
          { reference: "Acts 9:5–6", note: "“It is hard for thee to kick against the pricks” and the following exchange; the “goads” saying is uncontested in Acts 26:14." },
          { reference: "John 5:3–4", note: "The detail about an angel stirring the pool of Bethesda." },
          { reference: "Luke 9:55–56", note: "“Ye know not what manner of spirit ye are of. For the Son of man is not come to destroy men’s lives, but to save them.”" },
          { reference: "Luke 4:4", note: "“but by every word of God” — the full quotation is uncontested in Matthew 4:4." },
          { reference: "Luke 23:34", note: "“Father, forgive them; for they know not what they do.” Present in KJV, NKJV, and the main text of most modern translations, usually with a note that some early manuscripts omit it." },
          { reference: "Luke 24:12", note: "Peter running to the empty tomb; kept in most modern texts, footnoted in a few." },
          { reference: "Luke 4:8", note: "“Get thee behind me, Satan” — uncontested in the Matthew parallel." },
        ],
      },
      {
        id: "single-words",
        title: "Single words",
        intro: "The smallest manuscript differences — a name, a title, one noun.",
        shown: [
          {
            reference: "Mark 1:2",
            show: ["kjv", "nkjv", "esv"],
            note:
              "KJV and NKJV: “as it is written in the prophets.” The critical text: “in Isaiah the prophet.” The quotation that follows blends Malachi 3:1 with Isaiah 40:3, which is why the more general “prophets” reading exists.",
          },
          {
            reference: "Revelation 22:19",
            show: ["kjv", "nkjv", "esv"],
            note:
              "KJV and NKJV: God takes away a person’s part “out of the book of life.” The critical text: “from the tree of life.” Every Greek manuscript reads “tree” here; “book” entered through Erasmus, who had to reconstruct the last verses of Revelation from Latin.",
          },
          {
            reference: "Romans 14:10",
            show: ["kjv", "nkjv", "esv"],
            note:
              "KJV and NKJV: “the judgment seat of Christ.” The critical text: “the judgment seat of God.” “Judgment seat of Christ” is uncontested in 2 Corinthians 5:10.",
          },
        ],
        referenced: [
          { reference: "Matthew 27:35", note: "KJV adds “that it might be fulfilled…” with the quotation of Psalm 22:18; the quotation itself is uncontested in John 19:24." },
          { reference: "Mark 9:29", note: "KJV and NKJV: this kind comes out only “by prayer and fasting.” The critical text has “by prayer.”" },
          { reference: "Luke 11:2–4", note: "Luke’s form of the Lord’s Prayer is shorter than the KJV’s; the critical text is shorter still, closer to what Luke likely wrote as distinct from Matthew’s fuller version." },
          { reference: "1 Corinthians 15:47", note: "KJV: “the second man is the Lord from heaven.” The critical text: “the second man is from heaven.”" },
          { reference: "Revelation 1:11", note: "KJV opens the verse with “I am Alpha and Omega, the first and the last”; the critical text begins at “Write what you see in a book.” The title is uncontested in verses 8 and 17." },
        ],
      },
      {
        id: "doctrinal-wording",
        title: "Wording that touches doctrine",
        intro:
          "These manuscript differences land on wording that some readers consider doctrinally significant — usually about the deity of Christ or the Trinity. In each case the doctrine is taught plainly elsewhere; what varies is whether this particular verse also states it.",
        shown: [
          {
            reference: "1 John 5:7",
            show: ["kjv", "nkjv", "esv"],
            note:
              "The “Johannine Comma” — “the Father, the Word, and the Holy Ghost: and these three are one” (verses 7–8). In the KJV and NKJV. It appears in no Greek manuscript before the 1400s and is absent from every ancient one; it reached the printed Greek text through Erasmus’s third edition. The critical text reads simply “there are three that testify: the Spirit and the water and the blood.”",
          },
          {
            reference: "1 Timothy 3:16",
            show: ["kjv", "nkjv", "esv"],
            note:
              "KJV and NKJV: “God was manifest in the flesh.” The critical text: “He was manifested…” In uncial script the difference is one letter — ΘΣ (“God,” abbreviated) versus ΟΣ (“who”). The incarnation is not in question either way.",
          },
          {
            reference: "John 1:18",
            show: ["kjv", "nkjv", "esv", "niv"],
            note:
              "KJV and NKJV: “the only begotten Son.” The critical text: “the only God” / “God the only Son” — which, if anything, states Christ’s deity more directly. The two readings differ by one word in Greek (υἱός vs. θεός).",
          },
        ],
        referenced: [
          { reference: "Luke 2:14", note: "KJV: “peace, good will toward men.” The critical text: “peace among those with whom he is pleased.” The difference is a final letter that turns “good will” from a separate noun into a description of the people." },
          { reference: "Matthew 1:25", note: "KJV: Mary’s “firstborn son.” The critical text: “a son.” “Firstborn” is uncontested in Luke 2:7." },
        ],
      },
      {
        id: "old-testament",
        title: "Old Testament: the Hebrew text and its older witnesses",
        intro:
          "The Old Testament’s standard Hebrew text — the Masoretic Text, fixed by about AD 1000 — is occasionally shorter, damaged, or different from older evidence: the Greek Septuagint (roughly 200 BC) and the Dead Sea Scrolls (roughly 100 BC). Translators weigh these differently and footnote the alternatives.",
        shown: [
          {
            reference: "Deuteronomy 32:8",
            show: ["kjv", "nkjv", "esv", "niv"],
            note:
              "The Masoretic text: God set the nations’ boundaries “according to the number of the sons of Israel.” A Dead Sea Scrolls fragment and the Septuagint read “sons of God.” The ESV and NET follow the older reading; KJV, NKJV, and NIV keep the Masoretic.",
          },
          {
            reference: "1 Samuel 13:1",
            show: ["kjv", "nkjv", "esv", "niv"],
            note:
              "The Hebrew text of Saul’s age is incomplete — literally “Saul was … years old when he began to reign, and he reigned … and two years.” KJV and NKJV render it woodenly; the ESV brackets a guess; the NIV fills in numbers from the Septuagint and Acts 13:21.",
          },
          {
            reference: "Psalm 22:16",
            show: ["kjv", "esv", "niv", "net"],
            note:
              "KJV, NKJV, ESV, and NIV all read “they pierced my hands and my feet,” following the Septuagint and a Dead Sea Scrolls fragment. The Masoretic text reads “like a lion, my hands and my feet” — the reading the NET follows in its main text, with the other in a note.",
          },
        ],
        referenced: [
          { reference: "Psalm 8:5", note: "KJV: “a little lower than the angels,” following the Septuagint — which is how Hebrews 2:7 quotes it. The Hebrew is “lower than elohim,” rendered “God” or “heavenly beings” by others." },
          { reference: "Zechariah 12:10", note: "“They shall look upon me whom they have pierced.” A few Hebrew manuscripts read “on him,” and translations split between “me” and “him” — the verse is applied to Christ in John 19:37 and Revelation 1:7." },
        ],
      },
    ],
  },
  {
    id: "wording",
    title: "Part 2 — Which English words?",
    intro:
      "In these places the Hebrew or Greek is not in question — it reads the same in every manuscript. What differs is the English: the sense of an ambiguous word, whether to render a masculine form inclusively, or how much interpretation to fold into the translation.",
    sections: [
      {
        id: "isaiah-714",
        title: "“Virgin” or “young woman”: Isaiah 7:14",
        intro:
          "Every Hebrew manuscript reads almah. The debate is whether almah means specifically “virgin” or more generally “a young woman of marriageable age” — and whether to translate Isaiah’s word in light of Matthew 1:23, which quotes it (through the Septuagint’s parthenos, “virgin”) and applies it to the birth of Christ.",
        shown: [
          {
            reference: "Isaiah 7:14",
            show: ["kjv", "esv", "niv", "net"],
            note:
              "KJV, NKJV, ESV, and NIV read “the virgin.” The NET reads “this young woman,” with a note on the New Testament use. The RSV’s “young woman” in 1952 set off decades of this argument; most translations since have kept “virgin.”",
          },
        ],
      },
      {
        id: "titles",
        title: "Titles and time-words",
        intro: "Here translators agree on the words and differ on nuance.",
        shown: [
          {
            reference: "Micah 5:2",
            show: ["kjv", "nkjv", "esv", "niv"],
            note:
              "KJV and NKJV: the ruler’s “goings forth have been … from everlasting” (eternal). The ESV (“from ancient days”) and NIV (“from ancient times”) read it as “long ago.” The Hebrew phrase can carry either sense.",
          },
          {
            reference: "Isaiah 9:6",
            show: ["kjv", "esv", "niv"],
            note:
              "The KJV’s commas — “Wonderful, Counsellor, The mighty God” — can be read as separate titles. Modern translations join the pairs: “Wonderful Counselor, Mighty God, Everlasting Father, Prince of Peace.” The Hebrew has no punctuation; it is a translator’s judgment.",
          },
        ],
      },
      {
        id: "inclusive-language",
        title: "Inclusive vs. traditional wording",
        intro:
          "The Greek and Hebrew here are undisputed. Translations differ on the English — whether adelphoi (“brothers”) addressing a mixed congregation becomes “brothers,” “brothers and sisters,” or “believers”; whether a generic masculine becomes “man” or “person”; and how to render Greek terms whose exact scope is debated.",
        shown: [
          {
            reference: "1 Corinthians 1:10",
            show: ["kjv", "esv", "niv"],
            note:
              "KJV “brethren,” ESV “brothers,” NIV and NET “brothers and sisters.” The Greek adelphoi is a masculine plural that in ordinary Greek usage could address a group including women; the question is whether English “brothers” still does.",
          },
          {
            reference: "1 Corinthians 6:9",
            show: ["kjv", "nkjv", "esv", "niv"],
            note:
              "Two Greek words, malakoi and arsenokoitai, rendered very differently: KJV “effeminate … abusers of themselves with mankind,” NKJV “homosexuals, nor sodomites,” ESV “men who practice homosexuality,” NIV “men who have sex with men.” The debate is over how narrowly or broadly each term applies.",
          },
        ],
        referenced: [
          { reference: "1 Corinthians 6:10", note: "Continues the list from 6:9." },
          { reference: "1 Timothy 1:10", note: "Uses arsenokoitai again, in a list of the “lawless.” Same rendering question as 1 Corinthians 6:9." },
          { reference: "Leviticus 6:25", note: "“The priest … he” versus “the one who” — a generic-singular question in the sacrificial law." },
          { reference: "Matthew 4:24", note: "Greek anthrōpous — “all sick people,” “all who were ill,” or “all the sick.” “People” versus “men.”" },
        ],
      },
      {
        id: "john-858",
        title: "“I am”: John 8:58",
        intro:
          "The Greek egō eimi is undisputed, and every translation here renders it “I am.” What varies is punctuation, capitalization, and whether a footnote points to Exodus 3:14 (“I AM WHO I AM”). Readers who see Jesus claiming the divine name are reading the same words in every version.",
      },
    ],
  },
];

/** total distinct verses covered (for the intro count) */
export const TOTAL_VERSES = 85;
