import type { Metadata } from "next";
import { CalculatorPage } from "@/components/layout/CalculatorPage";
import { FuelCostCalculator } from "@/components/calculators/FuelCostCalculator";
import { pageMetadata } from "@/lib/seo";
import { getCalculator } from "@/config/calculators";

const meta = getCalculator("spritkosten")!;

export const metadata: Metadata = pageMetadata({
  title: meta.seo.title,
  description: meta.seo.description,
  path: meta.href,
});

export default function Page() {
  return (
    <CalculatorPage
      calculatorId="spritkosten"
      disclaimer="keiner"
      intro={
        <p>
          Was kostet die Fahrt in den Urlaub, und was zahlt jeder in der
          Fahrgemeinschaft? Der Rechner arbeitet mit Verbrenner und Elektroauto
          gleichermassen – die Rechnung ist dieselbe, nur mit Kilowattstunden
          statt Litern.
        </p>
      }
      calculator={<FuelCostCalculator />}
      formula={
        <>
          <p>
            Die Verbrauchsangabe bezieht sich auf 100 Kilometer, deshalb wird
            zuerst auf die tatsächliche Strecke umgerechnet:
          </p>
          <div className="mt-4 space-y-2 rounded-lg border border-border bg-surface-muted/60 p-4 font-mono text-sm text-text">
            <p>Menge = Strecke × Verbrauch je 100 km ÷ 100</p>
            <p>Kosten = Menge × Preis je Einheit</p>
            <p>Je Person = Kosten ÷ Anzahl Personen</p>
          </div>
          <p>
            Beim Elektroauto ändert sich nur die Einheit: Statt Litern rechnest
            du mit Kilowattstunden, statt dem Literpreis mit dem Preis je
            Kilowattstunde. Der Rechner stellt die Felder automatisch um und
            setzt passende Ausgangswerte.
          </p>
        </>
      }
      example={
        <>
          <p>
            <strong>Fahrt von Hamburg nach München, rund 800 km, mit einem
            Auto, das 7,5 Liter auf 100 km braucht, bei 1,75 € je Liter, zu
            viert im Wagen.</strong>
          </p>
          <ol>
            <li>Menge: 800 × 7,5 ÷ 100 = 60 Liter</li>
            <li>
              Kosten: 60 × 1,75 = <strong>105 €</strong>
            </li>
            <li>
              Je Person: 105 ÷ 4 = <strong>26,25 €</strong>
            </li>
            <li>Hin und zurück: 210 €, also 52,50 € pro Person</li>
          </ol>
          <p>
            <strong>Dieselbe Strecke elektrisch</strong> bei 18 kWh je 100 km
            und 40 Cent je Kilowattstunde: 800 × 18 ÷ 100 = 144 kWh, mal 0,40 €
            ergibt 57,60 €. An einer teuren Schnellladesäule für 79 Cent wären es
            dagegen 113,76 € – ein Unterschied, der zeigt, wie stark der
            Ladepreis das Ergebnis bestimmt.
          </p>
        </>
      }
      interpretation={
        <>
          <p>
            Der Wert, den du bekommst, sind die <strong>reinen
            Energiekosten</strong>. Das ist genau die Zahl, die du brauchst, wenn
            du in einer Fahrgemeinschaft abrechnest oder zwei Routen vergleichst.
          </p>
          <p>
            Für die Frage „was kostet mich mein Auto wirklich“ reicht sie nicht.
            Dazu kämen Wertverlust, Versicherung, Kfz-Steuer, Wartung, Reifen und
            Reparaturen. Bei einem Mittelklassewagen liegen die tatsächlichen
            Vollkosten je Kilometer erfahrungsgemäss um ein Mehrfaches über den
            reinen Spritkosten – der Wertverlust ist dabei meist der grösste
            Einzelposten.
          </p>
          <p>
            Für den Verbrauchswert nimm nicht die Herstellerangabe, sondern
            deinen eigenen Bordcomputer-Durchschnitt über mehrere Tankfüllungen.
            Herstellerangaben werden unter Laborbedingungen ermittelt und liegen
            im Alltag regelmässig darunter. Wer es genau will, rechnet über die
            Tankquittungen: getankte Liter geteilt durch gefahrene Kilometer,
            mal 100.
          </p>
        </>
      }
      limits={
        <>
          <ul>
            <li>
              <strong>Ein konstanter Verbrauch ist eine Vereinfachung.</strong>{" "}
              Auf der Autobahn bei 130 km/h liegt der Verbrauch deutlich höher
              als auf der Landstrasse. Kurzstrecken im Winter sind besonders
              ungünstig, weil der kalte Motor mehr braucht.
            </li>
            <li>
              <strong>Beim Elektroauto schwankt der Preis stark.</strong>{" "}
              Haushaltsstrom, Wallbox mit günstigem Autostromtarif und
              Schnellladesäule an der Autobahn unterscheiden sich um ein
              Vielfaches. Auch Ladeverluste von etwa 10 bis 20 Prozent sind im
              Bordcomputer-Verbrauch oft nicht enthalten.
            </li>
            <li>
              <strong>Zuladung und Bedingungen fehlen.</strong> Dachbox,
              Anhänger, volle Beladung, Gegenwind und Bergstrecken erhöhen den
              Verbrauch merklich.
            </li>
            <li>
              <strong>Keine Maut, keine Fähren.</strong> Streckenabhängige
              Zusatzkosten sind nicht enthalten.
            </li>
          </ul>
        </>
      }
      faq={[
        {
          question: "Woher weiss ich meinen tatsächlichen Verbrauch?",
          answer:
            "Am zuverlässigsten über die Tankquittungen: Tanke voll, setze den Tageskilometerzähler zurück, tanke beim nächsten Mal wieder voll. Die getankten Liter geteilt durch die gefahrenen Kilometer mal 100 ergibt den Verbrauch je 100 km. Bordcomputer weichen davon oft um einige Zehntel ab.",
        },
        {
          question: "Was ist ein fairer Betrag in einer Fahrgemeinschaft?",
          answer:
            "Die reinen Spritkosten geteilt durch die Anzahl Personen sind die übliche Untergrenze. Wer den Wagen stellt, trägt zusätzlich Verschleiss und Wertverlust – ein Aufschlag ist deshalb nicht unüblich. Wichtig ist vor allem, den Modus vorher zu klären.",
        },
        {
          question: "Rechnet der Rechner auch für Motorräder oder Wohnmobile?",
          answer:
            "Ja, die Formel ist unabhängig vom Fahrzeugtyp. Trage einfach den entsprechenden Verbrauch ein – bei einem Wohnmobil also etwa 10 bis 12 Liter, bei einem Motorrad je nach Maschine 4 bis 7 Liter.",
        },
        {
          question: "Warum weicht mein Ergebnis von der ADAC-Rechnung ab?",
          answer:
            "Vollkostenrechnungen wie die des ADAC enthalten Wertverlust, Versicherung, Steuer, Wartung und Reifen. Dieser Rechner zeigt bewusst nur die Energiekosten – die Zahl, die für Fahrgemeinschaften und Streckenvergleiche gebraucht wird.",
        },
      ]}
    />
  );
}
