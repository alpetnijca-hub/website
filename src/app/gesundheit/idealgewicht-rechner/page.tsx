import type { Metadata } from "next";
import Link from "next/link";
import { CalculatorPage } from "@/components/layout/CalculatorPage";
import { IdealWeightCalculator } from "@/components/calculators/IdealWeightCalculator";
import { pageMetadata } from "@/lib/seo";
import { getCalculator } from "@/config/calculators";

const meta = getCalculator("idealgewicht")!;

export const metadata: Metadata = pageMetadata({
  title: meta.seo.title,
  description: meta.seo.description,
  path: meta.href,
});

export default function Page() {
  return (
    <CalculatorPage
      calculatorId="idealgewicht"
      intro={
        <p>
          „Das eine Idealgewicht“ gibt es nicht – und genau das zeigt dieser
          Rechner. Er rechnet deine Körpergrösse mit fünf etablierten Formeln
          durch und stellt die Ergebnisse nebeneinander. Die Unterschiede
          zwischen ihnen sind aufschlussreicher als jeder Einzelwert.
        </p>
      }
      calculator={<IdealWeightCalculator />}
      formula={
        <>
          <p>
            Vier der fünf Formeln arbeiten nach demselben Muster: ein Basiswert
            plus ein fester Zuschlag für jeden Zoll (2,54 cm) über fünf Fuss
            (152,4 cm). Das erklärt auch ihre Herkunft – sie stammen aus dem
            englischsprachigen Raum.
          </p>
          <div className="mt-4 space-y-2 rounded-lg border border-border bg-surface-muted/60 p-4 font-mono text-sm text-text">
            <p>Zoll über 5 Fuss = (cm − 152,4) ÷ 2,54</p>
            <p>Broca: (cm − 100) × 0,9 (Männer) bzw. × 0,85 (Frauen)</p>
            <p>Devine: 50,0 / 45,5 kg + 2,3 kg je Zoll</p>
            <p>Robinson: 52,0 kg + 1,9 / 49,0 kg + 1,7 je Zoll</p>
            <p>Miller: 56,2 kg + 1,41 / 53,1 kg + 1,36 je Zoll</p>
            <p>Hamwi: 48,0 kg + 2,7 / 45,5 kg + 2,2 je Zoll</p>
          </div>
          <p>
            Zusätzlich zeigen wir die Gewichtsspanne, die bei deiner Grösse einem
            BMI von 18,5 bis 24,9 entspricht. Diese Spanne beruht als einzige der
            hier gezeigten Angaben auf einer aktuellen, international
            gebräuchlichen Klassifikation.
          </p>
        </>
      }
      example={
        <>
          <p>Ein Mann ist 183 cm gross.</p>
          <ol>
            <li>Zoll über 5 Fuss: (183 − 152,4) ÷ 2,54 = 12,05</li>
            <li>Broca: (183 − 100) × 0,9 = <strong>74,7 kg</strong></li>
            <li>Devine: 50,0 + 2,3 × 12,05 = <strong>77,7 kg</strong></li>
            <li>Robinson: 52,0 + 1,9 × 12,05 = <strong>74,9 kg</strong></li>
            <li>Miller: 56,2 + 1,41 × 12,05 = <strong>73,2 kg</strong></li>
            <li>Hamwi: 48,0 + 2,7 × 12,05 = <strong>80,5 kg</strong></li>
          </ol>
          <p>
            Die Ergebnisse liegen zwischen 73,2 und 80,5 kg – ein Unterschied von
            über sieben Kilogramm. Der BMI-Normalbereich für 183 cm reicht
            derweil von 62,0 bis 83,4 kg und ist damit noch einmal deutlich
            weiter.
          </p>
        </>
      }
      interpretation={
        <>
          <p>
            Wenn fünf anerkannte Formeln bei derselben Person um sieben
            Kilogramm auseinanderliegen, sagt das mehr über die Formeln aus als
            über die Person. Keine von ihnen wurde entwickelt, um ein
            gesundheitliches Zielgewicht zu bestimmen.
          </p>
          <p>
            Devine, Robinson, Miller und Hamwi stammen aus der klinischen
            Praxis: Man brauchte eine standardisierte Bezugsgrösse, um
            Medikamentendosen zu berechnen – etwa bei Antibiotika, deren Dosis
            sich nicht am tatsächlichen, sondern an einem normierten Gewicht
            orientiert. Broca ist noch älter und war von Anfang an eine
            Faustregel ohne wissenschaftlichen Anspruch.
          </p>
          <p>
            Sinnvoll nutzen lässt sich die Spanne so: Liegt dein Gewicht
            innerhalb oder nahe daran, gibt es aus dieser Perspektive keinen
            Anlass zur Sorge. Liegt es deutlich darüber oder darunter, ist der{" "}
            <Link href="/gesundheit/bmi-rechner">BMI-Rechner</Link> die etwas
            aktuellere Einordnung – und ein ärztliches Gespräch die verlässlichste.
          </p>
        </>
      }
      limits={
        <>
          <ul>
            <li>
              <strong>Nur die Körpergrösse zählt.</strong> Körperbau,
              Muskelmasse, Alter und Trainingszustand fliessen in keine der
              Formeln ein. Zwei gleich grosse Menschen bekommen immer dasselbe
              Ergebnis.
            </li>
            <li>
              <strong>Die Formeln sind alt.</strong> Sie stammen aus den Jahren
              1871 bis 1983 und beruhen überwiegend auf Daten
              nordamerikanischer Erwachsener. Ob sie auf heutige Bevölkerungen
              übertragbar sind, ist offen.
            </li>
            <li>
              <strong>Zweckentfremdung.</strong> Formeln aus der
              Arzneimitteldosierung sagen nichts über Gesundheit, Fitness oder
              Wohlbefinden aus.
            </li>
            <li>
              <strong>Nur binäre Geschlechtsangabe.</strong> Die Formeln
              unterscheiden ausschliesslich zwischen „männlich“ und „weiblich“.
              Eine differenziertere Datengrundlage existiert für sie nicht.
            </li>
            <li>
              <strong>Kein Ziel für eine Diät.</strong> Ein Zahlenwert aus einer
              Formel von 1974 ist keine geeignete Grundlage, um das eigene
              Essverhalten zu steuern.
            </li>
          </ul>
        </>
      }
      faq={[
        {
          question: "Welche Formel ist die beste?",
          answer:
            "Keine sticht heraus. In Untersuchungen zur Arzneimitteldosierung wird Devine am häufigsten verwendet, weil sie am längsten etabliert ist – nicht weil sie am genauesten wäre. Für die Einschätzung des eigenen Gewichts ist der BMI-Normalbereich die zeitgemässere Angabe.",
        },
        {
          question: "Warum liegt Broca bei grossen Menschen so hoch?",
          answer:
            "Broca rechnet linear mit der Körpergrösse in Zentimetern minus 100. Bei sehr grossen Menschen führt das zu hohen Werten, bei sehr kleinen zu unrealistisch niedrigen. Die Formel funktioniert am ehesten im mittleren Bereich zwischen etwa 160 und 180 cm.",
        },
        {
          question: "Soll ich mein Gewicht an diesen Werten ausrichten?",
          answer:
            "Nein. Nutze die Spanne als groben Rahmen, nicht als Vorgabe. Ein gesundes Gewicht ist eines, bei dem du dich belastbar fühlst, gut schläfst und deine Blutwerte in Ordnung sind – das lässt sich mit keiner Formel berechnen.",
        },
        {
          question: "Warum unterscheiden sich die Werte für Frauen und Männer?",
          answer:
            "Alle fünf Formeln setzen für Frauen einen niedrigeren Basiswert an, weil Frauen im statistischen Mittel eine geringere Muskel- und Knochenmasse haben. Der Unterschied beträgt je nach Formel zwischen zwei und fünf Kilogramm bei gleicher Körpergrösse.",
        },
      ]}
      sources={["devine", "robinson", "miller", "hamwi", "whoBmi"]}
    />
  );
}
