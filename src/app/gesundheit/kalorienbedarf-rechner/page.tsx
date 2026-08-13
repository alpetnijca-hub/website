import type { Metadata } from "next";
import Link from "next/link";
import { CalculatorPage } from "@/components/layout/CalculatorPage";
import { CalorieCalculator } from "@/components/calculators/CalorieCalculator";
import { pageMetadata } from "@/lib/seo";
import { getCalculator } from "@/config/calculators";

const meta = getCalculator("kalorienbedarf")!;

export const metadata: Metadata = pageMetadata({
  title: meta.seo.title,
  description: meta.seo.description,
  path: meta.href,
});

export default function Page() {
  return (
    <CalculatorPage
      calculatorId="kalorienbedarf"
      intro={
        <p>
          Wie viele Kalorien du am Tag brauchst, hängt vor allem von deinem
          Körper und deiner Bewegung ab. Dieser Rechner ermittelt zuerst deinen
          Grundumsatz – also den Verbrauch in völliger Ruhe – und rechnet ihn
          dann mit einem Aktivitätsfaktor auf den Gesamtumsatz hoch. Anschliessend
          bekommst du eine Empfehlung für dein Ziel.
        </p>
      }
      calculator={<CalorieCalculator />}
      formula={
        <>
          <p>
            Der Grundumsatz wird nach der Gleichung von{" "}
            <strong>Mifflin und St Jeor (1990)</strong> berechnet. Sie gilt
            heute als die genaueste der gängigen Schätzformeln für gesunde
            Erwachsene und hat die ältere Harris-Benedict-Formel weitgehend
            abgelöst.
          </p>
          <div className="mt-4 space-y-2 rounded-lg border border-border bg-surface-muted/60 p-4 font-mono text-sm text-text">
            <p>Männer: BMR = 10 × kg + 6,25 × cm − 5 × Alter + 5</p>
            <p>Frauen: BMR = 10 × kg + 6,25 × cm − 5 × Alter − 161</p>
            <p>Gesamtumsatz = BMR × Aktivitätsfaktor</p>
          </div>
          <p>
            Der einzige Unterschied zwischen beiden Varianten ist die Konstante
            am Ende: plus 5 gegenüber minus 161, also 166 Kilokalorien. Dahinter
            steckt der im Mittel höhere Anteil an Muskelmasse bei Männern.
          </p>
          <p>
            Für den Aktivitätsfaktor verwenden wir die gebräuchlichen PAL-Stufen
            von 1,2 (sitzend) bis 1,9 (körperliche Schwerarbeit). Für das Ziel
            „Abnehmen“ ziehen wir 500 kcal ab, für „Zunehmen“ addieren wir
            300 kcal. Die Empfehlung wird nie unter 1.200 kcal (Frauen)
            beziehungsweise 1.500 kcal (Männer) abgesenkt.
          </p>
        </>
      }
      example={
        <>
          <p>
            Eine 34-jährige Frau, 68 kg schwer und 170 cm gross, arbeitet im Büro
            und geht dreimal pro Woche zum Sport (Aktivitätsfaktor 1,375). Sie
            möchte abnehmen.
          </p>
          <ol>
            <li>
              Grundumsatz: 10 × 68 + 6,25 × 170 − 5 × 34 − 161 = 680 + 1.062,5 −
              170 − 161 = <strong>1.411,5 kcal</strong>
            </li>
            <li>
              Gesamtumsatz: 1.411,5 × 1,375 = <strong>1.941 kcal</strong>
            </li>
            <li>
              Ziel Abnehmen: 1.941 − 500 = <strong>1.441 kcal pro Tag</strong>
            </li>
          </ol>
          <p>
            Rechnerisch entspricht das Defizit von 500 kcal etwa 0,45 kg
            Gewichtsverlust pro Woche. Der genaue Verlauf hängt allerdings von
            vielen weiteren Faktoren ab – siehe Abschnitt „Grenzen“.
          </p>
        </>
      }
      interpretation={
        <>
          <p>
            <strong>Grundumsatz</strong> ist die Energie, die dein Körper allein
            für Atmung, Herzschlag, Körpertemperatur und Zellerneuerung
            verbraucht. Er macht bei den meisten Menschen 60 bis 70 Prozent des
            Tagesbedarfs aus – auch an einem Tag, an dem du dich kaum bewegst.
          </p>
          <p>
            <strong>Gesamtumsatz</strong> ist der Grundumsatz plus alles, was
            durch Bewegung dazukommt: Sport, aber auch Treppensteigen, Einkaufen
            und die Verdauung selbst. Genau dieser Wert ist gemeint, wenn von
            „Kalorienbedarf“ die Rede ist.
          </p>
          <p>
            Behandle das Ergebnis als Ausgangspunkt für die nächsten zwei bis
            drei Wochen. Wiege dich morgens unter gleichen Bedingungen und schau
            dir den Trend an, nicht den einzelnen Tag. Bleibt das Gewicht trotz
            Defizit stabil, liegt dein tatsächlicher Bedarf wahrscheinlich
            niedriger als die Schätzung – dann passt du die Zufuhr in kleinen
            Schritten von etwa 100 bis 150 kcal an.
          </p>
          <p>
            Wie du das Kalorienziel auf Eiweiss, Fett und Kohlenhydrate
            aufteilst, kannst du direkt mit dem{" "}
            <Link href="/gesundheit/makronaehrstoff-rechner">
              Makronährstoff-Rechner
            </Link>{" "}
            weiterrechnen.
          </p>
        </>
      }
      limits={
        <>
          <p>
            Die Mifflin-St-Jeor-Formel wurde an gesunden Erwachsenen entwickelt
            und beschreibt den Durchschnitt einer Gruppe. Für eine einzelne
            Person kann der tatsächliche Grundumsatz spürbar abweichen – bei
            einem erheblichen Teil der Untersuchten um mehr als zehn Prozent in
            die eine oder andere Richtung.
          </p>
          <ul>
            <li>
              <strong>Körperzusammensetzung wird nicht erfasst.</strong> Zwei
              Menschen mit gleichem Gewicht und gleicher Grösse bekommen
              denselben Wert, obwohl der eine deutlich mehr Muskelmasse haben
              kann. Muskeln verbrauchen in Ruhe mehr Energie als Fettgewebe.
            </li>
            <li>
              <strong>Der Aktivitätsfaktor ist eine Selbsteinschätzung.</strong>{" "}
              Genau hier entsteht die grösste Ungenauigkeit. Die meisten Menschen
              überschätzen ihre Alltagsbewegung. Im Zweifel die niedrigere Stufe
              wählen.
            </li>
            <li>
              <strong>Nicht für alle geeignet.</strong> Bei Kindern und
              Jugendlichen, in Schwangerschaft und Stillzeit, bei
              Schilddrüsenerkrankungen, nach bariatrischen Operationen oder bei
              sehr hohem Körpergewicht liefert die Formel keine verlässlichen
              Werte.
            </li>
            <li>
              <strong>Der Bedarf ist nicht konstant.</strong> Er sinkt, wenn du
              abnimmst, und schwankt mit Schlaf, Stress und Krankheit.
            </li>
          </ul>
        </>
      }
      faq={[
        {
          question: "Warum weicht das Ergebnis von anderen Rechnern ab?",
          answer:
            "Viele Rechner verwenden die ältere Harris-Benedict-Formel oder andere Aktivitätsfaktoren. Harris-Benedict überschätzt den Grundumsatz gegenüber Mifflin-St Jeor häufig um rund fünf Prozent. Unterschiede von 100 bis 200 kcal zwischen zwei Rechnern sind deshalb normal und kein Zeichen dafür, dass einer davon falsch rechnet.",
        },
        {
          question: "Soll ich mein Trainings-Kalorienverbrauch zusätzlich addieren?",
          answer:
            "Nein, wenn du einen Aktivitätsfaktor ab 1,375 gewählt hast – dann ist regelmässiger Sport bereits enthalten. Wer den Faktor 1,2 wählt und das Training einzeln dazurechnet, kommt zu einem ähnlichen Ergebnis. Beides gleichzeitig zu tun führt dagegen zu einer deutlichen Überschätzung.",
        },
        {
          question: "Wie genau muss ich mein Gewicht angeben?",
          answer:
            "Auf ein Kilogramm genau reicht völlig. Ein Unterschied von einem Kilogramm ändert den Grundumsatz um genau 10 kcal – das liegt weit innerhalb der Ungenauigkeit der Formel selbst.",
        },
        {
          question: "Warum wird die Empfehlung nicht weiter abgesenkt?",
          answer:
            "Unterhalb von etwa 1.200 kcal für Frauen und 1.500 kcal für Männer ist es schwierig, den Bedarf an Eiweiss, Vitaminen und Mineralstoffen zu decken. Sehr niedrige Zufuhren gehören fachlich begleitet. Der Rechner zeigt deshalb diese Untergrenze an und weist gesondert darauf hin.",
        },
        {
          question: "Gilt der Wert auch an Ruhetagen?",
          answer:
            "Der Aktivitätsfaktor mittelt über die gesamte Woche. Es ist deshalb nicht nötig, an Trainings- und Ruhetagen unterschiedlich zu essen. Wer es dennoch möchte, kann an Trainingstagen etwas mehr und an Ruhetagen etwas weniger essen, solange die Wochensumme stimmt.",
        },
      ]}
      sources={["mifflin", "dge", "hall"]}
    />
  );
}
