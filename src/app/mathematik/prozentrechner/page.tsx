import type { Metadata } from "next";
import { CalculatorPage } from "@/components/layout/CalculatorPage";
import { PercentCalculator } from "@/components/calculators/PercentCalculator";
import { pageMetadata } from "@/lib/seo";
import { getCalculator } from "@/config/calculators";

const meta = getCalculator("prozent")!;

export const metadata: Metadata = pageMetadata({
  title: meta.seo.title,
  description: meta.seo.description,
  path: meta.href,
});

export default function Page() {
  return (
    <CalculatorPage
      calculatorId="prozent"
      disclaimer="keiner"
      intro={
        <p>
          Prozentrechnung besteht aus drei Grössen, von denen immer zwei bekannt
          sind. Welche du suchst, entscheidest du oben im Rechner. Dazu kommt
          die prozentuale Veränderung – die Rechnung, bei der die meisten
          Fehler passieren.
        </p>
      }
      calculator={<PercentCalculator />}
      formula={
        <>
          <p>Alles baut auf einer einzigen Gleichung auf:</p>
          <div className="mt-4 rounded-lg border border-border bg-surface-muted/60 p-4 font-mono text-sm text-text">
            <p>Prozentwert = Grundwert × Prozentsatz ÷ 100</p>
          </div>
          <p>
            Die anderen Varianten sind Umstellungen davon. Der{" "}
            <strong>Grundwert</strong> ist immer das Ganze, also 100 Prozent.
            Der <strong>Prozentwert</strong> ist der Teil davon, der{" "}
            <strong>Prozentsatz</strong> die Angabe in Prozent.
          </p>
          <div className="mt-4 space-y-2 rounded-lg border border-border bg-surface-muted/60 p-4 font-mono text-sm text-text">
            <p>Prozentsatz = Prozentwert ÷ Grundwert × 100</p>
            <p>Grundwert = Prozentwert × 100 ÷ Prozentsatz</p>
            <p>Veränderung = (neu − alt) ÷ alt × 100</p>
          </div>
          <p>
            Bei der Veränderung wird durch den <em>alten</em> Wert geteilt, nicht
            durch den neuen. Genau hier entstehen die meisten Rechenfehler.
          </p>
        </>
      }
      example={
        <>
          <p>
            <strong>Ein Pullover kostet 80 €, im Schlussverkauf gibt es
            30 Prozent Rabatt.</strong>
          </p>
          <ol>
            <li>Rabatt in Euro: 80 × 30 ÷ 100 = 24 €</li>
            <li>Neuer Preis: 80 − 24 = <strong>56 €</strong></li>
          </ol>
          <p>
            <strong>Gegenprobe – wie viel Prozent sind 56 € von 80 €?</strong>{" "}
            56 ÷ 80 × 100 = 70 Prozent. Das passt: Nach 30 Prozent Rabatt zahlst
            du 70 Prozent des ursprünglichen Preises.
          </p>
          <p>
            <strong>Und der klassische Stolperstein:</strong> Ein Preis steigt
            von 80 € auf 100 €, das sind 25 Prozent Erhöhung (20 ÷ 80). Fällt er
            von 100 € zurück auf 80 €, sind das nur 20 Prozent Senkung
            (20 ÷ 100). Gleicher Betrag, unterschiedlicher Prozentsatz – weil
            sich der Bezugswert geändert hat.
          </p>
        </>
      }
      interpretation={
        <>
          <p>
            Die wichtigste Frage bei jeder Prozentangabe lautet:{" "}
            <strong>Prozent wovon?</strong> Ohne den Bezugswert ist eine
            Prozentzahl bedeutungslos. „20 Prozent mehr“ kann viel oder wenig
            sein, je nachdem, worauf es sich bezieht.
          </p>
          <p>
            Ein zweiter Punkt betrifft Prozentangaben, die sich gegenseitig
            aufheben sollen – das tun sie nämlich nicht. Ein Preis, der zuerst um
            50 Prozent steigt und dann um 50 Prozent fällt, liegt danach bei
            75 Prozent des Ausgangswerts, nicht bei 100. Der Grund ist derselbe
            wie oben: Beim zweiten Schritt ist der Bezugswert bereits ein anderer.
          </p>
          <p>
            Verwechsle ausserdem <strong>Prozent</strong> und{" "}
            <strong>Prozentpunkte</strong> nicht. Steigt ein Zinssatz von 2 auf
            3 Prozent, ist das ein Prozentpunkt mehr – aber eine Steigerung um
            50 Prozent. Beides ist richtig, beschreibt aber Unterschiedliches.
          </p>
        </>
      }
      limits={
        <>
          <ul>
            <li>
              <strong>Ein Grundwert von 0 funktioniert nicht.</strong> Von null
              aus lässt sich kein prozentualer Anteil und keine prozentuale
              Veränderung berechnen – dafür müsste durch null geteilt werden.
              Der Rechner meldet das ausdrücklich, statt eine falsche Zahl
              auszugeben.
            </li>
            <li>
              <strong>Bei negativen Ausgangswerten ist Vorsicht geboten.</strong>{" "}
              Die Rechnung funktioniert, die Aussage wird aber schnell
              missverständlich. Eine Veränderung von −100 auf −50 als
              „50 Prozent Verbesserung“ zu bezeichnen, ist rechnerisch korrekt,
              aber erklärungsbedürftig.
            </li>
            <li>
              <strong>Gerundet wird auf zwei Nachkommastellen.</strong> Bei
              mehreren aufeinander aufbauenden Rechnungen können sich
              Rundungsdifferenzen von wenigen Cent summieren.
            </li>
          </ul>
        </>
      }
      faq={[
        {
          question: "Wie ziehe ich einen Rabatt richtig ab?",
          answer:
            "Zwei Wege führen zum selben Ergebnis. Entweder du berechnest den Rabattbetrag (Preis × Rabatt ÷ 100) und ziehst ihn ab, oder du rechnest direkt mit dem verbleibenden Anteil: Bei 30 Prozent Rabatt zahlst du 70 Prozent, also Preis × 0,7. Der zweite Weg ist kürzer und weniger fehleranfällig.",
        },
        {
          question: "Was ist der Unterschied zwischen Prozent und Prozentpunkten?",
          answer:
            "Prozentpunkte sind die absolute Differenz zwischen zwei Prozentangaben, Prozent die relative. Von 4 auf 6 Prozent sind zwei Prozentpunkte – aber eine Steigerung um 50 Prozent. In Nachrichten über Zinsen oder Wahlergebnisse werden beide regelmässig verwechselt.",
        },
        {
          question: "Wie rechne ich von brutto auf netto zurück?",
          answer:
            "Nicht, indem du 19 Prozent abziehst – das ist der häufigste Fehler. Bei 119 € brutto teilst du durch 1,19 und erhältst 100 € netto. Würdest du stattdessen 19 Prozent von 119 abziehen, kämst du auf 96,39 € und läge falsch. Der Mehrwertsteuer-Rechner nimmt dir das ab.",
        },
        {
          question: "Warum ergeben 50 Prozent plus und 50 Prozent minus nicht wieder den Ausgangswert?",
          answer:
            "Weil sich der Bezugswert dazwischen ändert. 100 € plus 50 Prozent sind 150 €. Davon 50 Prozent abgezogen sind 75 € – die zweite Rechnung bezieht sich auf 150 €, nicht auf 100 €. Um wieder bei 100 € zu landen, müsstest du ein Drittel abziehen.",
        },
      ]}
    />
  );
}
