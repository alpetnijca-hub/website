import type { Metadata } from "next";
import { CalculatorPage } from "@/components/layout/CalculatorPage";
import { GradeCalculator } from "@/components/calculators/GradeCalculator";
import { pageMetadata } from "@/lib/seo";
import { getCalculator } from "@/config/calculators";

const meta = getCalculator("notendurchschnitt")!;

export const metadata: Metadata = pageMetadata({
  title: meta.seo.title,
  description: meta.seo.description,
  path: meta.href,
});

export default function Page() {
  return (
    <CalculatorPage
      calculatorId="notendurchschnitt"
      disclaimer="keiner"
      intro={
        <p>
          Noten eintragen, Gewicht dazu, fertig – der Rechner zeigt den
          Durchschnitt und dazu, welche Note du in der nächsten Arbeit brauchst,
          um auf deinen Zielschnitt zu kommen. Für deutsche, österreichische und
          Schweizer Noten sowie für Punkte in der Oberstufe.
        </p>
      }
      calculator={<GradeCalculator />}
      formula={
        <>
          <p>Der Notendurchschnitt ist ein gewichtetes Mittel:</p>
          <div className="mt-4 space-y-2 rounded-lg border border-border bg-surface-muted/60 p-4 font-mono text-sm text-text">
            <p>Durchschnitt = Summe(Note × Gewicht) ÷ Summe(Gewichte)</p>
          </div>
          <p>
            Zählt jede Note gleich viel, ist jedes Gewicht 1 – dann wird daraus
            der gewöhnliche Mittelwert: alle Noten addieren, durch die Anzahl
            teilen.
          </p>
          <p>
            Für die <strong>nötige Note</strong> wird dieselbe Formel nach der
            gesuchten Note aufgelöst:
          </p>
          <div className="mt-4 space-y-2 rounded-lg border border-border bg-surface-muted/60 p-4 font-mono text-sm text-text">
            <p>x = Ziel × (Summe Gewichte + g) − Summe(Note × Gewicht)</p>
            <p>geteilt durch g, dem Gewicht der nächsten Arbeit</p>
          </div>
        </>
      }
      example={
        <>
          <p>
            <strong>Drei Noten: eine 2, eine 3 und eine 1, die doppelt
            zählt.</strong>
          </p>
          <ol>
            <li>Gewichtete Summe: 2 × 1 + 3 × 1 + 1 × 2 = 7</li>
            <li>Summe der Gewichte: 1 + 1 + 2 = 4</li>
            <li>
              Durchschnitt: 7 ÷ 4 = <strong>1,75</strong>
            </li>
          </ol>
          <p>
            Ohne die doppelte Wertung wären es (2 + 3 + 1) ÷ 3 = 2,0. Die
            Gewichtung macht hier einen Unterschied von einem Viertel einer
            ganzen Note.
          </p>
          <p>
            <strong>Der klassische Fehler:</strong> Wer in Mathe eine 1 und eine
            3 hat und in Deutsch eine 4, rechnet gern erst je Fach
            (Mathe 2,0 / Deutsch 4,0) und dann daraus 3,0. Richtig sind aber
            (1 + 3 + 4) ÷ 3 = 2,67. Das Mitteln von Mittelwerten stimmt nur,
            wenn überall gleich viele gleich gewichtete Noten vorliegen.
          </p>
          <p>
            <strong>Nötige Note:</strong> Bei zwei Dreien und dem Ziel 2,5 muss
            die nächste Arbeit eine 1,5 werden: (3 + 3 + 1,5) ÷ 3 = 2,5.
          </p>
        </>
      }
      interpretation={
        <>
          <p>
            <strong>Ein Durchschnitt ist keine Zeugnisnote.</strong> Wie eine
            Zeugnisnote zustande kommt, regeln die Schulordnungen der
            Bundesländer und die Prüfungsordnungen der Hochschulen. Dort ist
            oft festgelegt, dass mündliche und schriftliche Leistungen in einem
            bestimmten Verhältnis stehen, dass gerundet oder ausdrücklich nicht
            gerundet wird, und dass die Lehrkraft einen pädagogischen Spielraum
            hat.
          </p>
          <p>
            <strong>Rundung ist der häufigste Streitpunkt.</strong> Ein Schnitt
            von 2,49 ist rechnerisch näher an der 2, ein Schnitt von 2,50 liegt
            genau dazwischen. Ob daraus eine 2 oder eine 3 wird, entscheidet
            nicht die Mathematik, sondern die jeweilige Ordnung. Der Rechner
            rundet deshalb nichts auf ganze Noten.
          </p>
          <p>
            <strong>Die Skala muss stimmen.</strong> In Deutschland und
            Österreich ist die 1 die beste Note, in der Schweiz die 6. Wer die
            falsche Skala wählt, bekommt zwar dieselbe Zahl, aber eine völlig
            verkehrte Einordnung – deshalb fragt der Rechner danach, statt
            etwas anzunehmen.
          </p>
        </>
      }
      limits={
        <>
          <ul>
            <li>
              <strong>Keine Auskunft über deine Schulordnung.</strong> Ob
              Klassenarbeiten doppelt zählen, wie mündliche Noten eingehen und
              ab welchem Wert gerundet wird, steht in der Ordnung deiner Schule
              oder Hochschule. Der Rechner kennt sie nicht.
            </li>
            <li>
              <strong>Keine Umrechnung zwischen Notensystemen.</strong> Eine
              deutsche 2 ist keine Schweizer 5 – die Systeme sind nicht
              ineinander umrechenbar, auch wenn Tabellen im Netz das
              behaupten. Für Anerkennungen sind die zuständigen Stellen
              massgeblich.
            </li>
            <li>
              <strong>Keine Prognose.</strong> Die Angabe zur nötigen Note ist
              reine Rechnerei. Ob eine 1,0 in der nächsten Arbeit realistisch
              ist, kann dir nur dein Fachlehrer sagen.
            </li>
            <li>
              <strong>Keine Notenpunkte-Umrechnung.</strong> Die Skala mit 15
              Punkten wird als eigene Skala gerechnet, nicht in Noten
              zurückgerechnet.
            </li>
          </ul>
        </>
      }
      faq={[
        {
          question: "Wie rechnet man den Notendurchschnitt aus?",
          answer:
            "Alle Noten addieren und durch ihre Anzahl teilen. Zählen einzelne Noten stärker, wird jede Note zuerst mit ihrem Gewicht multipliziert, und am Ende wird durch die Summe der Gewichte geteilt – nicht durch die Anzahl der Noten.",
        },
        {
          question: "Was bedeutet das Gewicht?",
          answer:
            "Wie stark eine Note zählt. 1 ist der Normalfall, 2 bedeutet doppelte Wertung – etwa bei einer Klausur gegenüber einem Test. Auch 0,5 ist möglich, wenn eine Note nur halb zählt.",
        },
        {
          question: "Wird bei 2,5 auf 2 oder auf 3 gerundet?",
          answer:
            "Das entscheidet nicht die Mathematik, sondern die Schul- oder Prüfungsordnung. Manche runden kaufmännisch, manche zugunsten der Schüler, manche gar nicht. Der Rechner zeigt deshalb den ungerundeten Wert mit zwei Nachkommastellen.",
        },
        {
          question: "Kann ich Schweizer Noten berechnen?",
          answer:
            "Ja, stell oben das Notensystem auf Schweiz um. Dort ist die 6 die beste Note und 4 die Grenze zum Bestehen – der Rechner dreht die Einordnung entsprechend um.",
        },
        {
          question: "Welche Note brauche ich für meinen Zielschnitt?",
          answer:
            "Trag deinen Zielschnitt unten im Ergebnis ein. Der Rechner löst die Durchschnittsformel nach der fehlenden Note auf. Liegt das Ergebnis ausserhalb der Notenskala, ist das Ziel mit einer einzelnen weiteren Note nicht mehr erreichbar – dann sagt der Rechner das auch.",
        },
      ]}
    />
  );
}
