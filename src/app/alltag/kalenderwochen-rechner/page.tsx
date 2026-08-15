import type { Metadata } from "next";
import { CalculatorPage } from "@/components/layout/CalculatorPage";
import { WeekCalculator } from "@/components/calculators/WeekCalculator";
import { pageMetadata } from "@/lib/seo";
import { getCalculator } from "@/config/calculators";

const meta = getCalculator("kalenderwoche")!;

export const metadata: Metadata = pageMetadata({
  title: meta.seo.title,
  description: meta.seo.description,
  path: meta.href,
});

export default function Page() {
  return (
    <CalculatorPage
      calculatorId="kalenderwoche"
      disclaimer="keiner"
      intro={
        <p>
          In welcher Kalenderwoche liegt ein Datum – und welche Tage umfasst
          KW 33? Beide Richtungen, gerechnet nach ISO 8601, also der Norm, die
          im deutschsprachigen Raum gilt.
        </p>
      }
      calculator={<WeekCalculator />}
      formula={
        <>
          <p>
            Die Kalenderwoche folgt zwei Regeln, aus denen sich alles Weitere
            ergibt:
          </p>
          <div className="mt-4 space-y-2 rounded-lg border border-border bg-surface-muted/60 p-4 font-mono text-sm text-text">
            <p>1. Die Woche beginnt am Montag.</p>
            <p>
              2. KW 1 ist die Woche, die den ersten Donnerstag des Jahres
              enthält.
            </p>
          </div>
          <p>
            Die zweite Regel lässt sich auch so ausdrücken: KW 1 ist die Woche,
            in der der 4. Januar liegt. Beides ist gleichbedeutend, und beides
            führt zu derselben Zählung.
          </p>
          <p>
            Daraus folgt eine Eigenheit, die viele überrascht: Eine Woche gehört
            zu dem Jahr, in dem ihr <strong>Donnerstag</strong> liegt. Der
            1. Januar kann deshalb noch zur letzten Woche des Vorjahres zählen,
            und der 31. Dezember schon zur KW 1 des Folgejahres.
          </p>
          <p>
            Ein Jahr hat 52 oder 53 Kalenderwochen. 53 Wochen hat es dann, wenn
            es an einem Donnerstag beginnt – oder in einem Schaltjahr an einem
            Mittwoch.
          </p>
        </>
      }
      example={
        <>
          <p>
            <strong>Der 15. August 2026</strong> liegt in KW 33. Die Woche läuft
            von Montag, dem 10. August, bis Sonntag, dem 16. August.
          </p>
          <p>
            <strong>Der 1. Januar 2027</strong> ist ein Freitag und gehört noch
            zur <strong>KW 53 des Jahres 2026</strong>. Der erste Donnerstag des
            Jahres 2027 liegt erst in der Woche darauf, also beginnt die KW 1
            von 2027 am 4. Januar.
          </p>
          <p>
            <strong>Umgekehrt:</strong> Der 31. Dezember 2029 ist ein Montag und
            liegt bereits in der KW 1 des Jahres 2030 – die Woche endet am
            6. Januar 2030, ihr Donnerstag fällt ins neue Jahr.
          </p>
          <p>
            <strong>Warum 2026 dreiundfünfzig Wochen hat:</strong> Das Jahr
            beginnt an einem Donnerstag. Damit enthält schon die erste Woche
            einen Donnerstag, und am Jahresende bleibt eine volle Woche übrig.
          </p>
        </>
      }
      interpretation={
        <>
          <p>
            <strong>Nicht überall wird gleich gezählt.</strong> In den USA
            beginnt die Woche am Sonntag, und KW 1 ist dort schlicht die Woche
            mit dem 1. Januar. Amerikanische Programme und manche
            Tabellenkalkulationen liefern deshalb eine andere Wochennummer als
            ein deutscher Kalender. Wer international arbeitet, sollte die
            Zählweise dazusagen.
          </p>
          <p>
            <strong>Kalenderwochen sind im Berufsleben allgegenwärtig:</strong>{" "}
            Liefertermine, Projektpläne, Schichtpläne und Urlaubsanträge werden
            in KW angegeben, weil das kürzer ist als ein Datumsbereich und
            unabhängig von Monatsgrenzen funktioniert.
          </p>
          <p>
            <strong>Achte auf das Jahr bei der Woche.</strong> „KW 1“ allein ist
            um den Jahreswechsel mehrdeutig. Der Rechner nennt deshalb immer
            dazu, zu welchem Jahr die Woche zählt.
          </p>
        </>
      }
      limits={
        <>
          <ul>
            <li>
              <strong>Nur die ISO-Zählung.</strong> Die amerikanische Zählweise
              mit Sonntag als Wochenbeginn bildet der Rechner nicht ab – sie
              wird hier praktisch nicht verwendet und würde nur zu
              Verwechslungen führen.
            </li>
            <li>
              <strong>Keine Feiertage und keine Schulferien.</strong> Der
              Rechner nennt Zeiträume, keine freien Tage.
            </li>
            <li>
              <strong>Keine Wochennummern für Abrechnungszeiträume.</strong>{" "}
              Manche Unternehmen verwenden abweichende Geschäftswochen. Wenn dein
              Betrieb eine eigene Zählung nutzt, gilt sie und nicht diese.
            </li>
          </ul>
        </>
      }
      faq={[
        {
          question: "Welche Kalenderwoche haben wir heute?",
          answer:
            "Der Rechner ist mit dem heutigen Datum vorbelegt und zeigt die aktuelle KW samt Zeitraum von Montag bis Sonntag. Für ein anderes Datum einfach das Feld ändern.",
        },
        {
          question: "Warum gehört der 1. Januar manchmal zur KW 52 oder 53?",
          answer:
            "Weil nach ISO 8601 eine Woche zu dem Jahr zählt, in dem ihr Donnerstag liegt. Fällt der 1. Januar auf einen Freitag, Samstag oder Sonntag, liegt der Donnerstag dieser Woche noch im alten Jahr – die Woche gehört dann zum Vorjahr.",
        },
        {
          question: "Wie viele Kalenderwochen hat ein Jahr?",
          answer:
            "52 oder 53. Ein Jahr hat 53 Wochen, wenn es an einem Donnerstag beginnt, oder wenn es ein Schaltjahr ist und an einem Mittwoch beginnt. Der Rechner nennt die Zahl für das eingegebene Jahr.",
        },
        {
          question: "Beginnt die Woche am Montag oder am Sonntag?",
          answer:
            "Nach ISO 8601 am Montag – so wird es im deutschsprachigen Raum und in weiten Teilen Europas gehandhabt. In den USA und einigen anderen Ländern beginnt die Woche am Sonntag, was zu abweichenden Wochennummern führt.",
        },
      ]}
    />
  );
}
