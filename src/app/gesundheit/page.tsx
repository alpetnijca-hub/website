import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, Section } from "@/components/layout/PageShell";
import { CalculatorCard } from "@/components/ui/Card";
import { AdSlot } from "@/components/ads/AdSlot";
import { HealthDisclaimer } from "@/components/ui/Disclaimer";
import { pageMetadata } from "@/lib/seo";
import { calculatorsByCategory } from "@/config/calculators";
import { getCategory } from "@/config/categories";

const category = getCategory("gesundheit")!;

export const metadata: Metadata = pageMetadata({
  title: "Gesundheit & Fitness – Rechner für Ernährung und Training",
  description:
    "Acht Rechner für Kalorienbedarf, BMI, Makronährstoffe, Eiweiss, Wasser und Kalorienverbrauch. Mit offengelegten Formeln und ehrlicher Einordnung der Ergebnisse.",
  path: category.href,
});

export default function Page() {
  const calculators = calculatorsByCategory("gesundheit").filter(
    (c) => c.status === "aktiv",
  );

  return (
    <PageShell
      title="Gesundheit & Fitness"
      intro="Rechner rund um Ernährung, Gewicht und Training. Alle Berechnungen laufen direkt in deinem Browser, und bei jedem Rechner steht offen, welche Formel dahintersteckt und wo ihre Grenzen liegen."
      breadcrumbs={[{ name: category.name }]}
      wide
    >
      <AdSlot placement="after-intro" />

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {calculators.map((calculator) => (
          <li key={calculator.id}>
            <CalculatorCard calculator={calculator} />
          </li>
        ))}
      </ul>

      <div className="mt-12 max-w-3xl">
        <Section title="Womit fange ich an?">
          <p>
            Wenn du dich zum ersten Mal mit deiner Ernährung beschäftigst, ist
            diese Reihenfolge sinnvoll:
          </p>
          <ol>
            <li>
              <Link href="/gesundheit/kalorienbedarf-rechner">
                Kalorienbedarf berechnen
              </Link>{" "}
              – das ist die Basis für alles Weitere. Du erfährst, wie viel
              Energie dein Körper in Ruhe und im Alltag verbraucht.
            </li>
            <li>
              <Link href="/gesundheit/makronaehrstoff-rechner">
                Makronährstoffe aufteilen
              </Link>{" "}
              – dein Kalorienziel in Gramm Eiweiss, Fett und Kohlenhydrate
              übersetzen.
            </li>
            <li>
              <Link href="/gesundheit/proteinbedarf-rechner">
                Proteinbedarf prüfen
              </Link>{" "}
              – die Eiweissmenge ist der Wert, den es sich am meisten lohnt zu
              treffen.
            </li>
            <li>
              Falls du abnehmen möchtest:{" "}
              <Link href="/gesundheit/kaloriendefizit-rechner">
                Kaloriendefizit festlegen
              </Link>{" "}
              – und dabei auf ein realistisches Tempo achten.
            </li>
          </ol>
          <p>
            Der <Link href="/gesundheit/bmi-rechner">BMI</Link> und das{" "}
            <Link href="/gesundheit/idealgewicht-rechner">Idealgewicht</Link>{" "}
            sind eher zur groben Einordnung gedacht. Sie sagen dir, wo du im
            Vergleich zu einer Klassifikation stehst – aber wenig darüber, was
            zu tun ist.
          </p>
        </Section>

        <Section title="Wie verlässlich sind diese Rechner?">
          <p>
            Alle hier verwendeten Formeln sind veröffentlicht und in der
            Fachliteratur etabliert. Trotzdem gilt für jede einzelne: Sie wurde
            an Gruppen entwickelt und beschreibt einen Durchschnitt. Für eine
            konkrete Person kann das Ergebnis merklich danebenliegen – beim
            Kalorienbedarf sind Abweichungen von rund zehn Prozent nach oben oder
            unten keine Seltenheit.
          </p>
          <p>
            Wir schreiben das bei jedem Rechner in einem eigenen Abschnitt
            „Grenzen dieser Berechnung“ dazu, statt es zu verschweigen. Welche
            Quellen wir verwenden und wie wir arbeiten, steht auf der Seite{" "}
            <Link href="/quellen-und-methoden">Quellen und Methoden</Link>.
          </p>
        </Section>

        <AdSlot placement="in-content" />

        <div className="mt-8">
          <HealthDisclaimer />
        </div>
      </div>
    </PageShell>
  );
}
