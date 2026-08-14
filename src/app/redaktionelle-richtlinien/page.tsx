import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, Section } from "@/components/layout/PageShell";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/config/site";

export const metadata: Metadata = pageMetadata({
  title: "Redaktionelle Richtlinien",
  description: `Nach welchen Grundsätzen die Inhalte auf ${site.name} entstehen, wie wir mit Quellen umgehen und wie Werbung vom Inhalt getrennt bleibt.`,
  path: "/redaktionelle-richtlinien",
});

export default function Page() {
  return (
    <PageShell
      title="Redaktionelle Richtlinien"
      intro={`Diese Grundsätze gelten für alle Inhalte auf ${site.name}. Sie sind keine Marketingaussage, sondern die Regeln, an denen wir uns beim Schreiben tatsächlich orientieren.`}
      breadcrumbs={[{ name: "Redaktionelle Richtlinien" }]}
    >
      <Section title="1. Nachvollziehbarkeit vor Kürze">
        <p>
          Jeder Rechner nennt die verwendete Formel, ein durchgerechnetes
          Beispiel und die Quelle. Wer will, soll das Ergebnis mit Papier und
          Stift nachrechnen können. Wir verzichten bewusst darauf, Formeln als
          Betriebsgeheimnis zu behandeln.
        </p>
      </Section>

      <Section title="2. Grenzen werden genannt, nicht versteckt">
        <p>
          Jede Rechnerseite hat einen eigenen Abschnitt darüber, was die
          Berechnung nicht leisten kann und für welche Personengruppen sie nicht
          geeignet ist. Diesen Abschnitt kürzen wir nicht, auch wenn er dem
          Eindruck von Präzision schadet.
        </p>
      </Section>

      <Section title="3. Keine Heilversprechen">
        <p>
          Wir behaupten nicht, dass ein Rechner Krankheiten erkennt, vorbeugt
          oder heilt. Wir geben keine Empfehlungen zu Medikamenten,
          Nahrungsergänzungsmitteln oder Therapien. Formulierungen, die eine
          medizinische Wirkung nahelegen, vermeiden wir.
        </p>
      </Section>

      <Section title="4. Keine erfundenen Belege und keine erfundenen Autoren">
        <p>
          Wir geben keine Studien an, die eine Aussage nicht wirklich stützen,
          und erfinden keine Zahlen, um einen Text glaubwürdiger wirken zu
          lassen. Es gibt auf dieser Website keine ausgedachten Expertenprofile,
          keine erfundenen Bewertungen und keine Testimonials.
        </p>
        <p>
          Aus demselben Grund verwenden wir bei den strukturierten Daten für
          Suchmaschinen nur Auszeichnungen, die zum Inhalt passen – also
          Breadcrumbs und häufige Fragen. Bewertungs- oder Autoren-Markup setzen
          wir nicht ein, weil es hier nichts zu bewerten gibt.
        </p>
      </Section>

      <Section title="5. Werbung bleibt vom Inhalt getrennt">
        <p>
          Werbeflächen sind als „Anzeige“ gekennzeichnet und optisch klar vom
          redaktionellen Text abgesetzt. Sie stehen nie vor dem eigentlichen
          Rechner und nie so, dass sie den Inhalt verdecken. Kein Werbepartner
          nimmt Einfluss darauf, was in einem Text steht.
        </p>
        <p>
          Vor der Auslieferung von Werbung fragen wir dich um Einwilligung.
          Lehnst du ab, erhältst du keine personalisierte Werbung – und alle
          Rechner funktionieren unverändert vollständig.
        </p>
      </Section>

      <Section title="6. Sprache, die verständlich bleibt">
        <p>
          Wir schreiben für Leute, die eine Antwort brauchen, nicht für
          Fachpublikum. Fachbegriffe erklären wir beim ersten Auftreten. Texte
          werden nicht künstlich verlängert, um mehr Werbefläche unterzubringen,
          und Suchbegriffe nicht wiederholt, um Suchmaschinen zu gefallen.
        </p>
      </Section>

      <Section title="7. Fehler werden korrigiert">
        <p>
          Wir machen Fehler. Wenn du einen findest – ob in einer Formel, einer
          Quellenangabe oder einer Erklärung – melde ihn uns über die{" "}
          <Link href="/kontakt">Kontaktseite</Link>. Nachweisbare Fehler
          korrigieren wir, ohne dass es lange Diskussionen braucht.
        </p>
      </Section>

      <Section title="8. Was wir bewusst nicht tun">
        <ul>
          <li>Keine Newsletter-Popups, die den Inhalt blockieren.</li>
          <li>
            Keine Schaltflächen, die anders aussehen, als sie sich verhalten.
          </li>
          <li>Keine automatischen Weiterleitungen auf fremde Seiten.</li>
          <li>Keine Anmeldepflicht für Funktionen, die auch ohne gehen.</li>
          <li>
            Keine Speicherung deiner Eingaben – weder auf einem Server noch
            dauerhaft in deinem Browser.
          </li>
        </ul>
      </Section>
    </PageShell>
  );
}
