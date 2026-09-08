const X0 = 40;
const SPAN = 740; // position 0 -> x=40, position 100 -> x=780
const px = (pos: number) => X0 + (pos / 100) * SPAN;

const TRACK_Y = 66;
const TRACK_H = 24;

interface Band {
  label: string;
  sub: string;
  from: number;
  to: number;
  fill: string;
  stroke: string;
}

interface Marker {
  label: string;
  pos: number;
  above: boolean;
}

/**
 * A visual restatement of the "Most Literal" ranking: the same 12 translations
 * in the same left-to-right order, grouped into the three bands every published
 * translation-spectrum chart uses (formal / mediating / dynamic), plus a
 * paraphrase zone the site doesn't cover. Band colors echo the philosophy pills
 * in lib/glossary.ts. Positions are hand-set so the tight clusters stay visible.
 */
const BANDS: Band[] = [
  { label: "Formal", sub: "word-for-word", from: 0, to: 40, fill: "#eef2ff", stroke: "#c7d2fe" },
  { label: "Mediating", sub: "optimal + mixed", from: 43, to: 57, fill: "#f0fdfa", stroke: "#99f6e4" },
  { label: "Dynamic", sub: "thought-for-thought", from: 60, to: 82, fill: "#fffbeb", stroke: "#fde68a" },
  { label: "Paraphrase", sub: "not on this site", from: 84, to: 100, fill: "#f1f5f9", stroke: "#cbd5e1" },
];

const MARKERS: Marker[] = [
  { label: "LSB", pos: 2, above: true },
  { label: "NASB", pos: 5, above: false },
  { label: "ESV", pos: 13, above: true },
  { label: "KJV", pos: 16, above: false },
  { label: "NKJV", pos: 20, above: true },
  { label: "AMP *", pos: 27, above: false },
  { label: "NRSVue", pos: 35, above: true },
  { label: "CSB", pos: 46, above: false },
  { label: "NET", pos: 54, above: true },
  { label: "NIV", pos: 64, above: false },
  { label: "CEB", pos: 72, above: true },
  { label: "NLT", pos: 80, above: false },
  { label: "The Message", pos: 86, above: true },
  { label: "The Passion", pos: 92, above: false },
  { label: "Living Bible", pos: 99, above: true },
];

export default function TranslationSpectrum({
  standalone = false,
}: {
  /** True when the chart isn't sitting directly below the ranked list. */
  standalone?: boolean;
}) {
  return (
    <div className="mt-5">
      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 820 126"
          className="w-full min-w-[820px]"
          role="img"
          aria-label="Translation spectrum, in the same left-to-right order as the ranking. Formal, word-for-word: LSB, NASB, ESV, KJV, NKJV, AMP, NRSVue. Mediating: CSB, NET. Dynamic, thought-for-thought: NIV, CEB, NLT. A separate paraphrase zone this site does not cover: The Message, The Passion, the Living Bible."
        >
          {BANDS.map((band) => {
            const x = px(band.from);
            const w = px(band.to) - x;
            const cx = x + w / 2;
            return (
              <g key={band.label}>
                <rect x={x} y={TRACK_Y} width={w} height={TRACK_H} rx={4} fill={band.fill} stroke={band.stroke} />
                <text x={cx} y={19} textAnchor="middle" fill="#404040" fontSize={13.5} fontWeight={500}>
                  {band.label}
                </text>
                <text x={cx} y={34} textAnchor="middle" fill="#a3a3a3" fontSize={11}>
                  {band.sub}
                </text>
              </g>
            );
          })}
          {MARKERS.map((marker) => {
            const x = px(marker.pos);
            return (
              <g key={marker.label}>
                <line
                  x1={x}
                  y1={TRACK_Y - 4}
                  x2={x}
                  y2={TRACK_Y + TRACK_H + 4}
                  stroke="#475569"
                  strokeWidth={1.5}
                />
                <text x={x} y={marker.above ? 56 : 114} textAnchor="middle" fill="#525252" fontSize={12}>
                  {marker.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-500">
        {standalone
          ? "The twelve translations in translation-method order, "
          : "The same order as the list, "}
        in the three bands that published spectrum charts use, plus a paraphrase zone the site
        doesn&apos;t profile. The axis is translation method, not reading difficulty.{" "}
        <span aria-hidden="true">*</span> The Amplified&apos;s base text is as formal as the NASB; the
        bracketed expansions pull the printed page rightward.
      </p>
    </div>
  );
}
