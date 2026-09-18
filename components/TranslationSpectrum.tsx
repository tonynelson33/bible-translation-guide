const X0 = 50;
const SPAN = 1600; // position 0 -> x=50, position 100 -> x=1650
const px = (pos: number) => X0 + (pos / 100) * SPAN;

const TRACK_Y = 70;
const TRACK_H = 26;

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

const FULL_NAME: Record<string, string> = {
  LSV: "Literal Standard Version",
  LSB: "Legacy Standard Bible",
  NASB: "New American Standard Bible",
  LEB: "Lexham English Bible",
  MSB: "Majority Standard Bible",
  BSB: "Berean Standard Bible",
  ESV: "English Standard Version",
  KJV: "King James Version",
  WEB: "World English Bible",
  NKJV: "New King James Version",
  MEV: "Modern English Version",
  "AMP *": "Amplified Bible",
  NRSVue: "New Revised Standard Version, Updated Edition",
  ISV: "International Standard Version",
  CSB: "Christian Standard Bible",
  NET: "New English Translation",
  GW: "GOD'S WORD Translation",
  NIV: "New International Version",
  "NIrV *": "New International Reader's Version",
  CEB: "Common English Bible",
  NCV: "New Century Version",
  NLT: "New Living Translation",
  GNT: "Good News Translation",
  CEV: "Contemporary English Version",
};

/**
 * The site's translation-method spectrum, extended 2026-09-18 from the
 * original twelve markers to all twenty-six, once the other fourteen (BSB,
 * WEB, GNT, CEV, NIrV, ISV, GW, NCV, MEV, LEB, The Voice, LSV, MSB, The
 * Message) were added to the site for real. Four bands, word-for-word
 * (Formal) on the left to thought-for-thought (Dynamic) toward the right,
 * plus a reference-only Paraphrase zone. The original twelve's positions
 * were cross-checked against a published translation-spectrum chart; the
 * other fourteen's are this guide's own read of each one's stated
 * translation philosophy, not independently cross-checked the same way —
 * a few, especially within the Dynamic band, were closer calls than others.
 */
const BANDS: Band[] = [
  { label: "Formal", sub: "word-for-word", from: 0, to: 40, fill: "#eef2ff", stroke: "#c7d2fe" },
  { label: "Mediating", sub: "optimal + mixed", from: 43, to: 58, fill: "#f0fdfa", stroke: "#99f6e4" },
  { label: "Dynamic", sub: "thought-for-thought", from: 60.5, to: 83.5, fill: "#fffbeb", stroke: "#fde68a" },
  { label: "Paraphrase", sub: "The Message, plus references", from: 85, to: 100, fill: "#f1f5f9", stroke: "#cbd5e1" },
];

