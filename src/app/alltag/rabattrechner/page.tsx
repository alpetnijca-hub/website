import type { Metadata } from "next";
import { CalculatorPage } from "@/components/layout/CalculatorPage";
import { DiscountCalculator } from "@/components/calculators/DiscountCalculator";
import { pageMetadata } from "@/lib/seo";
import { getCalculator } from "@/config/calculators";

const meta = getCalculator("rabatt")!;

export const metadata: Metadata = pageMetadata({
  title: meta.seo.title,
  description: meta.seo.description,
  path: meta.href,
});

export default function Page() {
  return (
    <CalculatorPage
      calculatorId="rabatt"
      disclaimer="keiner"
      intro={
        <p>
          Wie viel kostet der Artikel nach Abzug des Rabatts, wie viel sparst du
          wirklich – und stimmt der beworbene Prozentsatz überhaupt? Der Rechner
          beantwortet alle drei Fragen, auch rückwärts.
        </p>
      }
      calculator={<DiscountCalculator />}
      formula={
        <>
          <p>Rabatt ist Prozentrechnung mit drei möglichen Unbekannten:</p>
          <div className="mt-4 space-y-2 rounded-lg border border-border bg-surface-muted/60 p-4 font-mono text-sm text-text">
            <p>Endpreis = Originalpreis × (1 − Rabatt ÷ 100)</p>
            <p>Ersparnis = Originalpreis − Endpreis</p>
            <p>Rabatt in % = Ersparnis ÷ Originalpreis × 100</p>
            <p>Originalpreis = Endpreis ÷ (1 − Rabatt ÷ 100)</p>
          </div>
          <p>
            Bei <strong>zwei Rabatten nacheinander</strong> werden die
            Prozentsätze nicht addiert, sondern die Restfaktoren multipliziert:
          </p>
          <div className="mt-4 space-y-2 rounded-lg border border-border bg-surface-muted/60 p-4 font-mono text-sm text-text">
            <p>Gesamtrabatt = 1 − (1 − r₁ ÷ 100) × (1 − r₂ ÷ 100)</p>
          </div>
          <p>
            Der Grund: Der zweite Rabatt wird vom bereits reduzierten Preis
            abgezogen, nicht vom ursprünglichen. Er wirkt deshalb auf eine
            kleinere Grundlage.
          </p>
        </>
      }
      example={
        <>
          <p>
            <strong>
              Eine Jacke kostet 199 €, im Schlussverkauf gibt es 25 Prozent.
            </strong>
          </p>
          <ol>
            <li>Endpreis: 199 × 0,75 = <strong>149,25 €</strong></li>
            <li>Ersparnis: 199 − 149,25 = <strong>49,75 €</strong></li>
          </ol>
          <p>
            <strong>Rückwärts:</strong> Im Schaufenster stehen 149,25 € neben
            durchgestrichenen 199 €. Der Rabatt beträgt 49,75 ÷ 199 × 100 =
            25 Prozent – die Auszeichnung stimmt also.
          </p>
          <p>
            <strong>Zwei Rabatte:</strong> 20 Prozent Sale und an der Kasse noch
            einmal 10 Prozent mit einem Gutschein. Zusammen sind das nicht
            30 Prozent, sondern 1 − 0,8 × 0,9 = 0,28, also{" "}
            <strong>28 Prozent</strong>. Aus 199 € werden so 143,28 € statt der
            erwarteten 139,30 €.
          </p>
        </>
      }
      interpretation={
        <>
          <p>
            Die <strong>Ersparnis in Euro</strong> ist die ehrlichere Zahl als
            der Prozentsatz. 70 Prozent auf ein Teil für 20 € sind 14 € –
            10 Prozent auf ein Möbelstück für 800 € sind 80 €. Der grössere
            Prozentsatz ist nicht automatisch das bessere Geschäft.
          </p>
          <p>
            Der <strong>Originalpreis</strong> ist die Grösse, bei der sich am
            meisten schummeln lässt. Rechtlich muss sich ein durchgestrichener
            Preis in vielen Fällen am niedrigsten Preis der letzten 30 Tage
            orientieren; ob das im Einzelfall eingehalten wird, kann ein Rechner
            nicht prüfen. Er zeigt nur, was aus den genannten Zahlen folgt.
          </p>
          <p>
            Bei <strong>gestaffelten Aktionen</strong> lohnt der Blick auf den
            kombinierten Satz. Werbung, die „20 % + 10 % extra“ nebeneinander
            stellt, meint 28 Prozent. Das ist kein Betrug, aber es liest sich
            grösser, als es ist.
          </p>
        </>
      }
      limits={
        <>
          <ul>
            <li>
              <strong>Der Rechner prüft keine Preise.</strong> Ob der genannte
              Originalpreis jemals verlangt wurde, kann er nicht wissen. Er
              rechnet mit den Zahlen, die du eingibst.
            </li>
            <li>
              <strong>Keine Rechtsauskunft.</strong> Zur Frage, wie
              Preisermässigungen ausgewiesen werden müssen – etwa nach der
              Preisangabenverordnung –, macht der Rechner keine Aussage.
            </li>
            <li>
              <strong>Rundung auf zwei Nachkommastellen.</strong> Bei mehreren
              Artikeln kann die Summe der einzeln gerundeten Endpreise um wenige
              Cent von der Rabattierung der Gesamtsumme abweichen.
            </li>
            <li>
              <strong>Steuer ist nicht enthalten.</strong> Der Rabatt wird auf
              den eingegebenen Betrag gerechnet, gleich ob dieser brutto oder
              netto ist. Für die Umrechnung dazwischen gibt es den
              Mehrwertsteuer-Rechner.
            </li>
          </ul>
        </>
      }
      faq={[
        {
          question: "Warum sind 20 % und 10 % zusammen nicht 30 %?",
          answer:
            "Weil der zweite Rabatt vom schon reduzierten Preis abgezogen wird. Nach 20 Prozent sind noch 80 Prozent des Preises übrig, davon 10 Prozent sind nur 8 Prozent des ursprünglichen Preises. Zusammen also 28 Prozent.",
        },
        {
          question: "Wie rechne ich vom reduzierten Preis auf den Originalpreis zurück?",
          answer:
            "Durch Division statt Multiplikation: Originalpreis = Endpreis ÷ (1 − Rabatt ÷ 100). Bei 149,25 € und 25 Prozent Rabatt sind das 149,25 ÷ 0,75 = 199 €. Den Rabatt einfach draufzurechnen ergibt einen zu niedrigen Wert.",
        },
        {
          question: "Wird der Rabatt vor oder nach der Mehrwertsteuer abgezogen?",
          answer:
            "Bei Endkundenpreisen ist die Steuer bereits im Preis enthalten, der Rabatt gilt für den Bruttopreis und die Steuer verringert sich anteilig mit. Im Geschäftsverkehr wird der Rabatt üblicherweise vom Nettobetrag abgezogen und die Steuer danach auf den reduzierten Betrag berechnet. Das Ergebnis ist in beiden Fällen dasselbe.",
        },
        {
          question: "Was bedeutet ein Rabatt von 100 Prozent?",
          answer:
            "Der Artikel ist kostenlos, der Endpreis beträgt 0 €. Rückwärts lässt sich daraus allerdings kein Originalpreis mehr bestimmen – jeder beliebige Preis führt bei 100 Prozent Rabatt zu 0 €. Der Rechner weist in diesem Fall darauf hin, statt eine Zahl zu erfinden.",
        },
      ]}
    />
  );
}
