import type { Metadata } from "next";
import { CalculatorPage } from "@/components/layout/CalculatorPage";
import { CurrencyCalculator } from "@/components/calculators/CurrencyCalculator";
import { Callout } from "@/components/ui/Callout";
import { pageMetadata } from "@/lib/seo";
import { getCalculator } from "@/config/calculators";
import { getExchangeRates } from "@/lib/exchangeRates";

const meta = getCalculator("waehrungsrechner")!;

export const metadata: Metadata = pageMetadata({
  title: meta.seo.title,
  description: meta.seo.description,
  path: meta.href,
});

/**
 * Die Seite wird alle sechs Stunden neu erzeugt, damit die Kurse aktuell
 * bleiben. Next.js liest diesen Wert beim Bauen aus dem Quelltext – er muss
 * deshalb als Zahl dastehen und kann nicht aus einer Konstanten kommen.
 * Er entspricht RATES_REVALIDATE_SECONDS in `src/lib/exchangeRates.ts`.
 */
export const revalidate = 21600;

export default async function Page() {
  const snapshot = await getExchangeRates();

  return (
    <CalculatorPage
      calculatorId="waehrungsrechner"
      disclaimer="finanzen"
      sources={["ecb"]}
      intro={
        <p>
          Euro, Dollar, Franken und 28 weitere Währungen umrechnen – auf
          Grundlage der Referenzkurse, die die Europäische Zentralbank an jedem
          Geschäftstag veröffentlicht.
        </p>
      }
      calculator={
        snapshot ? (
          <CurrencyCalculator rates={snapshot.rates} date={snapshot.date} />
        ) : (
          <Callout tone="warnung" title="Kurse gerade nicht verfügbar">
            Die Kursdaten der Europäischen Zentralbank liessen sich im Moment
            nicht abrufen. Wir zeigen an dieser Stelle bewusst keine
            gespeicherten alten Kurse an, weil sie irreführend wären. Bitte
            versuch es in ein paar Minuten noch einmal.
          </Callout>
        )
      }
      formula={
        <>
          <p>
            Die EZB veröffentlicht zu jeder Währung, wie viele Einheiten einem
            Euro entsprechen. Daraus ergibt sich die Umrechnung:
          </p>
          <div className="mt-4 space-y-2 rounded-lg border border-border bg-surface-muted/60 p-4 font-mono text-sm text-text">
            <p>Euro → Fremdwährung: Betrag × Kurs</p>
            <p>Fremdwährung → Euro: Betrag ÷ Kurs</p>
            <p>Kurs(A → B) = Kurs(EUR → B) ÷ Kurs(EUR → A)</p>
          </div>
          <p>
            Die dritte Zeile ist der <strong>Kreuzkurs</strong>. Zwischen zwei
            Fremdwährungen gibt es in der EZB-Tabelle keinen direkten Kurs – er
            wird über den Euro als Zwischenschritt gebildet.
          </p>
        </>
      }
      example={
        <>
          <p>
            <strong>Angenommen, 1 Euro entspricht 1,1534 US-Dollar und
            0,9373 Schweizer Franken.</strong> Die tatsächlichen Kurse im
            Rechner oben stammen vom jeweils letzten Veröffentlichungstag; die
            Zahlen hier dienen nur dazu, die Rechnung zu zeigen.
          </p>
          <ol>
            <li>
              <strong>250 € in Dollar:</strong> 250 × 1,1534 = 288,35 USD
            </li>
            <li>
              <strong>500 USD in Euro:</strong> 500 ÷ 1,1534 = 433,50 €
            </li>
            <li>
              <strong>100 USD in Franken</strong> (Kreuzkurs): 0,9373 ÷ 1,1534 =
              0,8126 → 100 × 0,8126 = 81,26 CHF
            </li>
          </ol>
          <p>
            <strong>Was der Kurs im Alltag bedeutet:</strong> Wechselt eine Bank
            zum Kurs 1,10 statt 1,1534 Dollar je Euro, bekommst du für 1.000 €
            nur 1.100 statt 1.153 Dollar. Die Differenz von 53 Dollar ist die
            Marge – rund 4,6 Prozent, obwohl von „gebührenfrei“ die Rede sein
            kann.
          </p>
        </>
      }
      interpretation={
        <>
          <p>
            Der Referenzkurs der EZB ist ein <strong>Messwert, kein
            Angebot</strong>. Er wird an Geschäftstagen gegen 16 Uhr
            mitteleuropäischer Zeit auf Basis einer Abstimmung der Zentralbanken
            festgestellt und dient vor allem als Massstab – etwa für
            Buchhaltung, Steuererklärungen und Verträge.
          </p>
          <p>
            <strong>Zum Wechseln bekommst du diesen Kurs nicht.</strong> Banken,
            Wechselstuben und Kartenanbieter arbeiten mit einer Spanne zwischen
            An- und Verkauf. Sie liegt bei Direktbanken und
            Kreditkartenzahlungen häufig unter einem Prozent, an
            Flughafenschaltern nicht selten über zehn. Der Referenzkurs ist die
            Zahl, an der du das nachrechnen kannst: Vergleich den angebotenen
            Kurs mit dem hier gezeigten, und du kennst den Aufschlag.
          </p>
          <p>
            <strong>Kurse schwanken laufend.</strong> Der angezeigte Wert ist ein
            Tagesstand, keine Momentaufnahme des Devisenmarkts. Zwischen zwei
            Veröffentlichungen kann sich der Marktkurs um mehrere Zehntelprozent
            bewegen, in unruhigen Phasen deutlich mehr.
          </p>
        </>
      }
      limits={
        <>
          <ul>
            <li>
              <strong>Keine Live-Kurse.</strong> Angezeigt wird der zuletzt von
              der EZB veröffentlichte Referenzkurs mit dem Datum, zu dem er
              gehört. An Wochenenden und Feiertagen ist das der Stand des
              letzten Geschäftstags.
            </li>
            <li>
              <strong>Kein Handelskurs.</strong> Für Devisenhandel,
              Unternehmensabschlüsse zu einem bestimmten Stichtag oder
              Absicherungsgeschäfte sind diese Zahlen nicht die richtige
              Grundlage.
            </li>
            <li>
              <strong>Nur die Währungen der EZB-Tabelle.</strong> Enthalten sind
              rund 30 Währungen. Wer eine andere braucht, muss über eine
              Zwischenwährung rechnen oder eine andere Quelle nutzen.
            </li>
            <li>
              <strong>Keine Gebühren, keine Bargeldkurse.</strong> Aufschläge,
              Fremdwährungsgebühren und der Unterschied zwischen Bargeld und
              Kartenzahlung sind nicht enthalten.
            </li>
            <li>
              <strong>Keine Anlageberatung.</strong> Aus einem Kursstand lässt
              sich nicht ableiten, ob ein Zeitpunkt zum Wechseln günstig ist.
            </li>
          </ul>
        </>
      }
      faq={[
        {
          question: "Woher stammen die Kurse?",
          answer:
            "Von der Europäischen Zentralbank, aus der Datei der täglichen Euro-Referenzkurse. Sie wird an jedem TARGET-Geschäftstag gegen 16 Uhr MEZ aktualisiert. Unser Server holt sie mehrmals täglich; das Datum der Kursfeststellung steht immer im Ergebnis.",
        },
        {
          question: "Bekomme ich diesen Kurs bei meiner Bank?",
          answer:
            "Nein. Der Referenzkurs ist ein statistischer Massstab, kein handelbarer Preis. Jeder Anbieter schlägt eine Spanne auf. Genau dafür ist dieser Rechner nützlich: Er zeigt dir, wie weit ein Angebot vom amtlichen Kurs abweicht.",
        },
        {
          question: "Warum ändern sich die Kurse am Wochenende nicht?",
          answer:
            "Weil die EZB nur an Geschäftstagen veröffentlicht. Am Samstag und Sonntag siehst du deshalb den Stand vom Freitag. Der Devisenmarkt selbst ruht am Wochenende ebenfalls weitgehend.",
        },
        {
          question: "Werden meine Eingaben übertragen?",
          answer:
            "Nein. Die Umrechnung selbst findet in deinem Browser statt. Nur die Kurstabelle wird von unserem Server bei der EZB geholt – das geschieht unabhängig davon, ob und was du eingibst, und die EZB erfährt nichts über dich.",
        },
        {
          question: "Was ist ein Kreuzkurs?",
          answer:
            "Der Kurs zwischen zwei Währungen, die beide nicht der Euro sind. Er wird aus den beiden Euro-Kursen gebildet: Kurs(USD → CHF) = Kurs(EUR → CHF) ÷ Kurs(EUR → USD). Im Devisenhandel kann der direkt gehandelte Kurs davon leicht abweichen.",
        },
      ]}
    />
  );
}
