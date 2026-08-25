export interface Option {
  value: string;
  label: string;
}

/**
 * Denomination choices for the "suggest a correction" / "add a church" forms.
 * The first block matches the category slugs actually used in churches.category
 * (see CLAUDE.md / lib/churches.ts's humanizeCategory) so a suggestion can map
 * cleanly onto the existing column; the second block adds common denominations
 * not yet represented in that taxonomy. "church_cathedral" (the source data's
 * generic "not identified" default) is deliberately excluded — it's not a real
 * answer someone would suggest.
 */
export const denominationOptions: Option[] = [
  { value: "baptist_church", label: "Baptist" },
  { value: "methodist_church", label: "Methodist" },
  { value: "catholic_church", label: "Catholic" },
  { value: "lutheran_church", label: "Lutheran" },
  { value: "church_of_christ", label: "Church of Christ" },
  { value: "presbyterian_church", label: "Presbyterian" },
  { value: "latter_day_saints_church", label: "Latter Day Saints" },
  { value: "pentecostal_church", label: "Pentecostal" },
  { value: "assembly_of_god_church", label: "Assembly of God" },
  { value: "congregational_church", label: "Congregational" },
  { value: "adventist_church", label: "Adventist" },
  { value: "orthodox_church", label: "Orthodox" },
  { value: "episcopal_church", label: "Episcopal" },
  { value: "evangelical_church", label: "Evangelical" },
  { value: "anglican_church", label: "Anglican" },
  { value: "christian_science_church", label: "Christian Science" },
  { value: "disciples_of_christ_church", label: "Disciples of Christ" },
  { value: "convents_and_monasteries", label: "Convents and Monasteries" },
  { value: "mission", label: "Mission" },
  { value: "non_denominational", label: "Non-denominational" },
  { value: "reformed_church", label: "Reformed" },
  { value: "nazarene_church", label: "Nazarene" },
  { value: "wesleyan_church", label: "Wesleyan" },
  { value: "church_of_god_in_christ", label: "Church of God in Christ (COGIC)" },
  { value: "church_of_god_of_prophecy", label: "Church of God of Prophecy" },
  { value: "church_of_god", label: "Church of God (other)" },
  { value: "foursquare_church", label: "Foursquare" },
  { value: "vineyard_church", label: "Vineyard" },
  { value: "mennonite_church", label: "Mennonite" },
  { value: "quaker_friends", label: "Quaker (Friends)" },
  { value: "christian_missionary_alliance", label: "Christian & Missionary Alliance" },
  { value: "salvation_army", label: "Salvation Army" },
  { value: "unitarian_universalist", label: "Unitarian Universalist" },
  { value: "charismatic_church", label: "Charismatic" },
  { value: "community_church", label: "Community Church (non-denominational)" },
  { value: "other", label: "Other" },
  { value: "not_sure", label: "Not sure" },
];

/**
 * Bible translation choices — deliberately broader than the 9 translations this
 * site profiles in depth, since a church may use one this site doesn't cover.
 */
export const translationOptions: Option[] = [
  { value: "ESV", label: "ESV — English Standard Version" },
  { value: "KJV", label: "KJV — King James Version" },
  { value: "NIV", label: "NIV — New International Version" },
  { value: "NLT", label: "NLT — New Living Translation" },
  { value: "CSB", label: "CSB — Christian Standard Bible" },
  { value: "LSB", label: "LSB — Legacy Standard Bible" },
  { value: "NKJV", label: "NKJV — New King James Version" },
  { value: "NASB", label: "NASB — New American Standard Bible" },
  { value: "NET", label: "NET — New English Translation" },
  { value: "NRSV", label: "NRSV — New Revised Standard Version" },
  { value: "NRSVue", label: "NRSVue — NRSV, Updated Edition" },
  { value: "RSV", label: "RSV — Revised Standard Version" },
  { value: "ASV", label: "ASV — American Standard Version" },
  { value: "WEB", label: "WEB — World English Bible" },
  { value: "NABRE", label: "NABRE — New American Bible, Revised Edition" },
  { value: "NAB", label: "NAB — New American Bible" },
  { value: "NJB", label: "NJB — New Jerusalem Bible" },
  { value: "JB", label: "JB — Jerusalem Bible" },
  { value: "Douay-Rheims", label: "Douay-Rheims" },
  { value: "OSB", label: "OSB — Orthodox Study Bible" },
  { value: "HCSB", label: "HCSB — Holman Christian Standard Bible" },
  { value: "CEB", label: "CEB — Common English Bible" },
  { value: "CEV", label: "CEV — Contemporary English Version" },
  { value: "GNT", label: "GNT — Good News Translation" },
  { value: "MSG", label: "MSG — The Message" },
  { value: "AMP", label: "AMP — Amplified Bible" },
  { value: "TLB", label: "TLB — The Living Bible" },
  { value: "NLV", label: "NLV — New Life Version" },
  { value: "VOICE", label: "The Voice" },
  { value: "NIrV", label: "NIrV — New International Reader's Version" },
  { value: "Multiple / Varies", label: "Multiple / varies by service" },
  { value: "Other", label: "Other" },
  { value: "Not sure", label: "Not sure" },
];
