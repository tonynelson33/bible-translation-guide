import Link from "next/link";
import type { Translation } from "@/lib/types";
import type { TranslationProfile as TranslationProfileContent } from "@/lib/translationProfiles";
import type { SampleVerse } from "@/lib/data";
import type { VerseFetchResult } from "@/lib/verseProviders";
import { genderApproachGlossary, philosophyGlossary } from "@/lib/glossary";
import YesNoIcon from "./YesNoIcon";
import VerseCard from "./VerseCard";

function verifyMark(translation: Translation, field: string) {
  if (translation.verifyFields?.includes(field)) {
    return (
      <sup className="ml-0.5 text-brand-600" title="Flagged for manual verification before launch">
        †
      </sup>
    );
  }
  return null;
}

function StatCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white px-4 py-3">
      <dt className="text-xs font-bold uppercase tracking-wide text-neutral-500">{label}</dt>
      <dd className="mt-1 text-sm text-neutral-800">{children}</dd>
    </div>
  );
}

export default function TranslationProfile({
  translation,
  profile,
  sampleVerse,
  verseResult,
}: {
  translation: Translation;
  profile: TranslationProfileContent;
  sampleVerse: SampleVerse;
  verseResult: VerseFetchResult;
}) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/" className="text-sm font-medium text-brand-700 hover:underline">
        &larr; Back to the comparison table
      </Link>

      {/* Header */}
      <div className="mt-4 border-b border-neutral-200 pb-8">
        <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-wide text-brand-600">
          Translation Profile
        </span>
        <h1 className="font-serif text-3xl font-semibold text-brand-900 sm:text-4xl">
          {translation.name}
          <span className="ml-2 align-middle text-lg font-medium text-neutral-400">
            ({translation.abbreviation})
          </span>
        </h1>
        <p className="mt-3 max-w-2xl font-serif text-lg italic leading-relaxed text-neutral-700">
          {profile.tagline}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-neutral-600">
          <span>{translation.publisher}</span>
          <span className="text-neutral-300">&middot;</span>
          <span>
            First published {translation.firstPublishedYear}
            {translation.latestRevisionYear !== translation.firstPublishedYear &&
              ` · Latest revision ${translation.latestRevisionYear}`}
          </span>
          <span
            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${philosophyGlossary[translation.philosophy].className}`}
          >
            {translation.philosophy}
          </span>
          <span
            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${genderApproachGlossary[translation.genderApproach].className}`}
          >
            {translation.genderApproachLabel ?? translation.genderApproach}
          </span>
        </div>
      </div>

      {/* At a glance */}
      <div className="mt-8">
        <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-500">At a Glance</h2>
        <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Reading Level">
            {translation.gradeLevel}
            {verifyMark(translation, "gradeLevel")}
          </StatCard>
          <StatCard label="NT Textual Basis">{translation.textualBasis}</StatCard>
          <StatCard label="Quote Limit">
            {translation.quoteLimit}
            {verifyMark(translation, "quoteLimit")}
          </StatCard>
          <StatCard label="Red Letter Edition">
            <YesNoIcon value={translation.redLetter} label="Red letter edition available" />
          </StatCard>
          <StatCard label="Marks OT Quotations in NT">
            <div className="flex items-center gap-1.5">
              <YesNoIcon value={translation.otMarking.marks} label="Marks OT quotations in NT" />
              {translation.otMarking.marks && translation.otMarking.method && (
                <span className="text-xs text-neutral-500">({translation.otMarking.method})</span>
              )}
            </div>
          </StatCard>
          <StatCard label="Italicizes Translator Words">
            <YesNoIcon
              value={translation.italicizesTranslatorWords}
              label="Italicizes translator-supplied words"
            />
          </StatCard>
          <StatCard label="Capitalizes Deity Pronouns">
            <YesNoIcon
              value={translation.capitalizesDeityPronouns}
              label="Capitalizes deity pronouns"
            />
          </StatCard>
          <StatCard label="Quotation Marks for Dialogue">
            <YesNoIcon
              value={translation.quotationMarksForDialogue}
              label="Uses quotation marks for dialogue"
            />
          </StatCard>
        </dl>
        {translation.verifyFields && translation.verifyFields.length > 0 && (
          <p className="mt-2 text-xs text-neutral-500">
            <sup className="text-brand-600">†</sup> Flagged for manual verification against current
            publisher documentation.
          </p>
        )}
      </div>

      {/* Overview */}
      <div className="mt-10">
        <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-500">Overview</h2>
        <div className="mt-3 space-y-4">
          {profile.overview.map((paragraph, i) => (
            <p key={i} className="leading-relaxed text-neutral-700">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Distinctives / Good fit / Consider */}
      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-500">Distinctives</h2>
          <ul className="mt-3 space-y-2">
            {profile.distinctives.map((item, i) => (
              <li key={i} className="flex gap-2 text-sm leading-relaxed text-neutral-700">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-500">Good Fit For</h2>
          <ul className="mt-3 space-y-2">
            {profile.goodFor.map((item, i) => (
              <li key={i} className="flex gap-2 text-sm leading-relaxed text-neutral-700">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sample verse */}
      <div className="mt-10">
        <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-500">
          Sample Verse &mdash; {sampleVerse.reference}
        </h2>
        <div className="mt-3 max-w-xl">
          <VerseCard translation={translation} result={verseResult} />
        </div>
        <Link
          href={`/verses?verse=${sampleVerse.id}`}
          className="mt-3 inline-block text-sm font-medium text-brand-700 hover:underline"
        >
          Compare this verse across all translations &rarr;
        </Link>
      </div>
    </div>
  );
}
