import type { Metadata } from "next";
import Link from "next/link";
import { CalculatorPage } from "@/components/layout/CalculatorPage";
import { MacroCalculator } from "@/components/calculators/MacroCalculator";
import { pageMetadata } from "@/lib/seo";
import { getCalculator } from "@/config/calculators";

const meta = getCalculator("makronaehrstoffe")!;

export const metadata: Metadata = pageMetadata({
  title: meta.seo.title,
  description: meta.seo.description,
  path: meta.href,
});

export default function Page() {
  return (
    <CalculatorPage
      calculatorId="makronaehrstoffe"
      intro={
        <p>
          Wenn dein Kalorienziel steht, bleibt die Frage, wie es sich auf
          Eiweiss, Fett und Kohlenhydrate verteilt. Dieser Rechner macht daraus
          konkrete Grammangaben – mit einer Verteilung, die zu deinem Ziel passt
          und nachvollziehbar hergeleitet wird.
        </p>
      }
      calculator={<MacroCalculator />}
      formula={
        <>
          <p>
            Die Rechnung läuft in drei Schritten ab, und die Reihenfolge ist
            entscheidend:
          </p>
          <ol>
            <li>
              <strong>Eiweiss zuerst.</strong> Wenn du dein Körpergewicht
              angibst, rechnen wir mit 2,0 g/kg beim Abnehmen, 1,6 g/kg beim
              Halten und 1,8 g/kg beim Zunehmen. Ohne Gewichtsangabe verwenden
              wir 30 beziehungsweise 22 Prozent der Gesamtenergie.
            </li>
            <li>
              <strong>Fett als Nächstes.</strong> 25 bis 30 Prozent der
              Gesamtenergie, mindestens aber 0,6 g je Kilogramm Körpergewicht.
            </li>
            <li>
              <strong>Kohlenhydrate füllen auf.</strong> Was nach Eiweiss und
              Fett an Energie übrig bleibt, entfällt auf Kohlenhydrate.
            </li>
          </ol>
          <div className="mt-4 space-y-2 rounded-lg border border-border bg-surface-muted/60 p-4 font-mono text-sm text-text">
            <p>1 g Eiweiss = 4 kcal</p>
            <p>1 g Fett = 9 kcal</p>
            <p>1 g Kohlenhydrate = 4 kcal</p>
            <p>Gramm = zugeteilte kcal ÷ kcal je Gramm</p>
          </div>
          <p>
            Die Anteile bewegen sich innerhalb der Bereiche, die das Institute of
            Medicine als übliche Verteilung beschreibt (AMDR): Eiweiss 10 bis
            35 Prozent, Fett 20 bis 35 Prozent, Kohlenhydrate 45 bis 65 Prozent.
            Bei stark eiweissbetonten Zielen kann der Kohlenhydratanteil
            rechnerisch darunter fallen – der Rechner weist dann darauf hin.
          </p>
        </>
      }
      example={
        <>
          <p>
            Jemand wiegt 70 kg, hat ein Kalorienziel von 2.000 kcal und möchte
            abnehmen.
          </p>
          <ol>
            <li>
              Eiweiss: 70 × 2,0 = 140 g → 140 × 4 ={" "}
              <strong>560 kcal (28 Prozent)</strong>
            </li>
            <li>
              Fett: 27 Prozent von 2.000 = 540 kcal → 540 ÷ 9 ={" "}
              <strong>60 g</strong>
            </li>
            <li>
              Mindestfett prüfen: 70 × 0,6 = 42 g – die 60 g liegen darüber, also
              keine Anpassung nötig
            </li>
            <li>
              Kohlenhydrate: 2.000 − 560 − 540 = 900 kcal → 900 ÷ 4 ={" "}
              <strong>225 g (45 Prozent)</strong>
            </li>
          </ol>
          <p>
            Ergebnis: 140 g Eiweiss, 60 g Fett, 225 g Kohlenhydrate. Die Summe
            der Energieanteile ergibt wieder die 2.000 kcal.
          </p>
        </>
      }
      interpretation={
        <>
          <p>
            Von den drei Werten ist einer wichtiger als die anderen beiden. Die{" "}
            <strong>Eiweissmenge</strong> hat den grössten Einfluss darauf, wie
            viel Muskelmasse du in einer Diät hältst und wie satt du wirst. Sie
            solltest du möglichst treffen.
          </p>
          <p>
            Das Verhältnis von <strong>Fett zu Kohlenhydraten</strong> ist
            dagegen weitgehend Geschmackssache. Bei gleicher Kalorien- und
            Eiweissmenge zeigen Vergleichsstudien keinen bedeutsamen Unterschied
            im Abnehmerfolg zwischen fettarmen und kohlenhydratarmen Ansätzen.
            Entscheidend ist, womit du im Alltag besser zurechtkommst. Wer abends
            gerne isst und tagsüber wenig Hunger hat, verteilt anders als jemand,
            der ohne Frühstück nicht arbeiten kann.
          </p>
          <p>
            Ein paar praktische Untergrenzen sind trotzdem sinnvoll: Fett nicht
            dauerhaft unter etwa 0,6 g/kg, weil sonst die Aufnahme fettlöslicher
            Vitamine und der Hormonhaushalt leiden können. Und Kohlenhydrate
            nicht extrem niedrig, wenn du intensiv trainierst – sie sind der
            bevorzugte Brennstoff für harte Belastungen.
          </p>
          <p>
            Wenn dein Kalorienziel noch nicht feststeht, rechne es zuerst mit dem{" "}
            <Link href="/gesundheit/kalorienbedarf-rechner">
              Kalorienbedarf-Rechner
            </Link>{" "}
            aus.
          </p>
        </>
      }
      limits={
        <>
          <ul>
            <li>
              <strong>Die Verteilung ist eine begründete Konvention.</strong> Es
              gibt keine wissenschaftlich eindeutig „richtige“ Aufteilung. Andere
              Rechner setzen andere Prozentsätze an und liegen damit nicht falsch.
            </li>
            <li>
              <strong>Ballaststoffe fehlen.</strong> Sie zählen zu den
              Kohlenhydraten, liefern aber weniger verwertbare Energie. Der
              Rechner unterscheidet das nicht.
            </li>
            <li>
              <strong>Lebensmittelqualität bleibt aussen vor.</strong> 60 g Fett
              aus Olivenöl und Nüssen sind ernährungsphysiologisch etwas anderes
              als 60 g aus Frittiertem – die Grammzahl ist dieselbe.
            </li>
            <li>
              <strong>Auf das Gramm genau ist unnötig.</strong> Eine Abweichung
              von zehn Prozent bei Fett oder Kohlenhydraten fällt nicht ins
              Gewicht. Wer täglich exakte Zahlen erreichen will, macht sich das
              Leben ohne Nutzen schwer.
            </li>
            <li>
              <strong>Nicht für alle geeignet.</strong> Bei Diabetes,
              Fettstoffwechselstörungen, Nieren- oder Lebererkrankungen sollte
              die Verteilung fachlich abgestimmt werden.
            </li>
          </ul>
        </>
      }
      faq={[
        {
          question: "Muss ich meine Makros jeden Tag genau treffen?",
          answer:
            "Nein. Sinnvoll ist, die Eiweissmenge regelmässig zu erreichen und bei den Gesamtkalorien im Rahmen zu bleiben. Fett und Kohlenhydrate dürfen von Tag zu Tag schwanken – der Körper rechnet nicht in Kalendertagen. Entscheidend ist der Durchschnitt über die Woche.",
        },
        {
          question: "Ist Low Carb besser zum Abnehmen?",
          answer:
            "Bei gleicher Kalorien- und Eiweissmenge zeigen kontrollierte Studien keinen bedeutsamen Vorteil einer kohlenhydratarmen gegenüber einer fettarmen Ernährung. Der anfänglich schnellere Gewichtsverlust bei Low Carb beruht überwiegend auf Wasser, das mit den Glykogenspeichern verloren geht. Wähle den Ansatz, den du durchhältst.",
        },
        {
          question: "Warum begrenzt der Rechner das Eiweiss auf 40 Prozent?",
          answer:
            "Wenn ein niedriges Kalorienziel auf ein hohes Körpergewicht trifft, würde die Rechnung sonst fast die gesamte Energie dem Eiweiss zuweisen und für Fett und Kohlenhydrate kaum etwas übrig lassen. Die Begrenzung hält die Verteilung praktikabel – und ist zugleich ein Hinweis darauf, dass das Kalorienziel womöglich zu niedrig angesetzt ist.",
        },
        {
          question: "Was ist mit Alkohol?",
          answer:
            "Alkohol liefert rund 7 kcal je Gramm und gehört zu keiner der drei Gruppen. Er wird in diesem Rechner nicht berücksichtigt. Wer regelmässig Alkohol trinkt, sollte die Kalorien daraus vom Tagesziel abziehen – sie summieren sich schneller, als man denkt.",
        },
        {
          question: "Wozu die Angabe des Körpergewichts?",
          answer:
            "Sie macht die Eiweissmenge deutlich genauer. Ein fester Prozentsatz führt bei niedrigen Kalorienzielen zu wenig Eiweiss und bei hohen zu viel. Die Angabe ist freiwillig – ohne sie rechnet der Rechner mit prozentualen Anteilen weiter.",
        },
      ]}
      sources={["amdr", "issnProtein", "dge"]}
    />
  );
}
