export default function YesNoIcon({ value, label }: { value: boolean; label?: string }) {
  const srLabel = label ? `${label}: ${value ? "Yes" : "No"}` : value ? "Yes" : "No";
  return (
    <span className="inline-flex items-center justify-center" title={srLabel}>
      <span className="sr-only">{srLabel}</span>
      {value ? (
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          className="h-5 w-5 text-brand-700"
        >
          <path
            fillRule="evenodd"
            d="M16.704 5.29a1 1 0 010 1.415l-7.25 7.25a1 1 0 01-1.415 0l-3.25-3.25a1 1 0 111.415-1.414l2.542 2.543 6.543-6.543a1 1 0 011.415 0z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          className="h-5 w-5 text-neutral-300"
        >
          <path
            fillRule="evenodd"
            d="M10 8.586L5.707 4.293a1 1 0 00-1.414 1.414L8.586 10l-4.293 4.293a1 1 0 101.414 1.414L10 11.414l4.293 4.293a1 1 0 001.414-1.414L11.414 10l4.293-4.293a1 1 0 00-1.414-1.414L10 8.586z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </span>
  );
}
