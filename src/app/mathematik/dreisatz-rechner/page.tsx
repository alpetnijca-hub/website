import type { Metadata } from "next";
import { CalculatorPage } from "@/components/layout/CalculatorPage";
import { RatioCalculator } from "@/components/calculators/RatioCalculator";
import { pageMetadata } from "@/lib/seo";
import { getCalculator } from "@/config/calculators";

const meta = getCalculator("dreisatz")!;

export const metadata: Metadata = pageMetadata({
  title: meta.seo.title,
  description: meta.seo.description,
  path: meta.href,
});

export default function Page() {
  return (
    <CalculatorPage
      calculatorId="dreisatz"
      disclaimer="keiner"
      intro={
        <p>
          Drei Werte bekannt, einer gesucht – das ist der Dreisatz. Der Rechner
          löst beide Formen und schreibt den Rechenweg mit, damit du ihn
          nachvollziehen und abschreiben kannst.
        </p>
      }
      calculator={<RatioCalculator />}
      formula={
        <>
          <p>
            <strong>Proportional</strong> („je mehr, desto mehr“): Doppelte
            Menge, doppelter Preis. Man rechnet über den Wert für{" "}
            <em>eine</em> Einheit.
          </p>
          <div className="mt-4 space-y-2 rounded-lg border border-border bg-surface-muted/60 p-4 font-mono text-sm text-text">
            <p>a entsprechen b</p>
            <p>1 entspricht b ÷ a</p>
            <p>c entsprechen b ÷ a × c</p>
          </div>
          <p>
            <strong>Umgekehrt proportional</strong> („je mehr, desto weniger“):
            Doppelt so viele Arbeiter, halbe Zeit. Hier bleibt nicht der Wert je
            Einheit gleich, sondern das <strong>Produkt</strong> beider Grössen.
          </p>
          <div className="mt-4 space-y-2 rounded-lg border border-border bg-surface-muted/60 p-4 font-mono text-sm text-text">
            <p>a × b = Gesamtaufwand</p>
            <p>x = a × b ÷ c</p>
          </div>
          <p>
            Die Entscheidung zwischen beiden Formen ist der eigentliche
            Denkschritt und lässt sich nicht ausrechnen. Prüf sie immer am
            gesunden Menschenverstand: Muss das Ergebnis grösser oder kleiner
            werden?
          </p>
        </>
      }
      example={
        <>
          <p>
            <strong>Proportional: 3 Brötchen kosten 1,50 €. Was kosten
            7?</strong>
          </p>
          <ol>
            <li>Ein Brötchen: 1,50 ÷ 3 = 0,50 €</li>
            <li>
              Sieben Brötchen: 0,50 × 7 = <strong>3,50 €</strong>
            </li>
          </ol>
          <p>
            <strong>Umgekehrt proportional: 4 Arbeiter brauchen 6 Stunden.
            Wie lange brauchen 3?</strong>
          </p>
          <ol>
            <li>Gesamtaufwand: 4 × 6 = 24 Arbeitsstunden</li>
            <li>
              Auf 3 Arbeiter: 24 ÷ 3 = <strong>8 Stunden</strong>
            </li>
          </ol>
          <p>
            Der Unterschied ist gewaltig: Mit derselben Zahlenkombination würde
            der proportionale Ansatz 4,5 Stunden ergeben – weniger Arbeiter,
            weniger Zeit. Das ist offensichtlich falsch, und genau daran merkt
            man, welche Form gemeint ist.
          </p>
          <p>
            <strong>Aus dem Alltag:</strong> 250 g Mehl reichen für 12 Kekse –
            wie viel Mehl braucht man für 30? 250 ÷ 12 × 30 = 625 g.
          </p>
        </>
      }
      interpretation={
        <>
          <p>
            <strong>Die Frage ist nie die Rechnung, sondern die Zuordnung.</strong>{" "}
            Ob zwei Grössen proportional oder umgekehrt proportional
            zusammenhängen, entscheidet der Sachverhalt. Menge und Preis:
            proportional. Geschwindigkeit und Fahrzeit: umgekehrt proportional.
            Arbeiter und Dauer: umgekehrt proportional.
          </p>
          <p>
            <strong>Nicht alles ist proportional.</strong> Zwei Maler brauchen
            für ein Zimmer halb so lang wie einer – zwanzig Maler aber nicht ein
            Zwanzigstel, weil sie sich im Weg stehen. Der Dreisatz ist ein
            Modell, und Modelle haben Gültigkeitsbereiche. Bei extremen Werten
            lohnt der Blick, ob das Ergebnis noch Sinn ergibt.
          </p>
          <p>
            Der Dreisatz steckt in vielen anderen Rechnungen: Prozentrechnung,
            Massstab auf Karten, Währungsumrechnung, Rezepte hochrechnen. Wer
            ihn beherrscht, braucht für diese Aufgaben keine eigenen Formeln.
          </p>
        </>
      }
      limits={
        <>
          <ul>
            <li>
              <strong>Der Rechner erkennt die Art des Zusammenhangs
              nicht.</strong> Er kann aus drei Zahlen nicht ablesen, ob mehr
              Menge mehr oder weniger bedeutet. Diese Entscheidung triffst du.
            </li>
            <li>
              <strong>Keine negativen Werte.</strong> Beim Dreisatz geht es um
              Mengen, Preise und Zeiten – negative Eingaben ergeben hier keinen
              Sinn und werden abgelehnt.
            </li>
            <li>
              <strong>Der erste Wert darf nicht null sein.</strong> Aus „0 Stück
              kosten 5 €“ folgt kein Preis je Stück. Beim umgekehrten Dreisatz
              gilt dasselbe für den gesuchten Bezugswert.
            </li>
            <li>
              <strong>Rundung auf vier Nachkommastellen.</strong> Bei
              Geldbeträgen also gegebenenfalls selbst auf Cent runden.
            </li>
          </ul>
        </>
      }
      faq={[
        {
          question: "Was ist der Dreisatz?",
          answer:
            "Ein Verfahren, um aus drei bekannten Werten einen vierten zu bestimmen. Man rechnet zuerst auf eine Einheit herunter und von dort auf die gesuchte Menge hoch – daher der Name: drei Sätze, drei Schritte.",
        },
        {
          question: "Woran erkenne ich den umgekehrten Dreisatz?",
          answer:
            "Daran, dass mehr von der einen Grösse weniger von der anderen bedeutet. Typische Fälle: mehr Arbeiter – weniger Zeit, höhere Geschwindigkeit – kürzere Fahrtdauer, mehr Personen – kleinere Portionen. Im Zweifel überleg dir, ob das Ergebnis grösser oder kleiner werden muss.",
        },
        {
          question: "Kann ich den Dreisatz für Prozentrechnung nutzen?",
          answer:
            "Ja, Prozentrechnung ist ein Dreisatz mit dem Bezugswert 100. „30 % von 250“ heisst: 100 entsprechen 250, also entsprechen 30 dem Wert 250 ÷ 100 × 30 = 75. Für die gängigen Fälle gibt es dafür auch unseren Prozentrechner.",
        },
        {
          question: "Warum ist mein Ergebnis unplausibel?",
          answer:
            "Meist ist die falsche Form gewählt. Prüf, ob mehr von der einen Grösse tatsächlich mehr von der anderen bedeutet. Stell notfalls oben auf die andere Variante um und vergleiche die beiden Ergebnisse.",
        },
      ]}
    />
  );
}
