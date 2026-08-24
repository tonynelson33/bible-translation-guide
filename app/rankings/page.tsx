import type { Metadata } from "next";
import RankingsPage from "@/components/RankingsPage";
import { rankingCategories, defaultRankingSlug } from "@/lib/rankings";

export const metadata: Metadata = {
  title: "Rankings",
  alternates: { canonical: "/rankings" },
};

export default function Page() {
  return <RankingsPage categories={rankingCategories} defaultSlug={defaultRankingSlug} />;
}
