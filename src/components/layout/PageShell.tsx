import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import type { BreadcrumbItem } from "@/lib/schema";

/**
 * Gerüst für einfache Inhaltsseiten (Über uns, Datenschutz, Kategorien …).
 * Rechnerseiten verwenden stattdessen CalculatorPage.
 */
export function PageShell({
  title,
  intro,
  breadcrumbs,
  children,
  wide = false,
}: {
  title: string;
  intro?: string;
  breadcrumbs?: BreadcrumbItem[];
  children: ReactNode;
  /** Breites Layout für Übersichtsseiten mit Kartenraster. */
  wide?: boolean;
}) {
  return (
    <Container className="py-8 sm:py-12">
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
      <header className={`mt-4 ${wide ? "" : "max-w-3xl"}`}>
        <h1 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
          {title}
        </h1>
        {intro && (
          <p className="mt-3 text-lg leading-relaxed text-text-muted">{intro}</p>
        )}
      </header>
      <div className={`mt-8 ${wide ? "" : "max-w-3xl"}`}>{children}</div>
    </Container>
  );
}

/** Abschnitt mit Überschrift innerhalb einer Inhaltsseite. */
export function Section({
  title,
  id,
  children,
  className = "",
}: {
  title: string;
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`mt-10 scroll-mt-24 ${className}`}>
      <h2 className="text-xl font-semibold tracking-tight text-text sm:text-2xl">
        {title}
      </h2>
      <div className="mt-3 prose-rp">{children}</div>
    </section>
  );
}
