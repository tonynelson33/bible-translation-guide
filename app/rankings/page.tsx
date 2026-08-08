import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Rankings" };

export default function RankingsPage() {
  return (
    <ComingSoon
      title="Rankings"
      description="Curated rankings — Most Popular, Best for Personal Study, Best for Pastors, and Best Overall Balance — are on their way."
    />
  );
}
