/**
 * Content for /choose. Purpose-first: most people arrive asking "which one
 * should I read?", and want a short path to a shortlist rather than the full
 * rankings. Picks are consistent with lib/rankings.ts; the reasoning is
 * grounded in each translation's profile.
 */

export interface Pick {
  /** Translation id (data/translations.json). */
  id: string;
  why: string;
}

export interface ChooseScenario {
  id: string;
  /** "If you're reading …" */
  situation: string;
  lead: string;
  picks: Pick[];
  /** Optional "and not …" aside. */
  caveat?: string;
}

export const scenarios: ChooseScenario[] = [
  {
    id: "study",
    situation: "for close study",
    lead:
      "You want to see the shape of the original — repeated words, sentence structure, the seams in an argument. Reach for a formal translation, and keep a readable one open beside it to check your sense of a passage.",
    picks: [
      { id: "esv", why: "Formal and word-conscious, but still readable for long stretches — the usual first choice for study that isn't seminary-level." },
      { id: "nasb", why: "The long-standing benchmark for literalness, and the standard reference for word studies. Stiffer to read." },
      { id: "net", why: "Its 60,000 translator notes show the reasoning behind nearly every hard call — a study tool in itself." },
    ],
    caveat:
      "The LSB is even more consistent than the NASB if that's what you want; the NLT is the wrong tool here — accurate, but it has already made the interpretive calls for you.",
  },
  {
    id: "daily",
    situation: "for daily reading",
    lead:
      "You want to read chapters at a time without friction, and trust that the meaning is sound. Any of these will carry you through a book of the Bible comfortably.",
    picks: [
      { id: "niv", why: "The most widely used modern translation — accurate, unobtrusive, and easy to read at length." },
      { id: "csb", why: "A shade more literal than the NIV while still reading naturally; strong for reading aloud to yourself." },
      { id: "nlt", why: "The smoothest of the twelve. Best when you want momentum and clarity over precision." },
    ],
  },
  {
    id: "aloud",
    situation: "for reading aloud in a church",
    lead:
      "The text has to land on first hearing, carry dignity, and be familiar enough that visitors aren't thrown. This is partly a question of what your congregation already uses.",
    picks: [
      { id: "esv", why: "Widely adopted for public reading in evangelical churches; measured, formal cadence." },
      { id: "csb", why: "Explicitly designed to be read aloud without stumbling — short clauses, natural stress." },
      { id: "niv", why: "The safe default: more people in the room will have grown up on its wording than any other." },
    ],
  },
  {
    id: "memorization",
    situation: "for memorizing Scripture",
    lead:
      "You want precise, consistent wording and a cadence that sticks. It also helps to pick what the people around you quote, so the words you learn match the words you hear.",
    picks: [
      { id: "kjv", why: "Its rhythm is built for the ear, and many of the verses you'll memorize are already lodged in this wording." },
      { id: "nkjv", why: "The KJV's cadence and word order in grammar you don't have to translate in your head." },
      { id: "esv", why: "The best modern balance of precision and rhythm; widely memorized in evangelical circles." },
    ],
  },
  {
    id: "new",
    situation: "for a child, or someone new to the Bible",
    lead:
      "The goal is that they keep reading. A lower reading level and plain sentence structure matter more here than matching the Greek word order.",
    picks: [
      { id: "nlt", why: "Reads at about a sixth-grade level in natural English — the usual recommendation for a first Bible." },
      { id: "ceb", why: "Aimed at a seventh-grade level by a broad denominational committee; common in mainline churches." },
      { id: "niv", why: "A little more formal than the NLT, but everywhere — a first Bible they won't have to trade in later." },
    ],
  },
  {
    id: "kjv-bridge",
    situation: "if you love the King James but want a bridge",
    lead:
      "You're used to the KJV's text and cadence and don't want to lose either — you just want the archaic grammar gone.",
    picks: [
      { id: "nkjv", why: "The same Textus Receptus base and much of the KJV's phrasing, with modern grammar. The natural next step." },
      { id: "esv", why: "A modern-critical-text translation, but squarely in the formal KJV–RSV line — a bigger step, with more updated wording." },
    ],
    caveat:
      "The NKJV keeps the KJV's underlying Greek text; the ESV doesn't. If that distinction matters to you, it's covered on the differences page.",
  },
];
