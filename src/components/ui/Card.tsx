import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { CalculatorMeta } from "@/types/calculator";

/**
 * Karte für einen Rechner.
 *
 * Die Farbe des Symbols kommt aus der Kategorie (`data-accent`), damit sich
 * gemischte Listen – Startseite, A–Z, verwandte Rechner – auf einen Blick
 * ordnen lassen. Die Farbe ist dabei immer nur eine Zugabe: Name, Beschreibung
 * und Symbol stehen unabhängig davon da.
 *
 * Geplante Rechner werden als nicht klickbare Vorschau dargestellt,
 * damit keine toten Links entstehen.
 */
export function CalculatorCard({ calculator }: { calculator: CalculatorMeta }) {
  const isPlanned = calculator.status === "geplant";

  const inner = (
    <div className="flex items-start gap-3.5">
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
          isPlanned
            ? "bg-surface-muted text-text-subtle"
            : "bg-accent-soft text-accent"
        }`}
      >
        <Icon name={calculator.icon} className="h-5.5 w-5.5" />
      </span>
      {/* Rechts bleibt Platz für den Pfeil, der beim Überfahren erscheint. */}
      <div className="min-w-0 pr-6">
        <h3 className="font-semibold text-text">
          {calculator.name}
          {isPlanned && (
            <span className="ml-2 whitespace-nowrap rounded-full bg-surface-muted px-2 py-0.5 text-xs font-medium text-text-subtle">
              geplant
            </span>
          )}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-text-muted">
          {calculator.description}
        </p>
      </div>
    </div>
  );

  if (isPlanned) {
    return (
      <div className="h-full rounded-xl border border-dashed border-border bg-surface/60 p-5">
        {inner}
      </div>
    );
  }

  return (
    <Link
      href={calculator.href}
      data-accent={calculator.category}
      className="card-lift group relative block h-full rounded-xl border border-border bg-surface p-5 shadow-sm hover:border-accent"
    >
      {inner}
      {/* Der Pfeil liegt absolut, damit die Karte ohne ihn nicht höher wird
          und beim Überfahren nichts springt. */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute right-4 top-4 h-4 w-4 text-accent opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
        aria-hidden="true"
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </Link>
  );
}
