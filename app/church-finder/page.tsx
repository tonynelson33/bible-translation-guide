import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Church Finder" };

export default function ChurchFinderPage() {
  return (
    <ComingSoon
      title="Church Finder"
      description="Soon you'll be able to submit a church and see a community leaderboard of congregations by the translations they preach and teach from."
    />
  );
}
