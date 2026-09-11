import Tooltip from "./Tooltip";

const COPY: Record<"directory" | "crowd", { label: string; text: string; className: string }> = {
  directory: {
    label: "Directory-matched",
    text: "Matched against the denomination or network's own church directory — the highest-confidence source this site uses.",
    className: "bg-brand-50 text-brand-800 ring-1 ring-inset ring-brand-200",
  },
  crowd: {
    label: "Crowd-sourced",
    text: "Matched via OpenStreetMap or another public church directory, not verified against the denomination's own records — usually right, occasionally off.",
    className: "bg-neutral-100 text-neutral-600 ring-1 ring-inset ring-neutral-300",
  },
};

/**
 * Small provenance tag for a church's denomination/translation match — see
 * `Church.categoryConfidence` in lib/churches.ts. Renders nothing for the (majority)
 * unmarked case: this is additive signal, not a warning label, so a plain match stays
 * plain rather than getting flagged as suspect.
 */
export default function ConfidenceBadge({
  confidence,
}: {
  confidence: "directory" | "crowd" | null;
}) {
  if (!confidence) return null;
  const c = COPY[confidence];
  return (
    <Tooltip text={c.text}>
      <span
        className={`ml-1.5 inline-flex items-center rounded-full px-1.5 py-0.5 align-middle text-[0.65rem] font-semibold uppercase tracking-wide ${c.className}`}
      >
        {c.label}
      </span>
    </Tooltip>
  );
}
