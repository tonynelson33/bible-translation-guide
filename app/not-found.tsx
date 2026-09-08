import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-start px-4 py-20 sm:px-6 lg:px-8">
      <span className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-gild-700">
        404
      </span>
      <h1 className="font-display text-3xl font-semibold text-brand-900 sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-4 text-neutral-600">
        The page you&apos;re looking for doesn&apos;t exist, or may have moved.
      </p>
      <Link href="/" className="mt-8 text-sm font-medium text-brand-700 hover:underline">
        &larr; Back to the home page
      </Link>
    </div>
  );
}
