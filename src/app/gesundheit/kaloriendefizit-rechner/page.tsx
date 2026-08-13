import type { Metadata } from "next";
import Link from "next/link";
import { CalculatorPage } from "@/components/layout/CalculatorPage";
import { DeficitCalculator } from "@/components/calculators/DeficitCalculator";
import { pageMetadata } from "@/lib/seo";
import { getCalculator } from "@/config/calculators";

const meta = getCalculator("kaloriendefizit")!;

export const metadata: Metadata = pageMetadata({
  title: meta.seo.title,
  description: meta.seo.description,
  path: meta.href,
});

export default function Page() {
  return (
    <CalculatorPage
      calculatorId="kaloriendefizit"
      intro={
        <p>
          Abnehmen funktioniert über ein Energiedefizit: Du nimmst weniger
          Energie auf, als du verbrauchst. Dieser Rechner zeigt dir, welche
          Tageszufuhr sich aus deinem gewünschten Defizit ergibt und wie schnell
          du damit rechnerisch abnimmst – inklusive Warnung, wenn es zu weit
          geht.
        </p>
      }
      calculator={<DeficitCalculator />}
      formula={
        <>
          <p>
            Die Rechnung selbst ist einfach. Interessant ist der
            Umrechnungsfaktor am Ende:
          </p>
          <div className="mt-4 space-y-2 rounded-lg border border-border bg-surface-muted/60 p-4 font-mono text-sm text-text">
            <p>Zufuhr = Gesamtumsatz − Defizit pro Tag</p>
            <p>Defizit pro Woche = Defizit pro Tag × 7</p>
            <p>Gewichtsverlust = Defizit pro Woche ÷ 7.700 kcal</p>
          </div>
          <p>
            Der Wert von <strong>7.700 kcal je Kilogramm</strong> geht auf Max
            Wishnofsky (1958) zurück, der 3.500 kcal je Pfund Körperfett
            berechnete. Er beschreibt den Energiegehalt von reinem Fettgewebe.
          </p>
          <p>
            Die Untergrenze der empfohlenen Zufuhr liegt bei 1.200 kcal für
            Frauen und 1.500 kcal für Männer. Fällt die Zufuhr darunter, gibt
            der Rechner eine deutliche Warnung aus, statt den Wert einfach
            anzuzeigen.
          </p>
        </>
      }
      example={
        <>
          <p>
            Jemand hat einen Gesamtumsatz von 2.400 kcal und möchte täglich
            500 kcal einsparen.
          </p>
          <ol>
            <li>
              Tägliche Zufuhr: 2.400 − 500 = <strong>1.900 kcal</strong>
            </li>
            <li>Anteil am Bedarf: 500 ÷ 2.400 = 20,8 Prozent</li>
            <li>Wochendefizit: 500 × 7 = 3.500 kcal</li>
            <li>
              Gewichtsverlust: 3.500 ÷ 7.700 ={" "}
              <strong>rund 0,45 kg pro Woche</strong>
            </li>
            <li>Für ein volles Kilogramm: 7.700 ÷ 500 = 15,4 Tage</li>
          </ol>
          <p>
            Über einen Monat wären das rechnerisch etwa 1,95 kg. In der Praxis
            schwankt das Gewicht auf der Waage durch Wasser und Darminhalt oft
            um mehr als ein Kilogramm – ein einzelner Wiegetermin sagt deshalb
            wenig aus.
          </p>
        </>
      }
      interpretation={
        <>
          <p>
            Das Ergebnis ist eine Modellrechnung, kein Versprechen. In der
            Realität verlangsamt sich die Abnahme mit der Zeit, und zwar aus
            einem einfachen Grund: Wenn du leichter wirst, sinkt dein
            Energieverbrauch. Ein 100-kg-Körper braucht mehr Energie als
            derselbe Körper mit 90 kg – für jede Bewegung und auch in Ruhe.
          </p>
          <p>
            Ein realistisches Tempo liegt bei etwa 0,25 bis 1,0 Prozent des
            Körpergewichts pro Woche. Wer 80 kg wiegt, landet damit bei rund 0,2
            bis 0,8 kg. Je näher du an ein niedriges Körperfettniveau kommst,
            desto weiter solltest du dich am unteren Rand bewegen – sonst geht
            überproportional viel Muskelmasse verloren.
          </p>
          <p>
            Zwei Dinge helfen dabei, das Defizit durchzuhalten: genug Eiweiss
            (siehe{" "}
            <Link href="/gesundheit/proteinbedarf-rechner">
              Proteinbedarf-Rechner
            </Link>
            ) und eine sinnvolle Verteilung der übrigen Kalorien (siehe{" "}
            <Link href="/gesundheit/makronaehrstoff-rechner">
              Makronährstoff-Rechner
            </Link>
            ).
          </p>
          <p>
            Erste Woche mit deutlichem Gewichtsverlust? Das ist überwiegend
            Wasser – der Körper baut Glykogenspeicher ab, die Wasser binden. Der
            eigentliche Trend zeigt sich erst ab Woche drei.
          </p>
        </>
      }
      limits={
        <>
          <ul>
            <li>
              <strong>Die 7.700-kcal-Regel überschätzt langfristig.</strong>{" "}
              Wishnofskys Faktor unterstellt einen konstanten Verbrauch. Modelle
              wie das von Hall und Kollegen (2011) zeigen, dass der tatsächliche
              Verlust nach einigen Monaten deutlich hinter der linearen
              Hochrechnung zurückbleibt.
            </li>
            <li>
              <strong>Der Ausgangswert ist selbst nur geschätzt.</strong> Wenn
              dein Gesamtumsatz um zehn Prozent danebenliegt, verschiebt sich das
              gesamte Ergebnis entsprechend.
            </li>
            <li>
              <strong>Nicht jedes verlorene Kilogramm ist Fett.</strong> Je
              grösser das Defizit, desto höher der Anteil an Muskelmasse.
            </li>
            <li>
              <strong>Kalorienzählen ist ungenau.</strong> Nährwertangaben dürfen
              in der EU vom tatsächlichen Wert abweichen, und Portionen werden
              beim Schätzen regelmässig zu klein angesetzt.
            </li>
            <li>
              <strong>Kein Ersatz für Betreuung.</strong> Bei Essstörungen in der
              Vorgeschichte, in Schwangerschaft und Stillzeit oder bei
              chronischen Erkrankungen gehört ein Defizit fachlich begleitet.
            </li>
          </ul>
        </>
      }
      faq={[
        {
          question: "Wie gross darf mein Defizit maximal sein?",
          answer:
            "Als Orientierung gilt: bis etwa 20 bis 25 Prozent des Gesamtumsatzes. Darüber steigen Muskelverlust, Heisshunger und Konzentrationsprobleme spürbar an. Bei sehr hohem Ausgangsgewicht ist unter ärztlicher Begleitung auch mehr möglich, ohne Begleitung nicht empfehlenswert.",
        },
        {
          question: "Warum nehme ich trotz Defizit nicht ab?",
          answer:
            "Meist stimmt eine der beiden Zahlen nicht. Entweder ist der geschätzte Verbrauch zu hoch angesetzt oder die tatsächliche Zufuhr höher als gedacht – Getränke, Öl beim Kochen und Kleinigkeiten zwischendurch fehlen häufig in der Rechnung. Bleibt das Gewicht über drei bis vier Wochen konstant, senke die Zufuhr um 100 bis 150 kcal.",
        },
        {
          question: "Ist ein Defizit über Sport besser als über Essen?",
          answer:
            "Beides zählt gleich, aber Sport ist der langsamere Hebel: Eine halbe Stunde zügiges Radfahren verbrennt bei 70 kg rund 250 kcal – das entspricht etwa einem Croissant. Der praktikabelste Weg ist meist eine Kombination aus moderat weniger essen und mehr Alltagsbewegung.",
        },
        {
          question: "Sollte ich Diätpausen einlegen?",
          answer:
            "Viele Menschen halten ein Defizit besser durch, wenn sie nach mehreren Wochen ein bis zwei Wochen auf Erhaltungsniveau essen. Zwingend nötig ist das nicht, aber es kann helfen, wenn Hunger und Antriebslosigkeit zunehmen.",
        },
        {
          question: "Was ist mit dem Jo-Jo-Effekt?",
          answer:
            "Das Gewicht kommt vor allem dann zurück, wenn nach der Diät wieder wie vorher gegessen wird – bei einem inzwischen niedrigeren Verbrauch. Deshalb ist der Übergang zurück auf Erhaltungsniveau genauso wichtig wie die Diät selbst, am besten in kleinen Schritten über mehrere Wochen.",
        },
      ]}
      sources={["wishnofsky", "hall", "dge"]}
    />
  );
}
