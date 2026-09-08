import type { Metadata } from "next";
import { Inter, Lora, Newsreader } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Nav from "@/components/Nav";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Lora is kept for one job only: quoted scripture text (VerseCard, the verse
// comparison, the differences cards). Headings use Newsreader — see font-display.
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

// Display face for headings and the landing hero. A literary serif with an
// optical-size axis; next/font requests the variable font so weights 400–600
// and italics are all available under one --font-newsreader variable.
// adjustFontFallback is off because next/font has no metric-override data for
// Newsreader in this version (it logs an error and skips the adjustment either
// way); the CSS `display` stack falls back to Lora, which is close enough.
const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  style: ["normal", "italic"],
  adjustFontFallback: false,
});

const siteDescription =
  "A clear, side-by-side comparison of ESV, KJV, NIV, NLT, CSB, LSB, NKJV, NASB, and NET — translation philosophy, reading level, textual basis, and more.";

export const metadata: Metadata = {
  metadataBase: new URL("https://bibletranslationguide.vercel.app"),
  title: {
    default: "BibleTranslationGuide — Compare Bible Translations",
    template: "%s — BibleTranslationGuide",
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    siteName: "BibleTranslationGuide",
    title: "BibleTranslationGuide — Compare Bible Translations",
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: "BibleTranslationGuide — Compare Bible Translations",
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${lora.variable} ${newsreader.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-paper font-sans text-ink antialiased">
        <Nav />
        <main className="min-w-0 flex-1">{children}</main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
