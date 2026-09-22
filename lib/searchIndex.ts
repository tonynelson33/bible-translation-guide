import { translations } from "./data";
import { translationProfiles } from "./translationProfiles";
import { slugifyGlossaryTerm } from "./glossarySlug";

export type SearchItemType = "Translation" | "Question" | "Glossary" | "Page";

export type SearchItem = {
  type: SearchItemType;
  title: string;
  subtitle?: string;
  href: string;
  /** Extra text matched against but not shown — e.g. a translation's tagline. */
  keywords?: string;
};

const translationItems: SearchItem[] = translations.map((t) => ({
  type: "Translation",
  title: t.abbreviation,
  subtitle: t.name,
  href: `/translations/${t.id}`,
  keywords: translationProfiles[t.id]?.tagline,
}));

/**
 * Question id + text, one entry per app/faq/page.tsx item, grouped the same
 * way that page groups them. Hand-kept in step with that file rather than
 * imported from it: app/faq/page.tsx exports `metadata`, and Next.js refuses
 * to bundle any file that does into a client component's module graph (which
 * this reaches, via SiteSearch) — see lib/glossarySlug.ts for the same
 * constraint on the glossary side. Update this list when a question is
 * added, removed, or reworded there.
 */
const faqQuestions: { id: string; q: string; group: string }[] = [
  { id: "most-accurate", q: "What's the most accurate translation?", group: "Choosing a translation" },
  {
    id: "formal-vs-dynamic",
    q: "Formal vs. dynamic equivalence — what does that mean in practice?",
    group: "Choosing a translation",
  },
  {
    id: "which-for",
    q: "Which translation should I use — for study, for daily reading, for a child?",
    group: "Choosing a translation",
  },
  {
    id: "paraphrase",
    q: "What's the difference between a translation and a paraphrase?",
    group: "Choosing a translation",
  },
  { id: "removed-verses", q: "Did modern Bibles remove verses?", group: "Where the text comes from" },
  {
    id: "text-types",
    q: "Textus Receptus, Critical Text, Majority Text — what are those?",
    group: "Where the text comes from",
  },
  {
    id: "majority-text",
    q: "Does any translation use the Majority Text?",
    group: "Where the text comes from",
  },
  {
    id: "footnotes",
    q: "What do the “some manuscripts read…” footnotes mean?",
    group: "Where the text comes from",
  },
  {
    id: "apocrypha",
    q: "What about the Apocrypha? And why is this site Protestant-scoped?",
    group: "Where the text comes from",
  },
  {
    id: "koine-greek",
    q: "The New Testament was written in Koine Greek — what does that mean, and does it favor plainer translations?",
    group: "Where the text comes from",
  },
  { id: "why-so-many", q: "Why are there so many English translations?", group: "The bigger picture" },
  {
    id: "why-these-26",
    q: "Why these twenty-six translations, and not others?",
    group: "The bigger picture",
  },
  {
    id: "kjv-only",
    q: "What is KJV-onlyism? Is the King James the only reliable Bible?",
    group: "The bigger picture",
  },
  {
    id: "kjv-1611-vs-today",
    q: "Is the King James Version sold today the same as the 1611 text?",
    group: "The bigger picture",
  },
  { id: "who-translates", q: "Who actually translates the Bible?", group: "The bigger picture" },
];

const questionItems: SearchItem[] = faqQuestions.map((item) => ({
  type: "Question",
  title: item.q,
  subtitle: item.group,
  href: `/faq#${item.id}`,
}));

/**
 * Term + group, one entry per app/glossary/page.tsx term — same hand-kept
 * constraint as faqQuestions above (that page also exports `metadata`).
 * Slugs are computed with the same slugifyGlossaryTerm() the glossary page
 * itself uses for its anchors, so a hand-typed mismatch here can't produce a
 * dead link even if the term list itself drifts.
 */