const MARKERS: Marker[] = [
  // Formal
  { label: "LSV", pos: 0.5, above: true },
  { label: "LSB", pos: 3, above: false },
  { label: "NASB", pos: 6, above: true },
  { label: "LEB", pos: 9, above: false },
  { label: "MSB", pos: 12, above: true },
  { label: "BSB", pos: 14.5, above: false },
  { label: "ESV", pos: 17.5, above: true },
  { label: "KJV", pos: 20.5, above: false },
  { label: "WEB", pos: 23.5, above: true },
  { label: "NKJV", pos: 26.5, above: false },
  { label: "MEV", pos: 29.5, above: true },
  { label: "AMP *", pos: 33, above: false },
  { label: "NRSVue", pos: 37, above: true },
  // Mediating
  { label: "ISV", pos: 45, above: false },
  { label: "CSB", pos: 48.5, above: true },
  { label: "NET", pos: 52, above: false },
  { label: "GW", pos: 55.5, above: true },
  // Dynamic
  { label: "NIV", pos: 61, above: false },
  { label: "NIrV *", pos: 63.5, above: true },
  { label: "CEB", pos: 66.5, above: false },
  { label: "NCV", pos: 69.5, above: true },
  { label: "NLT", pos: 72.5, above: false },
  { label: "GNT", pos: 75.5, above: true },
  { label: "The Voice", pos: 78.5, above: false },
  { label: "CEV", pos: 81, above: true },
  // Paraphrase — reference zone. The Message is the one translation the
  // site profiles here; The Passion and the Living Bible stay plain
  // references, not profiled.
  { label: "The Message", pos: 86, above: false },
  { label: "The Passion", pos: 92, above: true },
  { label: "Living Bible", pos: 99, above: false },
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
          viewBox="0 0 1700 150"
          className="w-full min-w-[1700px]"
          role="img"
          aria-label="Translation spectrum for all twenty-six translations on the site. Formal, word-for-word: LSV, LSB, NASB, LEB, MSB, BSB, ESV, KJV, WEB, NKJV, MEV, AMP, and NRSVue. Mediating: ISV, CSB, NET, and GW. Dynamic, thought-for-thought: NIV, NIrV, CEB, NCV, NLT, GNT, The Voice, and CEV. In the reference-only paraphrase zone, The Message is the one translation this site profiles; The Passion and the Living Bible remain plain references, not profiled."
        >
          {BANDS.map((band) => {
            const x = px(band.from);
            const w = px(band.to) - x;
            const cx = x + w / 2;
            return (
              <g key={band.label}>
                <rect x={x} y={TRACK_Y} width={w} height={TRACK_H} rx={4} fill={band.fill} stroke={band.stroke} />
                <text x={cx} y={23} textAnchor="middle" fill="#404040" fontSize={15} fontWeight={500}>
                  {band.label}
                </text>
                <text x={cx} y={39} textAnchor="middle" fill="#a3a3a3" fontSize={12}>
                  {band.sub}
                </text>
              </g>
            );
          })}
          {MARKERS.map((marker) => {
            const x = px(marker.pos);
            return (
              <g key={marker.label}>
                {FULL_NAME[marker.label] && <title>{FULL_NAME[marker.label]}</title>}
                <line
                  x1={x}
                  y1={TRACK_Y - 4}
                  x2={x}
                  y2={TRACK_Y + TRACK_H + 4}
                  stroke="#475569"
                  strokeWidth={1.5}
                />
                <text
                  x={x}
                  y={marker.above ? 58 : 122}
                  textAnchor="middle"
                  fill="#525252"
                  fontSize={13}
                >
                  {marker.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-500">
        {standalone
          ? "The translations in translation-method order, "
          : "The same order as the list, "}
        word-for-word (Formal) on the left, thought-for-thought (Dynamic) toward the right, with
        two flavors of middle ground between, plus a reference-only paraphrase zone.{" "}
        <span aria-hidden="true">*</span> The Amplified&apos;s asterisk marks its bracketed
        expansions pulling the printed page rightward of its NASB-level base text; the{" "}
        <strong>NIrV</strong>&rsquo;s marks the same idea in reverse &mdash; it&rsquo;s the
        NIV&rsquo;s own text and method, simplified in vocabulary for a third-grade reading level,
        not a separate philosophy, so it sits beside its parent rather than further right. Five of
        the translations (<strong>WEB</strong>, <strong>LSV</strong>, <strong>MSB</strong>, and
        &mdash; like the <strong>NKJV</strong> &mdash; <strong>MEV</strong>) draw on the
        Byzantine Majority Text or the Textus Receptus rather than the modern Critical Text most
        of the rest use.
        <br />
        <br />
        <strong>The Message</strong> sits in the otherwise reference-only Paraphrase zone: Eugene
        Peterson worked from the Hebrew and Greek himself and twenty scholars reviewed it, a real
        cut above <strong>The Passion</strong> and the <strong>Living Bible</strong>, which stay
        plain gray references &mdash; not profiled, just there to mark where the paraphrase zone
        sits relative to everything else.
      </p>
    </div>
  );
}
