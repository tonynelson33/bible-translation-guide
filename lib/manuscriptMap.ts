/**
 * Data for the "Where they come from" map on /manuscripts.
 *
 * Every dot is a row from the page's two manuscript tables (lib/manuscripts.ts), and
 * every row has a dot (the medieval minuscules get a shaded area instead, since they are
 * thousands of copies from all over the Byzantine world). The rule for where a dot goes:
 * where the manuscript was made, if that is known; otherwise where it was found or first
 * known. Each place's `note` says which.
 *
 * Coastlines are hand-simplified from approximate coordinates — a schematic map, not a
 * survey. Points are [longitude, latitude]; west and south are negative.
 */

export type LonLat = [number, number];

/** The Mediterranean, as one outline going round from Gibraltar. */
export const mediterranean: LonLat[] = [
  [-5.6, 36.1], [-4.4, 36.7], [-2.2, 36.7], [-0.5, 38.3], [0.2, 38.8], [-0.3, 39.5],
  [0.9, 40.8], [2.2, 41.4], [3.2, 42.3], [3.0, 43.0], [4.0, 43.5], [4.8, 43.4],
  [5.4, 43.3], [6.9, 43.5], [7.4, 43.7], [8.8, 44.4], [9.8, 44.1], [10.3, 43.5],
  [11.1, 42.4], [12.2, 41.8], [13.0, 41.2], [14.3, 40.8], [15.6, 40.0], [16.0, 39.0],
  [15.65, 38.0], [16.1, 38.0], [16.6, 38.4], [17.2, 39.0], [16.5, 39.7], [17.2, 40.4],
  [18.0, 40.0], [18.5, 40.1], [18.5, 40.6], [17.1, 41.1], [15.9, 41.6], [14.7, 42.1],
  [13.9, 42.9], [13.5, 43.6], [12.3, 44.5], [12.3, 45.4], [13.7, 45.7], [13.6, 45.1],
  [14.4, 45.3], [15.9, 43.5], [17.4, 43.0], [18.1, 42.6], [19.0, 42.1], [19.4, 41.8],
  [19.4, 40.8], [19.3, 40.4], [20.1, 39.6], [20.7, 38.9], [21.1, 38.3], [21.6, 37.5],
  [21.9, 36.8], [22.4, 36.4], [22.8, 36.8], [23.2, 36.5], [23.0, 37.3], [23.5, 37.9],
  [24.0, 37.7], [24.0, 38.2], [23.6, 38.6], [23.0, 39.0], [22.9, 39.4], [22.6, 40.2],
  [22.9, 40.6], [23.9, 40.0], [24.2, 40.7], [25.5, 40.9], [26.0, 40.8], [26.3, 40.6],
  [26.2, 40.0], [26.2, 39.9], [26.6, 39.3], [26.8, 38.5], [26.4, 38.3], [27.2, 37.9],
  [27.3, 37.0], [28.0, 36.8], [28.6, 36.7], [29.1, 36.6], [30.5, 36.3], [30.7, 36.9],
  [31.5, 36.6], [32.5, 36.1], [33.5, 36.2], [34.6, 36.8], [35.9, 36.8], [35.8, 36.2],
  [35.9, 35.4], [35.6, 34.4], [35.5, 33.9], [35.2, 33.3], [35.1, 32.95], [35.05, 32.82],
  [34.96, 32.83], [34.9, 32.5], [34.75, 32.1], [34.6, 31.7],
  [34.2, 31.3], [33.0, 31.1], [32.3, 31.3], [31.0, 31.6], [30.3, 31.5], [29.9, 31.2],
  [28.5, 31.0], [25.2, 31.6], [24.0, 32.1], [23.0, 32.6], [21.7, 32.9], [20.1, 32.1],
  [19.6, 30.5], [18.5, 30.4], [15.8, 31.3], [15.2, 32.4], [13.2, 32.9], [11.1, 33.2],
  [10.2, 33.8], [10.4, 34.6], [10.8, 34.7], [11.1, 35.2], [10.6, 35.8], [11.0, 36.9],
  [10.2, 37.1], [9.8, 37.3], [8.6, 36.9], [7.0, 37.0], [5.1, 36.7], [3.1, 36.8],
  [1.0, 36.5], [-0.6, 35.7], [-2.2, 35.1], [-5.3, 35.9],
];

