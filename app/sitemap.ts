import type { MetadataRoute } from "next";
import { translations } from "@/lib/data";

const baseUrl = "https://bibletranslationguide.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/compare",
    "/translations",
    "/verses",
    "/rankings",
    "/differences",
    "/history",
    "/blog",
    "/faq",
    "/why-these-26",
    "/glossary",
    "/about",
    "/church-finder",
    "/buy",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
  }));

  const translationRoutes = translations.map((t) => ({
    url: `${baseUrl}/translations/${t.id}`,
  }));

  return [...staticRoutes, ...translationRoutes];
}
