# RechnerPilot – Architektur & Umsetzungsplan (Phase A–E)

> Arbeitsstand: Planungsphase. Noch kein Anwendungscode im Repo.
> Alle Rechts-, Datenschutz- und Impressumstexte werden als **Platzhalter** angelegt
> und müssen vor Veröffentlichung juristisch geprüft werden.

## A. Seiten- und Funktionsplan

### Seitenbaum

| URL | Typ | Rendering | Zweck |
|---|---|---|---|
| `/` | Startseite | static | Hero, Suche, beliebte Rechner, Kategorien, Vorteile |
| `/rechner` | Übersicht | static | Alle Rechner, filterbar nach Kategorie/Status |
| `/gesundheit` | Kategorie | static | Einstieg „Gesundheit & Fitness“ |
| `/gesundheit/kalorienbedarf-rechner` | Rechner | static | Mifflin-St Jeor, BMR + TDEE |
| `/gesundheit/bmi-rechner` | Rechner | static | BMI + WHO-Kategorie |
| `/gesundheit/idealgewicht-rechner` | Rechner | static | Broca, Devine, Robinson, Miller, Hamwi, BMI-Spanne |
| `/gesundheit/kaloriendefizit-rechner` | Rechner | static | Defizit → Gewichtsveränderung/Woche + Warnungen |
| `/gesundheit/proteinbedarf-rechner` | Rechner | static | g/kg-Spanne nach Ziel/Aktivität |
| `/gesundheit/wasserbedarf-rechner` | Rechner | static | Basisbedarf + Trainingszuschlag |
| `/gesundheit/kalorienverbrauch-rechner` | Rechner | static | MET-basiert |
| `/gesundheit/makronaehrstoff-rechner` | Rechner | static | Protein/Fett/KH in g und % |
| `/ueber-uns` | Inhalt | static | Betreiber, Anspruch, keine Beratung |
| `/kontakt` | Formular | server action | Kontakt, Demo-Modus klar gekennzeichnet |
| `/impressum` | Recht | static | **Platzhalter** |
| `/datenschutz` | Recht | static | **Platzhalter** |
| `/cookie-einstellungen` | Consent | client | Consent nachträglich ändern/widerrufen |
| `/redaktionelle-richtlinien` | Vertrauen | static | Wie Inhalte entstehen |
| `/quellen-und-methoden` | Vertrauen | static | Formelquellen zentral gelistet |
| `/not-found` (404) | System | static | Suche + Top-Rechner |
| `/robots.txt`, `/sitemap.xml` | SEO | generiert | aus Rechner-Registry |

### Funktionsblöcke pro Rechnerseite (verbindliches Layout)

1. Breadcrumb → H1 → Einleitung (2–4 Sätze, individuell)
2. **AdSlot `after-intro`**
3. Rechner (Client-Komponente, Berechnung rein lokal)
4. Ergebnisbereich (hervorgehoben, `aria-live="polite"`)
5. **AdSlot `after-result`**
6. Formel + Herleitung
7. Mindestens ein durchgerechnetes Beispiel
8. Interpretation des Ergebnisses
9. **AdSlot `in-content`**
10. Grenzen der Berechnung
11. FAQ (Accordion, `<details>`-basiert, dazu FAQPage-Schema)
12. Verwandte Rechner
13. Quellen
14. Gesundheits-Disclaimer
15. Desktop-Sidebar: **AdSlot `sidebar`** (sticky, nur ≥ lg)

## B. Technische Entscheidungen (Kurzbegründung)

- **Next.js App Router, alles statisch (SSG)** – Rechnerseiten sind reiner Content, statisch = beste Core Web Vitals und billigstes Hosting. Interaktivität nur in kleinen `"use client"`-Inseln.
- **Berechnung strikt in `src/lib/calculators/*`** – reine Funktionen ohne React, dadurch mit Vitest testbar und in jeder UI wiederverwendbar. UI ruft nur `calc(input) → result`.
- **Zentrale Registry `src/config/calculators.ts`** – eine Datenquelle für Navigation, Übersichtsseiten, verwandte Rechner, Sitemap und SEO-Metadaten. Neue Kategorien (Finanzen, Krypto …) brauchen später nur neue Registry-Einträge.
- **Site-Name in `src/config/site.ts`** – Umbenennung an genau einer Stelle.
- **Kein CSS-Framework außer Tailwind, keine UI-Library** – wenig Abhängigkeiten, kleines JS-Bundle.
- **Consent zuerst, Werbung danach** – kein Ad-/Analytics-Skript wird ohne Einwilligung geladen. Google Consent Mode v2 wird über `dataLayer`-Defaults (`denied`) vorbereitet; erst nach Zustimmung folgt ein `consent update`.
- **AdSlot reserviert immer feste Höhe** – verhindert CLS, auch im Platzhaltermodus.
- **Keine Health-Daten an den Server** – alle Formulare außer Kontakt laufen ohne Netzwerkzugriff; `localStorage` nur für Consent, Theme und optionales „Werte merken“ (opt-in).
- **Dark Mode über `class`-Strategie**, Auswahl in `localStorage`, ohne Flash via kleines Inline-Skript.

