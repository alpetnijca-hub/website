import Link from "next/link";
import { supportEnabled } from "@/config/support";

/**
 * Schmaler Hinweis auf die Trinkgeld-Seite.
 *
 * Erscheint nur, wenn tatsächlich ein Zahlungsweg eingerichtet ist. Bewusst
 * zurückhaltend: kein Overlay, kein Zähler, kein Countdown und keine
 * Formulierung, die ein schlechtes Gewissen machen soll. Wer nicht zahlen
 * will, soll die Seite unverändert weiternutzen können.
 */
export function SupportCard({ className = "" }: { className?: string }) {
  if (!supportEnabled) return null;

  return (
    <aside
      className={`rounded-xl border border-border bg-surface p-5 sm:flex sm:items-center sm:justify-between sm:gap-6 ${className}`}
    >
      <div>
        <h2 className="font-semibold text-text">Hat dir der Rechner geholfen?</h2>
        <p className="mt-1 text-sm leading-relaxed text-text-muted">
          Diese Website ist kostenlos und bleibt es. Wenn du magst, kannst du
          ein Trinkgeld dalassen – freiwillig und ohne Gegenleistung.
        </p>
      </div>
      <Link
        href="/unterstuetzen"
        className="mt-4 inline-block shrink-0 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-on-brand transition-opacity hover:opacity-90 sm:mt-0"
      >
        Trinkgeld geben
      </Link>
    </aside>
  );
}
