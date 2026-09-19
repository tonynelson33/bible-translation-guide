/**
 * A family tree for /history: how the site's twenty-six English Bible
 * translations descend (or don't) from the King James Version. Extended
 * 2026-09-18 from the original twelve to all twenty-six, once the other
 * fourteen (BSB, WEB, GNT, CEV, NIrV, ISV, GW, NCV, MEV, LEB, The Voice,
 * LSV, MSB, The Message) were added to the site for real. Every box is
 * colored by its translation philosophy (indigo/teal/amber — the same
 * colors as lib/glossary.ts and the spectrum; a fourth stone tone marks
 * The Message as a paraphrase, off that axis entirely): filled with that
 * color, it's one of the twenty-six; white with just a thick border in
 * that color, it's an older Bible (Tyndale, the Revised Version, the ASV,
 * Young's Literal Translation, the International Children's Bible) kept
 * only to show the lineage.
 *
 * Layout: hand-placed x — a literal cx per node, chosen so no edge runs
 * through a box. Three loose zones read left to right by New Testament
 * textual basis (Critical Text / Textus Receptus / Majority Text, marked by
 * a bracket overhead), but the tree shape itself — who descends from whom —
 * is untouched; a CT-basis descendant of the KJV (RSV, NASB, ESV, AMP,
 * NRSV/ue, LSB) still hangs off its real parent, even where that reads as
 * "inside" the TR bracket's span.
 *
 * The y axis is not hand-placed at all — it's a strict, shared chronological
 * rank across every node here (the independents list excluded; see below):
 * every unique year gets the next row down, so a node can never sit lower
 * than another node with a later year, full stop, regardless of which
 * branch or zone either one is in.
 *
 * One deliberate exception to "real tree shape": the WEB's line back to the
 * ASV, its real parent, is drawn in red and runs the full width of the
 * diagram instead of a short jog to a nearby column — the one connection
 * here that visibly crosses between zones, colored red so it doesn't read
 * as an ordinary Majority Text lineage line.
 *
 * A short code after the year marks New Testament textual basis (TR/CT/MT).
 * Every abbreviation carries a native tooltip (SVG <title> / HTML title=)
 * spelling out the full name on hover.
 */

type Philosophy = "Formal" | "Mediating" | "Dynamic" | "Paraphrase";
type TextualBasis = "TR" | "CT" | "MT" | "TR/MT";

// Same four hues as lib/glossary.ts's philosophy pills (indigo/teal/amber,
// plus stone for the paraphrase). SVG needs fill-*/stroke-* classes rather
// than glossary's bg-*/text-*, so this is its own map, not an import — but
// the actual colors are the same ones on purpose.
const PHIL: Record<Philosophy, { fill: string; text: string; border: string; htmlBg: string; htmlText: string; htmlBorder: string }> = {
  Formal: { fill: "fill-indigo-50", text: "fill-indigo-700", border: "stroke-indigo-500", htmlBg: "bg-indigo-50", htmlText: "text-indigo-700", htmlBorder: "border-indigo-500" },
  Mediating: { fill: "fill-teal-50", text: "fill-teal-700", border: "stroke-teal-500", htmlBg: "bg-teal-50", htmlText: "text-teal-700", htmlBorder: "border-teal-500" },
  Dynamic: { fill: "fill-amber-50", text: "fill-amber-700", border: "stroke-amber-500", htmlBg: "bg-amber-50", htmlText: "text-amber-700", htmlBorder: "border-amber-500" },
  Paraphrase: { fill: "fill-stone-100", text: "fill-stone-700", border: "stroke-stone-500", htmlBg: "bg-stone-100", htmlText: "text-stone-700", htmlBorder: "border-stone-500" },
};

