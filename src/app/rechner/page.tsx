import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { CalculatorCard } from "@/components/ui/Card";
import { CalculatorSearch } from "@/components/search/CalculatorSearch";
import { AdSlot } from "@/components/ads/AdSlot";
import { Icon } from "@/components/ui/Icon";
import { pageMetadata } from "@/lib/seo";
import { categories } from "@/config/categories";
import { activeCalculators, calculatorsByCategory } from "@/config/calculators";
import { site } from "@/config/site";

export const metadata: Metadata = pageMetadata({
  title: "Alle Rechner im Überblick",
  description: `Vollständige Übersicht aller Rechner auf ${site.name} – nach Kategorien sortiert, inklusive der Bereiche, die gerade entstehen.`,
  path: "/rechner",
});

export default function Page() {
  const total = activeCalculators().length;

  return (
    <PageShell
      title="Alle Rechner"
      intro={`Aktuell ${total} fertige Rechner, sortiert nach Themen. Bereiche, an denen wir noch arbeiten, sind als „geplant“ gekennzeichnet – so siehst du, was kommt.`}
      breadcrumbs={[{ name: "Alle Rechner" }]}
      wide
    >
      <div className="max-w-2xl">
        <CalculatorSearch limit={8} />
      </div>

      <AdSlot placement="after-intro" />

      {categories.map((category) => {
        const items = calculatorsByCategory(category.slug);
        if (items.length === 0) return null;

        return (
          <section
            key={category.slug}
            aria-labelledby={`kat-${category.slug}`}
            className="mt-12 first:mt-4"
          >
            <div className="flex items-start gap-3">
              <span
                className={`shrink-0 rounded-lg p-2 ${
                  category.status === "aktiv"
                    ? "bg-brand-soft text-brand-strong"
                    : "bg-surface-muted text-text-subtle"
                }`}
              >
                <Icon name={category.icon} className="h-5 w-5" />
              </span>
              <div>
                <h2
                  id={`kat-${category.slug}`}
                  className="text-xl font-bold tracking-tight text-text sm:text-2xl"
                >
                  {category.name}
                </h2>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-text-muted">
                  {category.description}
                </p>
              </div>
            </div>

            <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((calculator) => (
                <li key={calculator.id}>
                  <CalculatorCard calculator={calculator} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <AdSlot placement="in-content" />

      <section className="mt-4 rounded-xl border border-border bg-surface p-6">
        <h2 className="text-xl font-bold tracking-tight text-text">
          Ein Rechner fehlt dir?
        </h2>
        <p className="mt-2 max-w-2xl leading-relaxed text-text-muted">
          Wir bauen die Seite Schritt für Schritt aus und richten uns dabei nach
          dem, was tatsächlich gebraucht wird. Wenn du einen Rechner vermisst,
          schreib uns kurz über die{" "}
          <a
            href="/kontakt"
            className="text-brand underline underline-offset-2"
          >
            Kontaktseite
          </a>{" "}
          – Vorschläge fliessen direkt in die Planung ein.
        </p>
      </section>
    </PageShell>
  );
}
