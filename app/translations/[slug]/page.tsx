import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ComingSoon from "@/components/ComingSoon";
import TranslationProfile from "@/components/TranslationProfile";
import { translations, sampleVerses, getTranslation } from "@/lib/data";
import { translationProfiles } from "@/lib/translationProfiles";
import { fetchVerseForTranslation } from "@/lib/verseProviders";

export function generateStaticParams() {
  return translations.map((t) => ({ slug: t.id }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const translation = getTranslation(params.slug);
  return {
    title: translation ? translation.abbreviation : "Translation",
    alternates: { canonical: `/translations/${params.slug}` },
  };
}

export default async function TranslationProfilePage({ params }: { params: { slug: string } }) {
  const translation = getTranslation(params.slug);
  if (!translation) notFound();

  const profile = translationProfiles[translation.id];
  if (!profile) {
    return (
      <ComingSoon
        eyebrow={translation.abbreviation}
        title={translation.name}
        description={`A full profile page for the ${translation.name} — history, sample passages, notable features, and more — is on its way. In the meantime, see how it stacks up on the comparison table.`}
      />
    );
  }

  const sampleVerse = sampleVerses[0];
  const verseResult = await fetchVerseForTranslation(translation, sampleVerse);

  return (
    <TranslationProfile
      translation={translation}
      profile={profile}
      sampleVerse={sampleVerse}
      verseResult={verseResult}
    />
  );
}
