import Link from "next/link";

/**
 * Gesundheits-Disclaimer für alle Rechner im Bereich Gesundheit & Fitness.
 * Bewusst nüchtern formuliert: keine Heilversprechen, keine Zusicherung
 * medizinischer Genauigkeit.
 */
export function HealthDisclaimer() {
  return (
    <aside className="rounded-lg border border-border bg-surface-muted p-4 text-sm leading-relaxed text-text-muted">
      <h2 className="mb-1 font-semibold text-text">Wichtiger Hinweis</h2>
      <p>
        Dieser Rechner liefert eine rechnerische Schätzung auf Basis
        veröffentlichter Formeln. Er ersetzt keine ärztliche oder
        ernährungsmedizinische Beratung, stellt keine Diagnose und ist nicht zur
        Behandlung von Krankheiten geeignet. Die Ergebnisse sind statistische
        Durchschnittswerte und können im Einzelfall deutlich abweichen. Wenn du
        eine Erkrankung hast, schwanger bist, Medikamente einnimmst oder deine
        Ernährung stark verändern möchtest, sprich vorher mit einer Ärztin oder
        einem Arzt. Für Entscheidungen, die du auf Grundlage dieser Ergebnisse
        triffst, können wir keine Verantwortung übernehmen.{" "}
        <Link href="/quellen-und-methoden" className="text-brand underline underline-offset-2">
          Quellen und Methoden
        </Link>
      </p>
    </aside>
  );
}

/**
 * Kennzeichnung für Rechtstexte, die noch nicht ausgefüllt sind.
 * Verhindert, dass Platzhalter versehentlich für geprüfte Texte gehalten werden.
 */
export function PlaceholderNotice({ topic }: { topic: string }) {
  return (
    <div className="rounded-lg border-2 border-dashed border-warning/50 bg-warning-soft p-4 text-sm leading-relaxed text-text-muted">
      <p className="mb-1 font-semibold text-warning">
        Platzhalter – noch nicht rechtsverbindlich
      </p>
      <p>
        Dieser {topic} ist ein unverbindlicher Entwurf und noch nicht
        ausgefüllt. Er muss vor der Veröffentlichung der Website durch eine
        fachkundige Person – zum Beispiel eine Anwältin oder einen Anwalt für
        IT-Recht – erstellt beziehungsweise geprüft werden. Der Text hier
        erhebt keinen Anspruch auf Vollständigkeit oder Rechtskonformität.
      </p>
    </div>
  );
}
