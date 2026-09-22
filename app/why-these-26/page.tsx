import type { Metadata } from "next";
import Link from "next/link";
import TranslationTiers from "@/components/TranslationTiers";

export const metadata: Metadata = {
  title: "Why These 26 Translations",
  description:
    "Why this site covers these twenty-six English translations and not others — the philosophy, textual tradition, and reading-level range they cover, and where each one actually sits in real-world recognition.",
  alternates: { canonical: "/why-these-26" },
};

export default function WhyThese26Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold text-brand-900 sm:text-4xl">
        Why these twenty-six translations
      </h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-neutral-700">
        Not a quality ranking &mdash; a recognition one. Roughly where each of the twenty-six
        actually lands if you picture every video or site that reviews Bible translations at
        once, from the names everyone already knows to the ones only a comparison this thorough
        would mention. Why these twenty-six specifically, the fuller case, is further down the
        page.
      </p>

      <div className="mt-8">
        <TranslationTiers />
      </div>

      <section className="mt-12 border-t border-neutral-200 pt-10">
        <h2 className="font-display text-2xl font-semibold text-brand-900">
          Why these twenty-six, not some other set
        </h2>
        <p className="mt-2 max-w-2xl leading-relaxed text-neutral-700">
          Not because they&rsquo;re the twenty-six most popular, and not because they&rsquo;re
          the twenty-six most respected &mdash; either of those lists would look different,
          clustering around a handful of familiar names and skipping anything smaller. This one
          is closer to a cross-section: one real representative for each meaningful point on the
          map, so a comparison across philosophy, textual basis, or reading level actually has
          range to show, instead of twenty-six versions of the same three or four approaches.
        </p>
        <p className="mt-3 max-w-2xl leading-relaxed text-neutral-700">
          In practice that means the set covers every point on the{" "}
          <Link href="/rankings" className="font-medium text-brand-700 hover:underline">
            translation-philosophy spectrum
          </Link>
          , not just the crowded middle; all three{" "}
          <Link href="/faq#text-types" className="font-medium text-brand-700 hover:underline">
            textual traditions
          </Link>{" "}
          behind the New Testament, not just the dominant one; and reading levels from about
          third grade to twelfth, so a translation picked for a child and one picked for seminary
          study are both actually here. The{" "}
          <Link href="/history#tree" className="font-medium text-brand-700 hover:underline">
            translation family tree
          </Link>{" "}
          shows how a third of them relate by descent; the rest are independent work.
        </p>
      </section>

      <section className="mt-12 border-t border-neutral-200 pt-10">
        <h2 className="font-display text-2xl font-semibold text-brand-900">
          The floor is legitimacy, not fame
        </h2>
        <p className="mt-2 max-w-2xl leading-relaxed text-neutral-700">
          Every translation on this page is a committee&rsquo;s work, or &mdash; in{" "}
          <Link href="/translations/message" className="font-medium text-brand-700 hover:underline">
            The Message
          </Link>
          &rsquo;s one case &mdash; a single translator&rsquo;s work that still went through real
          scholarly review. A translation can be popular and still miss that bar; see{" "}
          <Link href="/faq#paraphrase" className="font-medium text-brand-700 hover:underline">
            translation versus paraphrase
          </Link>{" "}
          for why something like The Passion Translation isn&rsquo;t included. The scope here is
          narrower than &ldquo;everything legitimate,&rdquo; too: see{" "}
          <Link href="/faq#apocrypha" className="font-medium text-brand-700 hover:underline">
            the Apocrypha question
          </Link>{" "}
          for why you won&rsquo;t find a Catholic or Orthodox edition here either.
        </p>
      </section>

      <div className="mt-14 rounded-lg border border-gild-200 bg-gild-50 px-5 py-4 text-sm leading-relaxed text-neutral-700">
        Want the full list, alphabetically, with a one-sentence summary of each?{" "}
        <Link href="/translations" className="font-medium text-gild-700 hover:underline">
          See all twenty-six
        </Link>
        .
      </div>
    </div>
  );
}
