import type { ReactNode } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { CalculatorCard } from "@/components/ui/Card";
import { AdSlot } from "@/components/ads/AdSlot";
import { calculatorsByCategory } from "@/config/calculators";
import { getCategory } from "@/config/categories";
import type { CategorySlug } from "@/types/calculator";

/**
 * Gerüst für Kategorie-Übersichtsseiten.
 *
 * Die Rechnerliste kommt aus der Registry, der einleitende und der
 * abschliessende Text werden pro Kategorie individuell geschrieben – so
 * entsteht kein austauschbarer Fülltext.
 */
export function CategoryPage({
  slug,
  intro,
  children,
}: {
  slug: CategorySlug;
  /** Einleitung unter der H1. */
  intro: string;
  /** Individueller Inhalt unterhalb der Rechnerliste. */
  children?: ReactNode;
}) {
  const category = getCategory(slug);
  if (!category) {
    throw new Error(
      `Unbekannte Kategorie "${slug}" – fehlt sie in src/config/categories.ts?`,
    );
  }

  const all = calculatorsByCategory(slug);
  const active = all.filter((c) => c.status === "aktiv");
  const planned = all.filter((c) => c.status === "geplant");

  return (
    <PageShell
      title={category.name}
      intro={intro}
      breadcrumbs={[{ name: category.name }]}
      wide
    >
      <AdSlot placement="after-intro" />

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {active.map((calculator) => (
          <li key={calculator.id}>
            <CalculatorCard calculator={calculator} />
          </li>
        ))}
      </ul>

      {planned.length > 0 && (
        <section aria-labelledby="geplant" className="mt-12">
          <h2
            id="geplant"
            className="text-xl font-bold tracking-tight text-text"
          >
            Daran arbeiten wir
          </h2>
          <p className="mt-2 max-w-2xl text-text-muted">
            Diese Rechner sind geplant, aber noch nicht fertig. Wir stellen sie
            erst online, wenn Formel, Erklärung und Tests stehen.
          </p>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {planned.map((calculator) => (
              <li key={calculator.id}>
                <CalculatorCard calculator={calculator} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {children && <div className="mt-12 max-w-3xl">{children}</div>}
    </PageShell>
  );
}
