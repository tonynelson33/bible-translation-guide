export type Philosophy = "Formal" | "Dynamic" | "Optimal" | "Mixed" | "Paraphrase";
export type TextualBasis = "Critical Text" | "Textus Receptus" | "Majority Text" | "Textus Receptus / Majority Text";
export type GenderApproach = "Traditional" | "Moderate" | "Inclusive";
/** Can a printed Bible be bought? "Limited" = out of print or hard to find (see printNote in lib/buyLinks.ts). */
export type PrintEdition = "Yes" | "Limited" | "No";

export interface OtMarking {
  marks: boolean;
  method?: "Bold" | "Small caps" | "ALL CAPS";
}

export interface Translation {
  id: string; // slug, e.g. "esv"
  name: string; // full name
  abbreviation: string; // e.g. "ESV"
  latestRevisionYear: number;
  firstPublishedYear: number;
  gradeLevel: string;
  philosophy: Philosophy;
  textualBasis: TextualBasis;
  publisher: string;
  quoteLimit: string;
  printEdition: PrintEdition;
  /** Short qualifier shown under the print-edition mark, e.g. "Planned 2027". */
  printEditionLabel?: string;
  genderApproach: GenderApproach;
  genderApproachLabel?: string; // display override for the pill, when the bare bucket name needs qualifying
  redLetter: boolean;
  otMarking: OtMarking;
  italicizesTranslatorWords: boolean;
  capitalizesDeityPronouns: boolean;
  quotationMarksForDialogue: boolean;
  /** Field names flagged for manual verification before launch. */
  verifyFields?: string[];
}
