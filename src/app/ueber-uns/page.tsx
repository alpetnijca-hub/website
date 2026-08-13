import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, Section } from "@/components/layout/PageShell";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/config/site";
import { activeCalculators } from "@/config/calculators";

export const metadata: Metadata = pageMetadata({
  title: "Über uns",
  description: `Wer hinter ${site.name} steckt, wie die Rechner entstehen und wie sich die Website finanziert.`,
  path: "/ueber-uns",
});

export default function Page() {
  return (
    <PageShell
      title={`Über ${site.name}`}
      intro="Eine Website mit Rechnern, die tun, was sie sollen – ohne Anmeldung, ohne Datensammeln und mit offengelegten Formeln."
      breadcrumbs={[{ name: "Über uns" }]}
    >
      <Section title="Warum es diese Seite gibt">
        <p>
          Die meisten Online-Rechner geben eine Zahl aus und lassen einen damit
          allein. Woher der Wert kommt, welche Formel dahintersteckt und wie
          genau er überhaupt ist – dazu steht selten etwas Brauchbares.
        </p>
        <p>
          {site.name} macht es andersherum. Bei jedem Rechner steht die Formel
          da, ein durchgerechnetes Beispiel dazu und ein eigener Abschnitt
          darüber, wo die Berechnung an ihre Grenzen stösst. Wer verstehen will,
          wie ein Ergebnis zustande kommt, soll das nachlesen können.
        </p>
      </Section>

      <Section title="Wie die Inhalte entstehen">
        <p>
          Für jeden Rechner suchen wir die Originalquelle der Formel heraus –
          also die Veröffentlichung, in der sie zuerst beschrieben wurde – und
          nennen sie im Quellenverzeichnis der jeweiligen Seite. Die Rechenlogik
          ist vom Rest der Website getrennt und mit automatisierten Tests
          abgesichert, damit sich beim Weiterentwickeln keine Fehler einschleichen.
        </p>
        <p>
          Ausführlicher steht das in unseren{" "}
          <Link href="/redaktionelle-richtlinien">
            redaktionellen Richtlinien
          </Link>{" "}
          und auf der Seite{" "}
          <Link href="/quellen-und-methoden">Quellen und Methoden</Link>.
        </p>
      </Section>

      <Section title="Was wir nicht sind">
        <p>
          Wir sind keine medizinische Einrichtung und geben keine
          Gesundheitsberatung. Die Rechner liefern rechnerische Schätzwerte auf
          Basis veröffentlichter Formeln – nicht mehr. Sie ersetzen keine
          ärztliche Abklärung, stellen keine Diagnose und sind nicht dafür
          gedacht, Erkrankungen zu behandeln.
        </p>
        <p>
          Deshalb findest du auf dieser Seite auch keine Heilversprechen, keine
          erfundenen Erfolgsgeschichten und keine ausgedachten Expertenprofile.
          Wo wir uns auf Fachliteratur beziehen, nennen wir sie beim Namen.
        </p>
      </Section>

      <Section title="Deine Daten">
        <p>
          Alle Berechnungen laufen ausschliesslich in deinem Browser. Gewicht,
          Grösse, Alter und alle anderen Eingaben werden nicht an einen Server
          übertragen und nicht gespeichert. Lädst du eine Rechnerseite neu, sind
          die Felder wieder auf ihren Ausgangswerten.
        </p>
        <p>
          Wir haben uns bewusst dagegen entschieden, eingegebene Werte auch nur
          lokal zu speichern. Der Komfortgewinn wäre gering, und es handelt sich
          um Angaben, die niemanden etwas angehen. Details stehen in der{" "}
          <Link href="/datenschutz">Datenschutzerklärung</Link>.
        </p>
      </Section>

      <Section title="Wie sich die Seite finanziert">
        <p>
          Über Werbung. Auf den Seiten sind Werbeflächen eingeplant, die als
          „Anzeige“ gekennzeichnet sind. Werbe- und Analyseskripte werden erst
          geladen, nachdem du im Cookie-Banner zugestimmt hast – lehnst du ab,
          bleiben die Flächen leer und alle Rechner funktionieren trotzdem
          vollständig.
        </p>
        <p>
          Es gibt keine Bezahlschranke, kein Abonnement und keine Funktionen, die
          hinter einer Anmeldung liegen. Alle {activeCalculators().length}{" "}
          Rechner sind für alle nutzbar.
        </p>
      </Section>

      <Section title="Kontakt">
        <p>
          Fehler gefunden oder einen Rechner-Wunsch? Über die{" "}
          <Link href="/kontakt">Kontaktseite</Link> erreichst du uns – am
          schnellsten per Telegram. Hinweise auf Rechenfehler oder
          missverständliche Formulierungen sind ausdrücklich willkommen.
        </p>
      </Section>
    </PageShell>
  );
}
