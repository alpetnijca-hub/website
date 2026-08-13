import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";
import { activeCalculators } from "@/config/calculators";
import { activeCategories } from "@/config/categories";

/**
 * sitemap.xml – erzeugt aus der Rechner-Registry.
 *
 * Geplante Rechner und geplante Kategorien erscheinen bewusst nicht: Ihre
 * Seiten existieren noch nicht, und eine Sitemap mit 404-Adressen schadet
 * mehr, als sie nützt.
 *
 * Die Rechtstexte fehlen ebenfalls, solange sie Platzhalter sind.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticPages: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/rechner", priority: 0.9 },
    { path: "/ueber-uns", priority: 0.4 },
    { path: "/kontakt", priority: 0.4 },
    { path: "/quellen-und-methoden", priority: 0.5 },
    { path: "/redaktionelle-richtlinien", priority: 0.4 },
    { path: "/cookie-einstellungen", priority: 0.2 },
  ];

  return [
    ...staticPages.map((page) => ({
      url: absoluteUrl(page.path),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: page.priority,
    })),
    ...activeCategories().map((category) => ({
      url: absoluteUrl(category.href),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...activeCalculators().map((calculator) => ({
      url: absoluteUrl(calculator.href),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
