export interface Option {
  value: string;
  label: string;
}

/**
 * Denomination choices for the "suggest a correction" / "add a church" forms.
 *
 * This list is a mutually-exclusive US master taxonomy (33 entries), NOT a
 * mirror of churches.category — several labels split or merge the underlying
 * buckets. Where a label maps cleanly onto an existing/derivable category slug
 * (see lib/churches.ts's humanizeCategory, which builds its label map from this
 * list, and scripts/add-refined-category-column.js), the `value` is that slug so
 * an edit suggestion can be merged without a translation step. Labels the source
 * data can't distinguish from a name (both Non-denominational tiers,
 * church_of_god_holiness, plymouth_brethren_church) carry a descriptive slug
 * that starts with zero rows and gets populated by manual review.
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
  { value: "baptist_church", label: "Baptist (Mainstream / Southern / American)" },
  { value: "bible_church", label: "Bible Church (Independent / Dispensational)" },
  { value: "calvary_chapel_church", label: "Calvary Chapel" },
  { value: "catholic_church", label: "Catholic" },
  { value: "christian_missionary_alliance", label: "Christian & Missionary Alliance (CMA)" },
  { value: "church_of_christ", label: "Church of Christ" },
  { value: "church_of_god_holiness", label: "Church of God (Holiness / Traditional)" },
  { value: "church_of_god", label: "Church of God (Pentecostal)" },
  { value: "church_of_god_in_christ", label: "Church of God in Christ (COGIC)" },
  { value: "church_of_the_brethren", label: "Church of the Brethren" },
  { value: "congregational_church", label: "Congregational (UCC)" },
  { value: "disciples_of_christ_church", label: "Disciples of Christ" },
  { value: "foursquare_church", label: "Foursquare" },
  { value: "lutheran_church", label: "Lutheran" },
  { value: "mennonite_church", label: "Mennonite / Amish" },
  { value: "methodist_ame", label: "Methodist (Historically Black / AME)" },
  { value: "methodist_church", label: "Methodist / Wesleyan (Mainline & Global)" },
  { value: "nazarene_church", label: "Nazarene" },
  { value: "non_denominational_charismatic", label: "Non-denominational (Contemporary / Charismatic)" },
  { value: "non_denominational", label: "Non-denominational (Traditional / Mainstream)" },
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
