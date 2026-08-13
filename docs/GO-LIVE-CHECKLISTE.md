# Checkliste für den Produktivstart

Arbeite diese Liste von oben nach unten ab. Die Blöcke 1 bis 3 sind
Voraussetzung für den Livegang, alles Weitere folgt danach.

## 1. Muss vor der Veröffentlichung erledigt sein

### Rechtstexte

- [x] **Impressum ausgefüllt** (`src/app/impressum/page.tsx`) – mit echten
      Angaben des Betreibers.
- [x] **Datenschutzerklärung geschrieben** (`src/app/datenschutz/page.tsx`) –
      zugeschnitten auf die tatsächliche Verarbeitung, ohne Bausteine für
      Vorgänge, die es hier nicht gibt.
- [x] Beide Seiten sind indexierbar und in der Sitemap.
- [ ] **Beide Texte fachkundig prüfen lassen.** Sie sind vollständig und
      inhaltlich zutreffend, aber nicht anwaltlich geprüft. Offene Punkte:
      Vertreter nach Art. 27 DSGVO (Betreiber sitzt in der Schweiz, Angebot
      richtet sich auch an EU-Nutzer) und die Frage der gewerblichen Anmeldung,
      sobald Werbeeinnahmen fliessen.
- [ ] **Hosting-Anbieter im Datenschutztext konkret benennen**, sobald er
      feststeht, und den Auftragsverarbeitungsvertrag abschliessen.

### Grundkonfiguration

- [x] `src/config/site.ts`: Name, Kontaktadresse, Betreiberangaben und
      Telegram-Benutzername sind eingetragen.
- [ ] `NEXT_PUBLIC_SITE_URL` auf die echte Domain setzen – ohne Schrägstrich am
      Ende. **Ohne diesen Schritt zeigen alle Canonical-URLs und die Sitemap
      auf localhost.**
- [ ] Favicon in `src/app/` ersetzen.
- [ ] Open-Graph-Bild prüfen: Es wird beim Build automatisch aus
      `src/app/opengraph-image.tsx` erzeugt und zeigt Name und Untertitel aus
      `site.ts`. Aufrufbar unter `/opengraph-image`. Wenn du lieber ein eigenes
      Bild verwendest, ersetze die Datei durch ein statisches
      `opengraph-image.png` im selben Ordner (1200 × 630 px).

### Technische Prüfung

- [ ] `npm run lint` ohne Fehler
- [ ] `npm run typecheck` ohne Fehler
- [ ] `npm test` – alle Tests grün
- [ ] `npm run build` ohne Fehler
- [ ] Alle Seiten im Browser durchklicken, auch die 404-Seite (irgendeine
      erfundene Adresse aufrufen)
- [ ] Jeden Rechner einmal mit sinnvollen und einmal mit unsinnigen Werten
      testen (leer, 0, negativ, sehr gross)

## 2. Datenschutz und Einwilligung

- [ ] Banner erscheint beim ersten Besuch
- [ ] „Ablehnen“ funktioniert und lädt keine externen Skripte
      (im Browser prüfen: Entwicklertools → Netzwerk → nach „googlesyndication“
      suchen, es darf kein Treffer erscheinen)
- [ ] Entscheidung überlebt einen Seitenwechsel und einen Neustart des Browsers
- [ ] Footer-Link „Cookie-Einstellungen“ öffnet den Dialog
- [ ] Widerruf auf `/cookie-einstellungen` funktioniert
- [ ] **Zertifizierte CMP eingebunden**, falls du AdSense mit Nutzern aus dem
      EWR betreiben willst – siehe `docs/CONSENT.md`. Die Eigenentwicklung
      reicht dafür nicht aus.

## 3. Barrierefreiheit und Bedienung

- [ ] Gesamte Seite nur mit der Tastatur bedienbar (Tab, Shift+Tab, Enter,
      Leertaste)
- [ ] Fokusring überall sichtbar
- [ ] „Zum Hauptinhalt springen“ erscheint beim ersten Tab-Druck
- [ ] Cookie-Dialog und Interstitial mit Escape schliessbar
- [ ] Fehlermeldungen in Formularen sind Text, nicht nur eine rote Umrandung
- [ ] Test mit 200 Prozent Zoom – nichts überlappt
- [ ] Test auf einem echten Mobiltelefon, nicht nur im Simulator
- [ ] Dark Mode auf allen Seiten geprüft

## 4. SEO

- [ ] `https://deine-domain.de/robots.txt` erreichbar und plausibel
- [ ] `https://deine-domain.de/sitemap.xml` erreichbar und enthält alle Rechner
- [ ] Google Search Console eingerichtet und Sitemap eingereicht
      (siehe `docs/CONSENT.md`, Abschnitt Search Console)
- [ ] Meta-Titles und Descriptions stichprobenartig prüfen – jede Seite hat
      eigene, keine Dubletten
- [ ] Strukturierte Daten mit dem Rich-Results-Test von Google prüfen
- [ ] Core Web Vitals mit PageSpeed Insights messen – besonders CLS, weil
      Werbeflächen die häufigste Ursache für Layout-Shifts sind

## 5. Werbung

- [ ] Erst nach Freischaltung des AdSense-Kontos die IDs eintragen
      (siehe `docs/ADSENSE.md`)
- [ ] Nach dem Aktivieren erneut PageSpeed messen – Anzeigen kosten Ladezeit
- [ ] Prüfen, dass Anzeigen auf dem Handy keinen Inhalt verdecken
- [ ] Beschriftung „Anzeige“ überall vorhanden
- [ ] `https://deine-domain.de/ads.txt` aufrufen und prüfen, dass die Zeile
      mit deiner Publisher-ID erscheint
- [ ] Interstitial: bewusst entscheiden, ob es an soll. Empfehlung: zunächst
      aus lassen (Begründung in `docs/ADSENSE.md`)
- [ ] Niemals selbst auf die eigenen Anzeigen klicken

## 6. Nach dem Start

- [ ] Search Console nach zwei Wochen auf Indexierungsfehler prüfen
- [ ] Beobachten, welche Rechner tatsächlich genutzt werden, und die
      „beliebten Rechner“ in `src/config/calculators.ts` entsprechend anpassen
      (Konstante `featuredCalculatorIds`)
- [ ] Inhalte halbjährlich auf Aktualität durchsehen, besonders
      Ernährungsempfehlungen
- [ ] Abhängigkeiten regelmässig aktualisieren: `npm outdated`, dann
      `npm update`, danach Tests und Build erneut ausführen

## Was bewusst nicht behauptet wird

Diese Checkliste ersetzt keine Rechtsberatung und garantiert keine
Rechtssicherheit. Sie deckt die technischen Punkte ab, die aus dem Code heraus
prüfbar sind. Die rechtliche Bewertung – Impressumspflicht,
Datenschutzerklärung, Einwilligungsanforderungen – gehört in fachkundige
Hände, bevor die Seite online geht.
