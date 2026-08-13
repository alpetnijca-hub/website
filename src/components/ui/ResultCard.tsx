import type { ReactNode } from "react";

/**
 * Hervorgehobener Ergebnisbereich.
 *
 * aria-live="polite" sorgt dafür, dass Screenreader ein neu berechnetes
 * Ergebnis vorlesen, ohne die Eingabe zu unterbrechen.
 */
export function ResultCard({
  title = "Dein Ergebnis",
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-live="polite"
      className="rounded-xl border-2 border-brand bg-brand-soft/50 p-5 sm:p-6"
    >
      <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-strong">
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

/** Grosse Kennzahl mit Beschriftung, z. B. Grundumsatz. */
export function ResultValue({
  label,
  value,
  note,
  emphasis = false,
}: {
  label: string;
  value: string;
  note?: string;
  emphasis?: boolean;
}) {
  return (
    <div>
      <p className="text-sm text-text-muted">{label}</p>
      <p
        className={`font-bold tracking-tight text-text ${
          emphasis ? "text-3xl sm:text-4xl" : "text-2xl"
        }`}
      >
        {value}
      </p>
      {note && <p className="mt-0.5 text-xs text-text-subtle">{note}</p>}
    </div>
  );
}

/** Raster für mehrere Kennzahlen nebeneinander. */
export function ResultGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-5 sm:grid-cols-2">{children}</div>;
}
