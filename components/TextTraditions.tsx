import { translations } from "@/lib/data";

/**
 * Two small diagrams for /history: which manuscripts the NT is translated from
 * (Textus Receptus / Critical Text / Majority Text) and which witnesses the OT
 * draws on (Masoretic / Septuagint / Dead Sea Scrolls). The NT buckets are
 * computed from each translation's `textualBasis`, so they stay in step with
 * the data.
 */

const tr = translations
  .filter((t) => t.textualBasis === "Textus Receptus")
  .map((t) => t.abbreviation);
const critical = translations
  .filter((t) => t.textualBasis === "Critical Text")
  .map((t) => t.abbreviation);

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
  children,
}: {
  heading: string;
  sub: string;
  body: string;
  usedBy?: string[];
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-4">
      <p className="font-display text-base font-semibold text-brand-900">{heading}</p>
      <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-gild-700">{sub}</p>
      <p className="mt-2 text-sm leading-relaxed text-neutral-700">{body}</p>
      {usedBy &&
        (usedBy.length > 0 ? (
          <div className="mt-auto pt-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Used by</p>
            <AbbrRow items={usedBy} />
          </div>
        ) : (
          <p className="mt-auto pt-3 text-xs italic text-neutral-400">
            No translation on this site uses it as its base.
          </p>
        ))}
      {children}
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
          All three approaches draw on the same body of roughly 5,800 Greek manuscripts. They
          differ in how much weight they give the oldest copies versus the more numerous later
          ones.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Card
            heading="Textus Receptus"
            sub="the later, Byzantine copies"
            body="Compiled by Erasmus in 1516 from about six late medieval manuscripts, lightly revised afterwards. The Greek text behind the KJV tradition."
            usedBy={tr}
          />
          <Card
            heading="Critical Text"
            sub="all of it, oldest included"
            body="Reconstructed by weighing every known manuscript, including papyrus fragments from the 100s–300s found in the last two centuries. Also called the Nestle-Aland or eclectic text."
            usedBy={critical}
          />
          <Card
            heading="Majority Text"
            sub="whatever the most copies say"
            body="Follows the reading found in the greatest number of surviving manuscripts — most of which are Byzantine and medieval."
            usedBy={[]}
          />
        </div>
      </div>

      <div>
        <h3 className="font-display text-xl font-semibold text-brand-900">
          Choosing the Old Testament text
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-700">
          Here there is one base text and two older witnesses that translators consult where they
          preserve a better reading.
        </p>
        <div className="mt-4 rounded-lg border border-neutral-200 bg-white p-4">
          <p className="font-display text-base font-semibold text-brand-900">Masoretic Text</p>
          <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-gild-700">
            the base for all twelve
          </p>
          <p className="mt-2 text-sm leading-relaxed text-neutral-700">
            The standard Hebrew text, preserved and standardized by Jewish scribes between roughly
            AD 500 and 1000. Every translation here starts from it.
          </p>
        </div>
        <p className="mt-3 text-sm text-neutral-500">Translators also weigh, where they help:</p>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <Card
            heading="The Septuagint"
            sub="Greek, ~200 BC"
            body="A Greek translation of the Hebrew Scriptures made a couple of centuries before Christ. Often what the New Testament authors quote; sometimes preserves an older reading."
          />
          <Card
            heading="The Dead Sea Scrolls"
            sub="Hebrew, ~250 BC – AD 70"
            body="Found near Qumran from 1947 on. They push the Hebrew evidence back about a thousand years, and mostly confirm how carefully the text was copied."
          />
        </div>
      </div>
    </div>
  );
}