## C. Verzeichnisstruktur

```
website/
├─ docs/
│  ├─ ARCHITEKTUR.md
│  ├─ SETUP.md                 # Anfänger-Anleitung
│  ├─ ADSENSE.md               # wo echte IDs eingetragen werden
│  └─ GO-LIVE-CHECKLISTE.md
├─ public/
│  ├─ favicon.ico
│  └─ og/default.png
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx
│  │  ├─ page.tsx
│  │  ├─ not-found.tsx
│  │  ├─ robots.ts
│  │  ├─ sitemap.ts
│  │  ├─ rechner/page.tsx
│  │  ├─ gesundheit/
│  │  │  ├─ page.tsx
│  │  │  ├─ bmi-rechner/page.tsx
│  │  │  ├─ kalorienbedarf-rechner/page.tsx
│  │  │  ├─ idealgewicht-rechner/page.tsx
│  │  │  ├─ kaloriendefizit-rechner/page.tsx
│  │  │  ├─ proteinbedarf-rechner/page.tsx
│  │  │  ├─ wasserbedarf-rechner/page.tsx
│  │  │  ├─ kalorienverbrauch-rechner/page.tsx
│  │  │  └─ makronaehrstoff-rechner/page.tsx
│  │  ├─ ueber-uns/page.tsx
│  │  ├─ kontakt/page.tsx        + actions.ts
│  │  ├─ impressum/page.tsx
│  │  ├─ datenschutz/page.tsx
│  │  ├─ cookie-einstellungen/page.tsx
│  │  ├─ redaktionelle-richtlinien/page.tsx
│  │  └─ quellen-und-methoden/page.tsx
│  ├─ components/
│  │  ├─ layout/    Header, Nav, Footer, ThemeToggle, Breadcrumbs
│  │  ├─ ui/        Card, Field, NumberInput, Select, RadioGroup,
│  │  │             ResultCard, Callout, Faq, Disclaimer, SourceList
│  │  ├─ calculators/  je ein <XyzCalculator />
│  │  ├─ ads/       AdSlot, StickyAd, AdInterstitial
│  │  ├─ consent/   ConsentBanner, ConsentDialog, ConsentProvider
│  │  └─ search/    CalculatorSearch
│  ├─ lib/
│  │  ├─ calculators/  bmi.ts, tdee.ts, idealWeight.ts, deficit.ts,
│  │  │                protein.ts, water.ts, activityBurn.ts, macros.ts,
│  │  │                shared.ts (Validierung, Clamping, Rundung)
│  │  ├─ consent.ts, gtag.ts, seo.ts, schema.ts, format.ts
│  ├─ config/
│  │  ├─ site.ts        # Name, URL, Kontakt – zentral änderbar
│  │  ├─ calculators.ts # Registry
│  │  ├─ categories.ts  # inkl. geplanter Kategorien
│  │  └─ ads.ts         # Slot-IDs aus ENV, Feature-Flags
│  ├─ data/  mets.ts, sources.ts
│  └─ types/ calculator.ts, consent.ts
├─ tests/  je Rechner eine *.test.ts
├─ .env.example
├─ eslint.config.mjs, tailwind/postcss, tsconfig.json, next.config.ts
```

## D. Benötigte Pakete

**Laufzeit:** `next`, `react`, `react-dom` — mehr nicht.

**Entwicklung:** `typescript`, `@types/node`, `@types/react`, `@types/react-dom`,
`tailwindcss`, `@tailwindcss/postcss`, `postcss`, `eslint`, `eslint-config-next`,
`vitest`.

Bewusst **nicht** verwendet: UI-Kits, Icon-Pakete (Icons als Inline-SVG),
Form-Libraries (native Validierung + eigener State), Consent-SaaS (siehe CMP-Hinweis),
Date-Libraries.

## E. Startbefehle

```bash
npx create-next-app@latest . \
  --typescript --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --no-turbopack

npm i -D vitest
npm run dev     # http://localhost:3000
```

`.env.local` (aus `.env.example` kopieren) bleibt zunächst leer –
ohne Ad-IDs zeigt jeder AdSlot einen markierten Entwicklungs-Platzhalter.
