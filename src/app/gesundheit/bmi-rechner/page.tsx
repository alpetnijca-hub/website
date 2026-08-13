import type { Metadata } from "next";
import Link from "next/link";
import { CalculatorPage } from "@/components/layout/CalculatorPage";
import { BmiCalculator } from "@/components/calculators/BmiCalculator";
import { pageMetadata } from "@/lib/seo";
import { getCalculator } from "@/config/calculators";

const meta = getCalculator("bmi")!;

export const metadata: Metadata = pageMetadata({
  title: meta.seo.title,
  description: meta.seo.description,
  path: meta.href,
});

export default function Page() {
  return (
    <CalculatorPage
      calculatorId="bmi"
      intro={
        <p>
          Der Body-Mass-Index setzt dein Gewicht ins Verhältnis zu deiner
          Körpergrösse. Er ist schnell berechnet und deshalb weit verbreitet –
          aber er ist bewusst ein grobes Werkzeug. Hier bekommst du deinen Wert,
          die zugehörige WHO-Kategorie und eine ehrliche Einordnung, was der
          Wert aussagt und was nicht.
        </p>
      }
      calculator={<BmiCalculator />}
      formula={
        <>
          <p>
            Die Formel stammt vom belgischen Mathematiker Adolphe Quetelet aus
            dem 19. Jahrhundert. Der Name „Body-Mass-Index“ kam erst 1972 auf.
          </p>
          <div className="mt-4 rounded-lg border border-border bg-surface-muted/60 p-4 font-mono text-sm text-text">
            <p>BMI = Gewicht in kg ÷ (Körpergrösse in m)²</p>
          </div>
          <p>
            Wichtig ist das Quadrat im Nenner: Die Körpergrösse geht doppelt
            gewichtet ein. Deshalb reagiert der BMI empfindlich auf
            Grössenangaben – ein Zentimeter mehr oder weniger verändert das
            Ergebnis stärker, als viele erwarten.
          </p>
          <p>
            Die Einteilung folgt der Klassifikation der Weltgesundheitsorganisation
            für Erwachsene: unter 18,5 Untergewicht, 18,5 bis 24,9 Normalgewicht,
            25 bis 29,9 Übergewicht, ab 30 Adipositas in drei Graden.
          </p>
        </>
      }
      example={
        <>
          <p>Eine Person wiegt 82 kg und ist 178 cm gross.</p>
          <ol>
            <li>Körpergrösse in Meter: 178 cm = 1,78 m</li>
            <li>Quadrieren: 1,78 × 1,78 = 3,1684</li>
            <li>
              Teilen: 82 ÷ 3,1684 = <strong>25,9</strong>
            </li>
          </ol>
          <p>
            Ein BMI von 25,9 fällt in die Kategorie Übergewicht (Präadipositas).
            Um in den Normalbereich zu kommen, müsste die Person bei gleicher
            Grösse zwischen 58,6 kg und 78,9 kg wiegen – also rund drei
            Kilogramm weniger als aktuell.
          </p>
        </>
      }
      interpretation={
        <>
          <p>
            Der BMI wurde entwickelt, um Bevölkerungsgruppen zu vergleichen,
            nicht um einzelne Menschen zu beurteilen. Auf Bevölkerungsebene
            funktioniert er gut: Mit steigendem BMI nimmt statistisch das Risiko
            für Typ-2-Diabetes, Bluthochdruck und Herz-Kreislauf-Erkrankungen zu.
          </p>
          <p>
            Für dich persönlich ist er ein erster Anhaltspunkt, mehr nicht. Ein
            Wert knapp ausserhalb des Normalbereichs bedeutet für sich genommen
            wenig. Aussagekräftiger wird das Bild in Kombination mit dem
            Taillenumfang: Ab etwa 88 cm bei Frauen und 102 cm bei Männern gilt
            das Bauchfett als gesundheitlich bedeutsam – unabhängig vom BMI.
          </p>
          <p>
            Wenn dein Wert dich beschäftigt, ist der nächste sinnvolle Schritt
            nicht eine Diät auf eigene Faust, sondern ein Gespräch in der
            Hausarztpraxis. Falls du deinen Energiebedarf einschätzen möchtest,
            hilft der{" "}
            <Link href="/gesundheit/kalorienbedarf-rechner">
              Kalorienbedarf-Rechner
            </Link>
            .
          </p>
        </>
      }
      limits={
        <>
          <p>
            Der BMI kennt nur zwei Zahlen. Alles andere – Muskelmasse,
            Knochenbau, Fettverteilung, Alter, Herkunft – bleibt aussen vor. Das
            führt zu bekannten Fehleinschätzungen:
          </p>
          <ul>
            <li>
              <strong>Muskulöse Menschen</strong> landen häufig im Bereich
              „Übergewicht“, obwohl ihr Körperfettanteil niedrig ist. Muskelgewebe
              ist dichter als Fettgewebe.
            </li>
            <li>
              <strong>Ältere Menschen</strong> haben bei gleichem BMI oft mehr
              Fett- und weniger Muskelmasse. Ein leicht erhöhter BMI gilt im
              höheren Alter teilweise sogar als günstig.
            </li>
            <li>
              <strong>Die Fettverteilung fehlt völlig.</strong> Bauchfett gilt
              als deutlich risikoreicher als Fett an Hüfte und Oberschenkeln –
              der BMI unterscheidet das nicht.
            </li>
            <li>
              <strong>Nicht anwendbar</strong> bei Kindern und Jugendlichen (dort
              gelten alters- und geschlechtsspezifische Perzentilkurven), in der
              Schwangerschaft und bei Menschen mit Amputationen oder starken
              Wassereinlagerungen.
            </li>
          </ul>
        </>
      }
      faq={[
        {
          question: "Ab welchem BMI sollte ich zum Arzt?",
          answer:
            "Der BMI allein ist kein Grund für einen Arztbesuch. Sinnvoll ist ein Gespräch, wenn der Wert deutlich unter 18,5 oder über 30 liegt, wenn sich dein Gewicht ungewollt stark verändert hat oder wenn zusätzliche Beschwerden bestehen. Auch bei Werten im Normalbereich kann eine ärztliche Abklärung angebracht sein, wenn du dich unwohl fühlst.",
        },
        {
          question: "Gibt es unterschiedliche BMI-Grenzen für Männer und Frauen?",
          answer:
            "Nein. Die WHO-Klassifikation für Erwachsene ist für beide Geschlechter gleich. Manche Rechner zeigen abweichende Werte an, die auf älteren Einteilungen beruhen. Unterschiede gibt es dagegen beim Körperfettanteil: Frauen haben bei gleichem BMI im Mittel einen höheren Anteil an Körperfett.",
        },
        {
          question: "Ist der BMI für Sportler unbrauchbar?",
          answer:
            "Bei ausgeprägtem Krafttraining oder in Sportarten mit hoher Muskelmasse verliert der BMI stark an Aussagekraft – ein Wert über 25 sagt dort wenig aus. Für Freizeitsportler mit normalem Trainingsumfang bleibt er dagegen als grober Anhaltspunkt brauchbar.",
        },
        {
          question: "Warum zeigt der Rechner eine Gewichtsspanne an?",
          answer:
            "Weil der Normalbereich eine Spanne ist, kein Punkt. Bei 175 cm reicht der Bereich mit BMI 18,5 bis 24,9 von etwa 56,7 kg bis 76,3 kg – fast zwanzig Kilogramm. Das zeigt gut, wie grob die Einteilung ist.",
        },
        {
          question: "Werden meine Eingaben gespeichert?",
          answer:
            "Nein. Die Berechnung läuft vollständig in deinem Browser. Gewicht und Körpergrösse werden weder an einen Server gesendet noch dauerhaft gespeichert. Lädst du die Seite neu, sind die Felder wieder auf den Ausgangswerten.",
        },
      ]}
      sources={["whoBmi", "dge"]}
    />
  );
}
