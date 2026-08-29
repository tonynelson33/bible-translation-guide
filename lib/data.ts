import translationsData from "@/data/translations.json";
import versesData from "@/data/verses.json";
import type { Translation } from "./types";

export interface SampleVerse {
  id: string;
  reference: string;
}

export const translations = translationsData as Translation[];
export const sampleVerses = versesData as SampleVerse[];

export function getTranslation(id: string): Translation | undefined {
  return translations.find((t) => t.id === id);
}

export function getSampleVerse(id: string): SampleVerse | undefined {
  return sampleVerses.find((v) => v.id === id);
}