export const blackSea: LonLat[] = [
  [29.1, 41.2], [28.0, 41.6], [27.5, 42.5], [27.9, 43.2], [28.6, 44.2], [29.7, 45.2],
  [30.7, 46.5], [31.6, 46.6], [32.6, 46.0], [33.5, 45.9], [32.5, 45.4], [33.6, 44.5],
  [34.5, 44.5], [35.4, 45.0], [36.5, 45.3], [37.8, 44.7], [38.9, 44.2], [39.7, 43.6],
  [41.6, 42.1], [41.6, 41.6], [40.5, 41.0], [39.7, 41.0], [37.8, 41.1], [36.3, 41.3],
  [35.0, 42.0], [33.0, 42.0], [31.4, 41.3], [29.9, 41.2],
];

export const marmara: LonLat[] = [
  [26.7, 40.4], [27.5, 40.97], [28.9, 41.0], [29.4, 40.8], [29.0, 40.4], [27.7, 40.3],
];

/** The Gulfs of Suez and Aqaba and the top of the Red Sea. */
export const redSea: LonLat[] = [
  [32.55, 29.95], [32.75, 29.35], [33.55, 28.3], [33.9, 27.0], [36.0, 27.0], [35.3, 27.8],
  [34.85, 28.1], [35.0, 29.45], [34.95, 29.55], [34.75, 29.2], [34.5, 28.5], [34.25, 27.73],
  [33.6, 28.6], [33.2, 29.0], [32.7, 29.8],
];

export const deadSea: LonLat[] = [[35.4, 31.75], [35.6, 31.8], [35.55, 31.1], [35.4, 31.1]];
export const seaOfGalilee: LonLat[] = [[35.53, 32.88], [35.65, 32.87], [35.64, 32.7], [35.56, 32.71]];

export const islands: LonLat[][] = [
  // Sicily
  [[12.4, 37.8], [13.3, 38.2], [14.5, 38.0], [15.6, 38.3], [15.1, 37.1], [15.1, 36.7], [14.3, 36.8], [12.6, 37.6]],
  // Sardinia
  [[8.4, 41.0], [9.5, 41.2], [9.8, 40.5], [9.6, 39.2], [9.0, 39.0], [8.4, 38.9], [8.4, 39.9], [8.2, 40.6]],
  // Corsica
  [[9.4, 43.0], [9.6, 42.5], [9.4, 41.6], [9.1, 41.4], [8.6, 41.9], [8.6, 42.4]],
  // Crete
  [[23.5, 35.6], [24.2, 35.5], [25.1, 35.35], [26.3, 35.3], [26.2, 35.0], [24.7, 35.0], [23.6, 35.2]],
  // Cyprus
  [[32.3, 35.0], [32.9, 35.4], [34.6, 35.7], [34.0, 35.1], [33.6, 34.8], [32.6, 34.7]],
];

/** Rivers drawn as lines: the Nile (with its delta) and the Jordan. */
export const rivers: LonLat[][] = [
  [[30.9, 26.0], [30.8, 28.0], [31.3, 29.0], [31.25, 30.05], [30.4, 31.45]],
  [[31.25, 30.05], [31.8, 31.5]],
  [[35.57, 32.7], [35.55, 32.2], [35.55, 31.8]],
];

/** Faint geography labels, so readers can find their bearings. */
export const geoLabels: { view: "nt" | "ot"; text: string; at: LonLat; water?: boolean }[] = [
  { view: "nt", text: "Mediterranean Sea", at: [17.5, 34.6], water: true },
  { view: "nt", text: "Black Sea", at: [34.5, 43.3], water: true },
  { view: "nt", text: "Italy", at: [15.4, 41.0] },
  { view: "nt", text: "France", at: [2.5, 46.5] },
  { view: "nt", text: "North Africa", at: [8.0, 32.0] },
  { view: "ot", text: "Mediterranean Sea", at: [31.6, 32.6], water: true },
  { view: "ot", text: "Egypt", at: [30.0, 29.6] },
  { view: "ot", text: "Sinai", at: [33.6, 29.8] },
  { view: "ot", text: "Nile", at: [30.8, 29.2], water: true },
  { view: "ot", text: "Dead Sea", at: [35.75, 31.25], water: true },
  { view: "ot", text: "Sea of Galilee", at: [35.85, 32.95], water: true },
];

