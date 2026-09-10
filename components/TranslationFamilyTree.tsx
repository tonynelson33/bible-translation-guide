/**
 * A compact family tree for /history: how the twelve translations on this site
 * descend (or don't) from the King James Version. Hand-placed SVG on a simple
 * three-column grid — the shape is the point, so coordinates are explicit.
 *
 * Navy nodes are the twelve profiled here; outlined nodes are ancestors kept
 * only for the lineage. The five "independent" translations below the rule were
 * made fresh from the original languages and sit outside the KJV line.
 */

type Node = {
  id: string;
  label: string;
  year: string;
  /** column centre */
  cx: number;
  /** box top edge */
  y: number;
  w?: number;
  current?: boolean;
  hub?: boolean;
};

const BOX_H = 34;
const DEF_W = 92;

// Three columns, seven rows. Time runs top → bottom.
const COL = { L: 62, C: 210, R: 358 };
const ROW = [10, 74, 138, 202, 266, 330, 394];

const nodes: Node[] = [
  { id: "tyndale", label: "Tyndale NT", year: "1526", cx: COL.C, y: ROW[0] },
  { id: "kjv", label: "KJV", year: "1611", cx: COL.C, y: ROW[1], w: 150, current: true, hub: true },
  { id: "rv", label: "Revised Version", year: "1885", cx: COL.L, y: ROW[2], w: 116 },
  { id: "nkjv", label: "NKJV", year: "1982", cx: COL.R, y: ROW[2], current: true },
  { id: "asv", label: "ASV", year: "1901", cx: COL.L, y: ROW[3], w: 116 },
  { id: "rsv", label: "RSV", year: "1952", cx: COL.L, y: ROW[4] },
  { id: "nasb", label: "NASB", year: "1971", cx: COL.C, y: ROW[4], current: true },
  { id: "amp", label: "AMP", year: "1965", cx: COL.R, y: ROW[4], current: true },
  { id: "esv", label: "ESV", year: "2001", cx: COL.L, y: ROW[5], current: true },
  { id: "nrsv", label: "NRSV", year: "1989", cx: COL.C, y: ROW[5] },
  { id: "lsb", label: "LSB", year: "2021", cx: COL.R, y: ROW[5], current: true },
  { id: "nrsvue", label: "NRSVue", year: "2021", cx: COL.C, y: ROW[6], current: true },
];

const edges: [string, string][] = [
  ["tyndale", "kjv"],
  ["kjv", "rv"],
  ["kjv", "nkjv"],
  ["rv", "asv"],
  ["asv", "rsv"],
  ["asv", "nasb"],
  ["asv", "amp"],
  ["rsv", "esv"],
  ["rsv", "nrsv"],
  ["nasb", "lsb"],
  ["nrsv", "nrsvue"],
];

const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

const independents = [
  { label: "NIV", year: "1978" },
  { label: "NLT", year: "1996" },
  { label: "NET", year: "2005" },
  { label: "CEB", year: "2011" },
  { label: "CSB", year: "2017" },
];

export default function TranslationFamilyTree() {
  return (
    <figure className="mt-6">
      <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-paper p-4">
        <svg
          viewBox="0 0 420 452"
          className="mx-auto block h-auto w-full min-w-[340px] max-w-[440px]"
          role="img"
          aria-label="Family tree of the twelve English Bible translations. William Tyndale's 1526 New Testament leads to the 1611 King James Version. From the KJV: the NKJV (1982), and the Revised Version (1885), which led to the ASV (1901). From the ASV: the RSV (1952), the NASB (1971), and the AMP (1965). From the RSV: the ESV (2001) and the NRSV (1989), which was updated to the NRSVue (2021). The LSB (2021) is a revision of the NASB. The NIV, NLT, NET, CEB, and CSB were translated fresh from the original languages and do not descend from the KJV."
        >
          {edges.map(([a, b]) => {
            const from = byId[a];
            const to = byId[b];
            const y1 = from.y + BOX_H;
            const mid = (y1 + to.y) / 2;
            return (
              <path
                key={`${a}-${b}`}
                d={`M ${from.cx} ${y1} V ${mid} H ${to.cx} V ${to.y}`}
                fill="none"
                stroke="rgb(212 212 212)"
                strokeWidth="1.5"
              />
            );
          })}

          {nodes.map((n) => {
            const w = n.w ?? DEF_W;
            const x = n.cx - w / 2;
            return (
              <g key={n.id}>
                {n.hub && (
                  <rect
                    x={x - 3}
                    y={n.y - 3}
                    width={w + 6}
                    height={BOX_H + 6}
                    rx="7"
                    fill="none"
                    className="stroke-gild-400"
                    strokeWidth="1.5"
                  />
                )}
                <rect
                  x={x}
                  y={n.y}
                  width={w}
                  height={BOX_H}
                  rx="5"
                  strokeWidth="1.5"
                  className={
                    n.current ? "fill-brand-800 stroke-brand-800" : "fill-white stroke-neutral-300"
                  }
                />
                <text
                  x={n.cx}
                  y={n.y + 14}
                  textAnchor="middle"
                  className={`text-[11px] font-semibold ${n.current ? "fill-white" : "fill-neutral-700"}`}
                >
                  {n.label}
                </text>
                <text
                  x={n.cx}
                  y={n.y + 26}
                  textAnchor="middle"
                  className={`text-[9px] ${n.current ? "fill-brand-200" : "fill-neutral-400"}`}
                >
                  {n.year}
                </text>
              </g>
            );
          })}

          <line x1="8" y1="430" x2="412" y2="430" stroke="rgb(229 229 229)" strokeWidth="1" />
          <text x="210" y="445" textAnchor="middle" className="fill-neutral-400 text-[9px]">
            Made fresh from the original languages — outside the King James line
          </text>
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {independents.map((t) => (
          <span
            key={t.label}
            className="rounded-md border border-neutral-300 bg-white px-2.5 py-1 text-xs font-semibold text-neutral-700"
          >
            {t.label} <span className="font-normal text-neutral-400">{t.year}</span>
          </span>
        ))}
      </div>

      <figcaption className="mt-3 max-w-2xl text-xs leading-snug text-neutral-500">
        The twelve are in navy. Most descend from the King James Version &mdash; itself mostly
        Tyndale&rsquo;s wording. The <strong>NKJV</strong> modernizes its language directly; the
        Revised Version &rarr; ASV &rarr; RSV line branches into the <strong>ESV</strong>,{" "}
        <strong>NRSVue</strong>, <strong>NASB</strong>, <strong>LSB</strong>, and{" "}
        <strong>AMP</strong>. The other five were translated from scratch.
      </figcaption>
    </figure>
  );
}
