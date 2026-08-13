import type { Metadata } from "next";
import { CalculatorPage } from "@/components/layout/CalculatorPage";
import { CompoundInterestCalculator } from "@/components/calculators/CompoundInterestCalculator";
import { pageMetadata } from "@/lib/seo";
import { getCalculator } from "@/config/calculators";

const meta = getCalculator("zinseszins")!;

export const metadata: Metadata = pageMetadata({
  title: meta.seo.title,
  description: meta.seo.description,
  path: meta.href,
});

export default function Page() {
  return (
    <CalculatorPage
      calculatorId="zinseszins"
      disclaimer="finanzen"
      intro={
        <p>
          Zinseszins bedeutet, dass auch bereits gutgeschriebene Zinsen wieder
          verzinst werden. In den ersten Jahren fällt das kaum auf, nach
          zwanzig Jahren macht es den grössten Teil des Ergebnisses aus. Dieser
          Rechner zeigt dir beides getrennt: was du eingezahlt hast und was die
          Zinsen daraus gemacht haben.
        </p>
      }
      calculator={<CompoundInterestCalculator />}
      formula={
        <>
          <p>Der Rechner kombiniert zwei Formeln.</p>
          <p>
            <strong>Einmalanlage</strong> – das Startkapital wächst mit jedem
            Jahr um den Zinsfaktor:
          </p>
          <div className="mt-3 rounded-lg border border-border bg-surface-muted/60 p-4 font-mono text-sm text-text">
            <p>Endkapital = Startkapital × (1 + p)ⁿ</p>
          </div>
          <p>
            <strong>Regelmässige Einzahlung</strong> – jede Rate verzinst sich
            unterschiedlich lange, je nachdem, wann sie eingezahlt wurde. Die
            Summe darüber ergibt die Rentenformel:
          </p>
          <div className="mt-3 rounded-lg border border-border bg-surface-muted/60 p-4 font-mono text-sm text-text">
            <p>Endkapital = Rate × ((1 + p)ⁿ − 1) ÷ p</p>
          </div>
          <p>
            Dabei ist <strong>p</strong> der Zinssatz je Periode und{" "}
            <strong>n</strong> die Anzahl der Perioden. Bei monatlicher
            Verzinsung wird der Jahreszins durch zwölf geteilt und die
            Periodenzahl mit zwölf multipliziert. Der Rechner geht von
            nachschüssigen Raten aus – die Einzahlung erfolgt also jeweils am
            Ende der Periode.
          </p>
        </>
      }
      example={
        <>
          <p>
            <strong>10.000 € Startkapital, 200 € monatlich, 5 Prozent Zins,
            20 Jahre, monatliche Verzinsung.</strong>
          </p>
          <ol>
            <li>Zins je Monat: 5 % ÷ 12 = 0,4167 %</li>
            <li>Perioden: 20 × 12 = 240</li>
            <li>Startkapital wächst auf: 10.000 × 1,0041667²⁴⁰ ≈ 27.126 €</li>
            <li>
              Sparplan ergibt: 200 × (1,0041667²⁴⁰ − 1) ÷ 0,0041667 ≈ 82.207 €
            </li>
            <li>
              Zusammen: <strong>rund 109.333 €</strong>
            </li>
          </ol>
          <p>
            Eingezahlt hast du in diesen 20 Jahren 10.000 € plus 48.000 €, also
            58.000 €. Der Rest – über 51.000 € – stammt aus Zinsen und
            Zinseszinsen. Bemerkenswert ist die Verteilung über die Zeit: In den
            ersten fünf Jahren kommen davon nur etwa 6.000 € zusammen, in den
            letzten fünf Jahren über 21.000 €.
          </p>
        </>
      }
      interpretation={
        <>
          <p>
            Die entscheidende Grösse beim Zinseszins ist nicht der Zinssatz,
            sondern die <strong>Zeit</strong>. Der Effekt wächst exponentiell,
            und exponentielles Wachstum entfaltet sich fast vollständig am Ende
            des Zeitraums. Wer zehn Jahre früher anfängt, kommt oft weiter als
            jemand, der doppelt so viel einzahlt, aber später beginnt.
          </p>
          <p>
            Eine praktische Faustregel für den Kopf ist die{" "}
            <strong>72er-Regel</strong>: Teile 72 durch den Zinssatz, und du
            erhältst ungefähr die Anzahl Jahre bis zur Verdopplung. Bei
            6 Prozent sind das 12 Jahre, bei 3 Prozent 24 Jahre. Das ist eine
            Näherung, aber für eine schnelle Einordnung genau genug.
          </p>
          <p>
            Der Rechner ist bewusst zinssatz-neutral. Welche Rendite realistisch
            ist, hängt von der Anlageform ab und lässt sich nicht vorhersagen –
            wir geben deshalb keinen Wert vor und behaupten keinen. Wer mehrere
            Szenarien vergleichen will, rechnet die Sache am besten mit einem
            vorsichtigen und einem optimistischen Wert durch.
          </p>
        </>
      }
      limits={
        <>
          <ul>
            <li>
              <strong>Ein konstanter Zinssatz ist eine Modellannahme.</strong>{" "}
              Weder Sparzinsen noch Wertpapierrenditen verlaufen gleichmässig.
              Bei Aktien und Fonds schwankt der Wert erheblich, auch über
              mehrere Jahre hinweg.
            </li>
            <li>
              <strong>Steuern fehlen.</strong> Kapitalerträge werden je nach
              Land unterschiedlich besteuert. In Deutschland fällt
              Abgeltungsteuer an, in der Schweiz gelten andere Regeln. Beides
              schmälert das Ergebnis, ist hier aber nicht eingerechnet.
            </li>
            <li>
              <strong>Kosten fehlen ebenfalls.</strong> Depotgebühren,
              Ausgabeaufschläge und laufende Fondskosten schmälern die Rendite.
              Ein Prozent jährliche Kosten kostet über zwanzig Jahre einen
              erheblichen Teil des Endkapitals.
            </li>
            <li>
              <strong>Inflation ist nicht berücksichtigt.</strong> Das
              Endkapital ist ein nominaler Betrag. Was er in heutiger Kaufkraft
              wert wäre, zeigt er nicht.
            </li>
            <li>
              <strong>Die Rate bleibt konstant.</strong> Erhöhungen der
              Sparrate oder Entnahmen zwischendurch bildet der Rechner nicht ab.
            </li>
          </ul>
        </>
      }
      faq={[
        {
          question: "Warum ist monatliche Verzinsung besser als jährliche?",
          answer:
            "Weil die Zinsen früher gutgeschrieben werden und dadurch selbst länger Zinsen erwirtschaften. Bei 6 Prozent auf 10.000 € über 10 Jahre ergibt jährliche Verzinsung rund 17.908 €, monatliche rund 18.194 € – etwa 286 € Unterschied. Je höher der Zinssatz, desto grösser der Effekt.",
        },
        {
          question: "Was bedeutet nachschüssig?",
          answer:
            "Dass die Einzahlung am Ende jeder Periode erfolgt und deshalb in dieser Periode noch keine Zinsen bringt. Bei vorschüssiger Zahlung – also am Anfang der Periode – fällt das Ergebnis etwas höher aus. Der Unterschied entspricht ungefähr einer zusätzlichen Periode Verzinsung auf die Rate.",
        },
        {
          question: "Kann ich damit einen ETF-Sparplan rechnen?",
          answer:
            "Für eine grobe Vorstellung ja, mit einer wichtigen Einschränkung: Ein ETF liefert keinen festen Zinssatz, sondern eine schwankende Rendite. Der Rechner zeigt, was bei einer durchschnittlichen Rendite herauskäme – nicht, wie der Verlauf tatsächlich aussieht. In der Realität gibt es Jahre mit deutlichen Verlusten.",
        },
        {
          question: "Was passiert bei einem negativen Zinssatz?",
          answer:
            "Der Rechner verarbeitet auch negative Werte. Das Kapital schrumpft dann rechnerisch – das ist kein Fehler, sondern genau der Effekt, den Verwahrentgelte auf Guthaben haben.",
        },
        {
          question: "Wie berücksichtige ich die Inflation?",
          answer:
            "Ein gängiger Weg ist, mit der realen statt der nominalen Rendite zu rechnen: Zinssatz minus Inflationsrate. Bei 5 Prozent Rendite und 2 Prozent Inflation gibst du also 3 Prozent ein. Das Ergebnis entspricht dann ungefähr der heutigen Kaufkraft.",
        },
      ]}
    />
  );
}
