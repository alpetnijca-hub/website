import type { Metadata } from "next";
import Link from "next/link";
import { CategoryPage } from "@/components/layout/CategoryPage";
import { Section } from "@/components/layout/PageShell";
import { FinanceDisclaimer } from "@/components/ui/Disclaimer";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Finanzrechner – Zinsen, Sparpläne und Kredite",
  description:
    "Zinseszins und Kreditraten berechnen, mit vollständigem Rechenweg und Jahresübersicht. Ohne Anmeldung, ohne Vermittlung, ohne versteckte Empfehlungen.",
  path: "/finanzen",
});

export default function Page() {
  return (
    <CategoryPage
      slug="finanzen"
      intro="Zinsen, Sparpläne und Kredite durchrechnen – mit offengelegter Formel und Jahr-für-Jahr-Übersicht. Wir vermitteln nichts und empfehlen kein Produkt."
    >
      <Section title="Womit anfangen?">
        <p>
          Die beiden Rechner hier beantworten gegensätzliche Fragen. Der{" "}
          <Link href="/finanzen/zinseszinsrechner">Zinseszinsrechner</Link> zeigt,
          wie Geld über die Jahre wächst, wenn du es anlegst. Der{" "}
          <Link href="/finanzen/kreditrechner">Kreditrechner</Link> zeigt
          dieselbe Mechanik aus der anderen Richtung: was Zinsen kosten, wenn du
          Geld leihst.
        </p>
        <p>
          Beide beruhen auf derselben mathematischen Grundlage. Und in beiden
          Fällen ist die Zeit der entscheidende Faktor – beim Sparen zu deinen
          Gunsten, beim Kredit zu deinen Lasten.
        </p>
      </Section>

      <Section title="Was wir hier nicht tun">
        <p>
          Wir nennen keine Zinssätze als Empfehlung, verlinken keine Anbieter
          und vermitteln keine Verträge. Alle Rechner arbeiten ausschliesslich
          mit den Werten, die du selbst eingibst. Wenn wir irgendwann
          Vergleichsangebote aufnehmen sollten, wird jede Vergütung offen
          gekennzeichnet.
        </p>
        <p>
          Was wir ebenfalls nicht tun: Renditen versprechen. Der
          Zinseszinsrechner zeigt dir, was bei einem angenommenen Zinssatz
          herauskäme – nicht, welcher Zinssatz realistisch ist. Diese Annahme
          triffst du selbst.
        </p>
      </Section>

      <div className="mt-8">
        <FinanceDisclaimer />
      </div>
    </CategoryPage>
  );
}
