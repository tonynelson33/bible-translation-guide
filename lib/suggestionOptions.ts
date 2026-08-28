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
  { value: "anglican_church", label: "Anglican" },
  { value: "assembly_of_god_church", label: "Assembly of God" },
  { value: "baptist_church", label: "Baptist" },
  { value: "calvary_chapel_church", label: "Calvary Chapel" },
  { value: "catholic_church", label: "Catholic" },
  { value: "charismatic_church", label: "Charismatic" },
  { value: "christian_missionary_alliance", label: "Christian & Missionary Alliance" },
  { value: "church_of_christ", label: "Church of Christ" },
  { value: "church_of_god", label: "Church of God (other)" },
  { value: "church_of_god_in_christ", label: "Church of God in Christ (COGIC)" },
  { value: "church_of_the_brethren", label: "Church of the Brethren" },
  { value: "congregational_church", label: "Congregational" },
  { value: "convents_and_monasteries", label: "Convents and Monasteries" },
  { value: "disciples_of_christ_church", label: "Disciples of Christ" },
  { value: "episcopal_church", label: "Episcopal" },
  { value: "evangelical_church", label: "Evangelical" },
  { value: "foursquare_church", label: "Foursquare" },
  { value: "latter_day_saints_church", label: "Latter Day Saints" },
  { value: "lutheran_church", label: "Lutheran" },
  { value: "mennonite_church", label: "Mennonite" },
  { value: "methodist_church", label: "Methodist" },
  { value: "mission", label: "Mission" },
  { value: "nazarene_church", label: "Nazarene" },
  { value: "non_denominational", label: "Non-denominational" },
  { value: "orthodox_church", label: "Orthodox" },
  { value: "pentecostal_church", label: "Pentecostal" },
  { value: "presbyterian_church", label: "Presbyterian" },
  { value: "quaker_friends", label: "Quaker (Friends)" },
  { value: "reformed_church", label: "Reformed" },
  { value: "salvation_army", label: "Salvation Army" },
  { value: "adventist_church", label: "Seventh-day Adventist" },
  { value: "vineyard_church", label: "Vineyard" },
  { value: "wesleyan_church", label: "Wesleyan" },
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
  { value: "NRSVue", label: "NRSVue — New Revised Standard Version, Updated Edition" },
  { value: "OSB", label: "OSB — Orthodox Study Bible" },
  { value: "RSV", label: "RSV — Revised Standard Version" },
  { value: "WEB", label: "WEB — World English Bible" },
];
