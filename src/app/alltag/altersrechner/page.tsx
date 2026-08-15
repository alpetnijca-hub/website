import type { Metadata } from "next";
import { CalculatorPage } from "@/components/layout/CalculatorPage";
import { AgeCalculator } from "@/components/calculators/AgeCalculator";
import { pageMetadata } from "@/lib/seo";
import { getCalculator } from "@/config/calculators";

const meta = getCalculator("altersrechner")!;

export const metadata: Metadata = pageMetadata({
  title: meta.seo.title,
  description: meta.seo.description,
  path: meta.href,
});

export default function Page() {
  return (
    <CalculatorPage
      calculatorId="altersrechner"
      disclaimer="keiner"
      intro={
        <p>
          Geburtsdatum eingeben und das Alter auf Jahre, Monate und Tage genau
          ablesen – dazu die Zahl der gelebten Tage, der Wochentag der Geburt
          und die Tage bis zum nächsten Geburtstag.
        </p>
      }
      calculator={<AgeCalculator />}
      formula={
        <>
          <p>
            Das Alter wird so gezählt, wie es im Alltag und im Recht gilt: Man
            ist so viele Jahre alt, wie man volle Jahre gelebt hat. Am Tag vor
            dem Geburtstag ist man noch ein Jahr jünger.
          </p>
          <div className="mt-4 space-y-2 rounded-lg border border-border bg-surface-muted/60 p-4 font-mono text-sm text-text">
            <p>Jahre  = volle Jahrestage seit der Geburt</p>
            <p>Monate = volle Monate seit dem letzten Geburtstag</p>
            <p>Tage   = Tage seit dem letzten vollen Monat</p>
          </div>
          <p>
            Bewusst <strong>nicht</strong> gerechnet wird über eine Division:
            „Tage seit der Geburt geteilt durch 365,25“ klingt naheliegend,
            liegt aber je nach Geburtsdatum und Schaltjahren um bis zu einen Tag
            daneben – und produziert an Geburtstagen die falsche Zahl. Deshalb
            werden Kalendermonate schrittweise aufaddiert.
          </p>
        </>
      }
      example={
        <>
          <p>
            <strong>Geboren am 15. August 1990, Stichtag 15. August
            2026.</strong> Das Alter beträgt genau 36 Jahre, 0 Monate,
            0 Tage – es ist Geburtstag.
          </p>
          <p>
            <strong>Einen Tag früher, am 14. August 2026:</strong> 35 Jahre,
            11 Monate und 30 Tage. Die Person ist noch 35, obwohl der
            36. Geburtstag am nächsten Tag ansteht. Genau das ist der
            Unterschied zwischen „vollendetem“ und „laufendem“ Lebensjahr.
          </p>
          <p>
            <strong>Gelebte Tage:</strong> Wer am 1. Januar 2026 geboren wurde,
            hat am 15. August 2026 genau 226 Tage gelebt – das sind 32 volle
            Wochen und 5.424 Stunden.
          </p>
          <p>
            <strong>Der 29. Februar als Geburtstag:</strong> In
            Nicht-Schaltjahren gibt es diesen Tag nicht. Der Rechner setzt den
            Jahrestag dann auf den 28. Februar. Rechtlich wird das in
            Deutschland ähnlich gehandhabt – wer am 29. Februar geboren ist,
            wird in Nicht-Schaltjahren am 1. März volljährig, weil das Gesetz
            auf den Ablauf des Vortages abstellt.
          </p>
        </>
      }
      interpretation={
        <>
          <p>
            <strong>Der Stichtag ist frei wählbar.</strong> Voreingestellt ist
            heute, aber du kannst jedes Datum eintragen: um zu sehen, wie alt
            jemand an einem bestimmten Tag war oder sein wird – etwa zum
            Schuleintritt, zu einer Hochzeit oder zum Rentenbeginn.
          </p>
          <p>
            <strong>Jahre, Monate und Tage sind nicht ineinander
            umrechenbar.</strong> „36 Jahre und 5 Monate“ lassen sich nicht
            exakt in eine Tageszahl übersetzen, weil Monate 28 bis 31 Tage
            haben. Der Rechner gibt deshalb beides getrennt aus: die
            Kalenderaufteilung und die absolute Zahl gelebter Tage.
          </p>
          <p>
            <strong>Der Wochentag der Geburt</strong> ist eine der Angaben, die
            fast jeder mal wissen will und kaum jemand kennt. Er ergibt sich
            eindeutig aus dem Kalender.
          </p>
        </>
      }
      limits={
        <>
          <ul>
            <li>
              <strong>Keine Uhrzeit.</strong> Gerechnet wird in ganzen
              Kalendertagen. Wer auf die Stunde genau rechnen will, braucht die
              Geburtsuhrzeit – die spielt für die Altersangabe aber praktisch
              keine Rolle.
            </li>
            <li>
              <strong>Keine rechtliche Auskunft.</strong> Ob jemand
              geschäftsfähig, volljährig oder rentenberechtigt ist, richtet sich
              nach den jeweiligen Vorschriften und nicht nach dieser Zahl. Für
              die Volljährigkeit gilt in Deutschland § 187 Abs. 2 BGB, wonach
              der Tag der Geburt mitzählt.
            </li>
            <li>
              <strong>Keine Zeitzonen.</strong> Wer im Ausland geboren wurde,
              hat je nach Zeitzone rechnerisch einen anderen Kalendertag – der
              Rechner nimmt das eingegebene Datum, wie es dasteht.
            </li>
            <li>
              <strong>Gregorianischer Kalender.</strong> Für sehr weit
              zurückliegende Daten gilt derselbe Vorbehalt wie beim
              Datumsrechner.
            </li>
          </ul>
        </>
      }
      faq={[
        {
          question: "Wie berechnet man das Alter genau?",
          answer:
            "Man zählt die vollen Jahre seit der Geburt, dann die vollen Monate seit dem letzten Geburtstag und schliesslich die restlichen Tage. Eine Division durch 365 oder 365,25 führt dagegen zu Abweichungen, besonders rund um Geburtstage und Schaltjahre.",
        },
        {
          question: "Wie alt bin ich in Tagen?",
          answer:
            "Der Rechner zeigt es direkt an: die Zahl der Kalendertage zwischen Geburtsdatum und Stichtag, dazu die Umrechnung in Wochen und Stunden.",
        },
        {
          question: "Was ist mit Geburtstagen am 29. Februar?",
          answer:
            "In Jahren ohne 29. Februar setzt der Rechner den Jahrestag auf den 28. Februar. Das entspricht der üblichen Handhabung; für rechtliche Fristen ist im deutschen Recht der Ablauf des Vortages massgeblich, was auf den 1. März führen kann.",
        },
        {
          question: "Kann ich das Alter zu einem früheren Zeitpunkt berechnen?",
          answer:
            "Ja. Trag beim Stichtag einfach das gewünschte Datum ein, zum Beispiel den ersten Schultag oder ein Datum in der Zukunft. Das Geburtsdatum darf dabei nur nicht nach dem Stichtag liegen.",
        },
      ]}
    />
  );
}