const FULL_NAME: Record<string, string> = {
  kjv: "King James Version",
  nkjv: "New King James Version",
  asv: "American Standard Version",
  rsv: "Revised Standard Version",
  nasb: "New American Standard Bible",
  amp: "Amplified Bible",
  esv: "English Standard Version",
  nrsv: "New Revised Standard Version",
  lsb: "Legacy Standard Bible",
  nrsvue: "New Revised Standard Version, Updated Edition",
  mev: "Modern English Version",
  web: "World English Bible",
  niv: "New International Version",
  nirv: "New International Reader's Version",
  bsb: "Berean Standard Bible",
  msb: "Majority Standard Bible",
  ylt: "Young's Literal Translation",
  lsv: "Literal Standard Version",
  icb: "International Children's Bible",
  ncv: "New Century Version",
  nlt: "New Living Translation",
  net: "New English Translation",
  ceb: "Common English Bible",
  csb: "Christian Standard Bible",
  gnt: "Good News Translation",
  cev: "Contemporary English Version",
  isv: "International Standard Version",
  gw: "GOD'S WORD Translation",
  leb: "Lexham English Bible",
};

const BOX_H = 24;
const DEF_W = 76;
const TOP = 34;
const PITCH = 28;

type Node = {
  id: string;
  label: string;
  year: number;
  cx: number;
  w?: number;
  current?: boolean;
  basis: TextualBasis;
  phil: Philosophy;
};

// x is hand-placed per node (see file header); y is never set here — it's
// derived below from a shared chronological rank so it can't drift out of
// year order the way hand-picked y values silently did during an earlier
// pass of this diagram (see the git history for that lesson).
const nodes: Node[] = [
  // NIV -> NIrV and ICB -> NCV: two small independent-of-KJV pairs, CT basis.
  { id: "niv", label: "NIV", year: 1978, cx: 75, current: true, basis: "CT", phil: "Dynamic" },
  { id: "nirv", label: "NIrV", year: 1996, cx: 75, current: true, basis: "CT", phil: "Dynamic" },
  { id: "icb", label: "ICB", year: 1986, cx: 175, basis: "CT", phil: "Dynamic" },
  { id: "ncv", label: "NCV", year: 1991, cx: 175, current: true, basis: "CT", phil: "Dynamic" },

  // The KJV tree's own CT-basis branch: RV -> ASV -> {RSV -> (ESV, NRSV ->
  // NRSVue), NASB -> LSB, AMP}, plus BSB hanging off on its own (its MT
  // sibling MSB is over on the right).
  { id: "rv", label: "Revised Version", year: 1885, cx: 410, w: 140, basis: "CT", phil: "Formal" },
  { id: "asv", label: "ASV", year: 1901, cx: 410, basis: "CT", phil: "Formal" },
  { id: "rsv", label: "RSV", year: 1952, cx: 350, basis: "CT", phil: "Formal" },
  { id: "nasb", label: "NASB", year: 1971, cx: 470, current: true, basis: "CT", phil: "Formal" },
  { id: "amp", label: "AMP", year: 1965, cx: 590, current: true, basis: "CT", phil: "Formal" },
  { id: "esv", label: "ESV", year: 2001, cx: 280, current: true, basis: "CT", phil: "Formal" },
  { id: "nrsv", label: "NRSV", year: 1989, cx: 390, basis: "CT", phil: "Formal" },
  { id: "lsb", label: "LSB", year: 2021, cx: 510, current: true, basis: "CT", phil: "Formal" },
  { id: "nrsvue", label: "NRSVue", year: 2021, cx: 390, w: 84, current: true, basis: "CT", phil: "Formal" },
  { id: "bsb", label: "BSB", year: 2023, cx: 510, current: true, basis: "CT", phil: "Mediating" },

  // The KJV's own TR spine: Tyndale -> KJV -> {RV (left), NKJV, MEV}.
  { id: "tyndale", label: "Tyndale NT", year: 1526, cx: 750, w: 90, basis: "TR", phil: "Formal" },
  { id: "kjv", label: "KJV", year: 1611, cx: 750, w: 128, current: true, basis: "TR", phil: "Formal" },
  { id: "nkjv", label: "NKJV", year: 1982, cx: 770, current: true, basis: "TR", phil: "Formal" },
  { id: "mev", label: "MEV", year: 2014, cx: 710, current: true, basis: "TR", phil: "Formal" },

  // Majority Text, on the right: YLT -> LSV (standalone), and separately
  // WEB / MSB (MSB is BSB's MT sibling, over on the CT side).
  { id: "ylt", label: "YLT", year: 1862, cx: 850, basis: "TR", phil: "Formal" },
  { id: "lsv", label: "LSV", year: 2020, cx: 900, w: 96, current: true, basis: "TR/MT", phil: "Formal" },
  { id: "web", label: "WEB", year: 2020, cx: 1020, current: true, basis: "MT", phil: "Formal" },
  { id: "msb", label: "MSB", year: 2023, cx: 1020, current: true, basis: "MT", phil: "Mediating" },
];

