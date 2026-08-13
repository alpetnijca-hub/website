# Werbung einrichten

## Der aktuelle Zustand

Im Code stehen **keine echten Publisher-IDs** und es wird **kein Werbeskript
geladen**. Solange `NEXT_PUBLIC_ADS_CLIENT_ID` leer ist, zeigen alle
Werbeflächen einen grau gerahmten Platzhalter mit dem Hinweis
„Entwicklungs-Platzhalter“. Es findet kein Verbindungsaufbau zu einem
Werbenetzwerk statt.

Das ist Absicht: Eine frisch geklonte Installation soll niemals versehentlich
Anzeigen ausliefern oder Daten an Dritte senden.

## Wo die Werbeplätze liegen

| Platzierung | Wo sie erscheint | Reservierte Höhe |
| --- | --- | --- |
| `after-intro` | Direkt unter der Einleitung, vor dem Rechner | 280 px |
| `after-result` | Nach dem Ergebnisbereich | 280 px |
| `in-content` | Zwischen den Erklärungsabschnitten | 250 px |
| `sidebar` | Rechte Spalte, erst ab 1024 px Bildschirmbreite | 600 px |
| `sticky-bottom` | Fixiert am unteren Rand, standardmässig aus | 50 / 90 px |

Jede Fläche reserviert ihre Höhe **immer**, auch wenn keine Anzeige geladen
wird. Dadurch entsteht kein Layout-Shift (CLS) – einer der drei Core Web
Vitals, die Google für das Ranking heranzieht.

Die Konfiguration steht in `src/config/ads.ts`.

## Schritt für Schritt zu echten Anzeigen

### 1. Voraussetzungen schaffen

Bevor du dich bei AdSense bewirbst, sollte die Seite Folgendes haben:

- ein vollständig ausgefülltes Impressum (aktuell Platzhalter)
- eine vollständige Datenschutzerklärung (aktuell Platzhalter)
- eine funktionierende Kontaktmöglichkeit
- eine eigene Domain und ausreichend eigenständige Inhalte

Bewerbungen mit Platzhaltertexten in den Rechtsseiten werden regelmässig
abgelehnt.

### 2. AdSense-Konto anlegen

Unter <https://adsense.google.com> registrieren und die Domain hinzufügen.
Google prüft die Seite; das dauert erfahrungsgemäss einige Tage bis mehrere
Wochen.

### 3. Publisher-ID eintragen

Nach der Freischaltung findest du deine Publisher-ID im AdSense-Konto. Sie hat
die Form `ca-pub-` gefolgt von 16 Ziffern. Trage sie in `.env.local` ein:

```bash
NEXT_PUBLIC_ADS_CLIENT_ID=ca-pub-DEINE_ECHTE_ID
```

Auf Vercel dieselbe Variable unter **Settings → Environment Variables**
anlegen und anschliessend neu deployen.

### 4. ads.txt prüfen

Die Datei wird automatisch aus derselben Variable erzeugt und ist unter
`https://deine-domain.de/ads.txt` erreichbar. Inhalt:

```
google.com, pub-DEINE_ID, DIRECT, f08c47fec0942fa0
```

Sie bestätigt Google, dass dein Konto berechtigt ist, Werbeflächen dieser
Domain zu verkaufen. **Ohne sie zeigt AdSense die Warnung „Erhebliche
Anzeigenumsätze gefährdet" und ein Teil der Einnahmen entfällt.** Nach dem
Deployment einmal im Browser aufrufen und prüfen, dass die Zeile erscheint.
Google liest die Datei automatisch neu ein, das kann einige Tage dauern.

Ist keine Publisher-ID gesetzt, liefert die Route bewusst einen 404 – besser
als eine Datei mit ungültiger ID.

### 5. Anzeigenblöcke anlegen

Lege im AdSense-Konto pro Platzierung einen Anzeigenblock an (Typ „Display“,
responsiv). Jeder Block bekommt eine Slot-ID aus zehn Ziffern. Diese trägst du
ebenfalls in `.env.local` ein:

```bash
NEXT_PUBLIC_AD_SLOT_AFTER_INTRO=1234567890
NEXT_PUBLIC_AD_SLOT_AFTER_RESULT=1234567891
NEXT_PUBLIC_AD_SLOT_IN_CONTENT=1234567892
NEXT_PUBLIC_AD_SLOT_SIDEBAR=1234567893
NEXT_PUBLIC_AD_SLOT_STICKY=1234567894
```

