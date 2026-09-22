import Link from "next/link";
import { getTranslation } from "@/lib/data";

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
const tiers: Tier[] = [
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

// Visual weight steps down from tier 1 to tier 4 (darkest, boldest card
// first; quietest, dashed-border card last), and each card indents further
// right on sm+ so the stack reads as a literal staircase — narrower and less
// prominent the further you read. Deliberately not the philosophy spectrum's
// indigo/teal/amber palette: this is a different axis (recognition, not
// translation method), and reusing those colors would wrongly imply a link
// between the two.
const styles = [
  {
    indent: "",
    card: "bg-brand-800 border border-brand-800",
    numeral: "text-brand-600",
    heading: "text-white",
    body: "text-brand-100",
    chip: "border-white/20 bg-white/10 text-white hover:border-white/40 hover:bg-white/20",
  },
  {
    indent: "sm:ml-6",
    card: "bg-brand-50 border border-brand-200",
    numeral: "text-brand-300",
    heading: "text-brand-900",
    body: "text-brand-800",
    chip: "border-brand-200 bg-white text-brand-800 hover:border-gild-300 hover:bg-gild-50",
  },
  {
    indent: "sm:ml-12",
    card: "bg-white border border-neutral-200",
    numeral: "text-neutral-300",
    heading: "text-brand-900",
    body: "text-neutral-600",
    chip: "border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-gild-300 hover:bg-gild-50",
  },
  {
    indent: "sm:ml-[4.5rem]",
    card: "bg-neutral-50/70 border border-dashed border-neutral-300",
    numeral: "text-neutral-300",
    heading: "text-brand-900",
    body: "text-neutral-500",
    chip: "border-neutral-200 bg-white/70 text-neutral-600 hover:border-gild-300 hover:bg-gild-50",
  },
];

export default function TranslationTiers() {
  return (
    <div className="space-y-4">
      {tiers.map((tier, i) => {
        const s = styles[i];
        return (
          <div key={tier.number} className={s.indent}>
            <div className={`rounded-xl px-5 py-5 sm:px-7 sm:py-6 ${s.card}`}>
              <div className="flex items-start gap-4">
                <span
                  aria-hidden="true"
                  className={`font-display text-4xl font-light leading-none sm:text-5xl ${s.numeral}`}
                >
                  {tier.number}
                </span>
                <div className="min-w-0 flex-1 pt-1">
                  <h3 className={`font-display text-lg font-semibold sm:text-xl ${s.heading}`}>
                    {tier.name}
                  </h3>
                  <p className={`mt-1.5 max-w-xl text-sm leading-relaxed ${s.body}`}>
                    {tier.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {tier.ids.map((id) => {
                      const t = getTranslation(id);
                      if (!t) return null;
                      return (
                        <Link
                          key={id}
                          href={`/translations/${id}`}
                          className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors ${s.chip}`}
                        >
                          {t.abbreviation}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
