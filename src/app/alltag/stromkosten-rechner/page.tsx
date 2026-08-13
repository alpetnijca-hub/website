import type { Metadata } from "next";
import { CalculatorPage } from "@/components/layout/CalculatorPage";
import { ElectricityCalculator } from "@/components/calculators/ElectricityCalculator";
import { pageMetadata } from "@/lib/seo";
import { getCalculator } from "@/config/calculators";

const meta = getCalculator("stromkosten")!;

export const metadata: Metadata = pageMetadata({
  title: meta.seo.title,
  description: meta.seo.description,
  path: meta.href,
});

export default function Page() {
  return (
    <CalculatorPage
      calculatorId="stromkosten"
      disclaimer="keiner"
      intro={
        <p>
          Auf jedem Gerät steht eine Wattzahl, auf der Stromrechnung ein Preis
          je Kilowattstunde. Dazwischen fehlt die Umrechnung – die macht dieser
          Rechner. Du siehst, was ein Gerät pro Nutzung, pro Tag und pro Jahr
          kostet.
        </p>
      }
      calculator={<ElectricityCalculator />}
      formula={
        <>
          <p>
            Watt ist eine Leistung, Kilowattstunden sind eine Energiemenge. Der
            Unterschied ist die Zeit:
          </p>
          <div className="mt-4 space-y-2 rounded-lg border border-border bg-surface-muted/60 p-4 font-mono text-sm text-text">
            <p>Verbrauch in kWh = Watt × Stunden ÷ 1.000</p>
            <p>Kosten = Verbrauch in kWh × Preis je kWh</p>
          </div>
          <p>
            Die Division durch 1.000 rechnet Watt in Kilowatt um. Ein Gerät mit
            2.000 Watt, das eine Stunde läuft, verbraucht also 2 Kilowattstunden.
            Läuft es nur sechs Minuten, sind es 0,2 kWh.
          </p>
          <p>
            Für die Hochrechnung verwenden wir 30,42 Tage je Monat (365 ÷ 12)
            und 365 Tage je Jahr. Der Strompreis wird in Cent eingegeben, weil er
            auf der Rechnung so ausgewiesen wird.
          </p>
        </>
      }
      example={
        <>
          <p>
            <strong>Ein Wasserkocher mit 2.000 Watt läuft viermal am Tag für
            jeweils 6 Minuten. Der Strompreis beträgt 35 Cent je
            Kilowattstunde.</strong>
          </p>
          <ol>
            <li>6 Minuten sind 0,1 Stunden</li>
            <li>Je Nutzung: 2.000 × 0,1 ÷ 1.000 = 0,2 kWh</li>
            <li>
              Kosten je Nutzung: 0,2 × 0,35 € = <strong>7 Cent</strong>
            </li>
            <li>Pro Tag: 0,8 kWh, also 28 Cent</li>
            <li>
              Pro Jahr: 292 kWh, also <strong>rund 102 €</strong>
            </li>
          </ol>
          <p>
            Zum Vergleich derselbe Strompreis bei einem alten Kühlschrank mit
            durchschnittlich 60 Watt Dauerlast: 60 × 24 ÷ 1.000 = 1,44 kWh am
            Tag, rund 526 kWh im Jahr, also etwa 184 €. Ein Gerät mit kleiner
            Wattzahl, das ständig läuft, kann teurer sein als ein starkes Gerät,
            das nur kurz an ist.
          </p>
        </>
      }
      interpretation={
        <>
          <p>
            Die entscheidende Grösse ist nicht die Wattzahl allein, sondern{" "}
            <strong>Wattzahl mal Laufzeit</strong>. Genau deshalb überraschen die
            Ergebnisse manchmal: Der Heizlüfter mit 2.000 Watt kostet nur dann
            viel, wenn er lange läuft, während die alte Kühltruhe im Keller mit
            80 Watt rund um die Uhr Geld verbraucht.
          </p>
          <p>
            Rechne die grössten Posten deines Haushalts einzeln durch und
            vergleiche die Jahreswerte. In der Regel stehen wenige Geräte für den
            grössten Teil der Rechnung – meist Heizen und Warmwasser, wenn sie
            elektrisch erfolgen, dann Kühlgeräte, Wäschetrockner und
            Unterhaltungselektronik im Dauerbetrieb.
          </p>
          <p>
            Ein oft übersehener Posten ist der <strong>Standby-Verbrauch</strong>.
            Ein Gerät, das mit 2 Watt dauerhaft im Bereitschaftsmodus hängt,
            kommt auf rund 17,5 kWh im Jahr – bei 35 Cent also gut 6 €. Bei zehn
            solchen Geräten summiert sich das auf über 60 € jährlich, ohne dass
            man sie überhaupt benutzt.
          </p>
        </>
      }
      limits={
        <>
          <ul>
            <li>
              <strong>Die Wattzahl auf dem Typenschild ist die
              Maximalleistung.</strong> Kaum ein Gerät läuft dauerhaft auf
              Volllast. Ein Kühlschrank schaltet den Kompressor nur zeitweise
              ein, eine Waschmaschine zieht die volle Leistung fast nur beim
              Aufheizen des Wassers.
            </li>
            <li>
              <strong>Der Rechner geht von gleichmässigem Betrieb aus.</strong>{" "}
              Geräte mit stark schwankender Last – Wärmepumpen, Klimaanlagen,
              Elektroherde – lassen sich damit nur grob abschätzen.
            </li>
            <li>
              <strong>Der Grundpreis fehlt.</strong> Auf der Stromrechnung steht
              neben dem Arbeitspreis je Kilowattstunde ein monatlicher
              Grundpreis. Der fällt unabhängig vom Verbrauch an und ist hier
              nicht enthalten.
            </li>
            <li>
              <strong>Genaue Werte liefert nur eine Messung.</strong> Ein
              Energiekostenmessgerät für die Steckdose kostet wenig und zeigt den
              tatsächlichen Verbrauch über Tage hinweg.
            </li>
          </ul>
        </>
      }
      faq={[
        {
          question: "Wo finde ich die Wattzahl meines Geräts?",
          answer:
            "Auf dem Typenschild – meist auf der Rückseite oder Unterseite, bei Haushaltsgeräten oft innen an der Tür. Steht dort nur eine Ampere-Angabe, multiplizierst du sie mit der Netzspannung von 230 Volt: 2 Ampere entsprechen also rund 460 Watt.",
        },
        {
          question: "Was kostet eine Kilowattstunde?",
          answer:
            "Das steht auf deiner Stromrechnung als „Arbeitspreis“ und unterscheidet sich je nach Anbieter, Tarif und Land erheblich. Wir geben bewusst keinen Wert vor, weil sich Strompreise laufend ändern – nimm den Wert von deiner eigenen Abrechnung.",
        },
        {
          question: "Wie rechne ich eine Nutzung alle paar Tage ein?",
          answer:
            "Über den Wert bei „Nutzungen pro Tag“. Zweimal pro Woche entspricht 2 ÷ 7 = etwa 0,3. Einmal pro Woche wären 0,14, einmal im Monat rund 0,03. Alternativ kannst du die Laufzeit je Nutzung entsprechend anpassen.",
        },
        {
          question: "Lohnt es sich, ein altes Gerät zu ersetzen?",
          answer:
            "Rechne beide Geräte einzeln durch und vergleiche die Jahreskosten. Die Ersparnis pro Jahr, gegen den Anschaffungspreis gerechnet, ergibt die Amortisationszeit. Bei alten Kühl- und Gefriergeräten, die rund um die Uhr laufen, rechnet sich ein Austausch oft schon nach wenigen Jahren.",
        },
      ]}
    />
  );
}