const glossaryTerms: { term: string; group: string }[] = [
  { term: "Formal equivalence (word-for-word)", group: "How translations are made" },
  { term: "Dynamic equivalence (thought-for-thought)", group: "How translations are made" },
  { term: "Optimal / mediating equivalence", group: "How translations are made" },
  { term: "Translation committee", group: "How translations are made" },
  { term: "Gender-inclusive language", group: "How translations are made" },
  { term: "Paraphrase", group: "How translations are made" },
  { term: "The autographs", group: "Where the text comes from" },
  { term: "Textual criticism", group: "Where the text comes from" },
  { term: "Manuscript", group: "Where the text comes from" },
  { term: "Textus Receptus", group: "Where the text comes from" },
  { term: "Critical Text", group: "Where the text comes from" },
  { term: "Majority Text", group: "Where the text comes from" },
  { term: "Masoretic Text", group: "Where the text comes from" },
  { term: "Septuagint (LXX)", group: "Where the text comes from" },
  { term: "Dead Sea Scrolls", group: "Where the text comes from" },
  { term: "Vulgate", group: "Where the text comes from" },
  { term: "Study Bible", group: "Editions and formats" },
  { term: "Red-letter edition", group: "Editions and formats" },
  { term: "Interlinear", group: "Editions and formats" },
  { term: "Lectionary", group: "Editions and formats" },
  { term: "Deuterocanonical books (the Apocrypha)", group: "Editions and formats" },
];

const glossaryItems: SearchItem[] = glossaryTerms.map((item) => ({
  type: "Glossary",
  title: item.term,
  subtitle: item.group,
  href: `/glossary#${slugifyGlossaryTerm(item.term)}`,
}));

// Hand-written since these are just the site's own routes — there's no single
// source of titles + descriptions to derive from the way the other three
// categories have (data/translations.json, the FAQ groups, the glossary groups).
const pageItems: SearchItem[] = [
  {
    type: "Page",
    title: "Full Comparison",
    subtitle: "The full table — philosophy, reading level, textual basis, publisher, and more.",
    href: "/compare",
  },
  {
    type: "Page",
    title: "All Translations",
    subtitle: "All twenty-six, alphabetically, with a one-sentence summary of each.",
    href: "/translations",
  },
  {
    type: "Page",
    title: "Verses",
    subtitle: "Read a popular passage side by side in all twenty-six translations.",
    href: "/verses",
  },
  {
    type: "Page",
    title: "Rankings",
    subtitle: "Best for daily reading, preaching, memorization, or serious study.",
    href: "/rankings",
  },
  {
    type: "Page",
    title: "Bible Translation Tree",
    subtitle: "How the twenty-six connect, or don't, laid out as one diagram.",
    href: "/history#tree",
  },
  {
    type: "Page",
    title: "Church Finder",
    subtitle: "Look up a U.S. church's Bible translation, or add one that's missing.",
    href: "/church-finder",
  },
  {
    type: "Page",
    title: "How We Got the English Bible",
    subtitle: "Tyndale, the King James Version, and six hundred years of history.",
    href: "/history",
  },
  {
    type: "Page",
    title: "Translation Differences",
    subtitle: "The specific verses where translations visibly differ, and why.",
    href: "/differences",
  },
  {
    type: "Page",
    title: "Videos",
    subtitle: "A curated set of videos on where the English Bible came from.",
    href: "/blog",
  },
  {
    type: "Page",
    title: "Glossary",
    subtitle: "Plain definitions of the terms that come up comparing translations.",
    href: "/glossary",
  },
  {
    type: "Page",
    title: "FAQ",
    subtitle: "Straight answers to the questions people ask most.",
    href: "/faq",
  },
  {
    type: "Page",
    title: "Where to Buy",
    subtitle: "Publisher stores, retailers, and free places to read each translation.",
    href: "/buy",
  },
  {
    type: "Page",
    title: "About This Site",
    subtitle: "What this is, the perspective behind it, and how it's made.",
    href: "/about",
  },
];

export const searchIndex: SearchItem[] = [
  ...translationItems,
  ...questionItems,
  ...glossaryItems,
  ...pageItems,
];

/**
 * Plain substring matching over title/subtitle/keywords — deliberately not a
 * fuzzy-search library. The whole index is under a hundred short items, so a
 * simple scan is instant and a title-prefix match ("nir" -> NIrV) is exactly
 * what a couple of typed letters should surface first.
 */
export function searchItems(query: string, index: SearchItem[] = searchIndex): SearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const scored = index
    .map((item) => ({ item, score: scoreMatch(item, q) }))
    .filter(({ score }) => score < NO_MATCH);

  scored.sort((a, b) => a.score - b.score);
  return scored.map(({ item }) => item);
}

const NO_MATCH = 99;

function scoreMatch(item: SearchItem, q: string): number {
  const title = item.title.toLowerCase();
  if (title === q) return 0;
  if (title.startsWith(q)) return 1;
  if (title.includes(q)) return 2;
  if (item.subtitle?.toLowerCase().includes(q)) return 3;
  if (item.keywords?.toLowerCase().includes(q)) return 4;
  return NO_MATCH;
}
