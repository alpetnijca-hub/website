# Einwilligung, Consent Mode und Webanalyse

## Was umgesetzt ist

Die Einwilligungsverwaltung ist eine Eigenentwicklung
(`src/components/consent/ConsentManager.tsx`). Umgesetzt sind:

- **Drei gleichwertige Schaltflächen:** „Alle akzeptieren“, „Ablehnen“ und
  „Einstellungen“ – gleiche Grösse, gleiche Position, keine versteckte
  Ablehnung.
- **Vier Kategorien:** notwendig (nicht abwählbar), Statistik, Marketing,
  personalisierte Werbung.
- **Keine Vorauswahl.** Alle optionalen Kategorien starten auf „aus“.
- **Blockade vor Zustimmung.** Ohne Einwilligung wird kein Werbe- oder
  Analyseskript geladen. Die Prüfung sitzt in den Komponenten selbst, nicht
  nur in der Anzeige-Logik.
- **Speicherung mit Zeitstempel** unter `rp_consent` im localStorage, samt
  Versionsnummer für spätere Änderungen.
- **Widerruf jederzeit** über den Footer-Link und über
  `/cookie-einstellungen`.
- **Google Consent Mode v2** technisch vorbereitet (`src/lib/gtag.ts`).

## Wie der Consent Mode v2 vorbereitet ist

Beim Laden schreibt `setDefaultConsent()` folgende Standardwerte in den
`dataLayer`, **bevor** irgendein Tag geladen wird:

```
ad_storage: denied
ad_user_data: denied
ad_personalization: denied
analytics_storage: denied
functionality_storage: granted
security_storage: granted
```

Nach der Entscheidung des Nutzers folgt ein `consent update` mit den
tatsächlichen Werten. Die Zuordnung:

| Kategorie im Banner | Consent-Mode-Signal |
| --- | --- |
| Statistik | `analytics_storage` |
| Marketing | `ad_storage` |
| Personalisierte Werbung | `ad_user_data`, `ad_personalization` |

Es wird **kein Google-Skript geladen**. Sobald du gtag.js oder den Google Tag
Manager einbindest, liest dieses die bereits gesetzten Werte aus.

## Wichtig: Das reicht für AdSense im EWR nicht

Google verlangt für Werbeauslieferung an Nutzer im Europäischen
Wirtschaftsraum und im Vereinigten Königreich eine **von Google zertifizierte
Consent-Management-Plattform**, die dem IAB TCF entspricht. Eine
Eigenentwicklung erfüllt diese Anforderung unabhängig von ihrer technischen
Qualität nicht.

Diese Lösung ist deshalb als **technische Grundlage** zu verstehen: Sie sorgt
dafür, dass die Architektur stimmt und nichts ohne Zustimmung lädt. Vor dem
Livegang mit echter Werbung ersetzt du sie durch eine zertifizierte CMP.

### Eine zertifizierte CMP einbinden

Verbreitete Optionen sind Googles eigenes Datenschutz- und Nachrichtentool
(kostenlos, direkt im AdSense-Konto), Cookiebot, Usercentrics oder Consentmanager.

Vorgehen:

1. CMP-Konto anlegen und Domain hinterlegen.
2. Das CMP-Skript so früh wie möglich einbinden – in `src/app/layout.tsx`
   im `<head>`, vor allen anderen Skripten.
3. `<ConsentManager />` aus dem Layout entfernen, damit nicht zwei Banner
   gleichzeitig erscheinen.
4. `src/components/consent/useConsent.ts` auf die API der CMP umstellen.
   Alle Werbe- und Analysekomponenten fragen ausschliesslich über diesen Hook
   ab – es ist die einzige Stelle, die du anpassen musst.
5. `src/lib/gtag.ts` kann entfallen: Zertifizierte CMPs setzen die
   Consent-Mode-Signale selbst.

Der Rest der Website bleibt unverändert. Genau dafür ist der Hook als einzige
Schnittstelle ausgelegt.

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
5. Sitemap einreichen: `https://deine-domain.de/sitemap.xml`

Das Meta-Tag wird nur ausgegeben, wenn die Variable gesetzt ist – die
Verifizierung ist technisch notwendig und benötigt keine Einwilligung.

## Kein Rechtsberatungsersatz

Dieses Dokument beschreibt die technische Umsetzung. Ob deine Website den
rechtlichen Anforderungen genügt, hängt von Faktoren ab, die sich nicht im
Code abbilden lassen – etwa davon, welche Dienste du tatsächlich einsetzt und
wo deine Nutzer sitzen. Lass die Umsetzung vor dem Livegang fachkundig prüfen.
