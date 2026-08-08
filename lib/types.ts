export type Philosophy = "Formal" | "Dynamic" | "Optimal" | "Mixed";
export type TextualBasis = "Critical text" | "Textus Receptus";
export type GenderApproach = "Traditional" | "Moderate" | "Inclusive";

export interface OtMarking {
  marks: boolean;
  method?: "Bold" | "Small caps" | "ALL CAPS";
}

export interface VerseApiConfig {
  /** Which provider adapter (lib/verseProviders.ts) to use for live verse fetches. */
  provider: "bible-api" | "esv-api" | "net-bible" | "api-bible" | "unavailable";
  /** api-bible only: the Bible ID for this translation on scripture.api.bible. */
  apiBibleId?: string;
  /** Human-readable note on availability/gaps, shown if fetch is not possible. */
  note?: string;
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
  genderApproach: GenderApproach;
  genderApproachLabel?: string; // display override, e.g. "Moderate (2020)"
  redLetter: boolean;
  otMarking: OtMarking;
  italicizesTranslatorWords: boolean;
  capitalizesDeityPronouns: boolean;
  quotationMarksForDialogue: boolean;
  /** Field names flagged for manual verification before launch. */
  verifyFields?: string[];
  verseApi: VerseApiConfig;
}
