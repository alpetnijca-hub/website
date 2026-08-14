import type { Metadata } from "next";
import Link from "next/link";
import { CategoryPage } from "@/components/layout/CategoryPage";
import { Section } from "@/components/layout/PageShell";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Rechner für Arbeit und Gehalt",
  description:
    "Stundenlohn aus dem Monatsgehalt, Arbeitszeit mit Pausen, Überstunden und Dezimalstunden für die Zeiterfassung – mit offengelegter Rechenweise.",
  path: "/arbeit",
});

export default function Page() {
  return (
    <CategoryPage
      slug="arbeit"
      intro="Was verdiene ich pro Stunde, und wie lange habe ich heute eigentlich gearbeitet? Zwei Fragen, bei denen sich schnell verrechnet, wer im Kopf überschlägt."
    >
      <Section title="Warum der Monat nicht 4 Wochen hat">
        <p>
          Der häufigste Fehler beim{" "}
          <Link href="/arbeit/stundenlohnrechner">Stundenlohn</Link> ist die
          Annahme, ein Monat habe vier Wochen. Bei 40 Wochenstunden wären das
          160 Stunden im Monat – tatsächlich sind es 173,33. Der Unterschied von
          gut 13 Stunden verschiebt den Stundenlohn um mehrere Prozent nach
          oben, und zwar immer zugunsten einer zu schönen Zahl.
        </p>
        <p>
          Richtig gerechnet wird über das Jahr: 52 Wochen geteilt durch
          12 Monate ergeben 4,3333 Wochen je Monat. Das ist auch die Rechnung,
          die Lohnabrechnungen zugrunde legen.
        </p>
      </Section>

      <Section title="Arbeitszeit ist nicht Anwesenheit">
        <p>
          Beim{" "}
          <Link href="/arbeit/arbeitszeit-rechner">Arbeitszeit-Rechner</Link>{" "}
          gilt derselbe Grundsatz: Pausen zählen nicht zur Arbeitszeit. Wer um
          8 Uhr kommt und um 17 Uhr geht, war neun Stunden da, hat aber bei
          einer halben Stunde Pause achteinhalb Stunden gearbeitet. Der Rechner
          gibt das Ergebnis zusätzlich in Dezimalstunden aus, weil
          Zeiterfassungssysteme genau das verlangen – 8,5 statt 8:30.
        </p>
      </Section>

      <Section title="Was hier nicht steht">
        <p>
          Wir rechnen ausschliesslich mit Bruttowerten. Ein
          Brutto-Netto-Rechner bräuchte Steuertabellen, Beitragsbemessungsgrenzen
          und Beitragssätze, die sich jedes Jahr ändern und für jedes Land
          anders aussehen. Solche Zahlen erfinden wir nicht und stellen sie auch
          nicht veraltet online – deshalb steht dieser Rechner weiter unter
          „Daran arbeiten wir“.
        </p>
        <p>
          Auch die Hinweise zum Arbeitszeitgesetz sind eine Rechenhilfe, keine
          Rechtsauskunft. Tarifverträge und Betriebsvereinbarungen können
          abweichende Regeln enthalten.
        </p>
      </Section>
    </CategoryPage>
  );
}
