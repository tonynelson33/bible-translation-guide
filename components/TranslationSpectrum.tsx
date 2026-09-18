const X0 = 30;
const SPAN = 800; // position 0 -> x=30, position 100 -> x=830
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
 * plus The Message alone in its own Paraphrase zone (The Passion and the
 * Living Bible, both reference-only and never profiled here, were dropped
 * from the diagram entirely rather than kept as unprofiled reference
 * points — with only one paraphrase actually on the site, a zone sized for
 * three was mostly empty space). The original twelve's positions were
 * cross-checked against a published translation-spectrum chart; the other
 * fourteen's are this guide's own read of each one's stated translation
 * philosophy, not independently cross-checked the same way — a few,
 * especially within the Dynamic band, were closer calls than others.
 * Marker spacing within each band is deliberately uneven, not a mechanical
 * even split — translations that read as genuinely close together (e.g.
 * ESV/KJV/WEB) sit tighter than ones with more real daylight between them
 * (e.g. AMP's bracketed expansions, or NRSVue easing toward Mediating).
 */
const BANDS: Band[] = [
  { label: "Formal", sub: "word-for-word", from: 0, to: 44, fill: "#eef2ff", stroke: "#c7d2fe" },
  { label: "Mediating", sub: "optimal + mixed", from: 46.5, to: 63, fill: "#f0fdfa", stroke: "#99f6e4" },
  { label: "Dynamic", sub: "thought-for-thought", from: 65.5, to: 91.5, fill: "#fffbeb", stroke: "#fde68a" },
  { label: "Paraphrase", sub: "freely restated", from: 94, to: 100, fill: "#f1f5f9", stroke: "#cbd5e1" },
];

const MARKERS: Marker[] = [
  // Formal
  { label: "LSV", pos: 2, above: true },
  { label: "LSB", pos: 5.5, above: false },
  { label: "NASB", pos: 8.5, above: true },
  { label: "LEB", pos: 11, above: false },
  { label: "MSB", pos: 14, above: true },
  { label: "BSB", pos: 16.5, above: false },
  { label: "ESV", pos: 20, above: true },
  { label: "KJV", pos: 23, above: false },
  { label: "WEB", pos: 26, above: true },
  { label: "NKJV", pos: 29.5, above: false },
  { label: "MEV", pos: 32.5, above: true },
  { label: "AMP *", pos: 37, above: false },
  { label: "NRSVue", pos: 41.5, above: true },
  // Mediating
  { label: "ISV", pos: 48, above: false },
  { label: "CSB", pos: 52.5, above: true },
  { label: "NET", pos: 56.5, above: false },
  { label: "GW", pos: 61, above: true },
  // Dynamic
  { label: "NIV", pos: 65.5, above: false },
  { label: "NIrV *", pos: 68.5, above: true },
  { label: "CEB", pos: 72, above: false },
  { label: "NCV", pos: 75.5, above: true },
  { label: "NLT", pos: 79, above: false },
  { label: "GNT", pos: 82.5, above: true },
  { label: "The Voice", pos: 86, above: false },
  { label: "CEV", pos: 89.5, above: true },
  // Paraphrase — the one translation this site profiles at this end of the
  // spectrum.
  { label: "The Message", pos: 97, above: false },
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
          viewBox="0 0 860 140"
          className="mx-auto block h-auto w-full max-w-[860px]"
          role="img"
          aria-label="Translation spectrum for all twenty-six translations on the site. Formal, word-for-word: LSV, LSB, NASB, LEB, MSB, BSB, ESV, KJV, WEB, NKJV, MEV, AMP, and NRSVue. Mediating: ISV, CSB, NET, and GW. Dynamic, thought-for-thought: NIV, NIrV, CEB, NCV, NLT, GNT, The Voice, and CEV. The Message sits alone in its own Paraphrase zone."
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
        two flavors of middle ground between, and <strong>The Message</strong> alone in its own
        Paraphrase zone &mdash; the only paraphrase this site profiles.{" "}
        <span aria-hidden="true">*</span> The Amplified&apos;s asterisk marks its bracketed
        expansions pulling the printed page rightward of its NASB-level base text; the{" "}
        <strong>NIrV</strong>&rsquo;s marks the same idea in reverse &mdash; it&rsquo;s the
        NIV&rsquo;s own text and method, simplified in vocabulary for a third-grade reading level,
        not a separate philosophy, so it sits beside its parent rather than further right. Five of
        the translations (<strong>WEB</strong>, <strong>LSV</strong>, <strong>MSB</strong>, and
        &mdash; like the <strong>NKJV</strong> &mdash; <strong>MEV</strong>) draw on the
        Byzantine Majority Text or the Textus Receptus rather than the modern Critical Text most
        of the rest use.
      </p>
    </div>
  );
}
