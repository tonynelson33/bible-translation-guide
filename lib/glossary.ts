import type { GenderApproach, Philosophy } from "./types";

interface GlossaryEntry {
  description: string;
  className: string;
}

export const philosophyGlossary: Record<Philosophy, GlossaryEntry> = {
  Formal: {
    description:
      "Formal (word-for-word) equivalence: translates as closely as possible to the original words and grammatical structure of the Hebrew, Aramaic, and Greek text.",
    className: "bg-indigo-50 text-indigo-700",
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
    className: "bg-purple-50 text-purple-700",
  },
};

export const genderApproachGlossary: Record<GenderApproach, GlossaryEntry> = {
  Traditional: {
    description:
      "Traditional: retains generic masculine terms (e.g., \"he,\" \"man,\" \"brothers\") as used in the original languages, without adjusting wording for gender-neutral reading.",
    className: "bg-slate-100 text-slate-700",
  },
  Moderate: {
    description:
      "Moderate: uses gender-inclusive language for people in general (e.g., \"brothers and sisters,\" \"anyone\") where the original clearly intends both genders, while keeping masculine language where the text is gender-specific.",
    className: "bg-sky-50 text-sky-700",
  },
  Inclusive: {
    description:
      "Inclusive: more broadly adopts gender-neutral phrasing wherever the original language's audience is understood to include both genders.",
    className: "bg-pink-50 text-pink-700",
  },
};
