import type { Metadata } from "next";
import { CalculatorPage } from "@/components/layout/CalculatorPage";
import { TipCalculator } from "@/components/calculators/TipCalculator";
import { pageMetadata } from "@/lib/seo";
import { getCalculator } from "@/config/calculators";

const meta = getCalculator("trinkgeld")!;

export const metadata: Metadata = pageMetadata({
  title: meta.seo.title,
  description: meta.seo.description,
  path: meta.href,
});

export default function Page() {
  return (
    <CalculatorPage
      calculatorId="trinkgeld"
      disclaimer="keiner"
      intro={
        <p>
          Wie viel Trinkgeld, wie viel insgesamt, und was zahlt jeder, wenn ihr
          teilt? Der Rechner beantwortet es in einem Schritt – auch für den
          Fall, dass ihr einfach auf einen runden Betrag aufrundet.
        </p>
      }
      calculator={<TipCalculator />}
      formula={
        <>
          <div className="mt-2 space-y-2 rounded-lg border border-border bg-surface-muted/60 p-4 font-mono text-sm text-text">
            <p>Trinkgeld  = Rechnung × Satz ÷ 100</p>
            <p>Gesamt     = Rechnung + Trinkgeld</p>
            <p>Pro Person = Gesamt ÷ Anzahl Personen</p>
          </div>
          <p>
            Interessanter ist die <strong>umgekehrte Richtung</strong>, die im
            Lokal tatsächlich verwendet wird: Man rundet auf einen glatten
            Betrag und will wissen, welchem Prozentsatz das entspricht.
          </p>
          <div className="mt-4 space-y-2 rounded-lg border border-border bg-surface-muted/60 p-4 font-mono text-sm text-text">
            <p>Satz = (gezahlt − Rechnung) ÷ Rechnung × 100</p>
          </div>
          <p>
            Wichtig ist der Bezugswert: Der Prozentsatz bezieht sich auf die
            Rechnung, nicht auf den bezahlten Gesamtbetrag. Sonst kommt eine zu
            kleine Zahl heraus.
          </p>
        </>
      }
      example={
        <>
          <p>
            <strong>Rechnung 47,30 €, 10 Prozent Trinkgeld.</strong>
          </p>
          <ol>
            <li>Trinkgeld: 47,30 × 0,10 = 4,73 €</li>
            <li>
              Gesamt: 47,30 + 4,73 = <strong>52,03 €</strong>
            </li>
          </ol>
          <p>
            <strong>Aufgerundet auf 53 €</strong> sind es 5,70 € Trinkgeld – das
            entspricht 12,05 Prozent. Wer „mach 53“ sagt, gibt also spürbar mehr
            als die gedachten zehn Prozent. Der Rechner weist auf diesen
            Unterschied hin.
          </p>
          <p>
            <strong>Zu viert geteilt:</strong> 52,03 ÷ 4 = 13,01 € pro Person,
            davon 1,18 € Trinkgeld. Bei einer Kartenzahlung je Person ist genau
            das die Zahl, die jeder angeben muss.
          </p>
        </>
      }
      interpretation={
        <>
          <p>
            <strong>Trinkgeld ist freiwillig.</strong> Es gibt in Deutschland,
            Österreich und der Schweiz keine Pflicht dazu und keinen
            vorgeschriebenen Satz. Verbreitet sind fünf bis zehn Prozent, in
            gehobenen Restaurants auch mehr – das ist eine Gewohnheit, keine
            Regel. Bei schlechter Bedienung ist weniger oder gar nichts
            ebenfalls in Ordnung.
          </p>
          <p>
            <strong>Im Ausland gelten andere Gepflogenheiten.</strong> In den
            USA sind 15 bis 20 Prozent üblich und faktisch Teil des Einkommens
            des Personals; in Japan kann Trinkgeld als unhöflich gelten. Der
            Rechner rechnet nur – was angemessen ist, hängt vom Ort ab.
          </p>
          <p>
            <strong>Aufrunden ist praktisch, aber nicht neutral.</strong> Je
            kleiner die Rechnung, desto stärker verändert das Aufrunden den
            Prozentsatz. Bei 12,20 € auf 14 € sind es fast 15 Prozent, bei
            112,20 € auf 114 € nur 1,6.
          </p>
        </>
      }
      limits={
        <>
          <ul>
            <li>
              <strong>Keine Empfehlung.</strong> Der Rechner sagt dir nicht, wie
              viel du geben solltest. Die Schnellauswahl zeigt gebräuchliche
              Sätze, mehr nicht.
            </li>
            <li>
              <strong>Rundung auf Cent.</strong> Beim Teilen durch mehrere
              Personen kann die Summe der gerundeten Einzelbeträge um wenige
              Cent vom Gesamtbetrag abweichen. In der Praxis übernimmt das
              jemand.
            </li>
            <li>
              <strong>Keine steuerliche Auskunft.</strong> Wie Trinkgeld beim
              Personal steuerlich zu behandeln ist, hängt davon ab, ob es dem
              Arbeitnehmer direkt oder dem Betrieb zufliesst. Das ist eine Frage
              an die Lohnbuchhaltung.
            </li>
            <li>
              <strong>Nur ein Rechnungsbetrag.</strong> Wer nach einzelnen
              Positionen aufteilen will, wer also nur sein eigenes Essen zahlt,
              rechnet das vorher zusammen.
            </li>
          </ul>
        </>
      }
      faq={[
        {
          question: "Wie viel Trinkgeld ist üblich?",
          answer:
            "Im deutschsprachigen Raum sind fünf bis zehn Prozent gebräuchlich, bei sehr gutem Service auch mehr. Verbindlich ist das nicht – Trinkgeld ist freiwillig und niemand ist dazu verpflichtet.",
        },
        {
          question: "Wie rechne ich 10 Prozent Trinkgeld im Kopf aus?",
          answer:
            "Komma um eine Stelle nach links: Von 47,30 € sind zehn Prozent 4,73 €. Für 15 Prozent nimmst du diesen Wert plus die Hälfte davon, für 20 Prozent das Doppelte.",
        },
        {
          question: "Wie viel Prozent sind es, wenn ich aufrunde?",
          answer:
            "Das hängt vom Rechnungsbetrag ab. Stell im Rechner „Aufrunden“ ein – dann siehst du den tatsächlichen Prozentsatz. Bei kleinen Rechnungen fällt er deutlich höher aus, als man denkt.",
        },
        {
          question: "Wird das Trinkgeld auf den Betrag mit oder ohne Mehrwertsteuer gerechnet?",
          answer:
            "Üblicherweise auf den Rechnungsbetrag, wie er auf dem Bon steht – also inklusive Mehrwertsteuer. Eine Vorschrift gibt es dazu nicht.",
        },
      ]}
    />
  );
}
