import type { Metadata } from "next";
import Link from "next/link";
import { CategoryPage } from "@/components/layout/CategoryPage";
import { Section } from "@/components/layout/PageShell";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Alltagsrechner – Sprit, Strom und Mehrwertsteuer",
  description:
    "Spritkosten einer Fahrt, Stromkosten eines Geräts und Mehrwertsteuer hin oder zurück – die Rechnungen, die im Alltag ständig anfallen.",
  path: "/alltag",
});

export default function Page() {
  return (
    <CategoryPage
      slug="alltag"
      intro="Die kleinen Rechnungen, die im Alltag ständig anfallen: Was kostet die Fahrt, was kostet das Gerät, wie viel davon ist Steuer."
    >
      <Section title="Kleine Beträge, die sich summieren">
        <p>
          Die Rechner hier haben eines gemeinsam: Einzeln geht es meist um
          wenige Euro, über ein Jahr gerechnet um dreistellige Beträge. Der{" "}
          <Link href="/alltag/stromkosten-rechner">Stromkosten-Rechner</Link>{" "}
          zeigt das besonders deutlich – ein Gerät, das für sieben Cent pro
          Nutzung läuft, kostet über das Jahr schnell hundert Euro.
        </p>
        <p>
          Ähnlich beim{" "}
          <Link href="/alltag/spritkosten-rechner">Spritkosten-Rechner</Link>:
          Der Weg zur Arbeit kostet pro Tag vielleicht vier Euro. Auf 220
          Arbeitstage gerechnet sind das fast neunhundert – allein an Sprit,
          ohne Wertverlust und Wartung.
        </p>
      </Section>

      <Section title="Rechnen statt schätzen">
        <p>
          Bei allen drei Rechnern gilt: Die Eingabewerte solltest du aus deinen
          eigenen Unterlagen nehmen, nicht aus dem Gedächtnis. Den Strompreis
          findest du auf der Jahresabrechnung, den echten Spritverbrauch über die
          Tankquittungen. Mit geschätzten Eingaben wird auch das Ergebnis nur
          eine Schätzung.
        </p>
      </Section>
    </CategoryPage>
  );
}
