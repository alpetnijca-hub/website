import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";

/**
 * robots.txt – wird von Next.js unter /robots.txt ausgeliefert.
 *
 * Es gibt nichts zu verstecken: Alle Inhalte dürfen indexiert werden.
 * Ausgenommen sind lediglich die Rechtstexte, solange sie Platzhalter sind
 * (sie tragen zusätzlich ein noindex im Seiten-Metadatensatz).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/impressum", "/datenschutz"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