export interface MapView {
  id: "nt" | "ot";
  label: string;
  /** Map extent: [west, south, east, north]. */
  bounds: [number, number, number, number];
}

export const mapViews: MapView[] = [
  { id: "nt", label: "New Testament", bounds: [-1, 26.5, 47, 47.5] },
  { id: "ot", label: "Old Testament", bounds: [28.5, 29.2, 36.6, 33.4] },
];

export interface MapPlace {
  view: "nt" | "ot";
  /** The place name shown on the map. */
  name: string;
  at: LonLat;
  /** Table rows (ids from lib/manuscripts.ts) this dot stands for. */
  rows: string[];
  /** "Made here" or "Found here" plus a few words. */
  note: string;
  /** Which side of the dot the name sits on, to keep labels clear of each other. */
  labelSide?: "left" | "right" | "above" | "below";
}

export const mapPlaces: MapPlace[] = [
  // Old Testament
  { view: "ot", name: "Qumran", at: [35.46, 31.74], rows: ["dead-sea-scrolls"], note: "Found here, in caves, 1947–56.", labelSide: "left" },
  { view: "ot", name: "Tiberias", at: [35.53, 32.79], rows: ["masoretic"], note: "Made here: the Masoretes worked here, and the Aleppo Codex was written here.", labelSide: "left" },
  { view: "ot", name: "Nablus", at: [35.26, 32.22], rows: ["samaritan"], note: "Made here: the home of the Samaritan community, at Mount Gerizim. (The first copy Europe saw was bought in Damascus in 1616.)", labelSide: "left" },
  { view: "ot", name: "Old Cairo", at: [31.23, 30.0], rows: ["geniza"], note: "Found here, in a synagogue storeroom, and taken to Cambridge in 1896–97.", labelSide: "right" },
  { view: "ot", name: "Alexandria", at: [29.92, 31.2], rows: ["septuagint"], note: "Made here: the translation was begun here.", labelSide: "below" },
  // New Testament
  { view: "nt", name: "Egypt", at: [30.8, 28.4], rows: ["p52", "p46", "p66", "p75", "washingtonianus"], note: "Found here: all five were bought in Egypt, mostly from unknown sites.", labelSide: "left" },
  { view: "nt", name: "Mount Sinai", at: [33.97, 28.54], rows: ["sinaiticus"], note: "Found here, at St. Catherine’s Monastery, 1844 and 1859.", labelSide: "right" },
  { view: "nt", name: "Alexandria", at: [29.92, 31.2], rows: ["alexandrinus"], note: "Found here: it was kept in Alexandria, which gave it its name, before reaching England in 1627.", labelSide: "left" },
  { view: "nt", name: "Rome", at: [12.5, 41.9], rows: ["vaticanus"], note: "Found here: kept in the Vatican Library since at least the 1400s. Where it was made is unknown.", labelSide: "right" },
  { view: "nt", name: "Lyon", at: [4.83, 45.76], rows: ["bezae"], note: "Found here, by Theodore Beza in 1562. Where it was made is unknown.", labelSide: "right" },
  { view: "nt", name: "Caucasus", at: [43.6, 42.3], rows: ["koridethi"], note: "Found here, in a remote church in the mountains of Georgia, and published in 1913.", labelSide: "below" },
];

/** The shaded area standing in for the thousands of medieval minuscules. */
export const byzantineArea = {
  view: "nt" as const,
  name: "Byzantine East",
  center: [27.5, 39.6] as LonLat,
  /** Radii in degrees of longitude and latitude. */
  radius: [7.5, 3.6] as [number, number],
  rows: ["minuscules"],
  note: "Thousands of medieval copies came from all over the Greek-speaking world, centered on Constantinople.",
};
