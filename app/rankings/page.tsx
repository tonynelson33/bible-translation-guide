import type { Metadata } from "next";
import RankingsPage from "@/components/RankingsPage";
import { rankingCategories } from "@/lib/rankings";

export const metadata: Metadata = { title: "Rankings" };

export default function Page() {
  return <RankingsPage categories={rankingCategories} />;
}
