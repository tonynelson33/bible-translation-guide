import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import HistoryImage from "@/components/HistoryImage";
import ImageZoom from "@/components/ImageZoom";
import { translations } from "@/lib/data";
import { historyImages, type HistoryImage as HistoryImageData } from "@/lib/englishBibleHistory";
import {
  KJV_YEAR,
  mainFamilies,
  minorFamilies,
  ntKinds,
  ntManuscripts,
  otExamples,
  otManuscripts,
  timelineRows,
  unsortedRow,
  type Family,
  type FamilyRow,
  type KjvHad,
  type ManuscriptRow,
} from "@/lib/manuscripts";
import type { Translation } from "@/lib/types";

export const metadata: Metadata = {
  title: "Bible Manuscripts 101: The Copies Behind Every Translation",
  description:
    "A plain-language guide to the Bible's manuscripts: the Hebrew, Aramaic and Greek copies behind every translation, what they were written on, how many survive, when they were written and found, the manuscript families, and what the Textus Receptus, Critical Text and Majority Text actually are.",
  alternates: { canonical: "/manuscripts" },
};

const sections = [
  { id: "start", title: "The originals" },
  { id: "languages", title: "The three languages" },
  { id: "materials", title: "What they wrote on" },
  { id: "old-testament", title: "Old Testament manuscripts" },
  { id: "new-testament", title: "New Testament manuscripts" },
  { id: "families", title: "Manuscript families" },
  { id: "timeline", title: "Written vs. found" },
  { id: "translators-desk", title: "The translator’s desk, then and now" },
  { id: "tr-ct-mt", title: "Textus Receptus, Critical Text, Majority Text" },
  { id: "ot-choices", title: "The Old Testament’s version of the question" },
  { id: "how-much", title: "How much do the manuscripts differ?" },
];

const link = "font-medium text-brand-700 hover:underline";
const IMG_FILTER = "[filter:sepia(0.24)_saturate(0.86)_contrast(1.03)]";

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
      <p className="mt-6 text-right text-sm">
        <a href="#top" className="text-neutral-500 hover:text-brand-700 hover:underline">
          ↑ Back to top
        </a>
      </p>
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
      className={`inline-block whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-semibold ${familyClass[family]}`}
    >
      {family}
    </span>
  );
}

const kjvClass: Record<KjvHad, string> = {
  Yes: "bg-emerald-50 text-emerald-800 border-emerald-200",
  No: "bg-neutral-100 text-neutral-700 border-neutral-200",
  Partly: "bg-amber-50 text-amber-800 border-amber-200",
};

function KjvCell({ m }: { m: ManuscriptRow }) {
  return (
    <>
      <span className={`inline-block rounded border px-1.5 py-0.5 text-xs font-bold ${kjvClass[m.kjv]}`}>
        {m.kjv}
      </span>
      {m.kjvNote && <span className="mt-1 block text-xs text-neutral-500">{m.kjvNote}</span>}
    </>
  );
}

/**
 * One data set, two layouts: a real table from `md` up, and compact stacked rows on a
 * phone, where six columns can't fit. The first column is the row's heading in both.
 */
interface Column<T> {
  label: string;
  className?: string;
  render: (row: T) => React.ReactNode;
}

