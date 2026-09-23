import type { GenderApproach, Philosophy } from "./types";

interface GlossaryEntry {
  description: string;
  className: string;
}

// Strips the bg-* token from a glossary entry's className, for the rare spot
// (the /verses row label) too width-constrained for a filled pill — just the
// philosophy color carried on the text itself.
export function textOnlyClass(className: string): string {
  return className
    .split(" ")
    .filter((c) => !c.startsWith("bg-"))
    .join(" ");
}

export const philosophyGlossary: Record<Philosophy, GlossaryEntry> = {
  Formal: {
    description:
      "Formal (word-for-word) equivalence: translates as closely as possible to the original words and grammatical structure of the Hebrew, Aramaic, and Greek text.",
    className: "bg-blue-50 text-blue-700",
  },
  Dynamic: {
    description:
      "Dynamic (thought-for-thought) equivalence: prioritizes natural, readable English phrasing that conveys the meaning of the original text over matching its exact wording.",
    className: "bg-amber-50 text-amber-700",
  },
  Optimal: {
    description:
      "Optimal equivalence: a hybrid approach that leans formal or dynamic verse-by-verse, depending on which best balances accuracy and readability.",
    className: "bg-teal-50 text-teal-700",
  },
  Mixed: {
    description:
      "Mixed approach: combines translation methods depending on context — generally literal, with extensive translator notes explaining alternate readings and word choices.",
    // Shares the teal "Balanced" band with Optimal — both sit between formal
    // and dynamic on the spectrum; the descriptions keep them distinct.
    className: "bg-teal-50 text-teal-700",
  },
  Paraphrase: {
    description:
      "Paraphrase: restates the text's meaning freely in the translator's own words, well beyond thought-for-thought translation — a distinct category from the other four, not simply the far end of the dynamic scale.",
    className: "bg-stone-100 text-stone-700",
  },
};

// Blue / green / amber, echoing the philosophy spectrum's own blue-to-amber
// run (Formal/Balanced/Dynamic in lib/glossary.ts's philosophyGlossary and
// throughout the diagrams) — traditional through inclusive reads as the same
// kind of near-to-far spread, just on the gender-language axis instead of the
// word-choice one. Green rather than the philosophy spectrum's teal, so a
// translation's two pills never coincidentally match colors and read as one
// signal when they're actually two independent ones.
export const genderApproachGlossary: Record<GenderApproach, GlossaryEntry> = {
  Traditional: {
    description:
      "Traditional: retains generic masculine terms (e.g., \"he,\" \"man,\" \"brothers\") as used in the original languages, without adjusting wording for gender-neutral reading.",
    className: "bg-blue-50 text-blue-700",
  },
  Moderate: {
    description:
      "Moderate: uses gender-inclusive language for people in general (e.g., \"brothers and sisters,\" \"anyone\") where the original clearly intends both genders, while keeping masculine language where the text is gender-specific.",
    className: "bg-green-50 text-green-700",
  },
  Inclusive: {
    description:
      "Inclusive: more broadly adopts gender-neutral phrasing wherever the original language's audience is understood to include both genders.",
    className: "bg-amber-50 text-amber-700",
  },
};
