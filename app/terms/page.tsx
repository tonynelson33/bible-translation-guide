import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The terms for using BibleTranslationGuide — a free, non-commercial reference site with no accounts and nothing to buy on it.",
  alternates: { canonical: "/terms" },
};

const sections: { title: string; body: ReactNode }[] = [
  {
    title: "What this site is",
    body: (
      <p>
        BibleTranslationGuide is a free, non-commercial reference site comparing English Bible
        translations and helping people find which translation their church uses. There&rsquo;s
        no account to create and nothing to buy here &mdash; the buy links go to outside
        retailers and publishers.
      </p>
    ),
  },
  {
    title: "Accuracy of the content",
    body: (
      <p>
        Real care goes into this site&rsquo;s comparison data &mdash; it&rsquo;s built from
        publisher documentation and checked periodically &mdash; but it can still be incomplete,
        out of date, or wrong in places. Fields the site itself isn&rsquo;t fully confident in
        are marked with a &dagger; and explained on the <Link href="/about">About page</Link>.
        For anything you&rsquo;re relying on for a real decision, verify it against the publisher
        or another primary source.
      </p>
    ),
  },
  {
    title: "Scripture text",
    body: (
      <p>
        Verses quoted on this site remain the copyrighted property of their respective
        publishers, quoted here under each publisher&rsquo;s own terms for non-commercial use,
        with the attribution each requires shown alongside the text. This site claims no
        ownership over any quoted scripture.
      </p>
    ),
  },
  {
    title: "Church Finder data",
    body: (
      <p>
        Church listings come from public sources and from corrections and additions visitors
        submit, reviewed by hand before being published. Listings can still be incomplete,
        outdated, or inaccurate &mdash; a church&rsquo;s translation, in particular, reflects
        research into what that congregation actually uses, not an official statement from the
        church. Appearing in this directory isn&rsquo;t an endorsement of a church or
        denomination, and absence from it isn&rsquo;t a judgment either &mdash; most churches
        simply haven&rsquo;t been researched yet.
      </p>
    ),
  },
  {
    title: "Submitting a correction or addition",
    body: (
      <p>
        By submitting information through this site&rsquo;s forms, you&rsquo;re confirming
        it&rsquo;s accurate to your knowledge, and you&rsquo;re giving this site permission to
        publish and use it. Every submission is reviewed by a person before anything changes on
        the live site; submitting something doesn&rsquo;t guarantee it gets published.
      </p>
    ),
  },
  {
    title: "Acceptable use",
    body: (
      <p>
        Please don&rsquo;t scrape or bulk-download the church directory, submit false or
        malicious information, or otherwise try to abuse the site&rsquo;s forms or search. Access
        can be restricted for anyone who does.
      </p>
    ),
  },
  {
    title: "Third-party links",
    body: (
      <p>
        Links to publishers, retailers, denominations, and other outside sites are provided for
        convenience. Following one takes you to a site this project doesn&rsquo;t control and
        isn&rsquo;t responsible for.
      </p>
    ),
  },
  {
    title: "No warranty",
    body: (
      <p>
        This site is provided as is, without warranties of any kind. It&rsquo;s a best-effort
        reference, not professional, theological, or legal advice, and nothing here should be
        treated as a guarantee of accuracy or completeness.
      </p>
    ),
  },
  {
    title: "Copyright concerns",
    body: (
      <p>
        If you believe something on this site infringes a copyright you hold, use the{" "}
        <Link href="/about">correction form on the About page</Link> to describe the issue
        &mdash; including what&rsquo;s affected and where &mdash; and it&rsquo;ll be looked at.
      </p>
    ),
  },
  {
    title: "Changes to these terms",
    body: (
      <p>
        These terms may be updated from time to time; the date at the top reflects the most
        recent change. Continuing to use the site after a change means you accept the updated
        terms.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold text-brand-900 sm:text-4xl">
        Terms of Use
      </h1>
      <p className="mt-3 leading-relaxed text-neutral-700">
        Last updated September 21, 2026. By using BibleTranslationGuide, you agree to these
        terms.
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
