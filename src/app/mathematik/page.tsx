import type { Metadata } from "next";
import Link from "next/link";
import { CategoryPage } from "@/components/layout/CategoryPage";
import { Section } from "@/components/layout/PageShell";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Mathematik-Rechner – Prozent und Dreisatz",
  description:
    "Prozentrechnung in allen vier Varianten, mit ausgeschriebenem Rechenweg. Für Schule, Beruf und Alltag.",
  path: "/mathematik",
});

export default function Page() {
  return (
    <CategoryPage
      slug="mathematik"
      intro="Die Rechenarten, die man im Alltag ständig braucht und trotzdem regelmässig durcheinanderbringt. Mit ausgeschriebenem Rechenweg, damit du die Logik dahinter siehst."
    >
      <Section title="Warum der Rechenweg mit angezeigt wird">
        <p>
          Ein Ergebnis allein hilft beim nächsten Mal nicht weiter. Der{" "}
          <Link href="/mathematik/prozentrechner">Prozentrechner</Link> zeigt
          deshalb jeden Schritt einzeln – wer das zwei- oder dreimal sieht, kann
          die Rechnung anschliessend selbst im Kopf machen.
        </p>
        <p>
          Besonders lohnt sich das bei der prozentualen Veränderung. Dass sich
          eine Erhöhung um 25 Prozent nicht durch eine Senkung um 25 Prozent
          rückgängig machen lässt, überrascht viele – bis man sieht, dass die
          beiden Rechnungen unterschiedliche Bezugswerte haben.
        </p>
      </Section>
    </CategoryPage>
  );
}
