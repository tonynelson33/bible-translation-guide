/**
 * A family tree for /history: how the site's twenty-six English Bible
 * translations descend (or don't) from the King James Version. Extended
 * 2026-09-18 from the original twelve to all twenty-six, once the other
 * fourteen (BSB, WEB, GNT, CEV, NIrV, ISV, GW, NCV, MEV, LEB, The Voice,
 * LSV, MSB, The Message) were added to the site for real. Navy boxes are
 * every translation on the site; pale boxes are older Bibles (Tyndale, the
 * Revised Version, the ASV, Young's Literal Translation, the International
 * Children's Bible) kept only to show the lineage.
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
 * One deliberate exception to "real tree shape": a second, plain box labeled
 * just "ASV" (no year/code, so it can't be mistaken for a genuine Majority
 * Text translation) sits beside the WEB, joined to it by a red connector —
 * a cross-reference, not a real node, there only so the WEB's own line
 * doesn't have to cross the whole diagram to reach the real ASV. It carries
 * no line back to the real ASV itself; the shared label and hover tooltip
 * are what tie the two together.
 *
 * Two more data layers ride along on every node/chip: a corner dot for
 * philosophy (indigo/teal/amber — the same three colors as lib/glossary.ts
 * and the spectrum; a fourth gray tone marks The Message as a paraphrase,
 * off that axis entirely), and a short code after the year for New
 * Testament textual basis (TR/CT/MT). Every abbreviation carries a native
 * tooltip (SVG <title> / HTML title=) spelling out the full name on hover.
 */

type Philosophy = "Formal" | "Mediating" | "Dynamic" | "Paraphrase";
type TextualBasis = "TR" | "CT" | "MT" | "TR/MT";

const PHIL_COLOR: Record<Philosophy, string> = {
  Formal: "#6366f1",
  Mediating: "#14b8a6",
  Dynamic: "#f59e0b",
  Paraphrase: "#78716c",
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
  hub?: boolean;
  basis: TextualBasis;
  phil: Philosophy;
};

