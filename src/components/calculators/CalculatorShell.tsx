import type { ReactNode } from "react";

/**
 * Rahmen für das Eingabeformular eines Rechners.
 *
 * Die Rechner arbeiten ohne Absenden-Button: Das Ergebnis aktualisiert sich,
 * sobald eine gültige Eingabe vorliegt. Das Formular-Element bleibt trotzdem
 * ein <form>, damit Screenreader den Bereich als Formular ankündigen und die
 * Enter-Taste keine Seite neu lädt.
 */
export function CalculatorShell({
  children,
  legend,
}: {
  children: ReactNode;
  /** Für Screenreader beschriebener Zweck des Formulars. */
  legend: string;
}) {
  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="rounded-xl border border-border bg-surface p-5 sm:p-6"
      aria-label={legend}
    >
      {children}
    </form>
  );
}
