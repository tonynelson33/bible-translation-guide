/**
 * Canonical (Protestant, 66-book) ordering for verse references like
 * "John 3:16" or "1 Corinthians 10:13". Used to sort the verse-comparison
 * picker so it reads in Bible order.
 */

export const BIBLE_BOOKS = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
  "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
  "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra",
  "Nehemiah", "Esther", "Job", "Psalms", "Proverbs",
  "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations",
  "Ezekiel", "Daniel", "Hosea", "Joel", "Amos",
  "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk",
  "Zephaniah", "Haggai", "Zechariah", "Malachi",
  "Matthew", "Mark", "Luke", "John", "Acts",
  "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians",
  "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy",
  "2 Timothy", "Titus", "Philemon", "Hebrews", "James",
  "1 Peter", "2 Peter", "1 John", "2 John", "3 John",
  "Jude", "Revelation",
];

const BOOK_ALIASES: Record<string, string> = {
  Psalm: "Psalms",
  "Song of Songs": "Song of Solomon",
  Canticles: "Song of Solomon",
  Qoheleth: "Ecclesiastes",
};

const BOOK_INDEX = new Map(BIBLE_BOOKS.map((b, i) => [b, i]));

/** [bookIndex, chapter, verse]; unknown books sort to the end. */
export function referenceSortKey(reference: string): [number, number, number] {
  const m = reference.trim().match(/^((?:[1-3]\s)?[A-Za-z][A-Za-z ]*?)\s+(\d+):(\d+)/);
  if (!m) return [999, 0, 0];
  const book = BOOK_ALIASES[m[1].trim()] ?? m[1].trim();
  const idx = BOOK_INDEX.get(book);
  return [idx ?? 998, Number(m[2]), Number(m[3])];
}

export function compareReferences(a: string, b: string): number {
  const ka = referenceSortKey(a);
  const kb = referenceSortKey(b);
  return ka[0] - kb[0] || ka[1] - kb[1] || ka[2] - kb[2];
}

/** Coarse grouping for the verse picker: Old Testament / Gospels / Acts & the Letters. */
export function referenceSection(reference: string): string {
  const [book] = referenceSortKey(reference);
  if (book <= 38) return "Old Testament";
  if (book <= 42) return "Gospels"; // Matthew, Mark, Luke, John
  return "Acts & the Letters";
}
