import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import SiteCorrectionForm from "@/components/SiteCorrectionForm";

export const metadata: Metadata = {
  title: "About This Site",
  description:
    "What BibleTranslationGuide is, the perspective behind it, how the comparison data and rankings are put together, and how to flag a correction.",
  alternates: { canonical: "/about" },
};

const sections: { title: string; body: ReactNode }[] = [
  {
    title: "What it is",
    body: (
      <>
        <p>
          BibleTranslationGuide is a non-commercial guide to the English Bible translations most
          used in Protestant churches in the United States. It profiles{" "}
          <Link href="/compare">twelve of them</Link> in depth, covers the 66-book Protestant
          canon, and has no affiliation with any publisher &mdash; the buy links are plain outbound
          links with no affiliate tracking.
        </p>
        <p>
          It exists because &ldquo;which translation should I read?&rdquo; is a genuinely hard
          question with no single answer, and most of what&rsquo;s written about it is either a
          sales pitch or a fight.
        </p>
      </>
    ),
  },
  {
    title: "The perspective",
    body: (
      <>
        <p>
          The aim is to describe rather than prescribe: to lay out how each translation was made,
          where its text comes from, and what it&rsquo;s good for, and let you choose. The site is
          written from within the Protestant tradition &mdash; that&rsquo;s the scope, not a claim
          that other traditions are wrong.
        </p>
        <p>
          A few pages do take a position &mdash; the <Link href="/rankings">rankings</Link> most of
          all. Where that happens, the reasoning is shown alongside the conclusion so you can weigh
          it yourself. On the contested questions (the Textus Receptus versus the Critical Text,
          gender language, KJV-onlyism) the goal is to represent each side fairly and point to
          where the actual disagreement is.
        </p>
      </>
    ),
  },
  {
    title: "How the content is made",
    body: (
      <>
        <p>
          The <Link href="/compare">comparison table</Link> is built from each publisher&rsquo;s
          own documentation &mdash; permission policies, prefaces, edition histories &mdash; and
          checked against it periodically. Reading-grade numbers are approximate and vary by how
          they&rsquo;re measured; the fields marked{" "}
          <span className="font-semibold text-brand-600">&dagger;</span> are not fully confirmed.
        </p>
        <p>
          The <Link href="/differences">translation differences</Link> and{" "}
          <Link href="/verses">verse comparisons</Link> quote each translation under its
          publisher&rsquo;s allowance for non-commercial use, with the required copyright notice
          shown; the words and punctuation are reproduced exactly. The{" "}
          <Link href="/history">history</Link> follows standard reference works, and its images are
          all public domain.
        </p>
        <p>
          The <Link href="/church-finder">Church Finder</Link> is built on public U.S. church
          location data plus corrections and additions that visitors submit. Only a small fraction
          of listings have a confirmed pulpit translation so far &mdash; that part grows one church
          at a time.
        </p>
      </>
    ),
  },
  {
    title: "What’s not here",
    body: (
      <p>
        Deliberately left out: paraphrases (The Message, The Passion Translation); Catholic and
        Orthodox editions (Douay-Rheims, NABRE, RSV-2CE); readability editions with little pulpit
        use (the Good News Translation, the CEV); the public-domain WEB; and the 1952 RSV, which
        the ESV and NRSVue have superseded. The reasoning for the set is in the{" "}
        <Link href="/faq">FAQ</Link>.
      </p>
    ),
  },
  {
    title: "Corrections",
    body: (
      <>
        <p>
          Church listings have their own forms &mdash; every Church Finder result has a
          &ldquo;suggest a correction&rdquo; link, and there&rsquo;s a form to add one that&rsquo;s
          missing. For anything else &mdash; a wrong date, a misquoted verse, an out-of-step
          permission figure, a broken link &mdash; use the form below. It goes to a review queue,
          not straight onto the page.
        </p>
        <SiteCorrectionForm />
      </>
    ),
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold text-brand-900 sm:text-4xl">
        About this site
      </h1>
      <p className="mt-3 leading-relaxed text-neutral-700">
        A quick account of what this is, where it&rsquo;s coming from, and how the content is made.
      </p>

      <div className="mt-8 divide-y divide-neutral-200">
        {sections.map((s) => (
          <section key={s.title} className="py-8 first:pt-0">
            <h2 className="font-display text-xl font-semibold text-brand-900">{s.title}</h2>
            <div className="mt-3 space-y-3 leading-relaxed text-neutral-700 [&_a]:font-medium [&_a]:text-brand-700 [&_a:hover]:underline">
              {s.body}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
