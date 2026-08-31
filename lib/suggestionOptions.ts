export interface Option {
  value: string;
  label: string;
}

/**
 * Denomination choices for the "suggest a correction" / "add a church" forms.
 *
 * This list is a mutually-exclusive US master taxonomy (32 entries), NOT a
 * mirror of churches.category — several labels split or merge the underlying
 * buckets. Where a label maps cleanly onto an existing/derivable category slug
 * (see lib/churches.ts's humanizeCategory, which builds its label map from this
 * list, and scripts/add-refined-category-column.js), the `value` is that slug so
 * an edit suggestion can be merged without a translation step. `non_denominational`
 * carries a descriptive slug that starts with zero rows and gets populated by
 * manual review.
 *
 * Merged 2026-08-30 (all were empty or unenforceable-by-name):
 *   - "Church of God (Holiness)" + "Church of God (Pentecostal)" → one "Church of God".
 *     Bare "Church of God" names can't be told apart (Anderson/Holiness vs Cleveland/
 *     Pentecostal), and labelling every one "Pentecostal" mislabels the Anderson churches.
 *   - "Non-denominational (Contemporary/Charismatic)" + "(Traditional/Mainstream)" → one
 *     "Non-denominational". A submitter can't reliably pick between the two.
 *
 * Added 2026-08-30: "Evangelical Free Church (EFCA)" — ~1,600 congregations nationally,
 * many named "X Community Church" / "X Evangelical Free Church" and previously landing in
 * "church_cathedral" or being mislabelled. Its own category slug so suggestions merge cleanly.
 *
 * Relabelled 2026-08-31 (labels only — slugs unchanged, no data move):
 *   - "Bible Church (Independent / Dispensational)" → "Bible Church (Independent)".
 *     Dispensationalism is common in the movement but not universal.
 *   - "Baptist (Mainstream / Southern / American)" → "Baptist (Southern / Independent / other)".
 *     Interim wording. The bucket is a name-catch catch-all (~95% of its ~70k rows carry no
 *     sub-stream signal in the name); "/ other" keeps it from mislabelling the ABCUSA /
 *     moderate rows in it. A real Southern/SBC carve-out needs the SBC locator sync, not a label.
 *
 * Deliberately excluded: Latter Day Saints and Christian Science (removed from
 * the directory entirely — neither holds to historic Christian doctrine by any
 * mainstream tradition's definition); "church_cathedral" (the "not identified"
 * default); and the generic Pentecostal / Evangelical / Mission buckets, which
 * the 2026-08 overhaul folded into "church_cathedral" (they name a style, not a
 * body). Convents & Monasteries was deleted outright — not congregations.
 */
export const denominationOptions: Option[] = [
  { value: "anglican_episcopal_church", label: "Anglican / Episcopal" },
  { value: "assembly_of_god_church", label: "Assembly of God" },
  { value: "missionary_baptist_church", label: "Baptist (Historically Black / National)" },
  { value: "baptist_church", label: "Baptist (Southern / Independent / other)" },
  { value: "bible_church", label: "Bible Church (Independent)" },
  { value: "calvary_chapel_church", label: "Calvary Chapel" },
  { value: "catholic_church", label: "Catholic" },
  { value: "christian_missionary_alliance", label: "Christian & Missionary Alliance (CMA)" },
  { value: "church_of_christ", label: "Church of Christ" },
  { value: "church_of_god", label: "Church of God" },
  { value: "church_of_god_in_christ", label: "Church of God in Christ (COGIC)" },
  { value: "church_of_the_brethren", label: "Church of the Brethren" },
  { value: "congregational_church", label: "Congregational (UCC)" },
  { value: "disciples_of_christ_church", label: "Disciples of Christ" },
  { value: "evangelical_free_church", label: "Evangelical Free Church (EFCA)" },
  { value: "foursquare_church", label: "Foursquare" },
  { value: "lutheran_church", label: "Lutheran" },
  { value: "mennonite_church", label: "Mennonite / Amish" },
  { value: "methodist_ame", label: "Methodist (Historically Black / AME)" },
  { value: "methodist_church", label: "Methodist / Wesleyan (Mainline & Global)" },
  { value: "nazarene_church", label: "Nazarene" },
  { value: "non_denominational", label: "Non-denominational" },
  { value: "orthodox_church", label: "Orthodox (Eastern / Greek / Russian)" },
  { value: "oriental_orthodox_church", label: "Orthodox (Oriental / Coptic / Ethiopian)" },
  { value: "oneness_apostolic_church", label: "Pentecostal (Oneness / Apostolic)" },
  { value: "plymouth_brethren_church", label: "Plymouth Brethren / Christian Brethren" },
  { value: "presbyterian_church", label: "Presbyterian" },
  { value: "quaker_friends", label: "Quaker (Friends)" },
  { value: "reformed_church", label: "Reformed" },
  { value: "salvation_army", label: "Salvation Army" },
  { value: "adventist_church", label: "Seventh-day Adventist" },
  { value: "vineyard_church", label: "Vineyard" },
];

/**
 * Bible translation choices — deliberately broader than the 9 translations this
 * site profiles in depth, since a church may use one this site doesn't cover.
 */
export const translationOptions: Option[] = [
  { value: "AMP", label: "AMP — Amplified Bible" },
  { value: "CEB", label: "CEB — Common English Bible" },
  { value: "CEV", label: "CEV — Contemporary English Version" },
  { value: "CSB", label: "CSB — Christian Standard Bible" },
  { value: "Douay-Rheims", label: "Douay-Rheims" },
  { value: "EHV", label: "EHV — Evangelical Heritage Version" },
  { value: "ESV", label: "ESV — English Standard Version" },
  { value: "GNT", label: "GNT — Good News Translation" },
  { value: "KJV", label: "KJV — King James Version" },
  { value: "LSB", label: "LSB — Legacy Standard Bible" },
  { value: "NABRE", label: "NABRE — New American Bible, Revised Edition" },
  { value: "NASB", label: "NASB — New American Standard Bible" },
  { value: "NET", label: "NET — New English Translation" },
  { value: "NIV", label: "NIV — New International Version" },
  { value: "NJB", label: "NJB — New Jerusalem Bible" },
  { value: "NKJV", label: "NKJV — New King James Version" },
  { value: "NLT", label: "NLT — New Living Translation" },
  { value: "NRSV", label: "NRSV — New Revised Standard Version" },
  { value: "NRSVue", label: "NRSVue — New Revised Standard Version, Updated Edition" },
  { value: "OSB", label: "OSB — Orthodox Study Bible" },
  { value: "RSV", label: "RSV — Revised Standard Version" },
  { value: "WEB", label: "WEB — World English Bible" },
];
