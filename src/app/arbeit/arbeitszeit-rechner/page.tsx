import type { Metadata } from "next";
import { CalculatorPage } from "@/components/layout/CalculatorPage";
import { WorkTimeCalculator } from "@/components/calculators/WorkTimeCalculator";
import { pageMetadata } from "@/lib/seo";
import { getCalculator } from "@/config/calculators";

const meta = getCalculator("arbeitszeit")!;

export const metadata: Metadata = pageMetadata({
  title: meta.seo.title,
  description: meta.seo.description,
  path: meta.href,
});

export default function Page() {
  return (
    <CalculatorPage
      calculatorId="arbeitszeit"
      disclaimer="keiner"
      sources={["arbzg"]}
      intro={
        <p>
          Kommen, Gehen und Pausen eintragen – der Rechner zeigt die
          Arbeitszeit, die Abweichung von der Sollzeit und die Dezimalstunden
          für die Zeiterfassung. Zusätzlich prüft er, ob die Pause den
          gesetzlichen Mindestvorgaben entspricht.
        </p>
      }
      calculator={<WorkTimeCalculator />}
      formula={
        <>
          <div className="mt-2 space-y-2 rounded-lg border border-border bg-surface-muted/60 p-4 font-mono text-sm text-text">
            <p>Anwesenheit = Gehen − Kommen</p>
            <p>Arbeitszeit = Anwesenheit − Pausen</p>
            <p>Dezimalstunden = Arbeitszeit in Minuten ÷ 60</p>
            <p>Saldo = Arbeitszeit − Sollarbeitszeit</p>
          </div>
          <p>
            Die <strong>Dezimalstunden</strong> sind der Punkt, an dem sich am
            häufigsten verrechnet wird: 8 Stunden und 30 Minuten sind{" "}
            <strong>8,5</strong> und nicht 8,30. Der Grund ist banal – eine
            Stunde hat 60 Minuten, nicht 100. 42 Minuten sind 0,7 Stunden,
            15 Minuten sind 0,25.
          </p>
          <p>
            Für die <strong>Pausenprüfung</strong> gilt § 4 des deutschen
            Arbeitszeitgesetzes, bezogen auf die reine Arbeitszeit ohne Pausen:
          </p>
          <div className="mt-4 space-y-2 rounded-lg border border-border bg-surface-muted/60 p-4 font-mono text-sm text-text">
            <p>mehr als 6 Stunden → mindestens 30 Minuten Pause</p>
            <p>mehr als 9 Stunden → mindestens 45 Minuten Pause</p>
            <p>aufgeteilte Pausen: jeder Teil mindestens 15 Minuten</p>
          </div>
          <p>
            Nach § 3 ArbZG beträgt die werktägliche Höchstarbeitszeit
            8 Stunden. Sie darf auf bis zu 10 Stunden verlängert werden, wenn im
            Ausgleichszeitraum im Schnitt 8 Stunden nicht überschritten werden.
          </p>
        </>
      }
      example={
        <>
          <p>
            <strong>Ein normaler Bürotag: 08:00 gekommen, 17:00 gegangen,
            30 Minuten Mittagspause.</strong>
          </p>
          <ol>
            <li>Anwesenheit: 17:00 − 08:00 = 9 Stunden</li>
            <li>
              Arbeitszeit: 9 h − 30 min = <strong>8 h 30 min</strong>
            </li>
            <li>Dezimal: 510 ÷ 60 = <strong>8,5 Stunden</strong></li>
            <li>
              Bei 8 Stunden Sollzeit: <strong>+30 Minuten</strong> Überstunden
            </li>
          </ol>
          <p>
            Die Pause reicht: Bei 8,5 Stunden Arbeitszeit sind 30 Minuten
            vorgeschrieben, und genau die wurden genommen. Die Sollzeit von
            8 Stunden war um 16:30 erreicht.
          </p>
          <p>
            <strong>Ein langer Tag: 07:30 bis 18:15 mit 30 Minuten Pause.</strong>{" "}
            Anwesenheit 10 h 45 min, Arbeitszeit 10 h 15 min. Hier greifen
            zwei Hinweise: Ab mehr als 9 Stunden sind 45 Minuten Pause
            vorgeschrieben, es fehlen also 15 Minuten. Und die Arbeitszeit
            überschreitet die Grenze von 10 Stunden.
          </p>
          <p>
            <strong>Nachtschicht: 22:00 bis 06:00 mit 45 Minuten Pause.</strong>{" "}
            Weil das Gehen vor dem Kommen liegt, rechnet der Rechner über
            Mitternacht: 8 Stunden Anwesenheit, 7 h 15 min Arbeitszeit.
          </p>
        </>
      }
      interpretation={
        <>
          <p>
            <strong>Anwesenheit ist nicht Arbeitszeit.</strong> Pausen zählen
            nicht mit – das ist keine Spitzfindigkeit, sondern der Kern der
            gesetzlichen Regelung. Wer neun Stunden im Büro war, hat bei einer
            halben Stunde Pause achteinhalb Stunden gearbeitet.
          </p>
          <p>
            <strong>Der Saldo</strong> zeigt die Abweichung von der Sollzeit
            dieses einen Tages. Ob daraus ein Gleitzeitguthaben wird, ob es
            verfällt und wann es ausgeglichen werden muss, regeln
            Arbeitsvertrag, Betriebsvereinbarung oder Tarifvertrag.
          </p>
          <p>
            <strong>Die Hinweise zum Arbeitszeitgesetz</strong> sind eine
            Erinnerung an die Grundregel, keine rechtliche Bewertung. Die
            Pausenpflicht trifft den Arbeitgeber, der die Einhaltung
            sicherstellen muss; für Jugendliche, Schichtbetriebe, Krankenhäuser
            und einige weitere Bereiche gelten eigene Vorschriften. Die
            Aufzeichnung der Arbeitszeit ist ausserdem seit dem Urteil des
            Bundesarbeitsgerichts vom 13. September 2022 (1 ABR 22/21) in
            Deutschland verpflichtend.
          </p>
        </>
      }
      limits={
        <>
          <ul>
            <li>
              <strong>Nur deutsche Grundregeln.</strong> Der Rechner prüft
              gegen § 3 und § 4 des Arbeitszeitgesetzes. In der Schweiz gilt das
              Arbeitsgesetz mit anderen Werten, in Österreich das
              Arbeitszeitgesetz mit eigenen Regelungen. Tarifverträge und
              Betriebsvereinbarungen können abweichen.
            </li>
            <li>
              <strong>Ein Tag, nicht eine Woche.</strong> Der Rechner betrachtet
              einen einzelnen Arbeitstag. Wochen- und Monatssalden,
              Ausgleichszeiträume und Ruhezeiten zwischen zwei Schichten – nach
              § 5 ArbZG in der Regel 11 Stunden – bildet er nicht ab.
            </li>
            <li>
              <strong>Keine Rechtsberatung.</strong> Ob eine konkrete
              Arbeitszeit zulässig ist, hängt von Ausnahmeregelungen, der
              Branche und der Person ab. Bei Zweifeln hilft der Betriebsrat,
              die Gewerkschaft oder eine Fachanwältin für Arbeitsrecht weiter.
            </li>
            <li>
              <strong>Minutengenau, aber nicht sekundengenau.</strong> Gerechnet
              wird in vollen Minuten.
            </li>
          </ul>
        </>
      }
      faq={[
        {
          question: "Wie rechne ich Stunden und Minuten in Dezimalstunden um?",
          answer:
            "Minuten durch 60 teilen und zu den Stunden addieren. 8 Stunden 30 Minuten sind 8 + 30/60 = 8,5. Häufige Werte: 15 Minuten = 0,25, 20 Minuten = 0,33, 45 Minuten = 0,75. Der Rechner gibt den Wert direkt mit aus.",
        },
        {
          question: "Ab wann muss ich Pause machen?",
          answer:
            "Nach § 4 Arbeitszeitgesetz bei mehr als 6 Stunden Arbeitszeit mindestens 30 Minuten, bei mehr als 9 Stunden mindestens 45 Minuten. Bei genau 6 Stunden ist noch keine Pause vorgeschrieben. Die Pause darf aufgeteilt werden, jeder Teil muss aber mindestens 15 Minuten dauern.",
        },
        {
          question: "Zählt die Pause zur Arbeitszeit?",
          answer:
            "Nein. Ruhepausen sind Unterbrechungen der Arbeitszeit und werden in aller Regel nicht bezahlt. Etwas anderes gilt für kurze Unterbrechungen, in denen man erreichbar bleiben muss – die zählen nicht als Ruhepause im Sinne des Gesetzes.",
        },
        {
          question: "Wie erfasse ich eine Nachtschicht über Mitternacht?",
          answer:
            "Ganz normal: 22:00 als Kommen, 06:00 als Gehen. Weil die zweite Zeit vor der ersten liegt, rechnet der Rechner automatisch über Mitternacht und weist darauf hin.",
        },
        {
          question: "Sind 10 Stunden Arbeitszeit erlaubt?",
          answer:
            "Bis zu 10 Stunden ja, aber nur, wenn innerhalb von sechs Kalendermonaten oder 24 Wochen im Durchschnitt 8 Stunden werktäglich nicht überschritten werden. Darüber hinaus ist die Arbeitszeit ohne behördliche Ausnahmebewilligung unzulässig.",
        },
      ]}
    />
  );
}
