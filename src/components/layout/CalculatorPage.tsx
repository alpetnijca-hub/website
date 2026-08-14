import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Section } from "@/components/layout/PageShell";
import { AdSlot } from "@/components/ads/AdSlot";
import { Faq } from "@/components/ui/Faq";
import { SourceList } from "@/components/ui/SourceList";
import { FinanceDisclaimer, HealthDisclaimer } from "@/components/ui/Disclaimer";
import { JsonLd } from "@/components/ui/JsonLd";
import { SupportCard } from "@/components/support/SupportCard";
import { Icon } from "@/components/ui/Icon";
import { faqSchema, type FaqItem } from "@/lib/schema";
import { getCalculator, relatedCalculators } from "@/config/calculators";
import { getCategory } from "@/config/categories";
import type { SourceId } from "@/data/sources";

/**
 * Einheitliches Gerüst aller Rechnerseiten.
 *
 * Die Reihenfolge der Abschnitte ist bewusst überall gleich – Nutzer finden
 * sich dadurch schneller zurecht. Die Inhalte selbst werden pro Rechner
 * individuell geschrieben und nicht aus Vorlagen erzeugt.
 *
 * Werbeplätze liegen an drei Stellen im Inhalt plus einer Desktop-Sidebar.
 * Sie stehen nie vor dem Rechner, damit der eigentliche Zweck der Seite
 * sofort erreichbar bleibt.
 */
export function CalculatorPage({
  calculatorId,
  intro,
  calculator,
  formula,
  example,
  interpretation,
  limits,
  faq,
  sources = [],
  disclaimer = "gesundheit",
}: {
  calculatorId: string;
  /** Kurze Einleitung, 2–4 Sätze. */
  intro: ReactNode;
  /** Die interaktive Rechner-Komponente. */
  calculator: ReactNode;
  formula: ReactNode;
  example: ReactNode;
  interpretation: ReactNode;
  limits: ReactNode;
  faq: FaqItem[];
  /** Quellen der verwendeten Formel. Leer lassen, wenn es sich um
   *  allgemein bekannte Rechenregeln handelt (z. B. Prozentrechnung). */
  sources?: readonly SourceId[];
  /**
   * Welcher Haftungshinweis unter der Seite steht. "gesundheit" für alle
   * Rechner mit Bezug zu Ernährung und Training, "finanzen" für Geldthemen,
   * "keiner" für reine Rechenwerkzeuge ohne Beratungsbezug.
   */
  disclaimer?: "gesundheit" | "finanzen" | "keiner";
}) {
  const meta = getCalculator(calculatorId);
  if (!meta) {
    throw new Error(
      `Unbekannter Rechner "${calculatorId}" – fehlt er in src/config/calculators.ts?`,
    );
  }
  const category = getCategory(meta.category);
  const related = relatedCalculators(calculatorId);

  return (
    <Container className="py-8 sm:py-12" data-accent={meta.category}>
      <Breadcrumbs
        items={[
          ...(category ? [{ name: category.name, href: category.href }] : []),
          { name: meta.name },
        ]}
      />

      <div className="mt-4 gap-10 lg:flex">
        <div className="min-w-0 lg:max-w-3xl lg:flex-1">
          {category && (
            <Link
              href={category.href}
              className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-sm font-medium text-accent"
            >
              <Icon name={category.icon} className="h-4 w-4" />
              {category.name}
            </Link>
          )}
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-text sm:text-4xl">
            {meta.name}
          </h1>
          <div className="mt-3 text-lg leading-relaxed text-text-muted">
            {intro}
          </div>

          <AdSlot placement="after-intro" />

          {calculator}

          <AdSlot placement="after-result" />

          <Section title="Verwendete Formel" id="formel">
            {formula}
          </Section>

          <Section title="Rechenbeispiel" id="beispiel">
            {example}
          </Section>

          <Section title="Was das Ergebnis bedeutet" id="einordnung">
            {interpretation}
          </Section>

          <AdSlot placement="in-content" />

          <Section title="Grenzen dieser Berechnung" id="grenzen">
            {limits}
          </Section>

          <Section title="Häufige Fragen" id="faq">
            <Faq items={faq} />
          </Section>

          {related.length > 0 && (
            <Section title="Passende Rechner" id="verwandt">
              <ul className="grid gap-3 not-prose sm:grid-cols-2">
                {related.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 transition-colors hover:border-brand hover:bg-brand-soft/30"
                    >
                      <Icon name={item.icon} className="h-5 w-5 shrink-0 text-brand" />
                      <span className="text-sm font-medium text-text">
                        {item.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          <SupportCard className="mt-10" />

          {sources.length > 0 && (
            <Section title="Quellen" id="quellen">
              <SourceList ids={sources} />
            </Section>
          )}

          {disclaimer !== "keiner" && (
            <div className="mt-10">
              {disclaimer === "finanzen" ? (
                <FinanceDisclaimer />
              ) : (
                <HealthDisclaimer />
              )}
            </div>
          )}
        </div>

        {/* Sidebar nur ab Desktop-Breite – auf Mobilgeräten würde sie den
            Inhalt verdrängen. */}
        <aside className="hidden w-[300px] shrink-0 lg:block" aria-label="Anzeigen">
          <div className="sticky top-24">
            <AdSlot placement="sidebar" className="my-0" />
          </div>
        </aside>
      </div>

      <JsonLd data={faqSchema(faq)} />
    </Container>
  );
}
