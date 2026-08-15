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
          Zentimeter in Zoll, Kilokalorien in Kilojoule, PS in Kilowatt,
          Celsius in Fahrenheit – dazu Fläche, Volumen, Geschwindigkeit und
          Druck. Gerechnet wird mit den exakten Definitionswerten, nicht mit
          gerundeten Faustformeln.
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
            Dasselbe gilt bei den physikalischen Einheiten: Eine Kilokalorie
            sind <strong>exakt 4,184 Kilojoule</strong>, eine metrische
            Pferdestärke exakt 735,49875 Watt, ein Bar exakt 100.000 Pascal.
            Das sind Festlegungen, keine Messwerte – deshalb stimmen die
            Ergebnisse auf beliebig viele Stellen.
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
            <strong>2.000 Kilokalorien auf der Packung.</strong> 2.000 × 4,184 =
            8.368 kJ. Deshalb stehen auf Lebensmitteln immer beide Werte, und
            deshalb ist die kJ-Zahl rund viermal so gross – es ist dieselbe
            Energie in einer anderen Einheit.
          </p>
          <p>
            <strong>Ein Auto mit 100 PS</strong> hat 73,5 kW. Die verbreitete
            Faustregel „mal 0,75“ trifft es ziemlich genau: Eine metrische
            Pferdestärke ist als 735,49875 Watt definiert.
          </p>
          <p>
            <strong>Reifendruck 2,5 bar</strong> sind 36,3 psi. An
            amerikanischen Luftpumpen und bei importierten Fahrzeugen steht die
            zweite Zahl – ein Grund, warum viele Reifen falsch aufgepumpt sind.
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
            <strong>Kalorie ist nicht gleich Kalorie.</strong> Was auf
            Lebensmitteln als „Kalorien“ steht, sind in Wirklichkeit
            Kilokalorien – also Tausend Kalorien. Eine Tafel Schokolade hat
            keine 500 Kalorien, sondern 500 Kilokalorien oder 500.000 Kalorien.
            Der Rechner führt beide Einheiten getrennt auf, damit dieser
            Faktor 1.000 nicht untergeht.
          </p>
          <p>
            <strong>PS ist nicht gleich horsepower.</strong> Die metrische
            Pferdestärke und das britisch-amerikanische horsepower sind zwei
            verschiedene Einheiten mit fast gleichem Namen: 735,5 gegenüber
            745,7 Watt. Bei einem Sportwagen macht das gut zehn PS Unterschied –
            weshalb dieselbe Maschine in amerikanischen Prospekten mit einer
            anderen Zahl beworben wird.
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
          question: "Wie rechnet man kcal in kJ um?",
          answer:
            "Mit 4,184 multiplizieren: 100 kcal sind 418,4 kJ. Für den umgekehrten Weg durch 4,184 teilen. Diese Zahl ist die Definition der thermochemischen Kalorie und genau die, die den Angaben auf Lebensmittelverpackungen zugrunde liegt.",
        },
        {
          question: "Wie viel kW sind 100 PS?",
          answer:
            "73,5 kW. Eine metrische Pferdestärke ist als 735,49875 Watt festgelegt. Umgekehrt entspricht 1 kW rund 1,36 PS. Achtung: Das britisch-amerikanische horsepower ist mit 745,7 Watt etwas grösser.",
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
