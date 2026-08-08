import Link from "next/link";

export default function ComingSoon({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-start px-4 py-20 sm:px-6 lg:px-8">
      {eyebrow && (
        <span className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-600">
          {eyebrow}
        </span>
      )}
      <h1 className="font-serif text-3xl font-semibold text-brand-900 sm:text-4xl">{title}</h1>
      <p className="mt-4 text-neutral-600">{description}</p>
      <span className="mt-6 inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-800">
        Coming soon
      </span>
      <Link href="/" className="mt-8 text-sm font-medium text-brand-700 hover:underline">
        &larr; Back to the comparison table
      </Link>
    </div>
  );
}
