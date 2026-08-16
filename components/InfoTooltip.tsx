import Tooltip from "./Tooltip";

export default function InfoTooltip({ text }: { text: string }) {
  return (
    <Tooltip text={text}>
      <span className="ml-1 inline-flex items-center align-middle">
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          aria-hidden="true"
          className="h-3.5 w-3.5 text-neutral-400"
        >
          <circle cx="10" cy="10" r="8" strokeWidth="1.5" />
          <circle cx="10" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
          <line x1="10" y1="9.5" x2="10" y2="14.5" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </span>
    </Tooltip>
  );
}
