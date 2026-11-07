import type { Metadata } from "next";
import Link from "next/link";
import HistoryImage from "@/components/HistoryImage";
import { translations } from "@/lib/data";
import { historyImages } from "@/lib/englishBibleHistory";
import {
  families,
  ntKinds,
  ntManuscripts,
  otExamples,
  otManuscripts,
  KJV_YEAR,
  timelineRows,
  type Family,
  type KjvHad,
  type ManuscriptEntry,
} from "@/lib/manuscripts";
import type { Translation } from "@/lib/types";

export const metadata: Metadata = {
  title: "Bible Manuscripts: Where the Text Comes From",
  description:
    "A plain-language guide to the Bible's manuscripts: the Hebrew, Aramaic and Greek copies behind every translation, what they were written on, how many survive, when they were written and found, the manuscript families, and what the Textus Receptus, Critical Text and Majority Text actually are.",
  alternates: { canonical: "/manuscripts" },
};

const sections = [
  { id: "start", title: "Start here" },
  { id: "languages", title: "The three languages" },
  { id: "materials", title: "What they wrote on" },
  { id: "old-testament", title: "Old Testament manuscripts" },
  { id: "new-testament", title: "New Testament manuscripts" },
  { id: "families", title: "Manuscript families" },
  { id: "timeline", title: "Written vs. found" },
  { id: "translators-desk", title: "The translator’s desk" },
  { id: "tr-ct-mt", title: "Textus Receptus, Critical Text, Majority Text" },
  { id: "ot-choices", title: "Old Testament choices" },
  { id: "how-much", title: "How much does it change?" },
];

const link = "font-medium text-brand-700 hover:underline";

function SectionHeading({ id }: { id: string }) {
  const n = sections.findIndex((s) => s.id === id);
  return (
    <h2 className="font-display text-2xl font-semibold text-brand-900 sm:text-3xl">
      <span className="mr-2 text-gild-600">{n + 1}.</span>
      {sections[n].title}
    </h2>
  );
}

function InShort({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 rounded-r-lg border-l-4 border-gild-400 bg-gild-50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-gild-700">In short</p>
      <div className="mt-1 leading-relaxed text-neutral-800">{children}</div>
    </div>
  );
}

function Section({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-14 scroll-mt-20 border-t border-neutral-200 pt-10">
      <SectionHeading id={id} />
      {children}
    </section>
  );
}

const familyClass: Record<Family, string> = {
  Alexandrian: "border-amber-200 bg-amber-50 text-amber-800",
  Byzantine: "border-brand-200 bg-brand-50 text-brand-800",
  Western: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Caesarean: "border-violet-200 bg-violet-50 text-violet-800",
  Mixed: "border-neutral-200 bg-neutral-50 text-neutral-700",
  "Too small to tell": "border-neutral-200 bg-neutral-50 text-neutral-700",
};

