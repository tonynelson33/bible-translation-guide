import differenceVerses from "@/data/differenceVerses.json";
import cachedVerses from "@/data/cachedVerses.json";

/**
 * Content for /differences. The ~85 verses come from
 * data/verseComparisonList.json (category "Translation Difference"). The first
 * two sections just list them; from "Missing phrases" on, each item is a
 * KJV vs. ESV comparison (plus another translation only where that translation
 * is what creates the difference). Quoted text is in data/differenceVerses.json
 * (scripts/fetch-difference-verses.mjs, official APIs only).
 *
 *  Part 1 — manuscript differences (Textus Receptus / Byzantine vs. critical
 *           text; Masoretic OT vs. Septuagint / Dead Sea Scrolls)
 *  Part 2 — translation choices (undisputed text, different English)
 */

export type TranslationId = "kjv" | "esv" | "niv" | "nkjv" | "net";

export interface ShownVerse {
  reference: string;
  /** translation ids to display, in order. Default intent: ["kjv", "esv"] */
  show: TranslationId[];
  note: string;
}

export interface ReferencedVerse {
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

export function verseText(reference: string, id: TranslationId): string | null | undefined {
  return (differenceVerses as Record<string, Record<string, string | null>>)[reference]?.[id];
}

/** translation ids that appear in at least one card (for the attribution block) */
export const USED_TRANSLATIONS: TranslationId[] = ["kjv", "esv", "nkjv", "niv", "net"];

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
          "Two well-known passages are missing from the earliest Greek manuscripts but present in the later Byzantine ones. Modern translations keep both — normally in brackets, with a note.",
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
        referenced: [
          { reference: "Matthew 17:21", note: "“This kind goeth not out but by prayer and fasting.” The same teaching is in the Mark 9:29 parallel." },
          { reference: "Matthew 18:11", note: "“For the Son of man is come to save that which was lost” — uncontested in Luke 19:10." },
          { reference: "Matthew 23:14", note: "A woe about devouring widows’ houses; paralleled in Mark 12:40 and Luke 20:47." },
          { reference: "Mark 7:16", note: "“If any man have ears to hear, let him hear” — a refrain that appears many times elsewhere." },
          { reference: "Mark 9:44 and 9:46", note: "Both repeat verse 48 (“their worm dieth not”); modern texts keep only verse 48." },
          { reference: "Mark 11:26", note: "On forgiveness; the same teaching is in Matthew 6:15." },
          { reference: "Mark 15:28", note: "“He was numbered with the transgressors” (Isaiah 53:12); Jesus applies that verse to himself in Luke 22:37." },
          { reference: "Luke 17:36", note: "“Two men shall be in the field”; the previous verse already has the pattern." },
          { reference: "Luke 23:17", note: "Pilate’s custom of releasing a prisoner at the feast; stated plainly in Matthew 27:15 and Mark 15:6." },
          { reference: "Acts 8:37", note: "The Ethiopian official’s confession of faith before baptism (“I believe that Jesus Christ is the Son of God”). Quoted by writers from the 2nd century on, but absent from the earliest manuscripts of Acts." },
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
          "Here it is not a whole verse but a clause or phrase — the Byzantine text is longer, the critical text shorter. KJV and ESV, side by side:",
        shown: [
          { reference: "Matthew 6:13", show: ["kjv", "esv"], note: "The closing doxology of the Lord’s Prayer — “For thine is the kingdom, and the power, and the glory.” The ESV footnotes it; it echoes 1 Chronicles 29:11." },
          { reference: "Luke 4:4", show: ["kjv", "esv"], note: "“but by every word of God” — the full quotation of Deuteronomy 8:3, uncontested in the Matthew 4:4 parallel." },
          { reference: "Luke 4:8", show: ["kjv", "esv"], note: "KJV adds “Get thee behind me, Satan”; the rebuke is uncontested in Matthew 4:10 and Matthew 16:23." },
          { reference: "Luke 9:55-56", show: ["kjv", "esv"], note: "“Ye know not what manner of spirit ye are of. For the Son of man is not come to destroy men’s lives, but to save them.”" },
          { reference: "Luke 22:43-44", show: ["kjv", "esv"], note: "The angel strengthening Jesus and his sweat “like great drops of blood.” Both keep it, but the ESV footnotes it — “Some manuscripts omit verses 43 and 44” — and its print edition sets the verses in double brackets. The manuscript evidence is genuinely divided." },
          { reference: "Luke 23:34", show: ["kjv", "esv"], note: "“Father, forgive them; for they know not what they do.” Kept in the main text of most translations, usually with a note that some early manuscripts omit it." },
          { reference: "Luke 24:12", show: ["kjv", "esv"], note: "Peter running to the empty tomb; kept in most modern texts, footnoted in a few." },
          { reference: "John 5:3-4", show: ["kjv", "esv"], note: "The detail about an angel going down to stir the pool of Bethesda." },
          { reference: "Acts 9:5-6", show: ["kjv", "esv"], note: "“It is hard for thee to kick against the pricks,” and the exchange that follows. The “goads” saying is uncontested in Acts 26:14." },
          { reference: "Romans 8:1", show: ["kjv", "esv"], note: "KJV adds “who walk not after the flesh, but after the Spirit.” That exact clause appears in verse 4 without dispute." },
          { reference: "Colossians 1:14", show: ["kjv", "esv"], note: "KJV: “redemption through his blood.” The phrase is uncontested in the parallel at Ephesians 1:7." },
        ],
      },
      {
        id: "single-words",
        title: "Single words and small details",
        intro: "The smallest manuscript differences — a name, a title, a phrase.",
        shown: [
          { reference: "Matthew 27:35", show: ["kjv", "esv"], note: "KJV adds the quotation of Psalm 22:18 (“they parted my garments…”); the fulfilment is stated in John 19:24." },
          { reference: "Mark 1:2", show: ["kjv", "esv"], note: "KJV: “in the prophets.” Critical text: “in Isaiah the prophet.” The quotation that follows blends Malachi 3:1 with Isaiah 40:3." },
          { reference: "Mark 9:29", show: ["kjv", "esv"], note: "KJV and NKJV: this kind comes out only “by prayer and fasting.” The critical text has “by prayer.”" },
          { reference: "Luke 11:2-4", show: ["kjv", "esv"], note: "Luke’s form of the Lord’s Prayer is shorter than the KJV’s — the critical text is shorter still, distinct from Matthew’s fuller version." },
          { reference: "Romans 14:10", show: ["kjv", "esv"], note: "KJV: “the judgment seat of Christ.” Critical text: “of God.” “Judgment seat of Christ” is uncontested in 2 Corinthians 5:10." },
          { reference: "1 Corinthians 15:47", show: ["kjv", "esv"], note: "KJV: “the second man is the Lord from heaven.” Critical text: “the second man is from heaven.”" },
          { reference: "Revelation 22:19", show: ["kjv", "esv"], note: "KJV: “book of life.” Critical text: “tree of life.” Every Greek manuscript reads “tree” here; “book” entered when Erasmus reconstructed the end of Revelation from Latin." },
          { reference: "Revelation 1:11", show: ["kjv", "esv"], note: "KJV opens the verse with “I am Alpha and Omega, the first and the last”; the critical text starts at “Write what you see.” The title is uncontested in verses 8 and 17." },
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
            show: ["kjv", "esv"],
            note:
              "The “Johannine Comma.” The words naming the Father, the Word, and the Holy Spirit as “one” appear in no Greek manuscript before the 1400s and in none of the ancient ones; they entered the printed Greek text through Erasmus’s third edition. KJV-tradition readers value the verse as a plain statement of the Trinity — which the rest of Scripture teaches regardless. The critical text (shown here, with verse 8) reads simply that the Spirit, the water, and the blood testify.",
          },
          {
            reference: "1 Timothy 3:16",
            show: ["kjv", "esv"],
            note:
              "KJV: “God was manifest in the flesh.” Critical text: “He was manifested…” In the old uncial script the difference is one letter — ΘΣ, “God” abbreviated, versus ΟΣ, “who.” The KJV reading is a direct statement that God was incarnate; the shorter reading leaves “He” to be identified from context as Christ. The incarnation of God is affirmed in John 1:1–14, Colossians 2:9, and Titus 2:13 either way.",
          },
          {
            reference: "John 1:18",
            show: ["kjv", "esv", "niv"],
            note:
              "KJV: “the only begotten Son.” Critical text: “the only God” / “God the only Son” — one word different in Greek (υἱός vs. θεός), and if anything a stronger statement of Christ’s deity. Both are early readings; translators split on which the earliest manuscripts support.",
          },
          {
            reference: "Luke 2:14",
            show: ["kjv", "esv"],
            note:
              "KJV: “peace, good will toward men.” Critical text: “peace among those with whom he is pleased.” The difference is a final letter that turns “good will” from a separate gift announced to everyone into a description of the people the peace comes to. Nothing about the gospel hangs on it, but the sense of the angels’ announcement shifts.",
          },
          {
            reference: "Matthew 1:25",
            show: ["kjv", "esv"],
            note:
              "KJV: Mary’s “firstborn son.” Critical text: “a son.” Some read “firstborn” as implying other children later; others note it is a legal term for the child who opens the womb. “Firstborn” is uncontested in Luke 2:7 in any case.",
          },
        ],
      },
      {
        id: "old-testament",
        title: "Old Testament: the Hebrew text and its older witnesses",
        intro:
          "The Old Testament’s standard Hebrew text — the Masoretic Text, fixed by about AD 1000 — is occasionally shorter, damaged, or different from older evidence: the Greek Septuagint (roughly 200 BC) and the Dead Sea Scrolls (roughly 100 BC). Translators weigh these differently.",
        shown: [
          { reference: "Deuteronomy 32:8", show: ["kjv", "esv"], note: "Masoretic text: “the number of the children of Israel.” A Dead Sea Scrolls fragment and the Septuagint: “the sons of God.” The ESV follows the older reading; KJV, NKJV, and NIV keep the Masoretic." },
          { reference: "1 Samuel 13:1", show: ["kjv", "esv"], note: "The Hebrew of Saul’s age is incomplete — literally “Saul was … years old.” KJV renders it woodenly; the ESV brackets a guess; the NIV fills in numbers from the Septuagint and Acts 13:21." },
          { reference: "Psalm 22:16", show: ["kjv", "esv", "net"], note: "KJV, NKJV, ESV, and NIV read “they pierced my hands and my feet,” following the Septuagint and a Dead Sea Scrolls fragment. The Masoretic text reads “like a lion” — the reading the NET keeps in its main text." },
          { reference: "Psalm 8:5", show: ["kjv", "esv"], note: "KJV: “a little lower than the angels,” following the Septuagint — which is how Hebrews 2:7 quotes it. The Hebrew is “lower than elohim,” rendered “God” or “heavenly beings” by others." },
          { reference: "Zechariah 12:10", show: ["kjv", "esv"], note: "“They shall look upon me whom they have pierced.” A few Hebrew manuscripts read “on him,” and translations split between “me” and “him.” Applied to Christ in John 19:37 and Revelation 1:7." },
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
            show: ["kjv", "esv", "net"],
            note:
              "KJV, NKJV, ESV, and NIV read “the virgin.” The NET reads “this young woman,” with a note on the New Testament use. The RSV’s “young woman” in 1952 set off decades of this argument; most translations since have kept “virgin,” and the virgin birth is stated plainly in Matthew 1 and Luke 1 regardless.",
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
            show: ["kjv", "esv", "niv"],
            note:
              "KJV and NKJV: the ruler’s “goings forth have been … from everlasting” — eternal. The ESV (“from ancient days”) and NIV (“from ancient times”) read it as “long ago,” pointing to David’s line. The Hebrew phrase can carry either sense; the eternal Sonship of Christ is taught elsewhere either way.",
          },
          {
            reference: "Isaiah 9:6",
            show: ["kjv", "esv"],
            note:
              "The KJV’s commas — “Wonderful, Counsellor, The mighty God” — can be read as separate titles. Modern translations join the pairs: “Wonderful Counselor, Mighty God, Everlasting Father, Prince of Peace.” The Hebrew has no punctuation; it is a translator’s judgment, and “Mighty God” is a title of the child either way.",
          },
        ],
      },
      {
        id: "inclusive-language",
        title: "Inclusive vs. traditional wording",
        intro:
          "The Greek and Hebrew here are undisputed. Translations differ on the English — whether adelphoi (“brothers”) addressing a mixed congregation stays “brothers,” and how narrowly or broadly to render Greek terms whose exact scope is debated.",
        shown: [
          {
            reference: "1 Corinthians 1:10",
            show: ["kjv", "esv", "niv"],
            note:
              "KJV “brethren,” ESV “brothers,” NIV and NET “brothers and sisters.” The Greek adelphoi is a masculine plural that in ordinary Greek usage addressed a group including women; the question is whether English “brothers” still communicates that to a modern reader.",
          },
          {
            reference: "1 Corinthians 6:9-10",
            show: ["kjv", "esv", "niv", "nkjv"],
            note:
              "Two Greek words — malakoi and arsenokoitai — rendered very differently: KJV “effeminate … abusers of themselves with mankind,” NKJV “homosexuals, nor sodomites,” ESV “men who practice homosexuality,” NIV “men who have sex with men.” The debate is over how narrowly or broadly each term applies, not over the text.",
          },
          {
            reference: "1 Timothy 1:10",
            show: ["kjv", "esv", "niv"],
            note:
              "The same Greek word as in 1 Corinthians 6:9 (arsenokoitai), and the same rendering question: KJV “them that defile themselves with mankind,” ESV “men who practice homosexuality,” NIV “those practicing homosexuality.”",
          },
          {
            reference: "Matthew 4:24",
            show: ["kjv", "esv", "niv"],
            note:
              "Greek anthrōpous, a generic masculine: KJV “all sick people,” ESV “all the sick,” NIV “all who were ill.” The KJV’s “lunatick” for what the ESV calls “those having seizures” is a separate, unrelated matter of aging vocabulary.",
          },
          {
            reference: "Leviticus 6:25",
            show: ["kjv", "esv"],
            note:
              "The KJV and ESV read almost identically here — the generic-masculine question (a “he” that stands for any priest) runs through the sacrificial laws rather than turning on this one verse. Included because the source list flags it.",
          },
        ],
      },
      {
        id: "john-858",
        title: "“I am”: John 8:58",
        intro:
          "The Greek egō eimi is undisputed, and every translation here renders it “I am.” What varies is only punctuation, capitalization, and whether a footnote points to Exodus 3:14 (“I AM WHO I AM”). Readers who see Jesus claiming the divine name are reading the same words in every version.",
      },
    ],
  },
];

/** total distinct verses covered (for the intro count) */
export const TOTAL_VERSES = 85;
