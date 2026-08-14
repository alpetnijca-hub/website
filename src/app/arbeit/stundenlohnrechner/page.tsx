import type { Metadata } from "next";
import { CalculatorPage } from "@/components/layout/CalculatorPage";
import { HourlyWageCalculator } from "@/components/calculators/HourlyWageCalculator";
import { pageMetadata } from "@/lib/seo";
import { getCalculator } from "@/config/calculators";

const meta = getCalculator("stundenlohn")!;

export const metadata: Metadata = pageMetadata({
  title: meta.seo.title,
  description: meta.seo.description,
  path: meta.href,
});

export default function Page() {
  return (
    <CalculatorPage
      calculatorId="stundenlohn"
      disclaimer="keiner"
      intro={
        <p>
          Was verdienst du bei deinem Monatsgehalt eigentlich pro Stunde? Und
          umgekehrt: Auf welches Monatsgehalt läuft ein Stundenlohn hinaus? Der
          Rechner rechnet in beide Richtungen – mit der Umrechnung, die auch
          Lohnabrechnungen verwenden.
        </p>
      }
      calculator={<HourlyWageCalculator />}
      formula={
        <>
          <p>
            Der springende Punkt ist die Zahl der Arbeitsstunden im Monat. Sie
            wird nicht aus den Tagen des jeweiligen Monats berechnet – sonst
            hättest du im Februar einen anderen Stundenlohn als im März –,
            sondern aus dem Jahresdurchschnitt:
          </p>
          <div className="mt-4 space-y-2 rounded-lg border border-border bg-surface-muted/60 p-4 font-mono text-sm text-text">
            <p>Wochen je Monat = 52 ÷ 12 = 4,3333</p>
            <p>Stunden je Monat = Wochenstunden × 52 ÷ 12</p>
            <p>Stundenlohn = Jahresgehalt ÷ (Wochenstunden × 52)</p>
            <p>Jahresgehalt = Monatsgehalt × Zahl der Gehälter</p>
          </div>
          <p>
            Bei 40 Wochenstunden ergibt das <strong>173,33 Stunden im
            Monat</strong> und 2.080 Stunden im Jahr. Wer mit 160 Stunden
            rechnet – vier Wochen zu 40 Stunden –, kommt auf einen um rund
            8 Prozent zu hohen Stundenlohn.
          </p>
          <p>
            Ein <strong>13. oder 14. Monatsgehalt</strong> erhöht den
            Stundenlohn, ohne dass mehr gearbeitet wird: Die zusätzliche Zahlung
            verteilt sich auf dieselbe Zahl von Jahresstunden.
          </p>
        </>
      }
      example={
        <>
          <p>
            <strong>3.000 € brutto im Monat bei 40 Wochenstunden.</strong>
          </p>
          <ol>
            <li>Jahresgehalt: 3.000 × 12 = 36.000 €</li>
            <li>Jahresstunden: 40 × 52 = 2.080 Stunden</li>
            <li>
              Stundenlohn: 36.000 ÷ 2.080 = <strong>17,31 €</strong>
            </li>
          </ol>
          <p>
            <strong>Dieselbe Person mit einem 13. Monatsgehalt:</strong>{" "}
            39.000 ÷ 2.080 = 18,75 € pro Stunde. Das Weihnachtsgeld ist also
            gut 1,44 € Stundenlohn wert.
          </p>
          <p>
            <strong>Umgekehrt:</strong> 20 € Stundenlohn bei 40 Wochenstunden
            ergeben 20 × 2.080 = 41.600 € im Jahr, also 3.466,67 € im Monat.
          </p>
          <p>
            <strong>Teilzeit im Vergleich:</strong> 1.800 € bei 25 Wochenstunden
            sind 1.800 × 12 ÷ (25 × 52) = 16,62 € pro Stunde – weniger als die
            17,31 € der Vollzeitstelle oben, obwohl das Gehalt anteilig höher
            wirkt.
          </p>
        </>
      }
      interpretation={
        <>
          <p>
            Der Stundenlohn ist die einzige Grösse, mit der sich Stellen mit
            unterschiedlicher Arbeitszeit ehrlich vergleichen lassen. Ein
            Angebot über 3.200 € bei 42 Wochenstunden ist schlechter bezahlt als
            3.100 € bei 38 Stunden – 17,58 € gegenüber 18,83 € pro Stunde.
          </p>
          <p>
            <strong>Überstunden gehören in die Rechnung.</strong> Wer vertraglich
            40 Stunden hat, aber regelmässig 45 arbeitet, sollte mit 45 rechnen.
            Der tatsächliche Stundenlohn sinkt dann um gut 10 Prozent. Genau
            deshalb ist die Frage, ob Überstunden bezahlt oder mit dem Gehalt
            „abgegolten“ sind, mehr wert als manche Gehaltsverhandlung.
          </p>
          <p>
            <strong>Sonderzahlungen sind nicht sicher.</strong> Ein
            13. Monatsgehalt kann freiwillig, an Bedingungen geknüpft oder
            gekürzt sein, wenn man unterjährig ausscheidet. Für einen Vergleich
            zweier Angebote ist es sinnvoll, beide Varianten anzusehen: einmal
            mit und einmal ohne.
          </p>
        </>
      }
      limits={
        <>
          <ul>
            <li>
              <strong>Alles brutto.</strong> Was nach Steuern und
              Sozialabgaben bleibt, hängt von Steuerklasse, Kirchensteuer,
              Krankenkasse, Kinderfreibeträgen und Wohnort ab. Diese Werte
              ändern sich jährlich und unterscheiden sich zwischen Deutschland,
              Österreich und der Schweiz – der Rechner gibt sie deshalb bewusst
              nicht vor.
            </li>
            <li>
              <strong>Urlaub und Feiertage sind eingerechnet, nicht
              abgezogen.</strong> Die Rechnung verteilt das Gehalt auf die
              vertragliche Jahresarbeitszeit. Wer wissen will, was er je{" "}
              <em>tatsächlich gearbeiteter</em> Stunde verdient, muss Urlaubs-
              und Feiertage von den Jahresstunden abziehen – das erhöht den
              Stundenlohn deutlich.
            </li>
            <li>
              <strong>Zuschläge fehlen.</strong> Nacht-, Sonntags- und
              Feiertagszuschläge, Schichtzulagen, Provisionen und Boni bildet
              der Rechner nicht ab.
            </li>
            <li>
              <strong>Keine Mindestlohnprüfung.</strong> Ob der errechnete
              Stundenlohn einen gesetzlichen oder tariflichen Mindestlohn
              einhält, prüft der Rechner nicht – die Sätze ändern sich und
              unterscheiden sich nach Branche und Land.
            </li>
          </ul>
        </>
      }
      faq={[
        {
          question: "Warum 173,33 Stunden und nicht 160?",
          answer:
            "Weil ein Monat im Durchschnitt 4,3333 Wochen hat, nicht vier. Das Jahr hat 52 Wochen, verteilt auf 12 Monate. Mit 160 Stunden zu rechnen ergibt einen um rund 8 Prozent zu hohen Stundenlohn.",
        },
        {
          question: "Ist das Ergebnis brutto oder netto?",
          answer:
            "Brutto. Der Nettostundenlohn hängt von Steuerklasse, Krankenkasse, Kirchensteuer und weiteren persönlichen Merkmalen ab. Als Faustregel bleiben in Deutschland je nach Einkommen und Steuerklasse etwa 60 bis 75 Prozent übrig – belastbar ist nur die eigene Lohnabrechnung.",
        },
        {
          question: "Wie berücksichtige ich Überstunden?",
          answer:
            "Trag bei der Wochenarbeitszeit die Stunden ein, die du tatsächlich arbeitest, nicht die im Vertrag. Der Unterschied zeigt, was unbezahlte Mehrarbeit den Stundenlohn kostet.",
        },
        {
          question: "Wie rechne ich einen Stundenlohn in ein Jahresgehalt um?",
          answer:
            "Stundenlohn × Wochenstunden × 52. Bei 20 € und 40 Stunden sind das 41.600 € im Jahr. Stell dafür oben einfach die Rechenrichtung auf „Stundenlohn → Gehalt“ um.",
        },
        {
          question: "Zählt das Weihnachtsgeld zum Stundenlohn?",
          answer:
            "Wenn du wissen willst, was eine Stelle insgesamt einbringt: ja. Der Rechner verteilt 13 oder 14 Gehälter auf dieselben Jahresstunden. Für den Vergleich zweier Angebote ist es aber sinnvoll, auch die Variante ohne Sonderzahlung anzusehen – sie ist die verlässlichere Untergrenze.",
        },
      ]}
    />
  );
}
