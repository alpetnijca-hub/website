import type { Metadata } from "next";
import { CalculatorPage } from "@/components/layout/CalculatorPage";
import { UnitConverter } from "@/components/calculators/UnitConverter";
import { pageMetadata } from "@/lib/seo";
import { getCalculator } from "@/config/calculators";

const meta = getCalculator("einheiten")!;

export const metadata: Metadata = pageMetadata({
  title: meta.seo.title,
  description: meta.seo.description,
  path: meta.href,
});

export default function Page() {
  return (
    <CalculatorPage
      calculatorId="einheiten"
      disclaimer="keiner"
      intro={
        <p>
          Zentimeter in Zoll, Kilogramm in Pfund, Celsius in Fahrenheit und
          zurück – dazu Fläche, Volumen und Geschwindigkeit. Gerechnet wird mit
          den exakten Definitionswerten, nicht mit gerundeten Faustformeln.
        </p>
      }
      calculator={<UnitConverter />}
      formula={
        <>
          <p>
            Innerhalb einer Kategorie ist jede Einheit über einen Faktor zu
            einer Basiseinheit festgelegt. Die Umrechnung ist dann eine einzige
            Multiplikation:
          </p>
          <div className="mt-4 space-y-2 rounded-lg border border-border bg-surface-muted/60 p-4 font-mono text-sm text-text">
            <p>Ergebnis = Wert × Faktor(von) ÷ Faktor(nach)</p>
          </div>
          <p>
            Die Faktoren sind keine Näherungen, sondern Festlegungen: Ein Zoll
            ist seit 1959 international auf <strong>genau 25,4 Millimeter</strong>{" "}
            definiert, ein Pfund auf genau 0,45359237 Kilogramm und eine Meile
            auf genau 1609,344 Meter.
          </p>
          <p>
            Die <strong>Temperatur ist der Sonderfall</strong>. Ihre Skalen
            haben verschiedene Nullpunkte – 0 °C ist nicht 0 °F. Ein Faktor
            genügt deshalb nicht, es braucht Umrechnungsformeln:
          </p>
          <div className="mt-4 space-y-2 rounded-lg border border-border bg-surface-muted/60 p-4 font-mono text-sm text-text">
            <p>°F = °C × 9 ÷ 5 + 32</p>
            <p>°C = (°F − 32) × 5 ÷ 9</p>
            <p>K = °C + 273,15</p>
          </div>
        </>
      }
      example={
        <>
          <p>
            <strong>180 Zentimeter in Fuss und Zoll.</strong> 180 ÷ 2,54 =
            70,87 Zoll. Das sind 5 Fuss (60 Zoll) und 10,87 Zoll – auf
            Englisch also etwa „5 foot 11“.
          </p>
          <p>
            <strong>75 Kilogramm in Pfund.</strong> 75 ÷ 0,45359237 =
            165,35 lb. Die verbreitete Faustregel „mal zwei“ ergäbe 150 und läge
            damit um mehr als 15 Pfund daneben.
          </p>
          <p>
            <strong>Ein Backrezept mit 350 °F.</strong> (350 − 32) × 5 ÷ 9 =
            176,7 °C – im Ofen also 175 °C. Wer stattdessen mit einem Faktor
            rechnet, landet bei völlig anderen Werten.
          </p>
          <p>
            <strong>Eine Kuriosität:</strong> Bei −40 zeigen Celsius und
            Fahrenheit denselben Wert. Es ist der einzige Punkt, an dem sich die
            beiden Skalen kreuzen.
          </p>
        </>
      }
      interpretation={
        <>
          <p>
            <strong>Faustformeln sind bequem und ungenau.</strong> „Mal zwei“
            für Kilogramm in Pfund liegt um zehn Prozent daneben, „geteilt durch
            zwei“ für Meilen in Kilometer um zwanzig. Für eine Schätzung im Kopf
            reicht das, für ein Rezept, eine Bestellung oder eine technische
            Angabe nicht.
          </p>
          <p>
            <strong>Achte auf die Herkunft der Einheit.</strong> Eine
            amerikanische Gallone hat 3,785 Liter, eine britische 4,546 – ein
            Unterschied von zwanzig Prozent bei gleichem Namen. Dasselbe gilt
            für Pints. Der Rechner führt beide getrennt auf.
          </p>
          <p>
            <strong>Kelvin kennt keine negativen Werte.</strong> Der absolute
            Nullpunkt liegt bei −273,15 °C, tiefer geht es physikalisch nicht.
            Wer eine tiefere Temperatur eingibt, bekommt deshalb kein Ergebnis,
            sondern einen Hinweis.
          </p>
        </>
      }
      limits={
        <>
          <ul>
            <li>
              <strong>Rundung.</strong> Ergebnisse werden auf eine sinnvolle
              Stellenzahl gerundet – bei sehr kleinen Werten auf mehr Stellen,
              damit nicht schlicht 0 dasteht. Für wissenschaftliche Zwecke ist
              das nicht präzise genug.
            </li>
            <li>
              <strong>Keine Umrechnung zwischen Kategorien.</strong> Liter in
              Kilogramm geht nicht ohne die Dichte des Stoffes: Ein Liter Wasser
              wiegt ein Kilogramm, ein Liter Öl etwa 0,9 und ein Liter Honig
              rund 1,4.
            </li>
            <li>
              <strong>Keine Kochmasse.</strong> Tassen, Esslöffel und ähnliche
              Angaben sind nicht einheitlich festgelegt und je nach Land und
              Zutat verschieden. Sie fehlen deshalb bewusst.
            </li>
          </ul>
        </>
      }
      faq={[
        {
          question: "Wie viele Zentimeter sind ein Zoll?",
          answer:
            "Genau 2,54 Zentimeter. Das ist keine gerundete Näherung, sondern seit dem internationalen Yard-und-Pfund-Abkommen von 1959 die Definition des Zolls.",
        },
        {
          question: "Wie rechne ich Kilogramm in Pfund um?",
          answer:
            "Kilogramm durch 0,45359237 teilen, oder mit 2,2046 multiplizieren. Vorsicht bei „Pfund“: Im deutschen Sprachraum ist damit im Alltag oft 500 Gramm gemeint, das englische pound sind aber 453,6 Gramm.",
        },
        {
          question: "Wie rechnet man Fahrenheit in Celsius um?",
          answer:
            "32 abziehen, dann mit 5 multiplizieren und durch 9 teilen. Aus 100 °F werden so 37,8 °C. Eine Multiplikation mit einem Faktor allein funktioniert nicht, weil beide Skalen verschiedene Nullpunkte haben.",
        },
        {
          question: "Warum ist eine amerikanische Gallone kleiner als eine britische?",
          answer:
            "Weil es historisch zwei verschiedene Masse sind, die denselben Namen tragen. Die US-Gallone hat 3,785 Liter, die britische 4,546. Bei Verbrauchsangaben von Autos macht das einen erheblichen Unterschied.",
        },
      ]}
    />
  );
}
