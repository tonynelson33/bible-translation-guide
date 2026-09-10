/**
 * A compact family tree for /history: how the twelve translations on this site
 * descend (or don't) from the King James Version. Hand-placed SVG — the shape is
 * the point, so coordinates are explicit and chosen so no two edges cross.
 *
 * All twelve profiled translations are navy (in the SVG and in the chip row
 * below it); the pale boxes are older Bibles kept only to show the lineage.
 * The five in the chip row were translated fresh from the original languages
 * and have no King James ancestry, so they hang off nothing.
 */

type Node = {
  id: string;
  label: string;
  year: string;
  /** box centre x */
  cx: number;
  /** box top edge y */
  y: number;
  w?: number;
  current?: boolean;
  hub?: boolean;
};

const BOX_H = 34;
const DEF_W = 70;

const nodes: Node[] = [
  { id: "tyndale", label: "Tyndale NT", year: "1526", cx: 214, y: 10, w: 84 },
  { id: "kjv", label: "KJV", year: "1611", cx: 214, y: 74, w: 128, current: true, hub: true },
  { id: "rv", label: "Revised Version", year: "1885", cx: 118, y: 138, w: 132 },
  { id: "nkjv", label: "NKJV", year: "1982", cx: 336, y: 138, current: true },
  { id: "asv", label: "ASV", year: "1901", cx: 118, y: 202 },
  { id: "rsv", label: "RSV", year: "1952", cx: 80, y: 266 },
  { id: "nasb", label: "NASB", year: "1971", cx: 214, y: 266, current: true },
  { id: "amp", label: "AMP", year: "1965", cx: 344, y: 266, current: true },
  { id: "esv", label: "ESV", year: "2001", cx: 44, y: 330, current: true },
  { id: "nrsv", label: "NRSV", year: "1989", cx: 124, y: 330 },
  { id: "lsb", label: "LSB", year: "2021", cx: 240, y: 330, current: true },
  { id: "nrsvue", label: "NRSVue", year: "2021", cx: 124, y: 394, current: true },
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
          viewBox="0 0 448 440"
          className="mx-auto block h-auto w-full min-w-[340px] max-w-[440px]"
          role="img"
          aria-label="Family tree of the twelve English Bible translations. William Tyndale's 1526 New Testament leads to the 1611 King James Version. The NKJV (1982) updates the KJV directly. The KJV also leads to the Revised Version (1885) and its American edition, the ASV (1901). Three lines come off the ASV: the RSV (1952), which leads to the ESV (2001) and to the NRSV (1989), updated as the NRSVue (2021); the NASB (1971), which the LSB (2021) is a revision of; and the Amplified Bible (1965). The NIV, NLT, NET, CEB and CSB were translated from the original languages and have no King James lineage."
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
                stroke="rgb(203 203 203)"
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
        </svg>
      </div>

      <div className="mt-4 border-t border-neutral-200 pt-3">
        <p className="text-xs font-semibold text-neutral-600">
          No King James lineage &mdash; translated straight from the Hebrew and Greek
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {independents.map((t) => (
            <span
              key={t.label}
              className="rounded-md bg-brand-800 px-2.5 py-1 text-xs font-semibold text-white"
            >
              {t.label} <span className="font-normal text-brand-200">{t.year}</span>
            </span>
          ))}
        </div>
      </div>

      <figcaption className="mt-4 max-w-2xl text-xs leading-snug text-neutral-500">
        All twelve are in navy; the pale boxes are older Bibles kept in for the lineage. Most of the
        twelve go back to the King James Version &mdash; itself mostly Tyndale&rsquo;s wording. The{" "}
        <strong>NKJV</strong> updates the KJV&rsquo;s English directly; the rest come down through
        the 1901 ASV. The <strong>RSV</strong> branched off it in 1952 and leads to the{" "}
        <strong>ESV</strong> and the <strong>NRSVue</strong>; the <strong>NASB</strong> (which the{" "}
        <strong>LSB</strong> is a revision of) and the <strong>Amplified Bible</strong> are separate
        revisions of the ASV. The five below were made from scratch.
      </figcaption>
    </figure>
  );
}
