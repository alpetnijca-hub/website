import type { Metadata } from "next";
import Link from "next/link";
import { CategoryPage } from "@/components/layout/CategoryPage";
import { Section } from "@/components/layout/PageShell";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Währungsrechner",
  description:
    "Währungen umrechnen mit den amtlichen Euro-Referenzkursen der Europäischen Zentralbank – ohne Anmeldung und mit klarer Angabe, von welchem Tag die Kurse stammen.",
  path: "/waehrungen",
});

export default function Page() {
  return (
    <CategoryPage
      slug="waehrungen"
      intro="Umrechnen mit den Referenzkursen der Europäischen Zentralbank – der Grundlage, auf die sich auch Behörden und Buchhaltungen stützen."
    >
      <Section title="Referenzkurs statt Handelskurs">
        <p>
          Der{" "}
          <Link href="/waehrungen/waehrungsrechner">Währungsrechner</Link>{" "}
          verwendet die Euro-Referenzkurse der EZB. Sie werden an jedem
          Geschäftstag gegen 16 Uhr veröffentlicht und beschreiben die Lage am
          Devisenmarkt zu diesem Zeitpunkt.
        </p>
        <p>
          Das ist ausdrücklich kein Kurs, zu dem man Geld wechseln kann. Banken,
          Wechselstuben und Kartenanbieter schlagen eine Spanne auf, die je nach
          Anbieter zwischen wenigen Zehntelprozent und mehreren Prozent liegt.
          Der Referenzkurs ist der Massstab, an dem sich messen lässt, wie teuer
          ein Angebot wirklich ist.
        </p>
      </Section>

      <Section title="Woher die Kurse kommen">
        <p>
          Die Kurse werden auf unserem Server von der EZB geholt und mehrmals
          täglich aufgefrischt. Dein Browser nimmt dabei keine Verbindung zur
          EZB auf, und es wird nichts über dich übermittelt. Auf der
          Rechnerseite steht immer, von welchem Tag die angezeigten Kurse
          stammen.
        </p>
      </Section>
    </CategoryPage>
  );
}
