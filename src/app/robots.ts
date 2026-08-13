import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";

/**
 * robots.txt – wird von Next.js unter /robots.txt ausgeliefert.
 *
 * Es gibt nichts zu verstecken: Alle Inhalte dürfen indexiert werden.
 * Impressum und Datenschutzerklärung sind vollständig ausgefüllt und deshalb
 * ebenfalls freigegeben – sie gehören zu den Seiten, die Google bei der
 * AdSense-Prüfung ausdrücklich erwartet.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
