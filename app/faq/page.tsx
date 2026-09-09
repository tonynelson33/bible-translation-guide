import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Straight answers to the common questions about English Bible translations — the most accurate translation, why there are so many, whether modern Bibles removed verses, KJV-onlyism, paraphrases, why no Bible uses the Majority Text, and the manuscripts behind the text.",
  alternates: { canonical: "/faq" },
};

type QA = {
  id: string;
  q: string;
  /** Rich answer with links, for the page. */
  a: ReactNode;
  /** Self-contained plain-text answer, for FAQ structured data. */
  plain: string;
};

type Group = { title: string; intro: string; items: QA[] };

const groups: Group[] = [
  {
    title: "Choosing a translation",
    intro: "The questions people ask before they pick one.",
    items: [
      {
        id: "most-accurate",
        q: "What's the most accurate translation?",
        a: (
          <>
            <p>
              There isn&rsquo;t one answer, because &ldquo;accurate&rdquo; isn&rsquo;t one thing. A
              translation can be faithful to the <em>words</em> of the original &mdash; formal
              equivalence, like the{" "}
              <Link href="/translations/nasb">NASB</Link>,{" "}
              <Link href="/translations/lsb">LSB</Link>, or{" "}
              <Link href="/translations/esv">ESV</Link> &mdash; or faithful to the <em>meaning</em> as
              its first readers would have heard it &mdash; dynamic equivalence, like the{" "}
              <Link href="/translations/nlt">NLT</Link> or{" "}
              <Link href="/translations/niv">NIV</Link>.
            </p>
            <p>
              Both are legitimate goals, and every translation trades one against the other
              somewhere. A word-for-word translation shows you the structure of the original but can
              obscure its sense; a thought-for-thought translation reads clearly but asks you to
              trust the committee&rsquo;s judgment about what a phrase means. For close study, many
              people keep one of each. The{" "}
              <Link href="/rankings">rankings</Link> and{" "}
              <Link href="/differences">the differences page</Link> go into this.
            </p>
          </>
        ),
        plain:
          "“Accurate” isn't one thing. A translation can be faithful to the words of the original (formal equivalence, like the NASB, LSB, or ESV) or to its meaning as the first readers would have understood it (dynamic equivalence, like the NLT or NIV). Both are legitimate goals, and every translation trades one against the other. There is no single most accurate English Bible; for close study, many readers use one formal and one dynamic translation side by side.",
      },
      {
        id: "formal-vs-dynamic",
        q: "Formal vs. dynamic equivalence — what does that mean in practice?",
        a: (
          <>
            <p>
              &ldquo;Formal equivalence&rdquo; (word-for-word) tries to match the original&rsquo;s
              actual words and sentence structure, even when the English comes out a little stiff.
              &ldquo;Dynamic&rdquo; or &ldquo;functional equivalence&rdquo; (thought-for-thought)
              tries to reproduce the effect the original had on its first readers, rephrasing freely
              to do it.
            </p>
            <p>
              Most translations aren&rsquo;t purely one or the other. The{" "}
              <Link href="/translations/csb">CSB</Link> calls its method &ldquo;optimal
              equivalence&rdquo; and the <Link href="/translations/net">NET</Link> aims for a similar
              middle ground, leaning formal but rephrasing where a literal rendering would be
              unclear. In practice: a passage in the
              NASB will track the Greek clause order; the same passage in the NLT will be broken into
              short, plain sentences. Neither is wrong &mdash; they answer different questions. The{" "}
              <Link href="/rankings">spectrum on the rankings page</Link> shows where each translation
              sits.
            </p>
          </>
        ),
        plain:
          "Formal equivalence (word-for-word) matches the original's words and sentence structure even when the English is stiff. Dynamic or functional equivalence (thought-for-thought) aims to reproduce the effect on the original readers, rephrasing freely. Most translations mix the two, and some, like the CSB and NET, aim explicitly for the middle. A formal translation shows the shape of the original text; a dynamic one reads more smoothly.",
      },
      {
        id: "which-for",
        q: "Which translation should I use — for study, for daily reading, for a child?",
        a: (
          <>
            <p>The short version:</p>
            <ul>
              <li>
                <strong>Close study:</strong> a formal translation &mdash;{" "}
                <Link href="/translations/esv">ESV</Link>,{" "}
                <Link href="/translations/nasb">NASB</Link>, or{" "}
                <Link href="/translations/lsb">LSB</Link> &mdash; ideally with a readable one
                alongside it for comparison.
              </li>
              <li>
                <strong>Daily reading:</strong> the <Link href="/translations/niv">NIV</Link>,{" "}
                <Link href="/translations/csb">CSB</Link>, or{" "}
                <Link href="/translations/nlt">NLT</Link> &mdash; accurate and easy to read for long
                stretches.
              </li>
              <li>
                <strong>A child or someone new to the Bible:</strong> the{" "}
                <Link href="/translations/nlt">NLT</Link>, which reads at about a sixth-grade level.
              </li>
              <li>
                <strong>Reading aloud in a congregation:</strong> the{" "}
                <Link href="/translations/esv">ESV</Link>,{" "}
                <Link href="/translations/csb">CSB</Link>, or{" "}
                <Link href="/translations/niv">NIV</Link>.
              </li>
            </ul>
            <p>
              <Link href="/rankings">The rankings page</Link> breaks this down by purpose, and every{" "}
              <Link href="/compare">translation profile</Link> has a &ldquo;good fit for&rdquo;
              section.
            </p>
          </>
        ),
        plain:
          "For close study, a formal translation such as the ESV, NASB, or LSB, ideally with a more readable one alongside it. For daily reading, the NIV, CSB, or NLT. For a child or a new reader, the NLT, which reads at about a sixth-grade level. For reading aloud in a congregation, the ESV, CSB, or NIV. The rankings page breaks this down by purpose.",
      },
      {
        id: "paraphrase",
        q: "What's the difference between a translation and a paraphrase?",
        a: (
          <>
            <p>
              A translation starts from the Hebrew, Aramaic, and Greek and renders it into English. A
              paraphrase restates an existing English translation in fresh, looser words &mdash;
              usually one author&rsquo;s phrasing rather than a committee&rsquo;s.
            </p>
            <p>
              The Living Bible (1971) was Kenneth Taylor paraphrasing the 1901 American Standard
              Version for his children; The Message (2002) was Eugene Peterson&rsquo;s idiomatic
              retelling. These can be vivid for reading, but they drift further from the wording of
              the original and aren&rsquo;t suited to study. The Passion Translation is a separate
              case &mdash; it&rsquo;s marketed as a translation but was produced largely by one person
              and adds interpretive material, and most scholars don&rsquo;t recommend it. This site
              profiles <Link href="/compare">twelve committee translations</Link> and doesn&rsquo;t
              cover paraphrases.
            </p>
          </>
        ),
        plain:
          "A translation works from the Hebrew, Aramaic, and Greek. A paraphrase restates an existing English translation in looser words, usually one author's phrasing rather than a committee's — the Living Bible and The Message are the best known. Paraphrases can be vivid for reading but drift from the original wording and are not suited to study. The Passion Translation is marketed as a translation but was produced mainly by one person with added interpretive content, and most scholars do not recommend it.",
      },
    ],
  },
  {
    title: "Where the text comes from",
    intro: "Questions about the manuscripts behind the English.",
    items: [
      {
        id: "removed-verses",
        q: "Did modern Bibles remove verses?",
        a: (
          <>
            <p>
              This is the most common worry, and the honest answer is: modern translations print
              fewer verses than the KJV in a handful of places, but &ldquo;removed&rdquo; isn&rsquo;t
              quite the right word.
            </p>
            <p>
              The <Link href="/translations/kjv">King James</Link> New Testament was translated from a
              small set of late Greek manuscripts. Since 1611, scholars have found many older copies
              &mdash; some more than a thousand years older &mdash; and in about sixteen places those
              older copies don&rsquo;t contain a verse the KJV has. Modern translations follow the
              older evidence, usually keeping the verse in a footnote. Nothing that touches a core
              Christian teaching depends on these verses. The full list, with what each one says, is
              on <Link href="/differences">the differences page</Link>.
            </p>
          </>
        ),
        plain:
          "Modern translations print fewer verses than the King James Version in about sixteen places, but “removed” is misleading. The KJV New Testament was translated from a handful of late Greek manuscripts. Older copies found since 1611, some more than a thousand years older, do not contain those verses, so modern translations follow the older evidence and usually note the missing verse in a footnote. No core Christian teaching depends on any of them.",
      },
      {
        id: "text-types",
        q: "Textus Receptus, Critical Text, Majority Text — what are those?",
        a: (
          <>
            <p>
              Three answers to one question: which Greek manuscripts should the New Testament be
              translated from?
            </p>
            <ul>
              <li>
                <strong>Textus Receptus</strong> &mdash; the text assembled by Erasmus in the 1500s
                from a few late medieval manuscripts. It underlies the{" "}
                <Link href="/translations/kjv">KJV</Link> and{" "}
                <Link href="/translations/nkjv">NKJV</Link>.
              </li>
              <li>
                <strong>Critical Text</strong> (also called Nestle-Aland or the
                &ldquo;eclectic&rdquo; text) &mdash; reconstructed by weighing all known manuscripts,
                including papyri from the 100s&ndash;300s found in the last two centuries. Nearly
                every modern translation uses it.
              </li>
              <li>
                <strong>Majority Text</strong> &mdash; follows the reading found in the greatest
                number of surviving manuscripts, most of them Byzantine and medieval.
              </li>
            </ul>
            <p>
              Of the twelve translations here, the <Link href="/translations/kjv">KJV</Link> and{" "}
              <Link href="/translations/nkjv">NKJV</Link> follow the Textus Receptus; the other ten
              use the Critical Text. None uses the Majority Text as its base &mdash; the
              NKJV&rsquo;s footnotes are where you&rsquo;ll see Majority Text readings flagged.
            </p>
            <p>
              The differences among the three affect a small fraction of the New Testament and no
              major doctrine. <Link href="/differences">The differences page</Link> has the detail.
            </p>
          </>
        ),
        plain:
          "These are three approaches to choosing which Greek manuscripts the New Testament is translated from. The Textus Receptus, compiled by Erasmus in the 1500s from a few late manuscripts, underlies the KJV and NKJV. The Critical Text (or eclectic text) is reconstructed by weighing all known manuscripts, including early papyri found in the last two centuries, and is used by almost every modern translation. The Majority Text follows the reading found in the most surviving manuscripts. Of the twelve translations on this site, only the KJV and NKJV use the Textus Receptus; the rest use the Critical Text, and none uses the Majority Text as its base. The differences among the three are small and affect no major doctrine.",
      },
      {
        id: "majority-text",
        q: "Why doesn't any translation use the Majority Text?",
        a: (
          <>
            <p>
              None of the major English Bibles does &mdash; and that includes the{" "}
              <Link href="/translations/kjv">KJV</Link> and{" "}
              <Link href="/translations/nkjv">NKJV</Link>, which follow the{" "}
              <strong>Textus Receptus</strong>, a different text. The Textus Receptus and the Majority
              Text disagree in roughly 1,800 places, and the Textus Receptus even carries a few
              readings almost no Greek manuscript supports &mdash; the &ldquo;three that bear witness
              in heaven&rdquo; of 1&nbsp;John 5:7 among them.
            </p>
            <p>The Majority Text never got its own translation for reasons that stack up:</p>
            <ul>
              <li>
                <strong>It arrived late.</strong> No printed Majority Text Greek New Testament
                existed until the 1980s. By then every major English translation was already in print
                and settled on a base text.
              </li>
              <li>
                <strong>It has no natural constituency.</strong> Readers who want a traditional text
                want the Textus Receptus specifically &mdash; it&rsquo;s what the King James rests on.
                Readers who want the best scholarly reconstruction use the{" "}
                <strong>Critical Text</strong>, which every seminary teaches and an international
                committee maintains.
              </li>
              <li>
                <strong>Most scholars reject the method.</strong> The principle is that manuscripts
                are weighed, not counted. The Byzantine text is the majority because it was the
                standard Bible of the Greek-speaking church for a thousand years, so it was copied
                far more than anything else &mdash; not because it is demonstrably closest to the
                originals. The earliest surviving copies are mostly not Byzantine.
              </li>
            </ul>
            <p>
              And the practical stakes are small. The Majority Text and the Critical Text agree
              across the great bulk of the New Testament, so a Majority Text Bible would read almost
              exactly like the NKJV &mdash; whose footnotes are already where its distinctive
              readings appear.
            </p>
          </>
        ),
        plain:
          "No major English translation uses the Majority Text, and that includes the KJV and NKJV, which use the Textus Receptus — a different text that disagrees with the Majority Text in roughly 1,800 places. The Majority Text never got its own translation because it arrived late (no printed edition existed until the 1980s, after the major translations were set), because it has no natural constituency (traditional-text readers want the Textus Receptus specifically, and scholars use the Critical Text), and because most textual scholars reject its method: manuscripts are weighed, not counted, and the Byzantine text is the majority mainly because it was the standard Bible of the Greek-speaking church for a thousand years. In practice the Majority Text and the Critical Text agree across the great bulk of the New Testament, so a Majority Text Bible would read almost exactly like the NKJV, whose footnotes already flag its distinctive readings.",
      },
      {
        id: "footnotes",
        q: "What do the “some manuscripts read…” footnotes mean?",
        a: (
          <>
            <p>
              They&rsquo;re the translators showing their work. Ancient copies of the Bible were made
              by hand, and they don&rsquo;t all agree in every detail. When the surviving manuscripts
              differ in a way worth knowing about, a modern translation notes it: the main text gives
              the reading the committee judged original, and the footnote tells you what other
              manuscripts say.
            </p>
            <p>
              It&rsquo;s not a sign the text is unreliable &mdash; it&rsquo;s the opposite, a sign
              you&rsquo;re being shown the evidence rather than handed a single answer with no
              explanation. The <Link href="/translations/kjv">KJV</Link> has far fewer such notes
              mainly because its translators had far fewer manuscripts to compare.
            </p>
          </>
        ),
        plain:
          "They are the translators showing their work. Ancient copies of the Bible were made by hand and do not all agree in every detail. When manuscripts differ in a way worth knowing, a modern translation puts the reading the committee judged original in the main text and notes the alternative in a footnote. It reflects transparency about the evidence, not an unreliable text.",
      },
      {
        id: "apocrypha",
        q: "What about the Apocrypha? And why is this site Protestant-scoped?",
        a: (
          <>
            <p>
              The Apocrypha (or &ldquo;deuterocanonical books&rdquo;) is a set of books &mdash; Tobit,
              Judith, Sirach, 1&ndash;2 Maccabees, and others &mdash; included in Catholic and
              Orthodox Bibles but not in Protestant ones. They were in the original 1611{" "}
              <Link href="/translations/kjv">KJV</Link>, in a section between the Testaments, and some
              translations (<Link href="/translations/nrsvue">NRSVue</Link>,{" "}
              <Link href="/translations/ceb">CEB</Link>,{" "}
              <Link href="/translations/esv">ESV</Link>) still publish editions that include them.
            </p>
            <p>
              This site covers the 66-book Protestant canon and the translations most used in
              Protestant churches, which is why you won&rsquo;t find the Douay-Rheims or the NABRE
              here. That&rsquo;s a scope decision, not a judgment about those traditions.
            </p>
          </>
        ),
        plain:
          "The Apocrypha, or deuterocanonical books — Tobit, Judith, Sirach, 1-2 Maccabees, and others — appear in Catholic and Orthodox Bibles but not in Protestant ones. They were in the original 1611 King James Version between the Testaments, and some translations still publish editions that include them. This site covers the 66-book Protestant canon and the translations most used in Protestant churches, which is a scope decision rather than a judgment about other traditions.",
      },
    ],
  },
  {
    title: "The bigger picture",
    intro: "Why the landscape looks the way it does.",
    items: [
      {
        id: "why-so-many",
        q: "Why are there so many English translations?",
        a: (
          <>
            <p>A few reasons stack up:</p>
            <ul>
              <li>English keeps changing, so a translation that read naturally in 1611 or 1952 needs updating.</li>
              <li>
                The manuscript evidence keeps improving &mdash; discoveries like the Dead Sea Scrolls
                gave translators older and better source texts than earlier generations had.
              </li>
              <li>
                Scholars genuinely disagree about how literal a translation should be, and about how
                to handle things like gender language.
              </li>
              <li>
                Publishing is competitive: most major translations are owned by a publisher that
                benefits from having its own.
              </li>
            </ul>
            <p>
              The result is that most English translations since about 1970 fall into a few families
              &mdash; the <Link href="/translations/kjv">KJV</Link> line, the 1952 RSV line (
              <Link href="/translations/esv">ESV</Link>,{" "}
              <Link href="/translations/nrsvue">NRSVue</Link>), and newer independent efforts (
              <Link href="/translations/niv">NIV</Link>,{" "}
              <Link href="/translations/nlt">NLT</Link>,{" "}
              <Link href="/translations/csb">CSB</Link>).
            </p>
          </>
        ),
        plain:
          "Several reasons: English keeps changing, so older translations need updating; manuscript discoveries like the Dead Sea Scrolls gave later translators better source texts; scholars disagree about how literal a translation should be and how to handle gender language; and most major translations are owned by a publisher with an interest in having its own. Most English translations since about 1970 belong to a few families descending from the King James Version and the 1952 Revised Standard Version.",
      },
      {
        id: "kjv-only",
        q: "What is KJV-onlyism? Is the King James the only reliable Bible?",
        a: (
          <>
            <p>
              KJV-onlyism is the belief that the{" "}
              <Link href="/translations/kjv">King James Version</Link> is the only trustworthy English
              Bible &mdash; in its strongest form, that the KJV itself is divinely preserved and other
              translations are corruptions.
            </p>
            <p>
              It&rsquo;s a spectrum. Some people simply prefer the KJV&rsquo;s language, or trust its
              Greek text over the modern Critical Text &mdash; a defensible position. Others treat any
              other translation as dangerous, which most scholars and pastors, including conservative
              ones, regard as untenable. The King James is a landmark of the English language and
              still a fine translation of the text it used. It is not the only reliable one. The{" "}
              <Link href="/blog">videos page</Link> has presentations on both sides of the
              text-critical question.
            </p>
          </>
        ),
        plain:
          "KJV-onlyism is the belief that the King James Version is the only trustworthy English Bible, in its strongest form that the KJV itself is divinely preserved and other translations are corrupt. It ranges from a mild preference for the KJV's language or underlying Greek text to the view that other translations are dangerous. The King James is a landmark of English and a fine translation of the manuscripts available in 1611, but it is not the only reliable English Bible.",
      },
      {
        id: "who-translates",
        q: "Who actually translates the Bible?",
        a: (
          <>
            <p>
              Almost every major modern translation is the work of a committee &mdash; typically
              several dozen biblical scholars from a range of denominations, working over years, with
              drafts reviewed by other scholars, English stylists, and sometimes church bodies before
              publication.
            </p>
            <p>
              The <Link href="/translations/niv">NIV</Link> has a self-perpetuating committee that
              still meets to update it; the <Link href="/translations/esv">ESV</Link>,{" "}
              <Link href="/translations/csb">CSB</Link>, and{" "}
              <Link href="/translations/nasb">NASB</Link> each have their own oversight committee.
              This is one reason committee translations are trusted for study in a way
              single-author paraphrases aren&rsquo;t &mdash; no one person&rsquo;s blind spots
              dominate.
            </p>
          </>
        ),
        plain:
          "Almost every major modern translation is produced by a committee of several dozen biblical scholars from various denominations, working over years, with drafts reviewed by other scholars and English stylists before publication. The NIV, ESV, CSB, and NASB each have a standing oversight committee. Committee translation is one reason these are trusted for study more than single-author paraphrases.",
      },
    ],
  },
];

