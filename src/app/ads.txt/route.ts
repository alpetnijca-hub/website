import { adsClientId } from "@/config/ads";

/**
 * ads.txt (Authorized Digital Sellers)
 *
 * Google verlangt diese Datei im Wurzelverzeichnis der Domain. Sie bestätigt,
 * dass Google berechtigt ist, Werbeflächen dieser Website zu verkaufen. Fehlt
 * sie, zeigt AdSense die Warnung „Erhebliche Anzeigenumsätze gefährdet" an und
 * ein Teil der Werbeeinnahmen entfällt.
 *
 * Der Inhalt wird aus NEXT_PUBLIC_ADS_CLIENT_ID erzeugt. Ist die Variable
 * nicht gesetzt, gibt es bewusst keine Datei (404) statt einer Zeile mit
 * ungültiger ID.
 *
 * Erreichbar unter: https://deine-domain.de/ads.txt
 */

/** Feste Kennung des Google-Werbesystems – für alle Publisher identisch. */
const GOOGLE_EXCHANGE_ID = "f08c47fec0942fa0";

export const dynamic = "force-static";

export function GET(): Response {
  // Die Skript-Einbindung nutzt "ca-pub-…", ads.txt erwartet "pub-…".
  const publisherId = adsClientId.replace(/^ca-/, "");

  if (!publisherId.startsWith("pub-")) {
    return new Response("Not found", { status: 404 });
  }

  const body = `google.com, ${publisherId}, DIRECT, ${GOOGLE_EXCHANGE_ID}\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