function FamilyChip({ family }: { family: Family }) {
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${familyClass[family]}`}
    >
      {family === "Mixed" || family === "Too small to tell" ? family : `${family} family`}
    </span>
  );
}

const kjvClass: Record<KjvHad, string> = {
  Yes: "bg-emerald-50 text-emerald-800 border-emerald-200",
  No: "bg-neutral-100 text-neutral-700 border-neutral-200",
  Partly: "bg-amber-50 text-amber-800 border-amber-200",
};

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="sm:grid sm:grid-cols-[9.5rem_minmax(0,1fr)] sm:gap-3">
      <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500 sm:pt-0.5">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm leading-relaxed text-neutral-800 sm:mt-0">{children}</dd>
    </div>
  );
}

function ManuscriptCard({ m }: { m: ManuscriptEntry }) {
  return (
    <article className="rounded-lg border border-neutral-200 bg-white p-5">
      <div className={m.image ? "gap-6 sm:grid sm:grid-cols-[minmax(0,1fr)_12rem]" : undefined}>
        <div>
          <h3 className="font-display text-xl font-semibold text-brand-900">{m.name}</h3>
          {m.family && (
            <p className="mt-1.5 flex flex-wrap items-center gap-2">
              <FamilyChip family={m.family} />
              {m.familyNote && <span className="text-xs text-neutral-500">{m.familyNote}</span>}
            </p>
          )}
          <p className="mt-2 leading-relaxed text-neutral-700">{m.what}</p>
          <dl className="mt-4 space-y-3">
            <Fact label="Language">{m.language}</Fact>
            <Fact label="Written on">{m.material}</Fact>
            <Fact label="Contains">{m.contains}</Fact>
            <Fact label="Written">{m.written}</Fact>
            <Fact label="Scholars got access">{m.access}</Fact>
            <Fact label="Did the KJV translators have it?">
              <span
                className={`mr-2 inline-block rounded border px-1.5 py-0.5 text-xs font-bold ${kjvClass[m.kjv]}`}
              >
                {m.kjv}
              </span>
              {m.kjvNote}
            </Fact>
          </dl>
        </div>
        {m.image && (
          <HistoryImage
            image={m.image}
            className="mt-5 max-w-[16rem] sm:mt-0 sm:max-w-none"
            sizes="(max-width: 639px) 16rem, 12rem"
          />
        )}
      </div>
    </article>
  );
}

const byId = new Map(translations.map((t) => [t.id, t]));

function TranslationChips({ items }: { items: Translation[] }) {
  return (
    <ul className="mt-1.5 flex flex-wrap gap-1.5">
      {items.map((t) => (
        <li key={t.id}>
          <Link
            href={`/translations/${t.id}`}
            title={t.name}
            className="inline-block rounded border border-neutral-200 bg-white px-1.5 py-0.5 text-xs font-semibold text-brand-800 hover:border-brand-300"
          >
            {t.abbreviation}
          </Link>
        </li>
      ))}
    </ul>
  );
}

const byAbbr = (a: Translation, b: Translation) => a.abbreviation.localeCompare(b.abbreviation);
const trTranslations = translations
  .filter((t) => t.textualBasis === "Textus Receptus" || t.textualBasis === "Textus Receptus / Majority Text")
  .sort(byAbbr);
const ctTranslations = translations.filter((t) => t.textualBasis === "Critical Text").sort(byAbbr);
const mtTranslations = translations
  .filter((t) => t.textualBasis === "Majority Text" || t.textualBasis === "Textus Receptus / Majority Text")
  .sort(byAbbr);

// Timeline axis: 300 BC to AD 2000, BC as negative years.
const AXIS_START = -300;
const AXIS_END = 2000;
const pct = (year: number) => ((year - AXIS_START) / (AXIS_END - AXIS_START)) * 100;
const ticks = [
  { year: -300, label: "300 BC" },
  { year: 500, label: "AD 500" },
  { year: 1000, label: "AD 1000" },
  { year: 1500, label: "AD 1500" },
  { year: 2000, label: "AD 2000" },
];

function Timeline() {
  return (
    <figure className="mt-6 rounded-lg border border-neutral-200 bg-white p-4 sm:p-5">
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-neutral-600">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-5 rounded-sm bg-brand-700" aria-hidden="true" />
          When it was written
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full bg-gild-500" aria-hidden="true" />
          When scholars got access
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-0.5 bg-red-700" aria-hidden="true" />
          The KJV is published (1611)
        </span>
      </div>

      <div className="relative mt-4 h-4" aria-hidden="true">
        <span
          className="absolute top-0 -translate-x-1/2 whitespace-nowrap text-xs font-semibold text-red-700"
          style={{ left: `${pct(KJV_YEAR)}%` }}
        >
          KJV 1611
        </span>
      </div>
      <ol className="mt-1 space-y-3">
        {timelineRows.map((row) => {
          const left = pct(row.writtenFrom);
          const width = Math.max(pct(row.writtenTo) - left, 0.8);
          return (
            <li key={row.label}>
              <p className="text-sm font-semibold text-brand-900">
                {row.label}
                <span className="ml-2 font-normal text-neutral-500">
                  written {row.writtenLabel} · {row.accessLabel}
                </span>
              </p>
              <div className="relative mt-1 h-4" aria-hidden="true">
                <div className="absolute inset-x-0 top-1/2 h-px bg-neutral-200" />
                <div
                  className="absolute top-0 h-4 w-0.5 -translate-x-1/2 bg-red-700/70"
                  style={{ left: `${pct(KJV_YEAR)}%` }}
                />
                <div
                  className="absolute top-1/2 h-px -translate-y-1/2 border-t border-dashed border-gild-400"
                  style={{ left: `${pct(row.writtenTo)}%`, width: `${pct(row.access) - pct(row.writtenTo)}%` }}
                />
                <div
                  className="absolute top-1/2 h-2.5 -translate-y-1/2 rounded-sm bg-brand-700"
                  style={{ left: `${left}%`, width: `${width}%` }}
                />
                <div
                  className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-gild-500"
                  style={{ left: `${pct(row.access)}%` }}
                />
              </div>
            </li>
          );
        })}
      </ol>

      {/* Axis */}
      <div className="relative mt-3 h-10 border-t border-neutral-300" aria-hidden="true">
        {ticks.map((t) => (
          <span
            key={t.year}
            className="absolute top-1 -translate-x-1/2 whitespace-nowrap text-[10px] text-neutral-500 first:translate-x-0 last:-translate-x-full sm:text-xs"
            style={{ left: `${pct(t.year)}%` }}
          >
            {t.label}
          </span>
        ))}
      </div>

      <figcaption className="mt-1 text-sm leading-relaxed text-neutral-600">
        The red line marks 1611, when the KJV was published. Every gold dot to the right of it is
        a manuscript the KJV translators never had. Only two land before it: the medieval
        manuscripts Erasmus printed from in 1516, and Codex Bezae, which Beza owned but seldom
        followed.
      </figcaption>
    </figure>
  );
}

function TextCard({
  name,
  oneLine,
  kind,
  how,
  builtFrom,
  leans,
  printed,
  usedBy,
  image,
}: {
  name: string;
  oneLine: string;
  kind: string;
  how: React.ReactNode;
  builtFrom: React.ReactNode;
  leans: Family;
  printed: string;
  usedBy: Translation[];
  image?: (typeof historyImages)[string];
}) {
  return (
    <article className="rounded-lg border border-neutral-200 bg-white p-5">
      <div className={image ? "gap-6 sm:grid sm:grid-cols-[minmax(0,1fr)_11rem]" : undefined}>
        <div>
          <h3 className="font-display text-xl font-semibold text-brand-900">{name}</h3>
          <p className="mt-1 font-medium text-neutral-800">{oneLine}</p>
          <dl className="mt-4 space-y-3">
            <Fact label="What kind of thing">{kind}</Fact>
            <Fact label="How it decides">{how}</Fact>
            <Fact label="Built from">{builtFrom}</Fact>
            <Fact label="Leans toward">
              <FamilyChip family={leans} />
            </Fact>
            <Fact label="Printed today as">{printed}</Fact>
            <Fact label="Used on this site by">
              <TranslationChips items={usedBy} />
              {usedBy.some((t) => t.textualBasis === "Textus Receptus / Majority Text") && (
                <p className="mt-1.5 text-xs text-neutral-500">
                  The LSV draws on both the Textus Receptus and the Majority Text.
                </p>
              )}
            </Fact>
          </dl>
        </div>
        {image && (
          <HistoryImage
            image={image}
            className="mt-5 max-w-[14rem] sm:mt-0 sm:max-w-none"
            sizes="(max-width: 639px) 14rem, 11rem"
          />
        )}
      </div>
    </article>
  );
}

export default function ManuscriptsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold text-brand-900 sm:text-4xl">
        Bible manuscripts: where the text comes from
      </h1>
      <p className="mt-3 max-w-3xl leading-relaxed text-neutral-700">
        Every English Bible is a translation of something. This page explains what that
        something is: the old handwritten copies of the Bible, what language they are in, how
        many survive, and when they were written and found. With that background, the debate
        over the Textus Receptus, the Critical Text and the Majority Text becomes much easier
        to follow.
      </p>

      <nav aria-label="On this page" className="mt-6 rounded-lg border border-neutral-200 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">On this page</p>
        <ol className="mt-2 text-sm sm:columns-2 sm:gap-x-6">
          {sections.map((s, i) => (
            <li key={s.id} className="mb-1 break-inside-avoid">
              <a href={`#${s.id}`} className="text-brand-700 hover:underline">
                <span className="text-gild-600">{i + 1}.</span> {s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* 1 */}
      <Section id="start">
        <InShort>
          The first copy of each Bible book, as its author wrote it, is long gone. Every Bible
          today is translated from later copies, and thousands of them survive.
        </InShort>
        <div className="mt-4 space-y-3 leading-relaxed text-neutral-700">
          <p>
            The books of the Bible were written over many centuries. The originals were written
            by hand, and they wore out. None of them survives today.
          </p>
          <p>
            What survives are copies, and copies of copies. Before printing, every Bible was
            copied by hand, one letter at a time. Hand-copying creates small differences, such as
            a skipped line or a misspelled word. Because so many copies survive, scholars can
            compare them and usually work out the original wording. That work is called{" "}
            <strong>textual criticism</strong>.
          </p>
          <p>
            These old handwritten copies are called <strong>manuscripts</strong>. The rest of
            this page is about them.
          </p>
        </div>
      </Section>

      {/* 2 */}
      <Section id="languages">
        <InShort>
          The Old Testament was written in Hebrew, with a few chapters in Aramaic. The New
          Testament was written in Greek. A translator needs all three languages.
        </InShort>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-neutral-200 bg-white p-4">
            <h3 className="font-display text-lg font-semibold text-brand-900">Hebrew</h3>
            <p className="mt-1 text-sm leading-relaxed text-neutral-700">
              Almost all of the Old Testament. It is written from right to left. Originally only
              the consonants were written down, as if English were written “Gd s lv.” Before AD
              1000, Jewish scribes called the <strong>Masoretes</strong> added small marks for
              the vowels so the reading would never be lost.
            </p>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-white p-4">
            <h3 className="font-display text-lg font-semibold text-brand-900">Aramaic</h3>
            <p className="mt-1 text-sm leading-relaxed text-neutral-700">
              A language closely related to Hebrew. It is used in about half of Daniel (2:4–7:28),
              two parts of Ezra (4:8–6:18 and 7:12–26), one verse of Jeremiah (10:11) and two
              words of Genesis (31:47). It was also the everyday language of Jesus. A few of his
              Aramaic words survive in the Gospels, like “Talitha koum” (Mark 5:41).
            </p>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-white p-4">
            <h3 className="font-display text-lg font-semibold text-brand-900">Greek</h3>
            <p className="mt-1 text-sm leading-relaxed text-neutral-700">
              The whole New Testament. It is written in <strong>Koine</strong> (“common”) Greek,
              the everyday language of the eastern Roman Empire. The early copies use only capital
              letters with no spaces between words, LIKETHIS. From the AD 800s, scribes switched to
              a faster lower-case handwriting.
            </p>
          </div>
        </div>
      </Section>

      {/* 3 */}
      <Section id="materials">
        <InShort>
          Early copies were written on papyrus, a paper made from a reed, or on parchment, made
          from animal skin. Some were scrolls. Most Christian copies were books with pages.
        </InShort>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            {
              term: "Papyrus",
              def: "Sheets made from strips of the papyrus reed, which grows in Egypt. It was cheap but fragile. It survives mainly where the ground is very dry, so most papyrus copies come from Egypt.",
            },
            {
              term: "Parchment",
              def: "Specially prepared animal skin, usually from sheep, goats or calves. It was expensive but tough. Most of the big, complete Bible manuscripts are parchment.",
            },
            {
              term: "Scroll",
              def: "One long strip, rolled up. Jewish Scripture was traditionally copied on scrolls, as the Dead Sea Scrolls show.",
            },
            {
              term: "Codex",
              def: "Pages folded, stacked and sewn together: the ancestor of the modern book. Christians took to it very early, so most New Testament manuscripts are codices.",
            },
          ].map((d) => (
            <div key={d.term} className="rounded-lg border border-neutral-200 bg-white p-4">
              <dt className="font-display text-lg font-semibold text-brand-900">{d.term}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-neutral-700">{d.def}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-sm leading-relaxed text-neutral-600">
          In the later Middle Ages, paper came into use as well.
        </p>
      </Section>

      {/* 4 */}
      <Section id="old-testament">
        <InShort>
          The main Hebrew text, the Masoretic Text, survives in medieval copies. The Dead Sea
          Scrolls, found in the 1940s and 50s, are about a thousand years older, and they mostly
          agree with it. The Septuagint is an early Greek translation.
        </InShort>
        <p className="mt-4 leading-relaxed text-neutral-700">
          Each card answers the same questions, in the same order. The last line answers one
          question that matters later: did the translators of the King James Version (1611) have
          this to work from?
        </p>
        <div className="mt-6 space-y-5">
          {otManuscripts.map((m) => (
            <ManuscriptCard key={m.id} m={m} />
          ))}
        </div>
      </Section>

      {/* 5 */}
      <Section id="new-testament">
        <InShort>
          About 5,700 Greek copies of the New Testament survive, more than for any other ancient
          book. The oldest are from the AD 100s and 200s. Scholars got access to most of the
          oldest ones only after 1611.
        </InShort>
        <p className="mt-4 leading-relaxed text-neutral-700">
          The Institute for New Testament Textual Research in Münster, Germany, keeps the official
          list of Greek New Testament manuscripts. In 2023 it counted 5,700. They come in four
          kinds:
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {ntKinds.map((k) => (
            <div key={k.name} className="rounded-lg border border-neutral-200 bg-white p-4">
              <p className="font-display text-2xl font-semibold text-brand-900">{k.count}</p>
              <p className="mt-0.5 font-semibold text-brand-800">{k.name}</p>
              <p className="mt-1 text-sm leading-relaxed text-neutral-700">{k.description}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-neutral-600">
          Besides the Greek copies, there are early translations into Latin, Syriac, Coptic and
          other languages. Early church writers also quoted the New Testament constantly. Both
          help show what the text said in their time and place.
        </p>

        <h3 className="mt-10 font-display text-xl font-semibold text-brand-900">
          The best-known New Testament manuscripts
        </h3>
        <p className="mt-2 leading-relaxed text-neutral-700">
          Each one belongs to a manuscript <strong>family</strong>, shown by the colored label.
          Section 6 explains the families.
        </p>
        <div className="mt-5 space-y-5">
          {ntManuscripts.map((m) => (
            <ManuscriptCard key={m.id} m={m} />
          ))}
        </div>
      </Section>

      {/* 6 */}
      <Section id="families">
        <InShort>
          Copies made in the same region tended to share the same wording, so scholars group
          them into families. The Byzantine family has by far the most copies. The Alexandrian
          family has the oldest.
        </InShort>
        <p className="mt-4 leading-relaxed text-neutral-700">
          When a scribe copied a manuscript, any small changes passed on to every copy made from
          it. Over time, each region ended up with its own recognizable wording. These groups are
          called families, or <strong>text-types</strong>. Scholars count four, though one is
          disputed.
        </p>
        <div className="mt-6 space-y-5">
          {families.map((f) => (
            <article key={f.name} className="rounded-lg border border-neutral-200 bg-white p-5">
              <div className={f.image ? "gap-6 sm:grid sm:grid-cols-[minmax(0,1fr)_11rem]" : undefined}>
                <div>
                  <h3 className="flex flex-wrap items-center gap-2 font-display text-xl font-semibold text-brand-900">
                    {f.name}
                    <FamilyChip family={f.name} />
                    {f.disputed && (
                      <span className="rounded-full border border-neutral-300 px-2 py-0.5 font-sans text-xs font-semibold text-neutral-600">
                        disputed
                      </span>
                    )}
                  </h3>
                  <dl className="mt-4 space-y-3">
                    <Fact label="Where">{f.where}</Fact>
                    <Fact label="Oldest copies">{f.oldest}</Fact>
                    <Fact label="Language">{f.language}</Fact>
                    <Fact label="How many copies">{f.howMany}</Fact>
                    <Fact label="Best-known examples">{f.examples}</Fact>
                    <Fact label="Its wording">{f.style}</Fact>
                  </dl>
                </div>
                {f.image && (
                  <HistoryImage
                    image={f.image}
                    className="mt-5 max-w-[14rem] sm:mt-0 sm:max-w-none"
                    sizes="(max-width: 639px) 14rem, 11rem"
                  />
                )}
              </div>
            </article>
          ))}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-neutral-600">
          The counts are estimates. Not every copy has been studied closely enough to sort it
          into a family, and many copies mix families. Today many scholars treat the families as
          rough groupings rather than sharp categories.
        </p>
      </Section>

      {/* 7 */}
      <Section id="timeline">
        <InShort>
          Most of the oldest manuscripts were written long before the King James Version, but
          scholars only got access to them long after it.
        </InShort>
        <p className="mt-4 leading-relaxed text-neutral-700">
          This explains much of the debate. The translators in 1611 weren’t careless. Most of the
          oldest copies simply hadn’t surfaced yet. Each row below shows when a manuscript was
          written (the dark bar) and when scholars could study it (the gold dot).
        </p>
        <Timeline />
      </Section>

      {/* 8 */}
      <Section id="translators-desk">
        <InShort>
          Translators don’t work from the old manuscripts directly. They use printed editions
          that collect the evidence from thousands of copies in one place.
        </InShort>
        <div className="mt-4 space-y-3 leading-relaxed text-neutral-700">
          <p>
            A printed edition gives the text the editors judge most likely to be original. Its
            footnotes list where the manuscripts disagree and which ones say what. (Scholars
            call those footnotes the <strong>apparatus</strong>.) A translation committee uses
            these editions, then decides for itself in the places that matter.
          </p>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-neutral-200 bg-white p-5">
            <h3 className="font-display text-lg font-semibold text-brand-900">
              A translator’s desk today
            </h3>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-neutral-700">
              <li>
                <strong>Old Testament:</strong> <em>Biblia Hebraica Stuttgartensia</em> (1977), a
                printing of the Leningrad Codex. Its footnotes show where the Dead Sea Scrolls,
                the Septuagint and other copies differ. A newer edition, <em>Biblia Hebraica
                Quinta</em>, is in progress.
              </li>
              <li>
                <strong>New Testament:</strong> the Nestle-Aland 28th edition (2012) or the
                matching United Bible Societies 5th edition (2014). These print the Critical Text.
                Translations in the King James line use a Textus Receptus edition instead. A few
                use a Majority Text edition.
              </li>
              <li>
                <strong>Languages:</strong> Hebrew, Aramaic and Koine Greek. Committees also
                draw on experts in Latin, Syriac and Coptic, because the early translations into
                those languages are evidence too.
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-white p-5">
            <h3 className="font-display text-lg font-semibold text-brand-900">
              The KJV translators’ desk (1604–1611)
            </h3>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-neutral-700">
              <li>
                <strong>Old Testament:</strong> a printed Hebrew Bible published in Venice in
                1524–25, made from medieval copies of the Masoretic Text.
              </li>
              <li>
                <strong>New Testament:</strong> printed editions of the Textus Receptus, mainly
                Theodore Beza’s (1588–89 and 1598) and Robert Estienne’s (1550).
              </li>
              <li>
                <strong>Also consulted:</strong> the Septuagint, the Latin Vulgate, and earlier
                English Bibles.
              </li>
              <li>
                <strong>Not available yet:</strong> the Dead Sea Scrolls, the papyri, Codex
                Sinaiticus, Codex Alexandrinus, and any usable copy of Codex Vaticanus.
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* 9 */}
      <Section id="tr-ct-mt">
        <InShort>
          None of the three is a set of manuscripts. Each one is a printed Greek New Testament.
          They differ in how their editors chose between the manuscripts where the copies
          disagree.
        </InShort>
        <p className="mt-4 leading-relaxed text-neutral-700">
          This question only applies to the New Testament. Where the Greek copies disagree,
          someone has to decide which wording to print. These are three different answers.
        </p>
        <div className="mt-6 space-y-5">
          <TextCard
            name="Textus Receptus"
            oneLine="The first published Greek New Testament, lightly revised by later editors."
            kind="A specific printed text. Strictly, it is a family of closely related editions, from Erasmus (1516) through Estienne, Beza and the Elzevir brothers (1633). The name means “received text.” It comes from a line in the 1633 edition’s preface."
            how="Erasmus mostly printed what his manuscripts said, correcting them in places from other copies and from the Latin. Later editors made small changes."
            builtFrom={
              <>
                About seven medieval Greek manuscripts that Erasmus borrowed in Basel,
                Switzerland. They were copied between about AD 900 and 1500, and most are
                Byzantine. For Revelation he had only one copy, and it was missing its last page.
                He translated the last six verses back into Greek from the Latin.
              </>
            }
            leans="Byzantine"
            printed="Scrivener’s edition (1881, reprinted 1894). It reconstructs the Greek text behind the KJV."
            usedBy={trTranslations}
            image={historyImages.erasmus1516}
          />
          <TextCard
            name="Critical Text"
            oneLine="A Greek New Testament rebuilt verse by verse by weighing all the evidence."
            kind="Both a method and the printed text it produces. The method is to compare all the evidence and judge, in each disputed spot, which wording is most likely original."
            how="Editors weigh how old each reading is, how widely it spread, and which reading best explains how the others came about."
            builtFrom={
              <>
                The whole body of evidence: about 5,700 Greek manuscripts, the early translations,
                and quotations by early church writers. In practice, the oldest copies carry the
                most weight, and most of those are Alexandrian. The first major edition was by
                Westcott and Hort in 1881.
              </>
            }
            leans="Alexandrian"
            printed="Nestle-Aland 28th edition (2012) and United Bible Societies 5th edition (2014). Both print the same text."
            usedBy={ctTranslations}
          />
          <TextCard
            name="Majority Text"
            oneLine="A Greek New Testament that prints, at each spot, the reading found in the most manuscripts."
            kind="Both a principle and the editions built on it. The principle is to count the manuscripts and go with the majority."
            how="Wherever the copies disagree, follow what most of them say."
            builtFrom={
              <>
                In effect, the Byzantine copies, since they are 80–90% or more of all
                manuscripts. The editors could not compare all 5,700 copies word by word. They
                relied heavily on samples and on earlier scholars’ surveys.
              </>
            }
            leans="Byzantine"
            printed="Hodges and Farstad (1982), and Robinson and Pierpont (first edition 1991)."
            usedBy={mtTranslations}
          />
        </div>

        <div className="mt-6 rounded-lg border border-neutral-200 bg-white p-5">
          <h3 className="font-display text-lg font-semibold text-brand-900">How different are they?</h3>
          <ul className="mt-2 list-disc space-y-2 pl-5 leading-relaxed text-neutral-700">
            <li>
              The New Testament has about 7,950 verses.
            </li>
            <li>
              The <strong>Textus Receptus and Majority Text</strong> differ in about 1,800
              places. They are close cousins, since both rest on Byzantine copies.
            </li>
            <li>
              The <strong>Critical Text and Majority Text</strong> differ in more than 6,000
              places. One widely cited count is about 6,500.
            </li>
            <li>
              Most of these differences are tiny: spelling, word order, or a small word like
              “the” or “and.” Many don’t show up in English at all.
            </li>
          </ul>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600">
            Each side has serious arguments. The{" "}
            <Link href="/faq#text-types" className={link}>
              FAQ
            </Link>{" "}
            covers why the Majority Text stayed a minority choice, and the{" "}
            <Link href="/differences" className={link}>
              translation differences
            </Link>{" "}
            page shows the verses where the three visibly part ways.
          </p>
        </div>
      </Section>

      {/* 10 */}
      <Section id="ot-choices">
        <InShort>
          Every translation’s Old Testament starts from the Masoretic Text. Where an older witness
          reads differently, each committee decides verse by verse which to follow.
        </InShort>
        <p className="mt-4 leading-relaxed text-neutral-700">
          The Old Testament has no TR/CT/MT debate. Instead, translators choose case by case
          whether to follow a Dead Sea Scroll or the Septuagint over the Masoretic Text. Here are
          three real examples across ten widely used translations. The same translation can
          follow the Hebrew in one verse and an older witness in the next.
        </p>
        <div className="mt-6 space-y-5">
          {otExamples.map((ex) => (
            <article key={ex.ref} className="rounded-lg border border-neutral-200 bg-white p-5">
              <h3 className="font-display text-xl font-semibold text-brand-900">{ex.ref}</h3>
              <p className="mt-1 leading-relaxed text-neutral-700">{ex.difference}</p>
              <dl className="mt-4 space-y-3">
                {ex.groups.map((g) => (
                  <div key={g.label}>
                    <dt className="text-sm font-semibold text-neutral-800">{g.label}</dt>
                    <dd>
                      <TranslationChips
                        items={g.ids.map((id) => byId.get(id)).filter((t): t is Translation => !!t)}
                      />
                    </dd>
                  </div>
                ))}
              </dl>
              {ex.note && <p className="mt-3 text-sm text-neutral-600">{ex.note}</p>}
            </article>
          ))}
        </div>
      </Section>

      {/* 11 */}
      <Section id="how-much">
        <InShort>
          The manuscripts agree on the great majority of the text. The well-known differences are
          marked in the footnotes of most modern Bibles.
        </InShort>
        <div className="mt-4 space-y-3 leading-relaxed text-neutral-700">
          <p>
            The differences are real, and some are well known, such as the ending of Mark (16:9–20)
            and the woman caught in adultery (John 7:53–8:11). But they are a small share of the
            whole. Christians on every side of these debates generally agree that no core belief
            depends on a disputed reading.
          </p>
          <p>
            To see the differences for yourself, the{" "}
            <Link href="/differences" className={link}>
              translation differences
            </Link>{" "}
            page goes verse by verse. For the history of how these texts became English Bibles,
            see{" "}
            <Link href="/history" className={link}>
              How We Got the English Bible
            </Link>
            .
          </p>
        </div>
      </Section>
    </div>
  );
}
