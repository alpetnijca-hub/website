import type { FaqItem } from "@/lib/schema";

/**
 * FAQ-Liste auf Basis von <details>/<summary>.
 * Ohne JavaScript bedienbar, per Tastatur zugänglich und für Suchmaschinen
 * im HTML vorhanden (der Antworttext wird nicht per JS nachgeladen).
 */
export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-border rounded-xl border border-border bg-surface">
      {items.map((item) => (
        <details key={item.question} className="group px-5 py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-text">
            <span>{item.question}</span>
            <span
              aria-hidden="true"
              className="shrink-0 text-xl leading-none text-text-subtle transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-text-muted">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
