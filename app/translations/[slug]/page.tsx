import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ComingSoon from "@/components/ComingSoon";
import { translations, getTranslation } from "@/lib/data";

export function generateStaticParams() {
  return translations.map((t) => ({ slug: t.id }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const translation = getTranslation(params.slug);
  return { title: translation ? translation.abbreviation : "Translation" };
}

export default function TranslationProfilePage({ params }: { params: { slug: string } }) {
  const translation = getTranslation(params.slug);
  if (!translation) notFound();

  return (
    <ComingSoon
      eyebrow={translation.abbreviation}
      title={translation.name}
      description={`A full profile page for the ${translation.name} — history, sample passages, notable features, and more — is on its way. In the meantime, see how it stacks up on the comparison table.`}
    />
  );
}