const allItems = groups.flatMap((g) => g.items);

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: allItems.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.plain },
  })),
};

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <h1 className="font-display text-3xl font-semibold text-brand-900 sm:text-4xl">
        Frequently asked questions
      </h1>
      <p className="mt-3 leading-relaxed text-neutral-700">
        Short, straight answers to the questions that come up most about English Bible translations.
        Each one links out to a fuller treatment where the site has one.
      </p>

      <nav className="mt-6 rounded-lg border border-neutral-200 bg-white p-4 text-sm">
        {groups.map((group) => (
          <div key={group.title} className="mb-3 last:mb-0">
            <p className="font-semibold text-brand-800">{group.title}</p>
            <ul className="mt-1 space-y-0.5 pl-4">
              {group.items.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="text-neutral-600 hover:text-brand-700 hover:underline">
                    {item.q}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {groups.map((group) => (
        <section key={group.title} className="mt-12">
          <h2 className="font-display text-2xl font-semibold text-brand-900">{group.title}</h2>
          <p className="mt-1 text-sm text-neutral-500">{group.intro}</p>

          <div className="mt-6 space-y-8">
            {group.items.map((item) => (
              <div key={item.id} id={item.id} className="scroll-mt-20">
                <h3 className="font-display text-xl font-semibold text-brand-900">{item.q}</h3>
                <div className="mt-2 space-y-3 leading-relaxed text-neutral-700 [&_a]:font-medium [&_a]:text-brand-700 [&_a:hover]:underline [&_li]:ml-1 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
                  {item.a}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="mt-14 rounded-lg border border-gild-200 bg-gild-50 px-5 py-4 text-sm leading-relaxed text-neutral-700">
        Still stuck on which one to read? <Link href="/rankings" className="font-medium text-gild-700 hover:underline">The rankings</Link>{" "}
        sort the twelve by purpose, and <Link href="/differences" className="font-medium text-gild-700 hover:underline">the differences page</Link>{" "}
        walks through the specific verses people ask about.
      </div>
    </div>
  );
}
