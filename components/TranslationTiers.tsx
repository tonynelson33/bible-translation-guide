import Link from "next/link";
import { getTranslation } from "@/lib/data";
import { rankingCategories } from "@/lib/rankings";
import Tooltip from "./Tooltip";

type Tier = {
  number: number;
  name: string;
  description: string;
  ids: string[];
};

// Editorial groupings, not derived from any field on Translation — these rank
// by real-world recognition (how often a translation gets named across Bible-
// comparison videos/sites/articles), a different axis from the philosophy
// spectrum or the family tree. Every id must appear in exactly one tier; the
// four lists together are the full twenty-six.
const rawTiers: Tier[] = [
  {
    number: 1,
    name: "The default seven",
    description:
      "Show up in nearly every list, regardless of the reviewer's audience or lean — the safe, no-explanation-needed recommendations.",
    ids: ["niv", "esv", "nlt", "nasb", "csb", "nkjv", "kjv"],
  },
  {
    number: 2,
    name: "Named specialists",
    description:
      "Never in a casual top five, but any content that goes one level deeper reaches for these by name, each for one specific, real reason.",
    ids: ["nrsvue", "net", "lsb", "amp", "ceb"],
  },
  {
    number: 3,
    name: "Enthusiast and reference picks",
    description:
      "Legitimate, but largely invisible outside content that exists specifically to be comprehensive — the kind this site itself is.",
    ids: ["bsb", "web", "isv", "gw", "mev", "leb", "voice", "lsv", "msb"],
  },
  {
    number: 4,
    name: "Purpose-built, not general-purpose",
    description:
      "Always recommended for one particular use — a kids’ Bible, an ESL ministry, a new believer, a devotional read-through — and genuinely well known within that lane, but never someone’s general or study Bible.",
    ids: ["nirv", "ncv", "cev", "gnt", "message"],
  },
];

// Within each tier, chips run in the site's usual most-literal-to-freest
// order (the same "literal" ranking that /, /verses, and the family tree all
// key off), not the arbitrary order they happened to be typed in.
const literalOrder =
  rankingCategories.find((c) => c.slug === "literal")?.entries.map((e) => e.id) ?? [];
const literalRank = (id: string) => {
  const i = literalOrder.indexOf(id);
  return i === -1 ? literalOrder.length : i;
};
const tiers: Tier[] = rawTiers.map((tier) => ({
  ...tier,
  ids: [...tier.ids].sort((a, b) => literalRank(a) - literalRank(b)),
}));

// Visual weight steps down from tier 1 to tier 4 through a left accent bar
// (thick gold, to thick navy, to thin navy, to a plain dashed outline) plus a
// matching badge and heading size — several small signals rather than one
// blunt one, so the step-down doesn't hinge entirely on how dark a card's
// fill is. All four cards stay white/near-white: a full-bleed dark card read
// as overpowering, especially next to how much navy text the rest of the
// site already uses for translation names and headings. Deliberately not the
// philosophy spectrum's indigo/teal/amber palette either — this is a
// different axis (recognition, not translation method).
const styles = [
  {
    indent: "",
    card: "border border-neutral-200 border-l-[6px] border-l-gild-500 bg-white shadow-sm",
    badge: "bg-gild-600 text-white",
    heading: "text-xl text-brand-900",
    body: "text-neutral-600",
  },
  {
    indent: "sm:ml-6",
    card: "border border-neutral-200 border-l-[6px] border-l-brand-500 bg-white",
    badge: "bg-brand-600 text-white",
    heading: "text-lg text-brand-900",
    body: "text-neutral-600",
  },
  {
    indent: "sm:ml-12",
    card: "border border-neutral-200 border-l-4 border-l-brand-200 bg-white",
    badge: "border border-brand-200 bg-brand-50 text-brand-700",
    heading: "text-lg text-brand-900",
    body: "text-neutral-600",
  },
  {
    indent: "sm:ml-[4.5rem]",
    card: "border border-dashed border-neutral-300 bg-neutral-50/60",
    badge: "border border-neutral-300 bg-white text-neutral-400",
    heading: "text-base text-brand-900",
    body: "text-neutral-500",
  },
];

const chipClass =
  "rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-sm font-medium text-brand-900 transition-colors hover:border-gild-300 hover:bg-gild-50";

export default function TranslationTiers() {
  return (
    <div className="space-y-4">
      {tiers.map((tier, i) => {
        const s = styles[i];
        return (
          <div key={tier.number} className={s.indent}>
            <div className={`flex items-start gap-4 rounded-xl p-5 sm:p-6 ${s.card}`}>
              <span
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full font-display text-base font-semibold ${s.badge}`}
              >
                {tier.number}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className={`font-display font-semibold ${s.heading}`}>{tier.name}</h3>
                <p className={`mt-1.5 max-w-xl text-sm leading-relaxed ${s.body}`}>
                  {tier.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {tier.ids.map((id) => {
                    const t = getTranslation(id);
                    if (!t) return null;
                    return (
                      <Tooltip key={id} text={t.name}>
                        <Link href={`/translations/${id}`} className={chipClass}>
                          {t.abbreviation}
                        </Link>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
