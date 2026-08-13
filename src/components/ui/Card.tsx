import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { CalculatorMeta } from "@/types/calculator";

/**
 * Karte für einen Rechner.
 * Geplante Rechner werden als nicht klickbare Vorschau dargestellt,
 * damit keine toten Links entstehen.
 */
export function CalculatorCard({ calculator }: { calculator: CalculatorMeta }) {
  const isPlanned = calculator.status === "geplant";

  const inner = (
    <>
      <div className="flex items-start gap-3">
        <span
          className={`shrink-0 rounded-lg p-2 ${
            isPlanned
              ? "bg-surface-muted text-text-subtle"
              : "bg-brand-soft text-brand-strong"
          }`}
        >
          <Icon name={calculator.icon} className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h3 className="font-semibold text-text">
            {calculator.name}
            {isPlanned && (
              <span className="ml-2 rounded-full bg-surface-muted px-2 py-0.5 text-xs font-medium text-text-subtle">
                geplant
              </span>
            )}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-text-muted">
            {calculator.description}
          </p>
        </div>
      </div>
    </>
  );

  if (isPlanned) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-surface/60 p-5">
        {inner}
      </div>
    );
  }

  return (
    <Link
      href={calculator.href}
      className="block rounded-xl border border-border bg-surface p-5 shadow-sm transition-colors hover:border-brand hover:bg-brand-soft/30"
    >
      {inner}
    </Link>
  );
}
