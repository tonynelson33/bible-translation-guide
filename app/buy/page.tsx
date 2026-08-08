import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Buy" };

export default function BuyPage() {
  return (
    <ComingSoon
      title="Buy a Bible"
      description="Links to purchase each translation in print and digital editions are coming soon."
    />
  );
}
