import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What BibleTranslationGuide collects (almost nothing) and what it doesn't — no accounts, no tracking cookies, and none of the site's forms ask for your name or email.",
  alternates: { canonical: "/privacy" },
};

const sections: { title: string; body: ReactNode }[] = [
  {
    title: "The short version",
    body: (
      <p>
        This site doesn&rsquo;t have accounts, doesn&rsquo;t use tracking cookies, and
        doesn&rsquo;t ask for your name or email address anywhere on it &mdash; including in the
        forms. The only information collected is anonymous, aggregated visit data, and whatever
        facts about a church you choose to submit through the Church Finder forms.
      </p>
    ),
  },
  {
    title: "From everyone who visits",
    body: (
      <p>
        BibleTranslationGuide uses Vercel Analytics to see how many people visit and which pages
        they read. It doesn&rsquo;t use cookies, doesn&rsquo;t track you across other sites, and
        doesn&rsquo;t build a profile tied to you individually &mdash; it reports aggregate
        counts, not individual visitor records.{" "}
        <a
          href="https://vercel.com/legal/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-brand-700 hover:underline"
        >
          Vercel&rsquo;s own privacy policy
        </a>{" "}
        covers exactly what it collects and how.
      </p>
    ),
  },
  {
    title: "From the Church Finder forms",
    body: (
      <p>
        The forms for adding a church, correcting a listing, reporting one as closed, or
        suggesting a site correction ask only for facts about the church (or, for a site
        correction, about the page) &mdash; name, address, denomination, translation, website,
        and a note. None of them ask for your name, email, or any other way to identify you.
        Submissions are reviewed by hand before anything is published; nothing you submit appears
        on the site automatically.
      </p>
    ),
  },
  {
    title: "Where this is stored",
    body: (
      <p>
        Church Finder data and submissions are stored in a Supabase database. Supabase is a
        third-party service; its own{" "}
        <a
          href="https://supabase.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-brand-700 hover:underline"
        >
          privacy policy
        </a>{" "}
        covers how it handles data on its end. The public search only ever reads from the
        confirmed church directory &mdash; it has no access to edit or delete anything, by
        database policy, not just by convention.
      </p>
    ),
  },
  {
    title: "Children's privacy",
    body: (
      <p>
        This site isn&rsquo;t directed at children and doesn&rsquo;t knowingly collect
        information from anyone under 13.
      </p>
    ),
  },
  {
    title: "Changes to this policy",
    body: (
      <p>
        If this policy changes in a way that matters, the date at the top will change too.
        Material changes will be reflected here before they take effect.
      </p>
    ),
  },
  {
    title: "Questions",
    body: (
      <p>
        The <Link href="/about">correction form on the About page</Link> reaches the person who
        runs this site &mdash; that&rsquo;s the fastest way to ask a question about anything
        here.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold text-brand-900 sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-3 leading-relaxed text-neutral-700">
        Last updated September 21, 2026. This page explains what information
        BibleTranslationGuide collects, and what it doesn&rsquo;t.
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
