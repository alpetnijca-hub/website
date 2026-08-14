import Script from "next/script";
import { adsClientId, adsConfigured } from "@/config/ads";

/**
 * Lädt das Skript des Werbenetzwerks.
 *
 * Es wird nur geladen, wenn eine Publisher-ID über die Environment gesetzt
 * ist. Ohne ID findet kein externer Aufruf statt und die Werbeflächen zeigen
 * nur Platzhalter.
 *
 * Die Einwilligung steuert seit der Umstellung die von Google zertifizierte
 * Consent-Management-Plattform, die über genau dieses Skript ausgeliefert
 * wird. Sie zeigt die Abfrage an und entscheidet, ob personalisierte,
 * nicht personalisierte oder gar keine Anzeigen ausgeliefert werden.
 * Eine zusätzliche eigene Sperre wäre an dieser Stelle nicht nur überflüssig,
 * sie würde die Einwilligungsabfrage selbst verhindern.
 *
 * Die Adresse des Skripts steht bewusst nur an dieser einen Stelle.
 */
export function AdScripts() {
  if (!adsConfigured) return null;

  return (
    <Script
      id="ad-network"
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
        adsClientId,
      )}`}
    />
  );
}
