import type { Metadata } from "next";
import Link from "next/link";
import { CalculatorPage } from "@/components/layout/CalculatorPage";
import { ProteinCalculator } from "@/components/calculators/ProteinCalculator";
import { pageMetadata } from "@/lib/seo";
import { getCalculator } from "@/config/calculators";

const meta = getCalculator("protein")!;

export const metadata: Metadata = pageMetadata({
  title: meta.seo.title,
  description: meta.seo.description,
  path: meta.href,
});

export default function Page() {
  return (
    <CalculatorPage
      calculatorId="protein"
      intro={
        <p>
          Wie viel Eiweiss du brauchst, hängt weniger von deinem Alter ab als
          davon, wie viel du dich bewegst und was du erreichen willst. Dieser
          Rechner gibt bewusst eine Spanne aus – denn genau so steht es auch in
          den Fachempfehlungen.
        </p>
      }
      calculator={<ProteinCalculator />}
      formula={
        <>
          <p>
            Der Bedarf wird nicht als fester Wert, sondern in Gramm je Kilogramm
            Körpergewicht angegeben und dann mit deinem Gewicht multipliziert.
          </p>
          <div className="mt-4 rounded-lg border border-border bg-surface-muted/60 p-4 font-mono text-sm text-text">
            <p>Protein pro Tag = Körpergewicht in kg × g/kg-Faktor</p>
          </div>
          <p>Die verwendeten Faktoren:</p>
          <ul>
            <li>
              <strong>0,8 bis 1,0 g/kg</strong> bei überwiegend sitzendem Alltag.
              Der Wert 0,8 g/kg ist der Referenzwert der Deutschen Gesellschaft
              für Ernährung für gesunde Erwachsene ab 19 Jahren.
            </li>
            <li>
              <strong>1,2 bis 1,6 g/kg</strong> bei ein bis drei
              Trainingseinheiten pro Woche.
            </li>
            <li>
              <strong>1,4 bis 1,8 g/kg</strong> bei regelmässigem
              Ausdauertraining.
            </li>
            <li>
              <strong>1,6 bis 2,2 g/kg</strong> bei regelmässigem Krafttraining.
              Diese Spanne entspricht der Positionsschrift der International
              Society of Sports Nutrition.
            </li>
          </ul>
          <p>
            Für das Ziel „Abnehmen“ addieren wir 0,2 g/kg, für „Zunehmen“
            0,1 g/kg. Ein Gramm Eiweiss liefert rund 4 kcal.
          </p>
        </>
      }
      example={
        <>
          <p>
            Eine Person wiegt 75 kg, trainiert dreimal pro Woche mit Gewichten
            und möchte dabei abnehmen.
          </p>
          <ol>
            <li>Basis Krafttraining: 1,6 bis 2,2 g/kg</li>
            <li>Zuschlag für die Diätphase: +0,2 → 1,8 bis 2,4 g/kg</li>
            <li>
              Untere Grenze: 75 × 1,8 = <strong>135 g</strong>
            </li>
            <li>
              Obere Grenze: 75 × 2,4 = <strong>180 g</strong>
            </li>
            <li>Energieanteil: 135 × 4 = 540 kcal bis 180 × 4 = 720 kcal</li>
          </ol>
          <p>
            Bei einem Kalorienziel von 1.900 kcal entspricht das rund 28 bis 38
            Prozent der Gesamtenergie – ein für eine Diätphase typischer Wert.
          </p>
        </>
      }
      interpretation={
        <>
          <p>
            Eiweiss hat in einer Diät zwei Aufgaben, die kein anderer Nährstoff
            so übernimmt: Es liefert den Baustoff, um Muskulatur zu erhalten,
            und es sättigt bei gleicher Kalorienmenge am stärksten. Wer im
            Defizit zu wenig Eiweiss isst, verliert überproportional viel
            Muskelmasse.
          </p>
          <p>
            Der untere Rand der Spanne ist keine Notlösung. Studien zeigen, dass
            der Nutzen oberhalb von etwa 1,6 g/kg bei Kraftsportlern deutlich
            abflacht. Mehr als 2,2 bis 2,4 g/kg bringt nach heutigem Stand keinen
            zusätzlichen Vorteil – der Überschuss wird schlicht zur
            Energiegewinnung verwendet.
          </p>
          <p>
            Praktisch hilfreich ist die Verteilung über den Tag: drei bis vier
            Mahlzeiten mit jeweils 25 bis 40 g Eiweiss sind leichter zu erreichen
            als eine grosse Portion am Abend. Wie sich die Eiweissmenge in dein
            Kalorienziel einfügt, zeigt der{" "}
            <Link href="/gesundheit/makronaehrstoff-rechner">
              Makronährstoff-Rechner
            </Link>
            .
          </p>
        </>
      }
      limits={
        <>
          <ul>
            <li>
              <strong>Gerechnet wird mit dem Gesamtgewicht.</strong> Fachlich
              genauer wäre die fettfreie Masse – die kennen die wenigsten. Bei
              deutlichem Übergewicht führt die Rechnung mit dem Gesamtgewicht zu
              einem eher zu hohen Wert.
            </li>
            <li>
              <strong>Die Eiweissqualität bleibt aussen vor.</strong> Pflanzliche
              Quellen haben teils ein ungünstigeres Aminosäureprofil. Wer sich
              rein pflanzlich ernährt, sollte eher am oberen Rand der Spanne
              liegen und Quellen kombinieren.
            </li>
            <li>
              <strong>Kein Wert für alle Lebenslagen.</strong> In Schwangerschaft
              und Stillzeit, im höheren Alter und bei Erkrankungen gelten
              abweichende Empfehlungen.
            </li>
            <li>
              <strong>Wichtige Einschränkung bei Nierenerkrankungen:</strong> Bei
              eingeschränkter Nierenfunktion wird die Eiweisszufuhr ärztlich
              festgelegt und liegt oft deutlich niedriger. Dieser Rechner ist
              dafür nicht geeignet.
            </li>
          </ul>
        </>
      }
      faq={[
        {
          question: "Wie viel Protein pro Kilogramm Körpergewicht?",
          answer:
            "Für Erwachsene ohne besondere Belastung nennt die DGE 0,8 g je Kilogramm Körpergewicht als Mindestzufuhr. Wer regelmässig Kraft- oder Ausdauersport treibt, liegt nach den Empfehlungen der International Society of Sports Nutrition eher zwischen 1,4 und 2,0 g/kg. Im Kaloriendefizit kommt ein Zuschlag dazu, weil dort mehr Körpereiweiss abgebaut wird. Der Rechner nennt deshalb eine Spanne statt einer einzelnen Zahl.",
        },
        {
          question: "Wie viel Eiweiss brauche ich am Tag?",
          answer:
            "Das hängt vor allem vom Körpergewicht ab, nicht vom Alter oder Geschlecht. Eine 70 kg schwere Person ohne Sport kommt auf etwa 56 g pro Tag, mit regelmässigem Krafttraining eher auf 98 bis 140 g. Trag oben dein Gewicht und dein Aktivitätsniveau ein, dann rechnet der Rechner deine Spanne aus.",
        },
        {
          question: "Schadet viel Eiweiss den Nieren?",
          answer:
            "Bei gesunden Nieren gibt es nach aktuellem Stand keine Hinweise darauf, dass eine Zufuhr im hier genannten Bereich schädlich ist. Anders sieht es bei bestehender Nierenerkrankung aus – dort wird die Eiweissmenge ärztlich vorgegeben. Wenn du unsicher bist, kläre es in der Hausarztpraxis ab.",
        },
        {
          question: "Brauche ich Eiweisspulver?",
          answer:
            "Nein. Pulver ist ein praktisches Hilfsmittel, kein notwendiges. 30 g Eiweiss stecken auch in etwa 130 g Hähnchenbrust, 200 g Magerquark, 150 g Linsen oder fünf Eiern. Wer seine Menge über normale Lebensmittel erreicht, hat keinen Nachteil.",
        },
        {
          question: "Ist der Bedarf bei veganer Ernährung höher?",
          answer:
            "Etwas höher, ja. Pflanzliche Eiweissquellen werden im Mittel schlechter verwertet und enthalten oft weniger Leucin. Ein Aufschlag von etwa 10 bis 20 Prozent gegenüber dem berechneten Wert ist eine gängige Empfehlung, ebenso das Kombinieren von Hülsenfrüchten mit Getreide.",
        },
        {
          question: "Warum steigt die Empfehlung, wenn ich abnehmen will?",
          answer:
            "Weil im Kaloriendefizit mehr Körpereiweiss abgebaut wird. Eine höhere Zufuhr wirkt dem entgegen und hält zusätzlich länger satt. Der Zuschlag von 0,2 g/kg orientiert sich an Empfehlungen für Sporttreibende in Diätphasen.",
        },
        {
          question: "Zählt Eiweiss aus Brot und Nudeln mit?",
          answer:
            "Ja, alles zählt. Auch Getreideprodukte, Kartoffeln und Gemüse liefern Eiweiss – oft mehr, als man denkt. 100 g Nudeln roh enthalten rund 12 g. Über den Tag summiert sich das spürbar.",
        },
      ]}
      sources={["issnProtein", "dge", "amdr"]}
    />
  );
}
