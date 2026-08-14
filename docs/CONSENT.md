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

### Eine zertifizierte CMP einbinden – Schritt für Schritt

Der einfachste Weg führt über **Googles eigenes Tool**. Es ist kostenlos,
zertifiziert, direkt im AdSense-Konto enthalten und du musst keinen zweiten
Anbieter verwalten.

**1. Im AdSense-Konto aktivieren**

Melde dich bei <https://adsense.google.com> an und gehe zu
**Datenschutz und Messaging → Europäische Vorschriften**. Dort legst du eine
Nachricht an. Google fragt dabei ab:

- für welche Website die Nachricht gilt
- welche Sprachen sie unterstützen soll (Deutsch, sinnvollerweise auch Englisch)
- ob die Ablehnen-Schaltfläche direkt sichtbar sein soll –
  **hier unbedingt „Ja“ wählen.** Eine versteckte Ablehnung ist ein Dark
  Pattern und in der EU angreifbar.

Danach auf **Veröffentlichen** klicken.

**2. Nichts weiter einbauen**

Die Nachricht wird über das AdSense-Skript ausgeliefert, das bereits
eingebunden ist. Es ist also kein zusätzlicher Skript-Tag nötig. Wichtig ist
nur, dass `NEXT_PUBLIC_ADS_CLIENT_ID` gesetzt ist.

**3. Das eigene Banner abschalten**

Sonst erscheinen zwei Banner übereinander. Entferne dazu in
`src/app/layout.tsx` die Zeile mit `<ConsentManager />` und den zugehörigen
Import.

Danach musst du eine Entscheidung treffen, wie es mit dem Rest der Website
weitergeht – denn alle Werbe- und Analysekomponenten fragen über
`useConsent()` ab, ob eine Einwilligung vorliegt:

- **Variante A (einfach):** Lass `AdScripts.tsx` das Skript unbedingt laden,
  also ohne die Consent-Prüfung. Googles CMP übernimmt dann die
  Einwilligungssteuerung selbst und liefert ohne Zustimmung nur nicht
  personalisierte oder gar keine Anzeigen aus. Das ist der von Google
  vorgesehene Ablauf.
- **Variante B (strenger):** Behalte die Prüfung und verbinde
  `useConsent()` mit der TCF-API der CMP (`window.__tcfapi`). Dann lädt das
  Skript erst nach ausdrücklicher Zustimmung. Aufwändiger, aber
  datensparsamer.

In beiden Fällen ist `src/components/consent/useConsent.ts` die einzige
Datei, die du anfassen musst – alle Werbekomponenten hängen daran.

**4. Testen**

Ruf die Seite in einem privaten Fenster auf. Es darf nur ein Banner
erscheinen, „Ablehnen“ muss gleich sichtbar sein wie „Zustimmen“, und nach
einer Ablehnung dürfen in den Entwicklertools unter „Netzwerk“ keine
personalisierten Anzeigenanfragen mehr auftauchen.

### Alternative Anbieter

Wenn du mehr Einstellmöglichkeiten brauchst – etwa weil du später weitere
Dienste einbindest – sind Cookiebot, Usercentrics und Consentmanager
verbreitete zertifizierte Alternativen. Sie sind ab einer bestimmten
Seitenzahl kostenpflichtig und werden als eigenes Skript im `<head>` von
`src/app/layout.tsx` eingebunden, so früh wie möglich und vor allen anderen
Skripten.

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
