import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Blog",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  return (
    <ComingSoon
      title="Blog"
      description="Articles on translation history, textual criticism, and how to choose the right Bible for your context are coming soon."
    />
  );
}
