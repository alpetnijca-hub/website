import type { Metadata } from "next";
import { CalculatorPage } from "@/components/layout/CalculatorPage";
import { LoanCalculator } from "@/components/calculators/LoanCalculator";
import { pageMetadata } from "@/lib/seo";
import { getCalculator } from "@/config/calculators";

const meta = getCalculator("kredit")!;

export const metadata: Metadata = pageMetadata({
  title: meta.seo.title,
  description: meta.seo.description,
  path: meta.href,
});

export default function Page() {
  return (
    <CalculatorPage
      calculatorId="kredit"
      disclaimer="finanzen"
      intro={
        <p>
          Beim Annuitätendarlehen – der üblichen Form bei Immobilien- und
          Ratenkrediten – bleibt die monatliche Rate gleich, aber ihre
          Zusammensetzung verschiebt sich. Dieser Rechner zeigt dir die Rate,
          den Verlauf über die Zinsbindung und die Restschuld, die danach
          übrig bleibt.
        </p>
      }
      calculator={<LoanCalculator />}
      formula={
        <>
          <p>
            Die Rate ergibt sich aus Zinssatz und anfänglicher Tilgung – beide
            beziehen sich auf die volle Darlehenssumme:
          </p>
          <div className="mt-4 rounded-lg border border-border bg-surface-muted/60 p-4 font-mono text-sm text-text">
            <p>Rate = Darlehen × (Zinssatz + Tilgungssatz) ÷ 100 ÷ 12</p>
          </div>
          <p>Monat für Monat gilt dann:</p>
          <div className="mt-3 space-y-2 rounded-lg border border-border bg-surface-muted/60 p-4 font-mono text-sm text-text">
            <p>Zinsanteil = Restschuld × Jahreszins ÷ 100 ÷ 12</p>
            <p>Tilgungsanteil = Rate − Zinsanteil</p>
            <p>Neue Restschuld = Restschuld − Tilgungsanteil</p>
          </div>
          <p>
            Der Trick des Annuitätendarlehens steckt in der dritten Zeile: Weil
            die Restschuld sinkt, sinkt auch der Zinsanteil – und da die Rate
            gleich bleibt, steigt der Tilgungsanteil automatisch. Die Tilgung
            beschleunigt sich also von selbst.
          </p>
        </>
      }
      example={
        <>
          <p>
            <strong>300.000 € Darlehen, 3,5 Prozent Sollzins, 2 Prozent
            anfängliche Tilgung, 10 Jahre Zinsbindung.</strong>
          </p>
          <ol>
            <li>
              Rate: 300.000 × 5,5 % ÷ 12 = <strong>1.375 € im Monat</strong>
            </li>
            <li>Zins im ersten Monat: 300.000 × 3,5 % ÷ 12 = 875 €</li>
            <li>Tilgung im ersten Monat: 1.375 − 875 = 500 €</li>
            <li>Restschuld nach Monat 1: 299.500 €</li>
          </ol>
          <p>
            Im 120. Monat sieht dasselbe Bild schon anders aus: Der Zinsanteil
            ist auf rund 715 € gefallen, der Tilgungsanteil auf etwa 660 €
            gestiegen. Nach zehn Jahren sind rund 71.500 € getilgt, es bleiben
            etwa 228.500 € Restschuld – und gezahlt wurden in dieser Zeit rund
            93.500 € Zinsen.
          </p>
          <p>
            Bei gleichbleibendem Zins wäre das Darlehen nach ungefähr 26 Jahren
            vollständig abbezahlt.
          </p>
        </>
      }
      interpretation={
        <>
          <p>
            Der Wert, den die meisten unterschätzen, ist die{" "}
            <strong>Restschuld nach der Zinsbindung</strong>. Nach zehn Jahren
            mit zwei Prozent Anfangstilgung sind erst rund ein Viertel des
            Darlehens getilgt. Für den Rest brauchst du eine
            Anschlussfinanzierung – zu Zinsen, die heute niemand kennt. Steigt
            der Zins bis dahin deutlich, steigt auch deine Rate.
          </p>
          <p>
            Die <strong>Tilgungshöhe</strong> ist der wirksamste Hebel. Eine
            Erhöhung von 2 auf 3 Prozent verkürzt die Gesamtlaufzeit bei
            3,5 Prozent Zins von etwa 26 auf rund 20 Jahre und spart einen
            erheblichen Teil der Zinsen – bei einer um 250 € höheren Monatsrate.
          </p>
          <p>
            Beachte den Unterschied zwischen <strong>Sollzins</strong> und{" "}
            <strong>Effektivzins</strong>. Dieser Rechner arbeitet mit dem
            Sollzins, also dem reinen Zins auf die Darlehenssumme. Der
            Effektivzins enthält zusätzlich bestimmte Nebenkosten und liegt
            deshalb höher. Für den Vergleich zweier Angebote ist der
            Effektivzins die richtige Grösse.
          </p>
        </>
      }
      limits={
        <>
          <ul>
            <li>
              <strong>Nebenkosten fehlen vollständig.</strong> Bei einer
              Immobilie kommen Grunderwerbsteuer, Notar, Grundbuch und
              gegebenenfalls Maklerprovision hinzu – zusammen je nach Bundesland
              ein deutlicher Prozentsatz des Kaufpreises, der zusätzlich
              finanziert oder aus Eigenkapital gezahlt werden muss.
            </li>
            <li>
              <strong>Sondertilgungen sind nicht abgebildet.</strong> Die meisten
              Verträge erlauben jährliche Sondertilgungen, die die Laufzeit
              spürbar verkürzen. Der Rechner geht von gleichbleibenden Raten aus.
            </li>
            <li>
              <strong>Der Zins gilt nur für die Zinsbindung.</strong> Die
              angegebene Gesamtlaufzeit unterstellt, dass der Zins danach
              unverändert bleibt. Das ist eine Rechenannahme, keine Prognose.
            </li>
            <li>
              <strong>Keine Bereitstellungszinsen, keine Gebühren.</strong>{" "}
              Kontoführung, Schätzkosten und Bereitstellungszinsen bei
              verzögerter Auszahlung bleiben aussen vor.
            </li>
            <li>
              <strong>Kein Angebotsvergleich.</strong> Die Zahlen hier ersetzen
              keine verbindliche Finanzierungsberechnung deiner Bank.
            </li>
          </ul>
        </>
      }
      faq={[
        {
          question: "Was bedeutet „anfängliche Tilgung“?",
          answer:
            "Der Prozentsatz der Darlehenssumme, den du im ersten Jahr tilgst. Bei 300.000 € und 2 Prozent sind das 6.000 € im ersten Jahr. Das Wort „anfänglich“ ist wichtig: Weil der Zinsanteil mit sinkender Restschuld fällt, steigt der tatsächliche Tilgungsanteil jedes Jahr an.",
        },
        {
          question: "Welche Tilgung sollte ich wählen?",
          answer:
            "Als Orientierung gelten 2 bis 3 Prozent, bei niedrigen Zinsen eher mehr. Eine sinnvolle Gegenprobe: Das Darlehen sollte vor dem Renteneintritt abbezahlt sein. Zeigt der Rechner eine Gesamtlaufzeit, die darüber hinausgeht, ist die Tilgung zu niedrig angesetzt.",
        },
        {
          question: "Warum zahle ich am Anfang fast nur Zinsen?",
          answer:
            "Weil sich die Zinsen auf die Restschuld beziehen, und die ist am Anfang am höchsten. Bei 3,5 Prozent Zins und 2 Prozent Tilgung entfallen im ersten Monat rund 64 Prozent der Rate auf Zinsen. Dieses Verhältnis dreht sich im Lauf der Zeit um.",
        },
        {
          question: "Was ist der Unterschied zu einem Ratenkredit?",
          answer:
            "Bei einem klassischen Ratenkredit wird die Laufzeit vorgegeben und die Rate daraus berechnet. Beim Annuitätendarlehen gibst du die Tilgung vor, und die Laufzeit ergibt sich. Rechnerisch ist beides dieselbe Formel, nur nach einer anderen Grösse aufgelöst.",
        },
        {
          question: "Kann ich damit einen Autokredit rechnen?",
          answer:
            "Ja, wenn du die Zinsbindung auf die Kreditlaufzeit setzt und eine Tilgung wählst, bei der die Restschuld am Ende bei null liegt. Der Rechner zeigt dir dann Rate und Zinskosten. Beachte aber, dass Autokredite oft eine Schlussrate haben – die bildet dieser Rechner nicht ab.",
        },
      ]}
    />
  );
}