// Shared chronological rank: every distinct year among the nodes above gets
// the next row down, in order — the one rule the whole diagram must obey.
const rankedYears = [...new Set(nodes.map((n) => n.year))].sort((a, b) => a - b);
const rowOf = Object.fromEntries(rankedYears.map((y, i) => [y, i]));

// Small manual nudges within a node's own row — never enough to change
// ordering (each id is alone in its row, or moves within the gap to its
// neighbors), just breathing room where a rank-only pitch left a connector
// line almost invisible against its own boxes.
const yNudge: Record<string, number> = {
  tyndale: -12, // more room above KJV
  rsv: 10, // more room below ASV
  bsb: 14, // more room below LSB
  msb: 14, // stays level with BSB
};
const yOf = Object.fromEntries(nodes.map((n) => [n.id, TOP + rowOf[n.year] * PITCH + (yNudge[n.id] ?? 0)]));

const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

function box(id: string) {
  const n = byId[id];
  const w = n.w ?? DEF_W;
  const y = yOf[id];
  return { x: n.cx - w / 2, y, w, cx: n.cx, midY: y + BOX_H / 2, bottom: y + BOX_H };
}

// Real lineage edges, each a simple elbow (drop from the parent's bottom,
// jog at the midpoint, into the child's top) — the drop point is chosen per
// edge so nothing runs through an intervening box.
const edges: { from: string; to: string; jogY?: number }[] = [
  { from: "niv", to: "nirv" },
  { from: "icb", to: "ncv" },
  { from: "rv", to: "asv" },
  { from: "asv", to: "rsv", jogY: 177 },
  { from: "asv", to: "nasb", jogY: 200 },
  { from: "asv", to: "amp", jogY: 186 },
  { from: "rsv", to: "esv", jogY: 317 },
  { from: "rsv", to: "nrsv", jogY: 275 },
  { from: "nrsv", to: "nrsvue" },
  { from: "nasb", to: "lsb", jogY: 382 },
  { from: "tyndale", to: "kjv" },
  { from: "kjv", to: "rv", jogY: 102 },
  { from: "kjv", to: "nkjv", jogY: 186 },
  { from: "kjv", to: "mev", jogY: 270 },
  { from: "ylt", to: "lsv", jogY: 298 },
];

function edgePath(from: string, to: string, jogY?: number) {
  const a = box(from);
  const b = box(to);
  const sameCol = a.cx === b.cx;
  if (sameCol) return `M ${a.cx} ${a.bottom} V ${b.y}`;
  const mid = jogY ?? (a.bottom + b.y) / 2;
  return `M ${a.cx} ${a.bottom} V ${mid} H ${b.cx} V ${b.y}`;
}

type Chip = { id: string; label: string; year: number; basis: TextualBasis; phil: Philosophy; w?: number };
const independents: Chip[] = [
  { id: "gnt", label: "GNT", year: 1976, basis: "CT", phil: "Dynamic" },
  { id: "cev", label: "CEV", year: 1995, basis: "CT", phil: "Dynamic" },
  { id: "gw", label: "GW", year: 1995, basis: "CT", phil: "Mediating" },
  { id: "nlt", label: "NLT", year: 1996, basis: "CT", phil: "Dynamic" },
  { id: "message", label: "The Message", year: 2002, basis: "CT", phil: "Paraphrase", w: 124 },
  { id: "net", label: "NET", year: 2005, basis: "CT", phil: "Mediating" },
  { id: "ceb", label: "CEB", year: 2011, basis: "CT", phil: "Dynamic" },
  { id: "isv", label: "ISV", year: 2011, basis: "CT", phil: "Mediating" },
  { id: "leb", label: "LEB", year: 2011, basis: "CT", phil: "Formal" },
  { id: "voice", label: "The Voice", year: 2012, basis: "CT", phil: "Dynamic", w: 106 },
  { id: "csb", label: "CSB", year: 2017, basis: "CT", phil: "Mediating" },
].sort((a, b) => a.year - b.year) as Chip[];

