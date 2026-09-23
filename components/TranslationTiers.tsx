import Link from "next/link";
import { getTranslation } from "@/lib/data";
import { rankingCategories } from "@/lib/rankings";
import { philosophyGlossary } from "@/lib/glossary";
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
      "Never in a casual top five. Content that goes one level deeper reaches for these by name — each for one specific, real reason.",
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
      "Always recommended for one particular use — a kids’ Bible, an ESL ministry, a new believer, a devotional read-through. Genuinely well known within that lane. Never someone’s general or study Bible.",
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
// (thick gold, to thick navy, to thin navy, to thin neutral grey — color
// draining out entirely by the last tier) plus a matching badge and heading
// size — several small signals rather than one blunt one, so the step-down
// doesn't hinge entirely on how dark a card's fill is. All four cards stay
// white/near-white: a full-bleed dark card read
// as overpowering, especially next to how much navy text the rest of the
// site already uses for translation names and headings. Deliberately not the
// philosophy spectrum's palette for the card itself — recognition tier and
// translation method are different axes. The chips inside each card are a
// different story: they're colored by philosophy (see chipClass below), same
// as everywhere else on the site, so both axes read at a glance without the
// card's own tier styling conflating them.
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
    // Same solid border + white card as tiers 1-3, just with no color left to
    // accent — grey standing in for gild/brand/brand is what "one step
    // further down" looks like once the palette runs out.
    card: "border border-neutral-200 border-l-4 border-l-neutral-400 bg-white",
    badge: "border border-neutral-300 bg-white text-neutral-400",
    heading: "text-base text-brand-900",
    body: "text-neutral-500",
  },
];

const chipClass =
  "rounded-full px-3 py-1 text-sm font-medium transition-shadow hover:shadow-sm hover:ring-1 hover:ring-inset hover:ring-black/10";

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
                      <Tooltip key={id} text={`${t.name} — ${t.philosophy}`}>
                        <Link
                          href={`/translations/${id}`}
                          className={`${chipClass} ${philosophyGlossary[t.philosophy].className}`}
                        >
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
