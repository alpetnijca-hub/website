import type { Metadata } from "next";
import { CalculatorPage } from "@/components/layout/CalculatorPage";
import { DateCalculator } from "@/components/calculators/DateCalculator";
import { pageMetadata } from "@/lib/seo";
import { getCalculator } from "@/config/calculators";

const meta = getCalculator("datumsrechner")!;

export const metadata: Metadata = pageMetadata({
  title: meta.seo.title,
  description: meta.seo.description,
  path: meta.href,
});

export default function Page() {
  return (
    <CalculatorPage
      calculatorId="datumsrechner"
      disclaimer="keiner"
      intro={
        <p>
          Wie viele Tage liegen zwischen zwei Daten, und auf welchen Tag fällt
          eine Frist? Beides in einem Rechner – mit Werktagen, Wochentag und
          korrekt behandelten Schaltjahren.
        </p>
      }
      calculator={<DateCalculator />}
      formula={
        <>
          <p>
            Die Rechnung selbst ist einfach: Beide Daten werden in Tage seit
            einem festen Bezugspunkt umgerechnet und voneinander abgezogen.
            Zwei Stellen sind trotzdem heikel.
          </p>
          <p>
            <strong>Erstens: Zählt der erste Tag mit?</strong> Vom 1. bis zum
            3. März sind es <em>zwei</em> Tage Abstand, aber <em>drei</em> Tage,
            wenn man beide Randtage mitzählt – so zählt man Urlaubstage oder
            eine Hotelübernachtung. Der Rechner gibt deshalb beide Zahlen aus.
          </p>
          <div className="mt-4 space-y-2 rounded-lg border border-border bg-surface-muted/60 p-4 font-mono text-sm text-text">
            <p>Abstand = Enddatum − Startdatum</p>
            <p>Beide Tage mitgezählt = Abstand + 1</p>
          </div>
          <p>
            <strong>Zweitens: die Sommerzeit.</strong> An den
            Umstellungswochenenden hat ein Tag in Ortszeit 23 oder 25 Stunden.
            Wer über Millisekunden rechnet, bekommt dort einen Tag zu viel oder
            zu wenig. Dieser Rechner arbeitet deshalb durchgehend in UTC, wo
            jeder Tag exakt 24 Stunden hat.
          </p>
          <p>
            Beim <strong>Verschieben um Monate</strong> gilt die übliche Regel:
            Ein Monat nach dem 31. Januar ist der 28. Februar, nicht der
            3. März. Gibt es den Tag im Zielmonat nicht, wird auf das Monatsende
            begrenzt.
          </p>
        </>
      }
      example={
        <>
          <p>
            <strong>Wie viele Tage hat das Jahr 2026?</strong> Vom 1. Januar bis
            zum 31. Dezember sind es 364 Tage Abstand – beide Tage mitgezählt
            365. 2026 ist kein Schaltjahr.
          </p>
          <p>
            <strong>Urlaub vom 3. bis 14. August.</strong> Der Abstand beträgt
            11 Tage, mitgezählt sind es 12 Urlaubstage. Werktage (Mo–Fr) sind es
            in diesem Zeitraum weniger – der Rechner zählt sie separat, weil für
            den Urlaubsantrag genau die zählen.
          </p>
          <p>
            <strong>Eine Zahlungsfrist von 30 Tagen ab dem 15. August
            2026</strong> endet am 14. September 2026, einem Montag. Der Rechner
            nennt den Wochentag mit, weil Fristen am Wochenende in der Praxis
            oft auf den nächsten Werktag rutschen.
          </p>
          <p>
            <strong>Schaltjahr:</strong> Vom 28. Februar 2024 bis zum 1. März
            2024 sind es zwei Tage, denn dazwischen liegt der 29. Februar. Im
            Jahr 2025 ist es nur ein Tag.
          </p>
        </>
      }
      interpretation={
        <>
          <p>
            <strong>Werktage sind nicht Arbeitstage.</strong> Der Rechner zählt
            Montag bis Freitag. Feiertage kennt er nicht – sie unterscheiden
            sich je nach Land und Bundesland und müssten jedes Jahr gepflegt
            werden. Für eine Urlaubsplanung musst du die gesetzlichen Feiertage
            deines Bundeslands also selbst abziehen.
          </p>
          <p>
            <strong>Fristen im Rechtssinn folgen eigenen Regeln.</strong> Nach
            deutschem Recht wird der Tag des Ereignisses in der Regel nicht
            mitgezählt, und fällt das Fristende auf einen Samstag, Sonntag oder
            Feiertag, endet die Frist erst am nächsten Werktag. Der Rechner
            liefert die Kalendertage – die rechtliche Bewertung nicht.
          </p>
          <p>
            <strong>Monate sind unterschiedlich lang.</strong> Deshalb gibt es
            die Aufteilung in Jahre, Monate und Tage zusätzlich zur reinen
            Tageszahl. „Drei Monate“ sind je nach Startdatum zwischen 89 und
            92 Tage.
          </p>
        </>
      }
      limits={
        <>
          <ul>
            <li>
              <strong>Keine Feiertage.</strong> Bewusst weggelassen, statt eine
              Liste zu zeigen, die nur für ein Bundesland und ein Jahr stimmt.
            </li>
            <li>
              <strong>Keine Rechtsberatung zu Fristen.</strong> Ob eine
              Kündigungs-, Widerrufs- oder Verjährungsfrist so zu berechnen ist,
              richtet sich nach den §§ 187 ff. BGB und dem jeweiligen Vertrag.
            </li>
            <li>
              <strong>Gregorianischer Kalender.</strong> Für Daten vor seiner
              Einführung im Jahr 1582 rechnet der Rechner ihn rückwärts weiter –
              historische Datumsangaben aus dieser Zeit stimmen damit nicht
              zwingend überein.
            </li>
            <li>
              <strong>Keine Uhrzeiten.</strong> Gerechnet wird in ganzen Tagen.
              Für Arbeitszeiten innerhalb eines Tages gibt es den
              Arbeitszeit-Rechner.
            </li>
          </ul>
        </>
      }
      faq={[
        {
          question: "Wie viele Tage sind es zwischen zwei Daten?",
          answer:
            "Der Rechner gibt zwei Zahlen aus: den Abstand (Enddatum minus Startdatum) und die Zahl mit beiden Randtagen. Für Urlaubstage und Hotelnächte ist meist die zweite gemeint, für Fristen die erste.",
        },
        {
          question: "Werden Feiertage berücksichtigt?",
          answer:
            "Nein. Die Werktagszählung umfasst Montag bis Freitag ohne Feiertage, weil diese sich je nach Bundesland und Kanton unterscheiden. Zieh die Feiertage deines Wohnorts selbst ab.",
        },
        {
          question: "Rechnet der Rechner Schaltjahre richtig?",
          answer:
            "Ja, einschliesslich der Ausnahmeregel: Durch 100 teilbare Jahre sind keine Schaltjahre, durch 400 teilbare aber doch. 1900 war kein Schaltjahr, 2000 schon.",
        },
        {
          question: "Was passiert bei „ein Monat nach dem 31. Januar“?",
          answer:
            "Das Ergebnis ist der 28. Februar, im Schaltjahr der 29. – der Tag wird auf das Monatsende begrenzt. Ohne diese Regel käme der 3. März heraus, was den meisten Erwartungen widerspricht.",
        },
      ]}
    />
  );
}
