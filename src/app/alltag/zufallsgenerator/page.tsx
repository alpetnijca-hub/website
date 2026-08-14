import type { Metadata } from "next";
import { CalculatorPage } from "@/components/layout/CalculatorPage";
import { RandomNumberCalculator } from "@/components/calculators/RandomNumberCalculator";
import { pageMetadata } from "@/lib/seo";
import { getCalculator } from "@/config/calculators";

const meta = getCalculator("zufallszahl")!;

export const metadata: Metadata = pageMetadata({
  title: meta.seo.title,
  description: meta.seo.description,
  path: meta.href,
});

export default function Page() {
  return (
    <CalculatorPage
      calculatorId="zufallszahl"
      disclaimer="keiner"
      intro={
        <p>
          Zahlen in einem frei wählbaren Bereich ziehen – einzeln oder gleich
          mehrere, mit oder ohne Wiederholung. Für Verlosungen, Aufgabenteilung,
          Spiele oder wenn schlicht eine Entscheidung fällig ist.
        </p>
      }
      calculator={<RandomNumberCalculator />}
      formula={
        <>
          <p>
            Die Zufallszahlen stammen aus{" "}
            <code>crypto.getRandomValues()</code> – der Zufallsquelle, die dein
            Browser bereitstellt und die auch für Sicherheitsanwendungen
            gedacht ist. Sie liefert 32-Bit-Zahlen, die auf den gewünschten
            Bereich umgerechnet werden:
          </p>
          <div className="mt-4 space-y-2 rounded-lg border border-border bg-surface-muted/60 p-4 font-mono text-sm text-text">
            <p>Anzahl möglicher Werte = Max − Min + 1</p>
            <p>Zahl = Min + (Zufallswert mod Anzahl)</p>
          </div>
          <p>
            Diese Umrechnung allein wäre allerdings <strong>nicht
            gleichverteilt</strong>. 2³² lässt sich fast nie ohne Rest durch die
            Anzahl teilen, und die überzähligen Werte am oberen Rand würden die
            ersten Zahlen des Bereichs bevorzugen. Deshalb wird gerechnet:
          </p>
          <div className="mt-4 space-y-2 rounded-lg border border-border bg-surface-muted/60 p-4 font-mono text-sm text-text">
            <p>Grenze = ⌊2³² ÷ Anzahl⌋ × Anzahl</p>
            <p>Zufallswerte ab dieser Grenze werden verworfen und neu gezogen.</p>
          </div>
          <p>
            Für die <strong>Ziehung ohne Wiederholung</strong> in kleinen
            Bereichen wird nicht wiederholt gezogen, sondern nach dem Verfahren
            von Fisher und Yates gemischt. Sonst würde eine Ziehung, die fast
            den ganzen Bereich umfasst – etwa 10 aus 10 – beliebig lange
            brauchen, bis zufällig auch die letzte fehlende Zahl fällt.
          </p>
        </>
      }
      example={
        <>
          <p>
            <strong>Sechs Lottozahlen aus 49.</strong> Der Bereich umfasst
            49 mögliche Werte. 2³² ÷ 49 ergibt 87.652.393 volle Runden, also
            liegt die Grenze bei 87.652.393 × 49 = 4.294.967.257. Von den
            4.294.967.296 möglichen Zufallswerten werden die obersten 39
            verworfen – das betrifft weniger als ein Millionstel Prozent der
            Ziehungen, sorgt aber dafür, dass jede der 49 Zahlen exakt gleich
            wahrscheinlich ist.
          </p>
          <p>
            <strong>Ein Würfelwurf.</strong> Bereich 1 bis 6, eine Zahl, mit
            Wiederholung. Jede Augenzahl hat eine Wahrscheinlichkeit von genau
            einem Sechstel, unabhängig davon, was vorher gefallen ist.
          </p>
          <p>
            <strong>Gruppeneinteilung.</strong> 24 Personen sollen auf Plätze
            verteilt werden: Bereich 1 bis 24, 24 Zahlen, ohne Wiederholung.
            Das Ergebnis ist eine vollständige zufällige Reihenfolge – jede
            Nummer kommt genau einmal vor.
          </p>
        </>
      }
      interpretation={
        <>
          <p>
            <strong>Ohne Wiederholung</strong> entspricht einer Ziehung wie beim
            Lotto: Was gezogen ist, kommt nicht zurück in die Trommel. Mehr
            Zahlen als der Bereich hergibt sind dann unmöglich.
          </p>
          <p>
            <strong>Mit Wiederholung</strong> entspricht wiederholtem Würfeln.
            Jede Ziehung ist unabhängig, dieselbe Zahl kann mehrfach fallen –
            und das ist kein Fehler, sondern zu erwarten. Bei sechs Ziehungen
            aus 49 Zahlen liegt die Wahrscheinlichkeit für mindestens eine
            Doppelung bei rund 27 Prozent.
          </p>
          <p>
            Ein häufiges Missverständnis: Eine Folge wie 1, 2, 3, 4, 5, 6 ist
            genauso wahrscheinlich wie jede andere bestimmte Kombination. Sie
            sieht nur weniger zufällig aus. Zufall bedeutet nicht, dass das
            Ergebnis ungeordnet aussehen muss.
          </p>
        </>
      }
      limits={
        <>
          <ul>
            <li>
              <strong>Keine Beweiskraft.</strong> Das Ergebnis erscheint nur in
              deinem Browser und wird nirgends protokolliert. Für Verlosungen,
              bei denen ein Nachweis nötig ist, taugt das nicht – da braucht es
              Zeugen oder ein dokumentiertes Verfahren.
            </li>
            <li>
              <strong>Kein Glücksspiel-Zufallsgenerator.</strong> Für Anwendungen
              mit Geldeinsatz gelten geprüfte und zertifizierte Verfahren. Dieser
              Rechner ist für Alltagsentscheidungen gedacht.
            </li>
            <li>
              <strong>Es sind Pseudozufallszahlen.</strong> Auch{" "}
              <code>crypto.getRandomValues()</code> berechnet die Werte, statt
              sie physikalisch zu messen. Der Startwert stammt aus dem
              Betriebssystem und ist praktisch nicht vorhersagbar – ein echter
              physikalischer Zufallsgenerator ist es trotzdem nicht.
            </li>
            <li>
              <strong>Der Bereich ist begrenzt</strong> auf Werte von
              −1.000.000.000 bis 1.000.000.000 und höchstens 500 Zahlen je
              Ziehung. Nur ganze Zahlen, keine Nachkommastellen.
            </li>
          </ul>
        </>
      }
      faq={[
        {
          question: "Werden meine Zahlen an einen Server geschickt?",
          answer:
            "Nein. Die Ziehung findet vollständig in deinem Browser statt. Weder die Eingaben noch das Ergebnis verlassen dein Gerät, und gespeichert wird nichts – ein Neuladen der Seite setzt alles zurück.",
        },
        {
          question: "Sind die Zahlen wirklich gleichverteilt?",
          answer:
            "Ja, im Rahmen dessen, was ein Rechner leisten kann. Der häufigste Fehler in einfachen Umsetzungen – die ungleiche Verteilung durch die Restrechnung – wird durch das Verwerfen der überzähligen Werte vermieden. Jede Zahl im Bereich hat dieselbe Wahrscheinlichkeit.",
        },
        {
          question: "Warum erscheint das Ergebnis erst nach einem Klick?",
          answer:
            "Weil eine schon beim Laden gezogene Zahl auf dem Server eine andere wäre als in deinem Browser – die Anzeige würde beim Aufbau der Seite sichtbar springen. Der Knopf ist die saubere Lösung: Der Zufall entsteht genau dann, wenn du ihn anforderst.",
        },
        {
          question: "Kann ich auch nur eine einzige Zahl ziehen?",
          answer:
            "Ja, trag bei „Wie viele Zahlen?“ einfach 1 ein. Für einen Würfelwurf oder eine Ja-Nein-Entscheidung gibt es zusätzlich fertige Voreinstellungen.",
        },
      ]}
    />
  );
}
