import type { Metadata } from "next";
import { CalculatorPage } from "@/components/layout/CalculatorPage";
import { VatCalculator } from "@/components/calculators/VatCalculator";
import { pageMetadata } from "@/lib/seo";
import { getCalculator } from "@/config/calculators";

const meta = getCalculator("mehrwertsteuer")!;

export const metadata: Metadata = pageMetadata({
  title: meta.seo.title,
  description: meta.seo.description,
  path: meta.href,
});

export default function Page() {
  return (
    <CalculatorPage
      calculatorId="mehrwertsteuer"
      disclaimer="keiner"
      intro={
        <p>
          Steuer auf einen Nettopreis aufschlagen oder aus einem Bruttopreis
          herausrechnen – beides in einem Rechner. Der Steuersatz ist frei
          wählbar, weil er sich je nach Land und Warengruppe unterscheidet.
        </p>
      }
      calculator={<VatCalculator />}
      formula={
        <>
          <p>
            Wichtig ist, dass die beiden Richtungen{" "}
            <strong>nicht symmetrisch</strong> sind:
          </p>
          <div className="mt-4 space-y-2 rounded-lg border border-border bg-surface-muted/60 p-4 font-mono text-sm text-text">
            <p>Netto → Brutto: Brutto = Netto × (1 + Satz ÷ 100)</p>
            <p>Brutto → Netto: Netto = Brutto ÷ (1 + Satz ÷ 100)</p>
            <p>Steuerbetrag = Brutto − Netto</p>
          </div>
          <p>
            Beim Herausrechnen wird geteilt, nicht der Prozentsatz abgezogen.
            Das ist der häufigste Fehler in der Praxis: Von 119 € einfach
            19 Prozent abzuziehen ergibt 96,39 € – falsch. Richtig sind
            119 ÷ 1,19 = 100 €.
          </p>
          <p>
            Der Grund ist der Bezugswert. Die 19 Prozent beziehen sich auf den
            Nettobetrag, nicht auf den Bruttobetrag. Im Bruttopreis machen sie
            deshalb nur rund 15,97 Prozent aus.
          </p>
        </>
      }
      example={
        <>
          <p>
            <strong>Eine Handwerkerrechnung weist 1.190 € brutto aus. Wie viel
            davon ist Steuer?</strong>
          </p>
          <ol>
            <li>Netto: 1.190 ÷ 1,19 = <strong>1.000 €</strong></li>
            <li>Steuer: 1.190 − 1.000 = <strong>190 €</strong></li>
          </ol>
          <p>
            <strong>Umgekehrt:</strong> Ein Angebot lautet auf 2.500 € netto. Mit
            19 Prozent Umsatzsteuer sind das 2.500 × 1,19 = 2.975 € brutto, die
            Steuer beträgt 475 €.
          </p>
          <p>
            <strong>Und mit dem Schweizer Normalsatz von 8,1 Prozent:</strong>{" "}
            1.000 € netto ergeben 1.081 € brutto. Umgekehrt sind 1.081 € brutto
            wieder genau 1.000 € netto – der Rechner ist in beide Richtungen
            umkehrbar.
          </p>
        </>
      }
      interpretation={
        <>
          <p>
            Für <strong>Privatpersonen</strong> ist der Bruttobetrag der Preis,
            den man zahlt. Die Aufteilung interessiert höchstens, um Angebote
            zu vergleichen, bei denen eines netto und eines brutto ausgewiesen
            ist.
          </p>
          <p>
            Für <strong>Unternehmen</strong> ist der Nettobetrag die relevante
            Grösse: Wer vorsteuerabzugsberechtigt ist, bekommt die gezahlte
            Steuer vom Finanzamt zurück. Der Bruttobetrag ist dann nur ein
            durchlaufender Posten. Genau deshalb werden Preise im
            Geschäftsverkehr netto genannt und im Handel mit Privatkunden brutto.
          </p>
          <p>
            Welcher Satz gilt, hängt vom Land und von der Ware oder Leistung ab.
            Für Lebensmittel, Bücher und den öffentlichen Nahverkehr gelten
            vielerorts ermässigte Sätze, manche Leistungen sind ganz befreit.
            Der Rechner gibt bewusst keinen Satz vor – die Schnellauswahl nennt
            nur gebräuchliche Werte als Ausgangspunkt.
          </p>
        </>
      }
      limits={
        <>
          <ul>
            <li>
              <strong>Der Rechner weiss nicht, welcher Satz für dich gilt.</strong>{" "}
              Steuersätze werden vom Gesetzgeber festgelegt, unterscheiden sich
              nach Land und Warengruppe und ändern sich. Welcher Satz auf einen
              konkreten Vorgang anzuwenden ist, muss im Einzelfall geklärt
              werden.
            </li>
            <li>
              <strong>Keine Steuerberatung.</strong> Sonderfälle wie
              Kleinunternehmerregelung, Reverse-Charge bei
              grenzüberschreitenden Leistungen, innergemeinschaftliche
              Lieferungen oder Differenzbesteuerung bildet der Rechner nicht ab.
            </li>
            <li>
              <strong>Rundung auf zwei Nachkommastellen.</strong> Bei einer
              Rechnung mit vielen Positionen kann die Summe der einzeln
              gerundeten Steuerbeträge um wenige Cent von der Steuer auf die
              Gesamtsumme abweichen. Welche Methode gilt, regeln die jeweiligen
              steuerlichen Vorschriften.
            </li>
          </ul>
        </>
      }
      faq={[
        {
          question: "Heisst es Mehrwertsteuer oder Umsatzsteuer?",
          answer:
            "Gemeint ist dasselbe. „Umsatzsteuer“ ist der amtliche Begriff im deutschen Gesetz, „Mehrwertsteuer“ die im Alltag gebräuchliche Bezeichnung – und in der Schweiz auch die offizielle. Auf Rechnungen findest du beide Schreibweisen, oft abgekürzt als USt. oder MwSt.",
        },
        {
          question: "Wie viel Prozent des Bruttopreises sind die Steuer?",
          answer:
            "Bei 19 Prozent Steuersatz sind es rund 15,97 Prozent des Bruttopreises, bei 7 Prozent rund 6,54 Prozent. Der Grund ist der unterschiedliche Bezugswert: Der Steuersatz bezieht sich immer auf netto, nicht auf brutto.",
        },
        {
          question: "Warum darf ich nicht einfach 19 Prozent abziehen?",
          answer:
            "Weil sich die 19 Prozent auf den Nettobetrag beziehen, den du ja gerade erst suchst. Ziehst du sie vom Bruttobetrag ab, rechnest du mit dem falschen Bezugswert. Bei 119 € ergäbe das 96,39 € statt der korrekten 100 € – ein Fehler von über 3 Euro.",
        },
        {
          question: "Kann ich damit auch andere Länder rechnen?",
          answer:
            "Ja, der Steuersatz ist frei eingebbar, auch mit Nachkommastellen. Die Schnellauswahl enthält gebräuchliche Sätze für Deutschland, Österreich und die Schweiz. Für andere Länder trägst du den Satz einfach selbst ein.",
        },
      ]}
    />
  );
}