const VIEW_W = 1090;
const VIEW_H = TOP + rankedYears.length * PITCH + 30;
const BRACKETS: { label: string; x1: number; x2: number; openLeft?: boolean }[] = [
  { label: "Critical Text", x1: 0, x2: 645, openLeft: true },
  { label: "Textus Receptus", x1: 655, x2: 900 },
  { label: "Majority Text", x1: 910, x2: 1075 },
];

function NodeBox({
  x, y, w, cx, current, label, year, basis, phil, title,
}: {
  x: number; y: number; w: number; cx: number; current?: boolean;
  label: string; year: string; basis: TextualBasis; phil: Philosophy; title?: string;
}) {
  const style = PHIL[phil];
  const labelColor = current ? style.text : "fill-neutral-700";
  const metaColor = current ? style.text : "fill-neutral-400";
  return (
    <g>
      <rect
        x={x} y={y} width={w} height={BOX_H} rx="5"
        strokeWidth={current ? 1.5 : 2}
        className={`${current ? style.fill : "fill-white"} ${style.border}`}
      />
      {title && <title>{title}</title>}
      <text x={cx} y={y + BOX_H / 2 + 3.5} textAnchor="middle" className="text-[9px]">
        <tspan fontWeight={600} className={labelColor}>{label}</tspan>
        <tspan className={`${metaColor} ${current ? "opacity-70" : ""}`}> {year} </tspan>
        <tspan fontWeight={700} className={`${metaColor} ${current ? "opacity-70" : ""}`}>{basis}</tspan>
      </text>
    </g>
  );
}