// x is hand-placed per node (see file header); y is never set here — it's
// derived below from a shared chronological rank so it can't drift out of
// year order the way hand-picked y values silently did during an earlier
// pass of this diagram (see the git history for that lesson).
const nodes: Node[] = [
  // NIV -> NIrV and ICB -> NCV: two small independent-of-KJV pairs, CT basis.
  { id: "niv", label: "NIV", year: 1978, cx: 120, current: true, basis: "CT", phil: "Dynamic" },
  { id: "nirv", label: "NIrV", year: 1996, cx: 120, current: true, basis: "CT", phil: "Dynamic" },
  { id: "icb", label: "ICB", year: 1986, cx: 220, basis: "CT", phil: "Dynamic" },
  { id: "ncv", label: "NCV", year: 1991, cx: 220, current: true, basis: "CT", phil: "Dynamic" },

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
  { id: "kjv", label: "KJV", year: 1611, cx: 750, w: 128, current: true, hub: true, basis: "TR", phil: "Formal" },
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

// The ASV stand-in: a plain box, same style as the other non-current
// ancestors, at the real ASV's own row. Only its connector down to the WEB
// is red — a cross-reference, not a real fourth Majority Text translation —
// and it carries no separate line back to the real ASV; the shared label
// and tooltip do that work instead.
const ASV_STANDIN = { cx: 1020, y: yOf["asv"], w: 70 };

type Chip = { id: string; label: string; year: number; basis: TextualBasis; phil: Philosophy };
const independents: Chip[] = [
  { id: "gnt", label: "GNT", year: 1976, basis: "CT", phil: "Dynamic" },
  { id: "cev", label: "CEV", year: 1995, basis: "CT", phil: "Dynamic" },
  { id: "gw", label: "GW", year: 1995, basis: "CT", phil: "Mediating" },
  { id: "nlt", label: "NLT", year: 1996, basis: "CT", phil: "Dynamic" },
  { id: "message", label: "The Message", year: 2002, basis: "CT", phil: "Paraphrase" },
  { id: "net", label: "NET", year: 2005, basis: "CT", phil: "Mediating" },
  { id: "ceb", label: "CEB", year: 2011, basis: "CT", phil: "Dynamic" },
  { id: "isv", label: "ISV", year: 2011, basis: "CT", phil: "Mediating" },
  { id: "leb", label: "LEB", year: 2011, basis: "CT", phil: "Formal" },
  { id: "voice", label: "The Voice", year: 2012, basis: "CT", phil: "Dynamic" },
  { id: "csb", label: "CSB", year: 2017, basis: "CT", phil: "Mediating" },
].sort((a, b) => a.year - b.year) as Chip[];

const VIEW_W = 1090;
const VIEW_H = TOP + rankedYears.length * PITCH + 30;
const BRACKETS: { label: string; x1: number; x2: number }[] = [
  { label: "Critical Text", x1: 15, x2: 645 },
  { label: "Textus Receptus", x1: 655, x2: 900 },
  { label: "Majority Text", x1: 910, x2: 1075 },
];

function PhilDot({ cx, cy, phil }: { cx: number; cy: number; phil: Philosophy }) {
  return <circle cx={cx} cy={cy} r={4} fill={PHIL_COLOR[phil]} stroke="white" strokeWidth={1} />;
}

function NodeBox({
  x, y, w, cx, current, label, year, basis, phil, title,
}: {
  x: number; y: number; w: number; cx: number; current?: boolean;
  label: string; year: string; basis: TextualBasis; phil: Philosophy; title?: string;
}) {
  const labelColor = current ? "fill-white" : "fill-neutral-700";
  const metaColor = current ? "fill-brand-200" : "fill-neutral-400";
  return (
    <g>
      <rect
        x={x} y={y} width={w} height={BOX_H} rx="5" strokeWidth="1.5"
        className={current ? "fill-brand-800 stroke-brand-800" : "fill-white stroke-neutral-300"}
      />
      {title && <title>{title}</title>}
      <text x={cx} y={y + BOX_H / 2 + 3.5} textAnchor="middle" className="text-[9px]">
        <tspan fontWeight={600} className={labelColor}>{label}</tspan>
        <tspan className={metaColor}> {year} </tspan>
        <tspan fontWeight={700} className={metaColor}>{basis}</tspan>
      </text>
      <PhilDot cx={x + w} cy={y} phil={phil} />
    </g>
  );
}

export default function TranslationFamilyTree() {
  return (
    <figure className="mt-6">
      <div className="rounded-lg border border-neutral-200 bg-paper p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex shrink-0 flex-col gap-1 sm:w-28">
            {independents.map((t) => (
              <span
                key={t.id}
                title={FULL_NAME[t.id]}
                className="flex items-start gap-1 rounded bg-brand-800 px-1.5 py-1 text-[10px] font-semibold leading-tight text-white"
              >
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full ring-1 ring-black/10" style={{ background: PHIL_COLOR[t.phil] }} />
                <span>
                  {t.label}
                  <br />
                  <span className="font-normal text-brand-200">
                    {t.year} {t.basis}
                  </span>
                </span>
              </span>
            ))}
          </div>

          <div className="min-w-0 flex-1">
            <svg
              viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
              className="mx-auto block h-auto w-full max-w-[1090px]"
              role="img"
              aria-label="Every translation on the site, laid out as a family tree with three loose zones left to right by New Testament textual basis — Critical Text, the King James Textus Receptus, Majority Text — and a strict shared year axis top to bottom: no node sits lower than another node with a later year, regardless of branch. The King James tree's own Critical-Text descendants — Revised Version, ASV, RSV, NASB, AMP, ESV, NRSV, NRSVue, LSB, and BSB — hang off their real KJV-line parents even though that reads as inside the Textus Receptus zone. Young's Literal Translation leads to the Literal Standard Version; the Berean Standard Bible's Majority Text sibling, the Majority Standard Bible, sits on the right with a long connector back to it. A second, plain box labeled just ASV sits at the real ASV's own row beside the WEB, joined to the WEB by a red connector — a cross-reference, not a real fourth Majority Text translation. Translations with no documented lineage of their own sit in a column at the left, beside the NIV and NIrV, inside the same Critical Text zone."
            >
              {BRACKETS.map((b) => {
              const cx = (b.x1 + b.x2) / 2;
              return (
                <g key={b.label}>
                  <line x1={b.x1} y1={8} x2={b.x2} y2={8} stroke="#a3a3a3" strokeWidth={1.5} />
                  <line x1={b.x1} y1={3} x2={b.x1} y2={13} stroke="#a3a3a3" strokeWidth={1.5} />
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
            {/* ASV stand-in -> WEB (red, kept thin so it doesn't outweigh the
                real lineage lines just because of its color) */}
            <path
              d={`M ${ASV_STANDIN.cx} ${ASV_STANDIN.y + BOX_H} V ${box("web").y}`}
              fill="none"
              stroke="#dc2626"
              strokeWidth="1"
            />

            {nodes.map((n) => {
              const p = box(n.id);
              return (
                <g key={n.id}>
                  {n.hub && (
                    <rect x={p.x - 3} y={p.y - 3} width={p.w + 6} height={BOX_H + 6} rx="7" fill="none" className="stroke-gild-400" strokeWidth="1.5" />
                  )}
                  <NodeBox {...p} current={n.current} label={n.label} year={String(n.year)} basis={n.basis} phil={n.phil} title={FULL_NAME[n.id]} />
                </g>
              );
            })}

            <g>
              <rect x={ASV_STANDIN.cx - ASV_STANDIN.w / 2} y={ASV_STANDIN.y} width={ASV_STANDIN.w} height={BOX_H} rx="5" strokeWidth="1.5" className="fill-white stroke-neutral-300" />
              <title>American Standard Version (cross-reference — see the real ASV on the left)</title>
              <text x={ASV_STANDIN.cx} y={ASV_STANDIN.y + BOX_H / 2 + 3.5} textAnchor="middle" fill="#dc2626" className="text-[9px] font-semibold">
                ASV
              </text>
            </g>
          </svg>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-neutral-200 pt-3 text-[11px] text-neutral-500">
        <span className="font-semibold text-neutral-600">Corner dot = philosophy:</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: PHIL_COLOR.Formal }} />Formal</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: PHIL_COLOR.Mediating }} />Mediating</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: PHIL_COLOR.Dynamic }} />Dynamic</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: PHIL_COLOR.Paraphrase }} />Paraphrase</span>
        <span className="font-semibold text-neutral-600">Hover any abbreviation for its full name.</span>
      </div>

      <figcaption className="mt-4 max-w-2xl text-xs leading-relaxed text-neutral-500">
        The red <strong>ASV</strong> box is there so the <strong>WEB</strong>&rsquo;s line back to
        the real ASV doesn&rsquo;t have to cross the whole diagram, not because the ASV itself is
        Majority Text. Top to bottom follows a strict year axis &mdash; no box sits lower than
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
