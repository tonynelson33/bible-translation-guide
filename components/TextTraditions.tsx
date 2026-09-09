import Image from "next/image";
import Link from "next/link";
import HistoryImage from "@/components/HistoryImage";
import { translations } from "@/lib/data";
import { historyImages, type HistoryImage as HistoryImageData } from "@/lib/englishBibleHistory";

/**
 * Two small diagrams for /history: which manuscripts the NT is translated from
 * (Textus Receptus / Critical Text / Majority Text) and which witnesses the OT
 * draws on (Masoretic / Septuagint / Dead Sea Scrolls). The NT buckets are
 * computed from each translation's `textualBasis`, so they stay in step with
 * the data. Each card carries a public-domain image of a representative
 * manuscript (see lib/englishBibleHistory.ts).
 */

const tr = translations
  .filter((t) => t.textualBasis === "Textus Receptus")
  .map((t) => t.abbreviation);
const critical = translations
  .filter((t) => t.textualBasis === "Critical Text")
  .map((t) => t.abbreviation);

const IMG_FILTER = "[filter:sepia(0.24)_saturate(0.86)_contrast(1.03)]";

function AbbrRow({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 flex flex-wrap gap-1.5">
      {items.map((a) => (
        <li
          key={a}
          className="rounded bg-brand-50 px-1.5 py-0.5 text-xs font-semibold text-brand-800"
        >
          {a}
        </li>
      ))}
    </ul>
  );
}

function Card({
  heading,
  sub,
  body,
  usedBy,
  image,
  children,
}: {
  heading: string;
  sub: string;
  body: string;
  usedBy?: string[];
  image?: HistoryImageData;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white">
      {image && (
        <div className="relative h-28 border-b border-neutral-200 bg-paper">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 640px) 92vw, 260px"
            className={`object-cover object-top ${IMG_FILTER}`}
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-4">
        <p className="font-display text-base font-semibold text-brand-900">{heading}</p>
        <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-gild-700">{sub}</p>
        <p className="mt-2 text-sm leading-relaxed text-neutral-700">{body}</p>
        {image?.caption && (
          <p className="mt-2 text-xs leading-snug text-neutral-400">{image.caption}</p>
        )}
        {usedBy &&
          (usedBy.length > 0 ? (
            <div className="mt-auto pt-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                Used by
              </p>
              <AbbrRow items={usedBy} />
            </div>
          ) : (
            <p className="mt-auto pt-3 text-xs italic text-neutral-400">
              No translation on this site uses it as its base.
            </p>
          ))}
        {children}
      </div>
    </div>
  );
}

export default function TextTraditions() {
  return (
    <div className="space-y-10">
      <div>
        <h3 className="font-display text-xl font-semibold text-brand-900">
          Choosing the New Testament text
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-700">
          The three differ mainly in how much they lean on the oldest surviving copies. The Textus
          Receptus was fixed in the 1500s, before most of those were found; the Critical Text
          weighs all the evidence known today.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Card
            heading="Textus Receptus"
            sub="the later, Byzantine copies"
            body="Compiled by Erasmus in 1516 from about six late medieval manuscripts, lightly revised afterwards. The Greek text behind the KJV tradition."
            image={historyImages.estienne1551}
            usedBy={tr}
          />
          <Card
            heading="Critical Text"
            sub="all of it, oldest included"
            body="Reconstructed by weighing every known manuscript, including papyrus fragments from the 100s–300s found in the last two centuries. Also called the Nestle-Aland or eclectic text."
            image={historyImages.papyrus52}
            usedBy={critical}
          />
          <Card
            heading="Majority Text"
            sub="whatever the most copies say"
            body="Follows the reading found in the greatest number of surviving manuscripts — most of which are Byzantine and medieval."
            image={historyImages.boreelianus}
            usedBy={[]}
          />
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-500">
          No widely used English translation is based on the Majority Text; the NKJV&rsquo;s
          footnotes are where its readings usually appear, and the{" "}
          <Link href="/faq#majority-text" className="font-medium text-gild-700 hover:underline">
            FAQ explains why
          </Link>
          . The practical distance between all three is small &mdash;{" "}
          <Link href="/differences" className="font-medium text-gild-700 hover:underline">
            where translations differ
          </Link>{" "}
          walks through the specific verses.
        </p>
      </div>

      <div>
        <h3 className="font-display text-xl font-semibold text-brand-900">
          Choosing the Old Testament text
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-700">
          Here there is one base text and two older witnesses that translators consult where they
          preserve a better reading.
        </p>
        <div className="mt-4 sm:grid sm:grid-cols-[minmax(0,1fr)_13rem] sm:items-start sm:gap-5">
          <div>
            <p className="font-display text-base font-semibold text-brand-900">Masoretic Text</p>
            <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-gild-700">
              the base for all twelve
            </p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700">
              The standard Hebrew text, preserved and standardized by Jewish scribes between roughly
              AD 500 and 1000. Every translation here starts from it.
            </p>
          </div>
          <HistoryImage
            image={historyImages.leningrad}
            className="mt-4 max-w-[15rem] sm:mt-0 sm:max-w-none"
            sizes="(max-width: 639px) 15rem, 13rem"
          />
        </div>
        <p className="mt-6 text-sm text-neutral-500">Translators also weigh two older witnesses:</p>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <Card
            heading="The Septuagint"
            sub="Greek, ~200 BC"
            body="A Greek translation of the Hebrew Scriptures made a couple of centuries before Christ. Often what the New Testament authors quote; sometimes preserves an older reading."
          >
            <p className="mt-2 text-xs leading-snug text-neutral-400">
              The Codex Sinaiticus leaf shown earlier is a Septuagint page — the Greek Old
              Testament, copied in the fourth century.
            </p>
          </Card>
          <Card
            heading="The Dead Sea Scrolls"
            sub="Hebrew, ~250 BC – AD 70"
            body="Found near Qumran from 1947 on. They push the Hebrew evidence back about a thousand years, and mostly confirm how carefully the text was copied."
          />
        </div>
        <HistoryImage
          image={historyImages.isaiahScroll}
          className="mt-4"
          sizes="(max-width: 767px) 92vw, 46rem"
        />
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-500">
          The Septuagint has been known since antiquity, but the Dead Sea Scrolls only surfaced
          from 1947 on &mdash; so the 1611{" "}
          <Link href="/translations/kjv" className="font-medium text-gild-700 hover:underline">
            KJV
          </Link>{" "}
          predates them. Among the modern translations, the{" "}
          <Link href="/translations/nrsvue" className="font-medium text-gild-700 hover:underline">
            NRSVue
          </Link>{" "}
          and{" "}
          <Link href="/translations/net" className="font-medium text-gild-700 hover:underline">
            NET
          </Link>{" "}
          move to the older witnesses fairly readily and note it in the margin; the{" "}
          <Link href="/translations/esv" className="font-medium text-gild-700 hover:underline">
            ESV
          </Link>{" "}
          and{" "}
          <Link href="/translations/niv" className="font-medium text-gild-700 hover:underline">
            NIV
          </Link>{" "}
          stay closer to the Masoretic Hebrew.
        </p>
      </div>
    </div>
  );
}