export default function TranslationFamilyTree() {
  return (
    <figure className="mt-6">
      <div className="rounded-lg border border-neutral-200 bg-paper p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-2">
          <div className="flex shrink-0 flex-col sm:self-stretch">
            <div className="relative hidden sm:block" aria-hidden="true">
              <div className="absolute left-0 right-[-14px] top-[6px] border-t-[1.5px] border-neutral-400" />
              <div className="absolute left-0 top-[1px] h-[10px] border-l-[1.5px] border-neutral-400" />
            </div>
            <div className="flex flex-col items-start gap-1 sm:mt-[150px]">
              <p className="mb-1 text-[11px] font-semibold text-neutral-500">Independents</p>
              {independents.map((t) => {
                const style = PHIL[t.phil];
                return (
                  <span
                    key={t.id}
                    title={FULL_NAME[t.id]}
                    style={{ width: t.w ?? DEF_W }}
                    className={`flex h-6 items-center justify-center rounded-[5px] border px-1 text-[9px] leading-none ${style.htmlBg} ${style.htmlBorder} ${style.htmlText}`}
                  >
                    <span className="whitespace-nowrap">
                      <span className="font-semibold">{t.label}</span>
                      <span className="opacity-70"> {t.year} </span>
                      <span className="font-bold opacity-70">{t.basis}</span>
                    </span>
                  </span>
                );
              })}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <svg
              viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
              className="block h-auto w-full max-w-[1090px]"
              role="img"
              aria-label="Every translation on the site, laid out as a family tree with three loose zones left to right by New Testament textual basis — Critical Text, the King James Textus Receptus, Majority Text — and a strict shared year axis top to bottom: no node sits lower than another node with a later year, regardless of branch. The King James tree's own Critical-Text descendants — Revised Version, ASV, RSV, NASB, AMP, ESV, NRSV, NRSVue, LSB, and BSB — hang off their real KJV-line parents even though that reads as inside the Textus Receptus zone. Young's Literal Translation leads to the Literal Standard Version; the Berean Standard Bible's Majority Text sibling, the Majority Standard Bible, sits on the right with a long connector back to it. A red line connects the WEB directly back to the ASV, its real parent, crossing the full width of the diagram — the one connection here that crosses between zones. Translations with no documented lineage of their own are labeled Independents in a column at the left, beside the NIV and NIrV, inside the same Critical Text zone."
            >
              {BRACKETS.map((b) => {
              const cx = (b.x1 + b.x2) / 2;
              return (
                <g key={b.label}>
                  <line x1={b.x1} y1={8} x2={b.x2} y2={8} stroke="#a3a3a3" strokeWidth={1.5} />
                  {!b.openLeft && <line x1={b.x1} y1={3} x2={b.x1} y2={13} stroke="#a3a3a3" strokeWidth={1.5} />}
                  <line x1={b.x2} y1={3} x2={b.x2} y2={13} stroke="#a3a3a3" strokeWidth={1.5} />
                  <rect x={cx - 54} y={0} width={108} height={16} fill="var(--paper, #fcfbf8)" className="fill-paper" />
                  <text x={cx} y={12} textAnchor="middle" className="text-[11px] font-semibold fill-neutral-500">
                    {b.label}
                  </text>
                </g>
              );
            })}

            {edges.map((e) => (
              <path
                key={`${e.from}-${e.to}`}
                d={edgePath(e.from, e.to, e.jogY)}
                fill="none"
                stroke="rgb(203 203 203)"
                strokeWidth="1.5"
              />
            ))}
            {/* BSB -> MSB: same translation, MT-basis New Testament. */}
            <path
              d={`M ${box("bsb").x + box("bsb").w} ${box("bsb").midY} H ${box("msb").x}`}
              fill="none"
              stroke="rgb(203 203 203)"
              strokeWidth="1.5"
            />
            {/* WEB -> its real parent, the ASV (red, kept thin so it doesn't
                outweigh the real lineage lines just because of its color) */}
            <path
              d={`M ${box("asv").x + box("asv").w} ${box("asv").midY} H ${box("web").cx} V ${box("web").y}`}
              fill="none"
              stroke="#dc2626"
              strokeWidth="1"
            >
              <title>The WEB is a modernization of the ASV&rsquo;s own wording.</title>
            </path>

            {nodes.map((n) => {
              const p = box(n.id);
              return (
                <g key={n.id}>
                  <NodeBox {...p} current={n.current} label={n.label} year={String(n.year)} basis={n.basis} phil={n.phil} title={FULL_NAME[n.id]} />
                </g>
              );
            })}
          </svg>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-neutral-200 pt-3 text-[11px] text-neutral-500">
        <span className="font-semibold text-neutral-600">Fill = philosophy:</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm border border-indigo-500 bg-indigo-50" />Formal</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm border border-teal-500 bg-teal-50" />Mediating</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm border border-amber-500 bg-amber-50" />Dynamic</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm border border-stone-500 bg-stone-100" />Paraphrase</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm border-2 border-neutral-500 bg-white" />Thick border = not one of the twenty-six</span>
        <span className="font-semibold text-neutral-600">Hover any abbreviation for its full name.</span>
      </div>

      <figcaption className="mt-4 max-w-2xl text-xs leading-relaxed text-neutral-500">
        The red line traces the <strong>WEB</strong>&rsquo;s descent from the <strong>ASV</strong>,
        the one connection here that crosses the whole diagram instead of a short jog to a nearby
        column. Top to bottom follows a strict year axis &mdash; no box sits lower than
        another with a later year, in any zone. <strong>YLT</strong> leads to the{" "}
        <strong>LSV</strong>; the <strong>BSB</strong>&rsquo;s Majority Text sibling, the{" "}
        <strong>MSB</strong>, is the same translation and team with its New Testament swapped to
        the Majority Text. The <strong>NIrV</strong> is the NIV simplified to a third-grade
        reading level; the <strong>NCV</strong> descends from the International Children&rsquo;s
        Bible. Hover any abbreviation for its full name.
      </figcaption>
    </figure>
  );
}
