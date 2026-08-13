import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { AdSlot } from "@/components/ads/AdSlot";
import { pageMetadata } from "@/lib/seo";
import { calculators } from "@/config/calculators";
import { getCategory } from "@/config/categories";
import { site } from "@/config/site";
import type { CalculatorMeta } from "@/types/calculator";

export const metadata: Metadata = pageMetadata({
  title: "Alle Rechner von A bis Z",
  description: `Alphabetisches Verzeichnis aller Rechner auf ${site.name}. Sortiert nach Anfangsbuchstaben, mit Hinweis auf Rechner, die gerade entstehen.`,
  path: "/rechner/a-z",
});

/**
 * Gruppiert die Rechner nach Anfangsbuchstaben.
 *
 * Enthält ein Buchstabe mehr Einträge, als bequem in eine Karte passen, wird
 * er auf mehrere Karten aufgeteilt – die Folgekarten tragen dann „A …“ als
 * Überschrift. So bleiben die Karten gleich hoch und das Raster ruhig.
 */
const MAX_PER_CARD = 5;

interface LetterCard {
  letter: string;
  /** True für Folgekarten desselben Buchstabens. */
  continued: boolean;
  items: CalculatorMeta[];
}

function buildCards(): LetterCard[] {
  const groups = new Map<string, CalculatorMeta[]>();

  for (const calculator of calculators) {
    const letter = calculator.name.charAt(0).toUpperCase();
    const list = groups.get(letter) ?? [];
    list.push(calculator);
    groups.set(letter, list);
  }

  const cards: LetterCard[] = [];

  for (const letter of [...groups.keys()].sort((a, b) =>
    a.localeCompare(b, "de"),
  )) {
    const items = groups
      .get(letter)!
      .sort((a, b) => a.name.localeCompare(b.name, "de"));

    for (let index = 0; index < items.length; index += MAX_PER_CARD) {
      cards.push({
        letter,
        continued: index > 0,
        items: items.slice(index, index + MAX_PER_CARD),
      });
    }
  }

  return cards;
}

export default function Page() {
  const cards = buildCards();
  const letters = [...new Set(cards.map((card) => card.letter))];
  const activeCount = calculators.filter((c) => c.status === "aktiv").length;

  return (
    <PageShell
      title="Rechner von A bis Z"
      intro={`Alle Rechner alphabetisch sortiert. ${activeCount} sind fertig und sofort nutzbar, die übrigen entstehen gerade – sie stehen grau und ohne Link in der Liste.`}
      breadcrumbs={[{ name: "Alle Rechner", href: "/rechner" }, { name: "A–Z" }]}
      wide
    >
      {/* Buchstabenleiste als Sprungnavigation */}
      <nav aria-label="Nach Anfangsbuchstaben springen">
        <ul className="flex flex-wrap gap-1.5">
          {letters.map((letter) => (
            <li key={letter}>
              <a
                href={`#buchstabe-${letter}`}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-sm font-semibold text-text-muted transition-colors hover:border-brand hover:bg-brand-soft hover:text-brand-strong"
              >
                {letter}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <AdSlot placement="after-intro" />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => (
          <section
            key={`${card.letter}-${index}`}
            // Nur die erste Karte eines Buchstabens ist Sprungziel.
            id={card.continued ? undefined : `buchstabe-${card.letter}`}
            aria-labelledby={`titel-${card.letter}-${index}`}
            className="scroll-mt-24 rounded-xl border border-border bg-surface p-5"
          >
            <h2
              id={`titel-${card.letter}-${index}`}
              className="text-center text-3xl font-bold text-brand-strong"
            >
              {card.letter}
              {card.continued && (
                <span className="text-text-subtle"> …</span>
              )}
            </h2>

            <ul className="mt-4 space-y-2.5">
              {card.items.map((calculator) => {
                const category = getCategory(calculator.category);
                const isActive = calculator.status === "aktiv";

                return (
                  <li key={calculator.id} className="flex gap-2 text-sm">
                    <span
                      aria-hidden="true"
                      className={isActive ? "text-brand" : "text-text-subtle"}
                    >
                      ›
                    </span>
                    {isActive ? (
                      <Link
                        href={calculator.href}
                        className="text-text-muted underline-offset-2 hover:text-brand hover:underline"
                      >
                        {calculator.name}
                      </Link>
                    ) : (
                      <span className="text-text-subtle">
                        {calculator.name}
                        <span className="ml-1 text-xs">
                          (in Vorbereitung
                          {category ? `, ${category.name}` : ""})
                        </span>
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <AdSlot placement="in-content" />

      <section className="rounded-xl border border-border bg-surface p-6">
        <h2 className="text-xl font-bold tracking-tight text-text">
          Warum stehen hier Rechner ohne Link?
        </h2>
        <p className="mt-2 max-w-2xl leading-relaxed text-text-muted">
          Weil wir lieber ehrlich zeigen, woran wir arbeiten, als eine Liste mit
          Links zu füllen, die ins Leere führen. Sobald ein Rechner fertig und
          geprüft ist, wird der Eintrag automatisch anklickbar. Fehlt dir einer,
          der hier nicht einmal geplant ist? Dann{" "}
          <Link
            href="/kontakt"
            className="text-brand underline underline-offset-2"
          >
            schreib uns kurz
          </Link>
          .
        </p>
      </section>
    </PageShell>
  );
}
