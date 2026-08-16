import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import Nav from "@/components/Nav";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BibleTranslationGuide — Compare Bible Translations",
    template: "%s — BibleTranslationGuide",
  },
  description:
    "A clear, side-by-side comparison of ESV, KJV, NIV, NLT, CSB, LSB, NKJV, NASB, and NET — translation philosophy, reading level, textual basis, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable}`}>
      <body className="flex min-h-screen flex-col bg-white font-sans text-neutral-900 antialiased">
        <Nav />
        <main className="min-w-0 flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
