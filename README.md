# Rechnerliste

Ein Portal für Online-Rechner. Version 1 umfasst acht Rechner rund um
Ernährung, Gewicht und Training. Die Architektur ist darauf ausgelegt, später
weitere Kategorien aufzunehmen – Arbeit, Finanzen, Währungen, Krypto,
Mathematik und Alltag sind bereits angelegt.

Der Name steht ausschliesslich in `src/config/site.ts` und lässt sich dort in
einem Schritt ändern.

## Schnellstart

```bash
npm install
cp .env.example .env.local
npm run dev
```

Dann <http://localhost:3000> öffnen. Eine ausführliche Anleitung für
Einsteiger steht in [`docs/SETUP.md`](docs/SETUP.md).

## Befehle

```bash
npm run dev         # Entwicklungsserver
npm run build       # Produktionsbuild
npm run lint        # ESLint
npm run typecheck   # TypeScript ohne Ausgabe
npm test            # Unit-Tests der Rechenformeln
```

## Technik

- Next.js 16 mit App Router, alle Seiten statisch vorgerendert
- TypeScript, Tailwind CSS 4
- Laufzeit-Abhängigkeiten: nur `next`, `react`, `react-dom`
- Vitest für die Formeltests

## Aufbau

```
src/
├─ app/          Routen (eine Datei je Seite)
├─ components/   layout · ui · calculators · ads · consent · search
├─ lib/          calculators (reine Rechenlogik) · seo · consent · format
├─ config/       site · categories · calculators (Registry) · ads
├─ data/         mets · sources
└─ types/        calculator · consent
tests/           Unit-Tests der Formeln
docs/            Setup, Architektur, AdSense, Consent, Go-Live
```

## Leitentscheidungen

**Rechenlogik ist von der Oberfläche getrennt.** Alles unter
`src/lib/calculators/` besteht aus reinen Funktionen ohne React-Bezug und ist
durch Tests abgesichert – inklusive Grenzwerten, ungültigen Eingaben und
Division durch null.

**Eine Registry als Datenquelle.** `src/config/calculators.ts` speist
Navigation, Übersichtsseiten, Suche, verwandte Rechner und die Sitemap. Ein
neuer Rechner braucht dort einen Eintrag, eine Logikdatei und eine Seite.

**Nichts lädt ohne Einwilligung.** Werbe- und Analyseskripte werden erst nach
Zustimmung geladen. Ohne hinterlegte Publisher-ID wird überhaupt kein
externes Skript angefordert.

**Keine Gesundheitsdaten verlassen den Browser.** Alle Rechner arbeiten lokal.
Eingaben werden weder übertragen noch gespeichert.

## Vor dem Livegang

Impressum und Datenschutzerklärung sind **Platzhalter** und als solche auf den
Seiten gekennzeichnet. Sie müssen ausgefüllt und fachkundig geprüft werden.
Für AdSense mit Nutzern aus dem EWR ist zusätzlich eine von Google
zertifizierte CMP erforderlich – die mitgelieferte Einwilligungslösung ist
eine technische Grundlage, kein Ersatz dafür.

Die vollständige Liste steht in
[`docs/GO-LIVE-CHECKLISTE.md`](docs/GO-LIVE-CHECKLISTE.md).

## Dokumentation

| Datei | Inhalt |
| --- | --- |
| [`docs/SETUP.md`](docs/SETUP.md) | Installation und erste Schritte |
| [`docs/ARCHITEKTUR.md`](docs/ARCHITEKTUR.md) | Seitenplan und Entwurfsentscheidungen |
| [`docs/ADSENSE.md`](docs/ADSENSE.md) | Werbung einrichten, Interstitial, Richtlinien |
| [`docs/CONSENT.md`](docs/CONSENT.md) | Consent Mode v2, zertifizierte CMP, Analyse |
| [`docs/GO-LIVE-CHECKLISTE.md`](docs/GO-LIVE-CHECKLISTE.md) | Checkliste für den Start |
