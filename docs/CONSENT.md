# Einwilligung und Webanalyse

## Aktueller Stand: zertifizierte CMP von Google

Die Einwilligung wird von der **Consent-Management-Plattform von Google**
verwaltet, eingerichtet im AdSense-Konto unter *Datenschutz und Messaging →
Europäische Vorschriften*. Sie ist von Google zertifiziert und damit
Voraussetzung dafür, Werbung an Nutzer im EWR und in UK auszuliefern.

Wichtige Einstellungen dieser Nachricht:

- Ablehnen-Schaltfläche für **alle Länder** aktiviert – gleichwertig sichtbar
  neben der Zustimmung, kein Dark Pattern
- Standardsprache Deutsch
- Datenschutzerklärung verlinkt

### Wie die Website damit zusammenspielt

Die CMP wird über das AdSense-Skript ausgeliefert. Deshalb lädt
`AdScripts.tsx` das Skript **ohne eigene vorgeschaltete Sperre**, sobald eine
Publisher-ID gesetzt ist. Eine zusätzliche Sperre würde die
Einwilligungsabfrage selbst verhindern – die Seite könnte dann gar nicht mehr
fragen.

Die Steuerung, ob personalisierte, nicht personalisierte oder keine Anzeigen
ausgeliefert werden, übernimmt vollständig die CMP.

**Widerruf:** `ConsentSettingsLink` ruft `googlefc.showRevocationMessage()`
auf. Diese Funktion stellt die CMP bereit; darüber öffnet der Footer-Link
„Cookie-Einstellungen“ die Abfrage erneut. Steht sie nicht zur Verfügung –
etwa wegen eines Werbeblockers –, erklärt ein Hinweis, wie sich die
Einwilligung über den Browser zurücksetzen lässt.

### Ohne Publisher-ID

Ist `NEXT_PUBLIC_ADS_CLIENT_ID` leer, wird kein Skript geladen, es erscheint
keine Abfrage, und die Werbeflächen zeigen nur Platzhalter. Eine frisch
geklonte Installation sendet also nichts an Dritte.

### Was ersetzt wurde

Bis zur Umstellung enthielt das Projekt eine eigene Einwilligungslösung mit
vier Kategorien (`ConsentManager`, `useConsent`, `lib/consent.ts`,
`lib/gtag.ts`). Sie wurde entfernt, weil zwei Banner übereinander erschienen
wären und eine Eigenentwicklung die Google-Anforderung ohnehin nicht erfüllt.
Der Code liegt weiterhin in der Git-Historie, falls er als Ausgangspunkt für
eine andere Lösung gebraucht wird.

## Webanalyse ergänzen

Aktuell ist **keine Analyse eingebunden**. Wenn du eine ergänzen willst:

**Datenschutzfreundliche Alternativen** wie Plausible oder Umami arbeiten ohne
Cookies und ohne personenbezogene Daten. Sie sind in vielen Fällen ohne
Einwilligung einsetzbar – ob das für deinen konkreten Fall zutrifft, gehört
fachlich geprüft. Vorteil: Du bekommst Zahlen auch von Besuchern, die
ablehnen.

**Google Analytics 4** benötigt eine Einwilligung. Einbindung analog zu
`AdScripts.tsx`: eine Komponente, die den Hook `useConsent()` abfragt und das
Skript nur bei `statistik === true` lädt.

Beispielgerüst (`src/components/analytics/Analytics.tsx`):

```tsx
"use client";
import Script from "next/script";
import { useConsent } from "@/components/consent/useConsent";

export function Analytics() {
  const { consent } = useConsent();
  const id = process.env.NEXT_PUBLIC_ANALYTICS_ID;
  if (!id || consent?.choices.statistik !== true) return null;
  return <Script id="analytics" strategy="afterInteractive" src={`…${id}`} />;
}
```

## Google Search Console

1. Property unter <https://search.google.com/search-console> anlegen.
2. Bestätigungsmethode „HTML-Tag“ wählen und den `content`-Wert kopieren.
3. In `.env.local` eintragen:
   `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=dein_wert`
4. Neu deployen, dann in der Search Console bestätigen.
5. Sitemap einreichen: `https://rechnerliste.de/sitemap.xml`

Das Meta-Tag wird nur ausgegeben, wenn die Variable gesetzt ist – die
Verifizierung ist technisch notwendig und benötigt keine Einwilligung.

## Kein Rechtsberatungsersatz

Dieses Dokument beschreibt die technische Umsetzung. Ob deine Website den
rechtlichen Anforderungen genügt, hängt von Faktoren ab, die sich nicht im
Code abbilden lassen – etwa davon, welche Dienste du tatsächlich einsetzt und
wo deine Nutzer sitzen. Lass die Umsetzung vor dem Livegang fachkundig prüfen.
