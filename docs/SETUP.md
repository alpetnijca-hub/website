# Projekt starten – Schritt für Schritt

Diese Anleitung setzt keine Vorkenntnisse voraus. Wenn du an einer Stelle
hängen bleibst, arbeite sie einfach von oben nach unten durch.

## 1. Node.js installieren

Node.js ist die Umgebung, in der das Projekt läuft.

1. Gehe auf <https://nodejs.org> und lade die **LTS-Version** herunter.
2. Installiere sie mit den Standardeinstellungen.
3. Öffne ein Terminal (Windows: „PowerShell“, macOS: „Terminal“) und prüfe:

```bash
node -v
npm -v
```

Es sollten zwei Versionsnummern erscheinen, zum Beispiel `v22.x.x` und `10.x.x`.
Erscheint stattdessen eine Fehlermeldung, starte den Rechner nach der
Installation einmal neu.

Benötigt wird **Node.js 20.9 oder neuer**.

## 2. Projekt herunterladen

```bash
git clone <adresse-deines-repositorys>
cd website
```

## 3. Abhängigkeiten installieren

```bash
npm install
```

Das dauert beim ersten Mal ein bis zwei Minuten und legt den Ordner
`node_modules` an. Dieser Ordner gehört nicht ins Git-Repository und ist
bereits in `.gitignore` eingetragen.

## 4. Konfigurationsdatei anlegen

```bash
cp .env.example .env.local
```

Unter Windows in der PowerShell stattdessen:

```powershell
Copy-Item .env.example .env.local
```

Du kannst die Datei zunächst unverändert lassen – ohne Werbe-IDs zeigt die
Seite überall klar gekennzeichnete Platzhalter statt echter Anzeigen.

## 5. Entwicklungsserver starten

```bash
npm run dev
```

Öffne dann <http://localhost:3000> im Browser. Änderungen an Dateien erscheinen
sofort, ohne dass du neu laden musst.

Beenden: `Strg + C` im Terminal.

## 6. Die wichtigsten Befehle

| Befehl | Was er macht |
| --- | --- |
| `npm run dev` | Entwicklungsserver auf Port 3000 |
| `npm run build` | Erzeugt die optimierte Fassung für den Livebetrieb |
| `npm run start` | Startet die gebaute Fassung lokal (vorher `build` ausführen) |
| `npm run lint` | Prüft den Code auf Fehler und Stilverstösse |
| `npm run typecheck` | Prüft die TypeScript-Typen |
| `npm test` | Führt die Unit-Tests der Rechenformeln aus |
| `npm run test:watch` | Tests laufen dauerhaft mit und melden Fehler sofort |

Vor jedem Deployment sinnvoll:

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

## 7. Den Namen der Website ändern

Öffne `src/config/site.ts` und ändere das Feld `name`. Damit ändert sich der
Name automatisch in Header, Footer, allen Seitentiteln, den Open-Graph-Daten
und den strukturierten Daten. Es gibt keine zweite Stelle, an der der Name
fest eingetragen ist.

In derselben Datei stehen auch:

- `tagline` – der Untertitel im Hero-Bereich
- `contactEmail` – die Kontaktadresse
- `telegram` – **dein Telegram-Benutzername ohne @** (aktuell ein Platzhalter)
- `operator` – dein Name fürs Impressum

## 8. Einen neuen Rechner hinzufügen

Drei Schritte, immer in dieser Reihenfolge:

1. **Registry-Eintrag** in `src/config/calculators.ts` anlegen. Navigation,
   Übersichtsseiten, Suche und Sitemap aktualisieren sich daraufhin von selbst.
2. **Rechenlogik** als reine Funktion in `src/lib/calculators/` anlegen, plus
   eine Testdatei in `tests/`. Keine React-Bestandteile in dieser Datei.
3. **Seite** unter `src/app/<kategorie>/<slug>/page.tsx` anlegen und dort die
   Komponente `CalculatorPage` verwenden. Sie gibt die Abschnittsreihenfolge
   vor; die Texte schreibst du individuell.

## 9. Auf Vercel veröffentlichen

1. Konto auf <https://vercel.com> anlegen und mit GitHub verbinden.
2. „Add New… → Project“ wählen und das Repository importieren.
3. Vercel erkennt Next.js automatisch – die Voreinstellungen passen.
4. Unter **Settings → Environment Variables** die Werte aus `.env.example`
   eintragen, mindestens `NEXT_PUBLIC_SITE_URL` mit deiner echten Domain
   (zum Beispiel `https://rechnerpilot.de`, ohne Schrägstrich am Ende).
5. Auf „Deploy“ klicken.

Nach jedem Push auf den Hauptbranch baut Vercel automatisch neu.

**Wichtig:** Setze `NEXT_PUBLIC_SITE_URL` unbedingt, bevor Suchmaschinen die
Seite finden. Sonst zeigen die Canonical-URLs und die Sitemap auf
`http://localhost:3000`.

## 10. Häufige Probleme

**„Port 3000 is already in use“**
Ein anderer Prozess belegt den Port. Beende ihn oder starte mit
`npm run dev -- -p 3001`.

**Änderungen erscheinen nicht**
Lösche den Ordner `.next` und starte neu:
`rm -rf .next && npm run dev`

**`npm install` schlägt fehl**
Lösche `node_modules` und `package-lock.json`, dann erneut `npm install`.

**Die Seite sieht unformatiert aus**
Meist ein Tippfehler in `src/app/globals.css`. Prüfe die Terminalausgabe auf
Fehlermeldungen.