### 6. Was der Code dann tut

Sobald eine Publisher-ID gesetzt ist:

1. `AdScripts.tsx` lädt das AdSense-Skript – **aber erst, nachdem der Nutzer
   der Kategorie „Marketing“ zugestimmt hat.**
2. Jede `AdSlot`-Komponente rendert ein `<ins class="adsbygoogle">`-Element und
   fordert eine Anzeige an.
3. Ohne Zustimmung bleibt die Fläche leer und behält ihre Höhe.

Die Adresse des Skripts steht an genau einer Stelle: in
`src/components/ads/AdScripts.tsx`. Für ein anderes Werbenetzwerk tauschst du
dort den `src` aus.

### 7. Alles wieder abschalten

```bash
NEXT_PUBLIC_ADS_ENABLED=false
```

Damit sind sämtliche Anzeigen deaktiviert, unabhängig von den übrigen Werten.

## Das Interstitial (Werbe-Popup)

**Standardmässig ausgeschaltet.** Einschalten mit:

```bash
NEXT_PUBLIC_INTERSTITIAL_ENABLED=true
```

Die umgesetzten Regeln (`src/components/ads/AdInterstitial.tsx`):

- erscheint nie beim ersten Seitenaufruf
- frühestens nach 30 Sekunden oder ab der zweiten besuchten Seite
- höchstens einmal in 24 Stunden
- schliessbar über einen deutlich sichtbaren Button und über die Escape-Taste
- schliessbar durch Klick auf den Hintergrund
- Fokus springt beim Öffnen in den Dialog und beim Schliessen zurück
- Fokus bleibt im Dialog gefangen (`role="dialog"`, `aria-modal="true"`)
- erscheint nicht, solange das Cookie-Banner noch offen ist
- keine automatische Weiterleitung, keine irreführenden Schaltflächen –
  es gibt genau eine Aktion: schliessen

### Ehrliche Einschätzung dazu

Vollbild-Interstitials, die den Inhalt verdecken, sind nach den **Better Ads
Standards** der Coalition for Better Ads für Desktop und Mobile als störend
eingestuft. Google berücksichtigt „intrusive Interstitials“ ausserdem im
Ranking. Bei einer Seite, deren Traffic überwiegend aus der Google-Suche
kommt, kann ein Popup unter dem Strich mehr kosten, als es einbringt.

Empfehlung: zunächst aus lassen und mit den regulären Flächen starten. Wenn
du es testen willst, tu es kontrolliert und beobachte die
Search-Console-Daten.

## Sticky-Werbeleiste

```bash
NEXT_PUBLIC_STICKY_AD_ENABLED=true
```

Die Leiste ist niedrig gehalten (50 px mobil), jederzeit schliessbar, und
reserviert über einen Platzhalter im Dokumentfluss ihre eigene Höhe – so
verdeckt sie am Seitenende keine Inhalte.

## Richtlinien, die du kennen solltest

- **Trennungsgebot:** Werbung muss als solche erkennbar sein. Alle Flächen
  tragen deshalb die Beschriftung „Anzeige“. Diese darfst du nicht entfernen.
- **Keine Klickaufforderungen:** Nutzer dürfen nicht gebeten werden, auf
  Anzeigen zu klicken. Formulierungen wie „Unterstütze uns mit einem Klick“
  führen zur Sperrung des Kontos.
- **Keine eigenen Klicks:** Auch versehentliche Klicks auf die eigenen
  Anzeigen können zur Sperrung führen. Zum Testen die Vorschau des
  AdSense-Kontos nutzen.
- **Anzeigen dürfen den Inhalt nicht dominieren.** Die aktuelle Verteilung –
  drei Flächen im Text plus Sidebar – liegt im üblichen Rahmen. Wer mehr
  einbaut, riskiert sowohl Richtlinienverstösse als auch schlechtere
  Core Web Vitals.
- **Consent:** Siehe `docs/CONSENT.md`. Für Nutzer aus dem EWR verlangt Google
  eine zertifizierte CMP – die Eigenentwicklung reicht dafür nicht.
