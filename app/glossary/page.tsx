import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { slugifyGlossaryTerm } from "@/lib/glossarySlug";

export const metadata: Metadata = {
  title: "Glossary",
  description:
    "Plain definitions of the terms that come up when comparing English Bible translations — formal and dynamic equivalence, the Textus Receptus and Critical Text, the Masoretic Text and Septuagint, red-letter editions, lectionaries, and more.",
  alternates: { canonical: "/glossary" },
};

type Term = { term: string; def: ReactNode };
type Group = { title: string; terms: Term[] };

const groups: Group[] = [
  {
    title: "How translations are made",
    terms: [
      {
        term: "Formal equivalence (word-for-word)",
        def: "A translation method that stays as close as it can to the exact words and grammar of the Hebrew, Aramaic, and Greek, even when the English comes out a little stiff. The ESV, NASB, LSB, and KJV sit here.",
      },
      {
        term: "Dynamic equivalence (thought-for-thought)",
        def: "Also called functional equivalence. A method that aims to reproduce the meaning and effect of the original in natural English, rephrasing freely to do it. The NLT, NIV, and CEB lean this way.",
      },
      {
        term: "Optimal / mediating equivalence",
        def: "A deliberate middle path — leaning formal or dynamic verse by verse depending on which reads better without losing accuracy. The CSB calls its method “optimal equivalence”; the NET aims for a similar balance.",
      },
      {
        term: "Translation committee",
        def: "The group of biblical scholars — usually several dozen, from a range of denominations — who produce a modern translation over years, with drafts reviewed by other scholars and English stylists. It’s why committee translations are trusted for study in a way single-author paraphrases aren’t.",
      },
      {
        term: "Gender-inclusive language",
        def: "Rendering a generic masculine term in the original (“brothers,” a generic “he”) with wording that makes the inclusion of women explicit (“brothers and sisters,” “they”) where the original clearly addresses everyone. Translations vary from traditional (keep the masculine form) to moderate to thoroughly inclusive.",
      },
      {
        term: "Paraphrase",
        def: "A restatement of an existing English translation in looser, fresher words — usually one author’s phrasing rather than a committee’s. The Living Bible is the best-known example. Vivid for reading, but not built from the original languages and not suited to study. The Message is usually called a paraphrase too, though Eugene Peterson worked from the Hebrew and Greek rather than from an English Bible.",
      },
    ],
  },
  {
    title: "Where the text comes from",
    terms: [
      {
        term: "The autographs",
        def: "The original manuscripts of the biblical books, as first written. None survive; every Bible is translated from copies.",
      },
      {
        term: "Textual criticism",
        def: "The scholarly work of comparing the surviving handwritten copies to reconstruct the earliest recoverable wording. It’s the reason a modern Bible has footnotes like “some manuscripts read…”.",
      },
      {
        term: "Manuscript",
        def: "A hand-written copy of a biblical text or part of one. For the New Testament there are around 5,700 in Greek alone, ranging from small papyrus scraps of the 100s to complete medieval codices.",
      },
      {
        term: "Papyrus",
        def: "A paper-like writing material made from strips of the papyrus reed, which grows in Egypt. Also the name for the earliest New Testament manuscripts written on it — about 135 of them, some from the AD 100s and 200s.",
      },
      {
        term: "Codex",
        def: "A book made of pages stacked and sewn together, the ancestor of the modern book, as opposed to a scroll. Christians adopted it early, so most New Testament manuscripts are codices.",
      },
      {
        term: "Majuscule (uncial)",
        def: "A Greek manuscript written in all capital letters, usually with no spaces between words. Most date from the AD 300s to 900s; they include the great early Bibles such as Codex Sinaiticus and Codex Vaticanus.",
      },
      {
        term: "Minuscule",
        def: "A Greek manuscript written in the faster lower-case handwriting that took over from the AD 800s. About 2,860 New Testament manuscripts are minuscules, most of them medieval and Byzantine.",
      },
      {
        term: "Manuscript family (text-type)",
        def: "A group of manuscripts that share the same distinctive wording, usually because they were copied in the same region. The main two are the Alexandrian and the Byzantine; scholars also speak of a Western and a disputed Caesarean family.",
      },
      {
        term: "Alexandrian text",
        def: "The manuscript family associated with Egypt. Only a few dozen copies, but they include most of the oldest, such as Papyrus 75 and Codex Vaticanus. The Critical Text leans on it.",
      },
      {
        term: "Byzantine text",
        def: "The manuscript family of the Greek-speaking East, centered on Constantinople. It makes up about 80–90% of all surviving copies, most of them from AD 800 on. The Majority Text follows it, and the Textus Receptus is close to it.",
      },
      {
        term: "Apparatus",
        def: "The footnotes in a scholarly edition of the Greek or Hebrew text that list where the manuscripts disagree and which manuscripts support each reading. It is what translators work from instead of the manuscripts themselves.",
      },
      {
        term: "Textus Receptus",
        def: "The Greek New Testament text assembled by Erasmus in the 1500s from a few late medieval manuscripts, lightly revised afterward. It stands behind the KJV, NKJV, and MEV. Part of the broader Byzantine tradition, but not identical to the Majority Text.",
      },
      {
        term: "Critical Text",
        def: "Also called the Nestle-Aland or eclectic text. A Greek New Testament reconstructed by weighing every known manuscript, including papyri from the 100s–300s found in the last two centuries. Nearly every modern translation uses it.",
      },
      {
        term: "Majority Text",
        def: "A Greek New Testament that follows, at each point, the reading found in the greatest number of surviving manuscripts — most of them Byzantine and medieval. No major English translation is based on it; a few small ones are.",
      },
      {
        term: "Masoretes",
        def: "Jewish scribes who, between roughly AD 500 and 1000, guarded the Hebrew text of the Old Testament and added marks for its vowels, which had not been written before. The text they handed down is the Masoretic Text.",
      },
      {
        term: "Masoretic Text",
        def: "The standard Hebrew text of the Old Testament, preserved and standardized by Jewish scribes (the Masoretes) between roughly AD 500 and 1000. Every translation here starts from it.",
      },
      {
        term: "Septuagint (LXX)",
        def: "A Greek translation of the Hebrew Scriptures made a couple of centuries before Christ. Often what the New Testament authors quote, and it sometimes preserves an older reading than the Masoretic Hebrew.",
      },
      {
        term: "Dead Sea Scrolls",
        def: "Hebrew (and some Greek and Aramaic) manuscripts found from 1947 onward in caves near Qumran, on the northwest shore of the Dead Sea. Written between roughly 250 BC and AD 68, they push the Hebrew evidence back about a thousand years and mostly confirm how carefully the text was copied.",
      },
      {
        term: "Vulgate",
        def: "Jerome’s Latin translation of the Bible, made around AD 400 and the standard Bible of the Western church for over a thousand years. Wycliffe’s 1382 English Bible was translated from it.",
      },
    ],
  },
  {
    title: "Editions and formats",
    terms: [
      {
        term: "Study Bible",
        def: "An edition that adds explanatory notes, cross-references, book introductions, maps, and articles below or beside the text. The notes are a separate work from the translation — the ESV Study Bible and the NIV Study Bible use the same ESV and NIV text as any other edition.",
      },
      {
        term: "Red-letter edition",
        def: "An edition that prints the words spoken by Jesus in red. A 20th-century American convention; some translations (the NET, the NRSVue) don’t use it at all.",
      },
      {
        term: "Interlinear",
        def: "An edition that prints the Hebrew or Greek with a word-for-word English gloss directly beneath each word, plus a readable translation alongside. A study tool, not a reading Bible.",
      },
      {
        term: "Lectionary",
        def: "Two related meanings. (1) A schedule of Bible readings assigned to each Sunday and feast day of the church year. Many mainline denominations specify which translation is read aloud from the lectionary — the NRSV across much of Episcopal, Lutheran, and Methodist worship, for instance. (2) In manuscript studies, a handwritten church reading book that arranges Bible passages by the day they are read, rather than in book order. About 2,420 Greek New Testament manuscripts are lectionaries.",
      },
      {
        term: "Deuterocanonical books (the Apocrypha)",
        def: "A set of books — Tobit, Judith, Sirach, 1–2 Maccabees, and others — included in Catholic and Orthodox Bibles but not in the 66-book Protestant canon. They were in the original 1611 KJV, between the Testaments, and a few translations still publish editions that include them.",
      },
    ],
  },
];

export default function GlossaryPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold text-brand-900 sm:text-4xl">Glossary</h1>
      <p className="mt-3 leading-relaxed text-neutral-700">
        The words that keep coming up when people compare Bible translations, in plain terms. For
        the bigger questions, see the <Link href="/faq" className="font-medium text-brand-700 hover:underline">FAQ</Link>.
      </p>

      {groups.map((group) => (
        <section key={group.title} className="mt-12 border-t-2 border-gild-300 pt-7">
          <h2 className="font-display text-2xl font-semibold text-brand-900">{group.title}</h2>
          <dl className="mt-6 space-y-6">
            {group.terms.map((t) => (
              <div key={t.term} id={slugifyGlossaryTerm(t.term)} className="scroll-mt-20">
                <dt className="font-display text-base font-semibold text-brand-900">{t.term}</dt>
                <dd className="mt-1 leading-relaxed text-neutral-700">{t.def}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
