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
  /** Candidate translation, not yet on the site — rendered in gold. */
  candidate?: boolean;
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
 * A decision-support extension of TranslationSpectrum: the same twelve
 * translations, on the same four-band translation-method axis, plus
 * fourteen candidates the site is weighing (gold) — the thirteen real
 * translations plus The Message, the one paraphrase judged good enough to
 * weigh alongside them (see CandidateTranslationTree's figcaption for why).
 * See MEMORY.md / project_bible_guide_candidate_translations for the list.
 * The twelve's positions are unchanged from the real spectrum; the
 * candidates' positions are this guide's own read of each one's stated
 * translation philosophy, not independently cross-checked against a
 * published chart the way the twelve were.
 */
const BANDS: Band[] = [
  { label: "Formal", sub: "word-for-word", from: 0, to: 40, fill: "#eef2ff", stroke: "#c7d2fe" },
  { label: "Mediating", sub: "optimal + mixed", from: 43, to: 58, fill: "#f0fdfa", stroke: "#99f6e4" },
  { label: "Dynamic", sub: "thought-for-thought", from: 60.5, to: 83.5, fill: "#fffbeb", stroke: "#fde68a" },
  { label: "Paraphrase", sub: "not on this site", from: 85, to: 100, fill: "#f1f5f9", stroke: "#cbd5e1" },
];

const MARKERS: Marker[] = [
  // Formal
  { label: "LSV", pos: 0.5, above: true, candidate: true },
  { label: "LSB", pos: 3, above: false },
  { label: "NASB", pos: 6, above: true },
  { label: "LEB", pos: 9, above: false, candidate: true },
  { label: "MSB", pos: 12, above: true, candidate: true },
  { label: "BSB", pos: 14.5, above: false, candidate: true },
  { label: "ESV", pos: 17.5, above: true },
  { label: "KJV", pos: 20.5, above: false },
  { label: "WEB", pos: 23.5, above: true, candidate: true },
  { label: "NKJV", pos: 26.5, above: false },
  { label: "MEV", pos: 29.5, above: true, candidate: true },
  { label: "AMP *", pos: 33, above: false },
  { label: "NRSVue", pos: 37, above: true },
  // Mediating
  { label: "ISV", pos: 45, above: false, candidate: true },
  { label: "CSB", pos: 48.5, above: true },
  { label: "NET", pos: 52, above: false },
  { label: "GW", pos: 55.5, above: true, candidate: true },
  // Dynamic
  { label: "NIV", pos: 61, above: false },
  { label: "NIrV *", pos: 63.5, above: true, candidate: true },
  { label: "CEB", pos: 66.5, above: false },
  { label: "NCV", pos: 69.5, above: true, candidate: true },
  { label: "NLT", pos: 72.5, above: false },
  { label: "GNT", pos: 75.5, above: true, candidate: true },
  { label: "The Voice", pos: 78.5, above: false, candidate: true },
  { label: "CEV", pos: 81, above: true, candidate: true },
  // Paraphrase — reference zone. The Message is the one candidate here (gold);
  // The Passion and the Living Bible stay plain references, not candidates.
  { label: "The Message", pos: 86, above: false, candidate: true },
  { label: "The Passion", pos: 92, above: true },
  { label: "Living Bible", pos: 99, above: false },
];

export default function CandidateTranslationSpectrum() {
  return (
    <div className="mt-5">
      <div className="overflow-x-auto">
        <svg
          viewBox="0 0 1700 150"
          className="w-full min-w-[1700px]"
          role="img"
          aria-label="Translation spectrum with fourteen candidate translations added in gold, alongside the twelve already on the site. Formal, word-for-word: the candidates LSV, LEB, MSB, BSB, WEB, and MEV join LSB, NASB, ESV, KJV, NKJV, AMP, and NRSVue. Mediating: the candidates ISV and GW join CSB and NET. Dynamic, thought-for-thought: the candidates NIrV, NCV, GNT, The Voice, and CEV join NIV, CEB, and NLT. In the reference-only paraphrase zone, The Message is also a gold candidate; The Passion and the Living Bible remain plain references, not candidates."
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
            const lineColor = marker.candidate ? "#6f4c14" : "#475569";
            const textColor = marker.candidate ? "#6f4c14" : "#525252";
            return (
              <g key={marker.label}>
                {FULL_NAME[marker.label] && <title>{FULL_NAME[marker.label]}</title>}
                <line
                  x1={x}
                  y1={TRACK_Y - 4}
                  x2={x}
                  y2={TRACK_Y + TRACK_H + 4}
                  stroke={lineColor}
                  strokeWidth={1.5}
                  strokeDasharray={marker.candidate ? "3 2" : undefined}
                />
                <text
                  x={x}
                  y={marker.above ? 58 : 122}
                  textAnchor="middle"
                  fill={textColor}
                  fontSize={13}
                  fontStyle={marker.candidate ? "italic" : "normal"}
                >
                  {marker.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-500">
        The navy names are the twelve currently on the guide, positioned exactly as on the main
        spectrum. The gold, italicized names are candidates we&apos;re weighing &mdash; not yet
        part of the site &mdash; placed on the same translation-method axis: word-for-word
        (Formal) on the left, thought-for-thought (Dynamic) toward the right, with two flavors of
        middle ground between.{" "}
        <span aria-hidden="true">*</span> The Amplified&apos;s asterisk marks its bracketed
        expansions pulling the printed page rightward of its NASB-level base text; the{" "}
        <strong>NIrV</strong>&rsquo;s marks the same idea in reverse &mdash; it&rsquo;s the
        NIV&rsquo;s own text and method, simplified in vocabulary for a third-grade reading level,
        not a separate philosophy, so it sits beside its parent rather than further right. Four of
        the candidates (<strong>WEB</strong>, <strong>LSV</strong>, <strong>MSB</strong>, and
        &mdash; like the NKJV already on the site &mdash; <strong>MEV</strong>) draw on the
        Byzantine Majority Text or the Textus Receptus rather than the modern Critical Text most
        of the twelve use. The twelve&rsquo;s placements were cross-checked against a published
        translation-spectrum chart; the candidates&rsquo; are this guide&rsquo;s own best-effort
        read of each one&rsquo;s stated translation philosophy &mdash; a few, especially within
        the Dynamic band, are closer calls than others.
        <br />
        <br />
        <strong>The Message</strong> is gold too, the one candidate inside the otherwise
        reference-only Paraphrase zone: Eugene Peterson worked from the Hebrew and Greek himself
        and twenty scholars reviewed it, a real cut above <strong>The Passion</strong> and the{" "}
        <strong>Living Bible</strong>, which stay plain gray references &mdash; not candidates,
        just there to mark where the paraphrase zone sits relative to everything else.
      </p>
    </div>
  );
}
