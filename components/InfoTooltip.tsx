export default function InfoTooltip({ text }: { text: string }) {
  return (
    <span className="group relative ml-1 inline-flex cursor-help items-center align-middle">
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
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-56 -translate-x-1/2 rounded bg-neutral-900 px-2.5 py-1.5 text-center text-xs font-normal normal-case leading-snug text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
      >
        {text}
      </span>
    </span>
  );
}