function DataTable<T>({
  rows,
  columns,
  rowKey,
  caption,
  rowClass,
}: {
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  caption: string;
  rowClass?: (row: T) => string;
}) {
  const [head, ...rest] = columns;
  return (
    <>
      <div className="mt-5 hidden overflow-hidden rounded-lg border border-neutral-200 md:block">
        <table className="w-full border-collapse bg-white text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="bg-neutral-50">
              {columns.map((c) => (
                <th
                  key={c.label}
                  scope="col"
                  className={`border-b border-neutral-200 px-3 py-2 text-left align-bottom text-xs font-semibold uppercase tracking-wide text-neutral-600 ${c.className ?? ""}`}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={rowKey(r)} className={`border-b border-neutral-100 last:border-0 ${rowClass?.(r) ?? ""}`}>
                <th scope="row" className={`px-3 py-3 text-left align-top font-normal ${head.className ?? ""}`}>
                  {head.render(r)}
                </th>
                {rest.map((c) => (
                  <td key={c.label} className={`px-3 py-3 align-top leading-snug text-neutral-800 ${c.className ?? ""}`}>
                    {c.render(r)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="mt-5 space-y-3 md:hidden">
        {rows.map((r) => (
          <li key={rowKey(r)} className={`rounded-lg border border-neutral-200 bg-white p-4 ${rowClass?.(r) ?? ""}`}>
            <div>{head.render(r)}</div>
            <dl className="mt-3 grid grid-cols-[7rem_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm">
              {rest.map((c) => (
                <div key={c.label} className="contents">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{c.label}</dt>
                  <dd className="leading-snug text-neutral-800">{c.render(r)}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}

function NameCell({ name, what }: { name: string; what: string }) {
  return (
    <>
      <span className="block font-display text-base font-semibold text-brand-900">{name}</span>
      <span className="mt-1 block text-xs leading-snug text-neutral-600">{what}</span>
    </>
  );
}

/** A small, captioned, click-to-zoom picture for the image rows. */
function Pic({ image, label, sub }: { image: HistoryImageData; label: string; sub?: string }) {
  return (
    <figure>
      <ImageZoom
        image={image}
        className="relative block h-44 w-full overflow-hidden rounded-md border border-neutral-200 bg-paper"
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(max-width: 640px) 92vw, 240px"
          className={`object-contain p-2 ${IMG_FILTER}`}
        />
      </ImageZoom>
      <figcaption className="mt-1.5 text-sm leading-snug">
        <span className="font-semibold text-brand-900">{label}</span>
        {sub && <span className="block text-xs text-neutral-500">{sub}</span>}
      </figcaption>
    </figure>
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
                <span
                  className={`mr-1.5 inline-block rounded px-1 py-px text-[10px] font-bold ${
                    row.testament === "OT" ? "bg-gild-100 text-gild-800" : "bg-brand-100 text-brand-800"
                  }`}
                >
                  {row.testament}
                </span>
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

function TextCard({
  name,
  oneLine,
  kind,
  how,
  builtFrom,
  leans,
  printed,
  usedBy,
}: {
  name: string;
  oneLine: string;
  kind: string;
  how: string;
  builtFrom: string;
  leans: Family;
  printed: string;
  usedBy: Translation[];
}) {
  return (
    <article className="rounded-lg border border-neutral-200 bg-white p-5">
      <h3 className="font-display text-xl font-semibold text-brand-900">{name}</h3>
      <p className="mt-1 font-medium text-neutral-800">{oneLine}</p>
      <dl className="mt-4 space-y-3">
        <Fact label="What kind of thing">{kind}</Fact>
        <Fact label="How it decides">{how}</Fact>
        <Fact label="Built from">{builtFrom}</Fact>
        <Fact label="Leans toward">
          <FamilyChip family={leans} /> <span className="text-neutral-600">family</span>
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
    </article>
  );
}

const manuscriptColumns = (nt: boolean): Column<ManuscriptRow>[] => [
  {
    label: nt ? "Manuscript" : "Source",
    className: "w-[24%]",
    render: (m) => <NameCell name={m.name} what={m.what} />,
  },
  nt
    ? {
        label: "Family",
        className: "w-[12%]",
        render: (m) =>
          m.family && (
            <>
              <FamilyChip family={m.family} />
              {m.familyNote && <span className="mt-1 block text-xs text-neutral-500">{m.familyNote}</span>}
            </>
          ),
      }
    : { label: "Language", className: "w-[13%]", render: (m) => m.language },
  { label: nt ? "Contains" : "What survives", render: (m) => m.contains },
  { label: "Written", className: "w-[13%]", render: (m) => m.written },
  { label: "Scholars got access", className: "w-[15%]", render: (m) => m.access },
  { label: "KJV translators had it?", className: "w-[11%]", render: (m) => <KjvCell m={m} /> },
];

const familyColumns: Column<FamilyRow>[] = [
  {
    label: "Family",
    className: "w-[15%]",
    render: (f) => (
      <span className="flex flex-col items-start gap-1">
        <span className="font-display text-base font-semibold text-brand-900">{f.name}</span>
        {f.family === "Caesarean" && (
          <span className="rounded-full border border-neutral-300 px-2 py-0.5 text-[11px] font-semibold text-neutral-600">
            disputed
          </span>
        )}
      </span>
    ),
  },
  { label: "How many copies", className: "w-[17%] font-semibold", render: (f) => f.howMany },
  { label: "Where", render: (f) => f.where },
  { label: "Oldest copies", render: (f) => f.oldest },
  { label: "Best-known examples", render: (f) => f.examples },
  { label: "Its wording", render: (f) => f.style },
];

const familyRowClass = (f: FamilyRow) =>
  f.name === unsortedRow.name ? "bg-neutral-50" : "";

const deskRows: { topic: string; kjv: string; today: string }[] = [
  {
    topic: "Old Testament text",
    kjv: "A printed Hebrew Bible (Venice, 1524–25), made from medieval copies of the Masoretic Text.",
    today:
      "Biblia Hebraica Stuttgartensia (1977), a printing of the Leningrad Codex (AD 1008). A newer edition, Biblia Hebraica Quinta, is in progress.",
  },
  {
    topic: "New Testament text",
    kjv: "Printed Textus Receptus editions, mainly Beza’s (1588–89 and 1598) and Estienne’s (1550).",
    today:
      "Most translations: Nestle-Aland 28 (2012) or UBS 5 (2014), the Critical Text. KJV-line translations: a Textus Receptus edition. A few: a Majority Text edition.",
  },
  {
    topic: "Other sources they checked",
    kjv: "The Septuagint, the Latin Vulgate, and earlier English Bibles.",
    today:
      "The Dead Sea Scrolls, the Septuagint, early translations (Latin, Syriac, Coptic) and Bible quotations by early church writers.",
  },
  {
    topic: "Oldest Old Testament copies in reach",
    kjv: "Medieval Hebrew copies, through the printed edition.",
    today: "Dead Sea Scrolls from as early as about 250 BC.",
  },
  {
    topic: "Oldest New Testament copies in reach",
    kjv: "Medieval copies from about AD 900–1500, through the printed editions. No papyri, no Sinaiticus or Alexandrinus, and no usable copy of Vaticanus.",
    today: "Papyri from the AD 100s and 200s, and the great codices of the AD 300s.",
  },
  {
    topic: "How they see the evidence",
    kjv: "A few printed books. Estienne’s 1550 edition was the first to note differing readings in its margins, from about 15 manuscripts. Beza’s editions added a few more.",
    today:
      "Printed editions whose footnotes (the apparatus) list where thousands of copies disagree and which ones say what.",
  },
];

export default function ManuscriptsPage() {
  return (
    <div id="top" className="mx-auto max-w-5xl scroll-mt-20 px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold text-brand-900 sm:text-4xl">
        Bible Manuscripts 101
      </h1>
      <p className="mt-1 font-display text-xl text-neutral-600 sm:text-2xl">
        The copies behind every translation
      </p>
      <p className="mt-4 max-w-3xl leading-relaxed text-neutral-700">
        Every English Bible is a translation of something. This page explains what that
        something is: the old handwritten copies of the Bible, what language they are in, how
        many survive, and when they were written and found. With that background, the debate
        over the Textus Receptus, the Critical Text and the Majority Text becomes much easier
        to follow.
      </p>

      <nav aria-label="On this page" className="mt-6 max-w-3xl rounded-lg border border-neutral-200 bg-white p-4">
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
        <div className="mt-4 max-w-3xl space-y-3 leading-relaxed text-neutral-700">
          <p>
            The Old Testament was written over more than a thousand years. The New Testament was
            written in about AD 50–100. The originals were written by hand, and they wore out. None
            of them survives today.
          </p>
          <p>
            What survives are copies, and copies of copies. Before printing, every Bible was
            copied by hand, one letter at a time. Hand-copying creates small differences, such as
            a skipped line or a misspelled word. Because so many copies survive, scholars can
            compare them and usually work out the original wording. That work is called{" "}
            <strong>textual criticism</strong>.
          </p>
          <p>
            How close are the copies to the originals? The oldest New Testament copies were made
            within about 100 to 300 years of the originals. For the Old Testament the gap is
            longer: even the Dead Sea Scrolls were copied centuries after most of its books were
            written.
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
        <div className="mt-5 max-w-3xl rounded-lg border border-neutral-200 bg-white p-4">
          <h3 className="font-semibold text-brand-900">Why translators also know Latin, Syriac and Coptic</h3>
          <p className="mt-1 text-sm leading-relaxed text-neutral-700">
            Nobody translates the Bible from these languages. But very early on, Christians
            translated the Greek New Testament into <strong>Latin</strong> (for the western Roman
            Empire), <strong>Syriac</strong> (for the Middle East) and <strong>Coptic</strong> (for
            Egypt). Some of those translations were made in the AD 100s to 300s, from Greek copies
            that no longer exist. Reading them shows what those lost Greek copies said. The most
            famous is the <strong>Latin Vulgate</strong>, made by Jerome around AD 400. It was the
            standard Bible of the Western church for over a thousand years.
          </p>
        </div>
      </Section>

      {/* 3 */}
      <Section id="materials">
        <InShort>
          Early copies were written on papyrus, a paper made from a reed, or on parchment, made
          from animal skin. Some were scrolls. Most Christian copies were books with pages.
        </InShort>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              term: "Papyrus",
              def: "Sheets made from strips of the papyrus reed, which grows in Egypt. Cheap but fragile. It survives mainly in Egypt’s dry ground.",
              image: historyImages.papyrus52,
              label: "Papyrus 52",
              sub: "A papyrus scrap of John, AD 100s",
            },
            {
              term: "Parchment",
              def: "Specially prepared animal skin, usually from sheep, goats or calves. Expensive but tough. Most big, complete Bibles are parchment.",
              image: historyImages.leningrad,
              label: "Leningrad Codex",
              sub: "A parchment page of the Hebrew Bible, AD 1008",
            },
            {
              term: "Scroll",
              def: "One long strip, rolled up. Jewish Scripture was traditionally copied on scrolls.",
              image: historyImages.isaiahScroll,
              label: "Great Isaiah Scroll",
              sub: "The whole of Isaiah on one scroll, about 125 BC",
            },
            {
              term: "Codex",
              def: "Pages stacked and sewn together: the ancestor of the modern book. Christians took to it early, so most New Testament copies are codices.",
              image: historyImages.codexWashingtonianus,
              label: "Codex Washingtonianus",
              sub: "Two facing pages of a Gospel book, about AD 400",
            },
          ].map((d) => (
            <div key={d.term} className="flex flex-col rounded-lg border border-neutral-200 bg-white p-4">
              <h3 className="font-display text-lg font-semibold text-brand-900">{d.term}</h3>
              <p className="mt-1 flex-1 text-sm leading-relaxed text-neutral-700">{d.def}</p>
              <div className="mt-3">
                <Pic image={d.image} label={d.label} sub={d.sub} />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-neutral-600">
          In the later Middle Ages, paper came into use as well. Click any picture to enlarge it.
        </p>
      </Section>

      {/* 4 */}
      <Section id="old-testament">
        <InShort>
          The main Hebrew text, the Masoretic Text, survives in thousands of medieval copies. The
          Dead Sea Scrolls, found in the 1940s and 50s, are about a thousand years older, and they
          mostly agree with it. The Septuagint is an early Greek translation.
        </InShort>
        <div className="mt-4 max-w-3xl space-y-3 leading-relaxed text-neutral-700">
          <p>
            <strong>How many Old Testament copies are there?</strong> Nobody keeps one official
            count, the way the New Testament has (section 5). Scholars estimate that Hebrew
            manuscripts and fragments run into the <strong>tens of thousands</strong>, most of
            them small pieces from the Cairo Geniza. On top of that come about 230 biblical Dead
            Sea Scrolls and over 1,500 copies of the Greek Septuagint.
          </p>
          <p>
            The last column answers a question that matters later on this page: did the
            translators of the King James Version (1611) have it to work from?
          </p>
        </div>
        <DataTable
          caption="The main sources for the Old Testament text"
          rows={otManuscripts}
          rowKey={(m) => m.id}
          columns={manuscriptColumns(false)}
        />
      </Section>

      {/* 5 */}
      <Section id="new-testament">
        <InShort>
          About 5,700 Greek copies of the New Testament survive, more than for any other ancient
          book. The oldest are from the AD 100s and 200s. Scholars got access to most of the
          oldest ones only after 1611.
        </InShort>
        <p className="mt-4 max-w-3xl leading-relaxed text-neutral-700">
          The Institute for New Testament Textual Research in Münster, Germany, keeps the official
          list of Greek New Testament manuscripts. In 2023 it counted 5,700. They come in four
          kinds:
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ntKinds.map((k) => (
            <div key={k.name} className="rounded-lg border border-neutral-200 bg-white p-4">
              <p className="font-display text-2xl font-semibold text-brand-900">{k.count}</p>
              <p className="mt-0.5 font-semibold text-brand-800">{k.name}</p>
              <p className="mt-1 text-sm leading-relaxed text-neutral-700">{k.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 max-w-3xl rounded-lg border border-neutral-200 bg-white p-4">
          <h3 className="font-semibold text-brand-900">Which copies count?</h3>
          <p className="mt-1 text-sm leading-relaxed text-neutral-700">
            Only copies written by hand, before printing took over. The ones on the official list
            run from the AD 100s to the 1700s. Once printed Greek New Testaments appeared (the
            first in 1516), new copies were usually made from printed books. A copy of a printed
            book adds no new evidence about the original wording, so later copies, and any copy
            made today, aren’t counted.
          </p>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-neutral-600">
          Besides the Greek copies, there are early translations into Latin, Syriac, Coptic and
          other languages. Early church writers also quoted the New Testament constantly. Both
          help show what the text said in their time and place.
        </p>

        <h3 className="mt-10 font-display text-xl font-semibold text-brand-900">
          The best-known New Testament manuscripts
        </h3>
        <p className="mt-2 max-w-3xl leading-relaxed text-neutral-700">
          All are in Greek (Codex Bezae also has Latin). The papyri are on papyrus; the codices are
          on parchment. The colored label is the manuscript’s <strong>family</strong>, explained in
          section 6.
        </p>
        <DataTable
          caption="The best-known New Testament manuscripts"
          rows={ntManuscripts}
          rowKey={(m) => m.id}
          columns={manuscriptColumns(true)}
        />
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Pic
            image={historyImages.codexSinaiticus}
            label="Codex Sinaiticus (Alexandrian family)"
            sub="About AD 330–360, shown in an 1862 facsimile"
          />
          <Pic
            image={historyImages.boreelianus}
            label="Codex Boreelianus (Byzantine family)"
            sub="A Gospel book from the AD 800s"
          />
        </div>
      </Section>

      {/* 6 */}
      <Section id="families">
        <InShort>
          Copies made in the same region tended to share the same wording, so scholars group them
          into families. Two matter most: the <strong>Byzantine</strong> family has by far the most
          copies, and the <strong>Alexandrian</strong> family has the oldest.
        </InShort>
        <p className="mt-4 max-w-3xl leading-relaxed text-neutral-700">
          When a scribe copied a manuscript, any small changes passed on to every copy made from it.
          Over time, each region ended up with its own recognizable wording. These groups are called
          families, or <strong>text-types</strong>.
        </p>

        <h3 className="mt-8 font-display text-xl font-semibold text-brand-900">The two main families</h3>
        <DataTable
          caption="The two main manuscript families"
          rows={mainFamilies}
          rowKey={(f) => f.name}
          columns={familyColumns}
        />

        <h3 className="mt-8 font-display text-xl font-semibold text-brand-900">
          The smaller families, and the rest
        </h3>
        <DataTable
          caption="The smaller manuscript families and unsorted copies"
          rows={[...minorFamilies, unsortedRow]}
          rowKey={(f) => f.name}
          columns={familyColumns}
          rowClass={familyRowClass}
        />

        <div className="mt-5 max-w-3xl rounded-lg border border-neutral-200 bg-white p-4">
          <h3 className="font-semibold text-brand-900">How does that add up to 5,700?</h3>
          <p className="mt-1 text-sm leading-relaxed text-neutral-700">
            Roughly 4,500 to 5,000 Byzantine copies, plus about a hundred in the other families put
            together, leaves roughly 500 to 1,000 more. Those are copies that mix families, scraps
            too short to judge, and copies no one has studied closely enough to sort. All of these
            numbers are estimates. Many scholars today treat the families as rough groupings
            rather than sharp categories.
          </p>
        </div>
      </Section>

      {/* 7 */}
      <Section id="timeline">
        <InShort>
          Most of the oldest manuscripts were written long before the King James Version, but
          scholars only got access to them long after it.
        </InShort>
        <p className="mt-4 max-w-3xl leading-relaxed text-neutral-700">
          This explains much of the debate. The translators in 1611 weren’t careless. Most of the
          oldest copies simply hadn’t surfaced yet. The chart shows a <strong>few famous
          examples</strong>, not every manuscript, marked <strong>OT</strong> or{" "}
          <strong>NT</strong>. Each row shows when a manuscript was written (the dark bar) and when
          scholars could study it (the gold dot).
        </p>
        <Timeline />
      </Section>

      {/* 8 */}
      <Section id="translators-desk">
        <InShort>
          Translators don’t work from the old manuscripts directly. They use printed editions. The
          KJV translators had a few printed books made from medieval copies. Translators today have
          editions that gather the evidence from thousands of copies, including the oldest ones.
        </InShort>
        <div className="mt-5 hidden overflow-hidden rounded-lg border border-neutral-200 md:block">
          <table className="w-full border-collapse bg-white text-sm">
            <caption className="sr-only">What the KJV translators worked from, compared with translators today</caption>
            <thead>
              <tr className="bg-neutral-50">
                <td className="w-[20%] border-b border-neutral-200 px-3 py-2" />
                <th scope="col" className="w-[40%] border-b border-neutral-200 px-3 py-2 text-left font-display text-base font-semibold text-brand-900">
                  KJV translators (1604–1611)
                </th>
                <th scope="col" className="w-[40%] border-b border-neutral-200 px-3 py-2 text-left font-display text-base font-semibold text-brand-900">
                  Translators today
                </th>
              </tr>
            </thead>
            <tbody>
              {deskRows.map((r) => (
                <tr key={r.topic} className="border-b border-neutral-100 last:border-0">
                  <th scope="row" className="px-3 py-3 text-left align-top text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    {r.topic}
                  </th>
                  <td className="px-3 py-3 align-top leading-snug text-neutral-800">{r.kjv}</td>
                  <td className="px-3 py-3 align-top leading-snug text-neutral-800">{r.today}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="mt-5 space-y-3 md:hidden">
          {deskRows.map((r) => (
            <li key={r.topic} className="rounded-lg border border-neutral-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{r.topic}</p>
              <p className="mt-2 text-sm font-semibold text-brand-900">KJV translators (1604–1611)</p>
              <p className="text-sm leading-snug text-neutral-800">{r.kjv}</p>
              <p className="mt-2 text-sm font-semibold text-brand-900">Translators today</p>
              <p className="text-sm leading-snug text-neutral-800">{r.today}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-neutral-600">
          The languages haven’t changed: Hebrew, Aramaic and Greek. Committees today also draw on
          experts in Latin, Syriac and Coptic, for the reason explained in section 2.
        </p>
      </Section>

      {/* 9 */}
      <Section id="tr-ct-mt">
        <InShort>
          These three names belong to the New Testament. None of them is a set of manuscripts. Each
          one is a printed Greek New Testament, and they differ in how their editors chose between
          the manuscripts where the copies disagree.
        </InShort>
        <p className="mt-4 max-w-3xl leading-relaxed text-neutral-700">
          Think of each one as a book on a translator’s desk. Translators translate from one of
          these printed books, not from the manuscripts themselves. The Textus Receptus is the
          printed text Erasmus first made from his handful of manuscripts. The Critical Text and
          Majority Text are each a method, plus the printed books that method produces.
        </p>
        <p className="mt-3 max-w-3xl leading-relaxed text-neutral-700">
          The Dead Sea Scrolls play no part here, because they are Hebrew copies of the Old
          Testament. The Old Testament faces the same kind of question in its own way, covered in
          section 10.
        </p>

        <div className="mt-6 rounded-lg border-2 border-gild-300 bg-white p-5">
          <div className="gap-6 sm:grid sm:grid-cols-[minmax(0,1fr)_12rem]">
            <div>
              <h3 className="font-display text-xl font-semibold text-brand-900">
                Where it started: what Erasmus had in 1516
              </h3>
              <p className="mt-1 leading-relaxed text-neutral-700">
                The Dutch scholar Erasmus published the first Greek New Testament in 1516. It
                became the Textus Receptus, the text behind the KJV. Here is what he had to work
                with:
              </p>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 leading-relaxed text-neutral-800">
                <li>
                  <strong>About seven Greek manuscripts</strong>. Most were lent to him by a
                  monastery library in Basel, Switzerland, where he was working.
                </li>
                <li>
                  All were <strong>medieval</strong>, copied between about AD 900 and 1500. Most
                  were Byzantine.
                </li>
                <li>
                  He had only a few copies of each part of the New Testament, and for{" "}
                  <strong>Revelation just one</strong>. That copy was missing its last page.
                </li>
                <li>
                  So for the last six verses of Revelation (22:16–21), he used the{" "}
                  <strong>Latin Vulgate</strong>, the standard Latin Bible of his day, and
                  translated those verses <strong>from Latin into Greek</strong> himself. A few
                  words of that
                  back-translation are still in the Textus Receptus and the KJV. For example,
                  Revelation 22:19 says “book of life” in the KJV, where the Greek manuscripts say
                  “tree of life.”
                </li>
              </ul>
            </div>
            <HistoryImage
              image={{
                ...historyImages.erasmus1516,
                caption: "The last page of Erasmus’s 1516 Greek New Testament: his Greek beside his own Latin.",
              }}
              className="mt-5 max-w-[14rem] sm:mt-0 sm:max-w-none"
              sizes="(max-width: 639px) 14rem, 12rem"
            />
          </div>
        </div>

        <div className="mt-6 space-y-5">
          <TextCard
            name="Textus Receptus"
            oneLine="The first published Greek New Testament, lightly revised by later editors."
            kind="A specific printed text. Strictly, it is a family of closely related editions, from Erasmus (1516) through Estienne, Beza and the Elzevir brothers (1633). The name means “received text.” It comes from a line in the 1633 edition’s preface."
            how="Erasmus mostly printed what his manuscripts said, correcting them in places from other copies and from the Latin Vulgate. Later editors made small changes."
            builtFrom="Erasmus’s seven or so medieval manuscripts (see the box above), with small changes from a few more copies by later editors."
            leans="Byzantine"
            printed="Scrivener’s edition (1881, reprinted 1894). It reconstructs the Greek text behind the KJV."
            usedBy={trTranslations}
          />
          <TextCard
            name="Critical Text"
            oneLine="A Greek New Testament rebuilt verse by verse by weighing all the evidence."
            kind="Both a method and the printed text it produces. The method is to compare all the evidence and judge, in each disputed spot, which wording is most likely original."
            how="Editors weigh how old each reading is, how widely it spread, and which reading best explains how the others came about."
            builtFrom="The whole body of evidence: about 5,700 Greek manuscripts, the early translations, and quotations by early church writers. In practice, the oldest copies carry the most weight, and most of those are Alexandrian. Its best-known early edition was by Westcott and Hort in 1881."
            leans="Alexandrian"
            printed="Nestle-Aland 28th edition (2012) and United Bible Societies 5th edition (2014). Both print the same text."
            usedBy={ctTranslations}
          />
          <TextCard
            name="Majority Text"
            oneLine="A Greek New Testament that prints, at each spot, the reading found in the most manuscripts."
            kind="Both a principle and the editions built on it. The principle is to count the manuscripts and go with the majority."
            how="Wherever the copies disagree, follow what most of them say."
            builtFrom="In effect, the Byzantine copies, since they are 80–90% or more of all manuscripts. The editors could not compare all 5,700 copies word by word. They relied heavily on samples and on earlier scholars’ surveys."
            leans="Byzantine"
            printed="Hodges and Farstad (1982), and Robinson and Pierpont (first edition 1991)."
            usedBy={mtTranslations}
          />
        </div>

        <div className="mt-6 rounded-lg border border-neutral-200 bg-white p-5">
          <h3 className="font-display text-lg font-semibold text-brand-900">How different are they?</h3>
          <ul className="mt-2 list-disc space-y-2 pl-5 leading-relaxed text-neutral-700">
            <li>The New Testament has about 7,950 verses.</li>
            <li>
              The <strong>Textus Receptus and Majority Text</strong> differ in about 1,800 places.
              They are close cousins, since both rest on Byzantine copies.
            </li>
            <li>
              The <strong>Critical Text and Majority Text</strong> differ in more than 6,000 places.
              One widely cited count is about 6,500.
            </li>
            <li>
              Most of these differences are tiny: spelling, word order, or a small word like “the”
              or “and.” Many don’t show up in English at all.
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
          Every translation uses the Masoretic Text as its base, and for nearly every verse it
          simply translates the Masoretic Hebrew. But in a small number of verses, translators
          decide an older witness, a Dead Sea Scroll or the Septuagint, preserves the better
          reading, and use that instead, usually with a footnote. Translations disagree about which
          verses those should be.
        </InShort>
        <div className="mt-4 max-w-3xl space-y-3 leading-relaxed text-neutral-700">
          <p>
            This is where the Dead Sea Scrolls matter. They are about a thousand years older than
            the oldest complete Masoretic copy. Most of the time they agree with it, which is
            strong confirmation that the Hebrew was copied carefully. Where they differ, translators
            have to choose.
          </p>
          <p>
            Translators also check early translations of the Old Testament, such as the Latin
            Vulgate, the Syriac Peshitta and the Aramaic paraphrases called Targums. They show
            what the Hebrew copies of their day said.
          </p>
          <p>
            Some translations keep the Masoretic reading more often, and others adopt the older
            readings more often. But no translation does either every time. Here are three real
            examples across ten widely used translations.
          </p>
        </div>
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {otExamples.map((ex) => (
            <article key={ex.ref} className="rounded-lg border border-neutral-200 bg-white p-5">
              <h3 className="font-display text-xl font-semibold text-brand-900">{ex.ref}</h3>
              <p className="mt-1 text-sm leading-relaxed text-neutral-700">{ex.difference}</p>
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
        <div className="mt-4 max-w-3xl space-y-3 leading-relaxed text-neutral-700">
          <p>
            The differences are real, and some are well known, such as the ending of Mark (16:9–20)
            and the woman caught in adultery (John 7:53–8:11). But they are a small share of the
            whole. Christians on every side of these debates generally agree that no core belief
            depends on a disputed reading.
          </p>
          <p>
            One famous case shows how a difference can arise. 1 John 5:7 in the KJV reads “For
            there are three that bear record in heaven, the Father, the Word, and the Holy Ghost:
            and these three are one.” That sentence is in many later copies of the Latin Vulgate,
            but only a handful of Greek manuscripts have it, all of them late. Erasmus left it out of his first edition in 1516. He added it in
            his third edition, in 1522, after a single Greek manuscript with the sentence was
            produced. From there it passed into the Textus Receptus and the KJV. Most modern
            translations leave it out or put it in a footnote.
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
