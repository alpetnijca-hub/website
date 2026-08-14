import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, Section } from "@/components/layout/PageShell";
import { ConsentSettingsLink } from "@/components/consent/ConsentSettingsLink";
import { Callout } from "@/components/ui/Callout";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Cookie-Einstellungen",
  description:
    "Deine Einwilligung in Werbe-Cookies einsehen, ändern oder widerrufen. Übersicht darüber, was ohne Zustimmung passiert und was nicht.",
  path: "/cookie-einstellungen",
});

export default function Page() {
  return (
    <PageShell
      title="Cookie-Einstellungen"
      intro="Hier kannst du deine Einwilligung jederzeit ändern oder vollständig widerrufen."
      breadcrumbs={[{ name: "Cookie-Einstellungen" }]}
    >
      <p className="not-prose">
        <ConsentSettingsLink className="rounded-lg bg-brand px-5 py-3 font-semibold text-on-brand hover:bg-brand-strong">
          Einwilligung ändern oder widerrufen
        </ConsentSettingsLink>
      </p>

      <Section title="Wer die Abfrage stellt">
        <p>
          Die Einwilligungsabfrage stammt von einer zertifizierten
          Consent-Management-Plattform unseres Werbepartners Google. Sie
          erscheint beim ersten Besuch und fragt, ob deine Daten für Werbung
          verwendet werden dürfen.
        </p>
        <p>
          Über die Schaltfläche oben öffnest du dieselbe Abfrage erneut. Deine
          bisherige Auswahl ist dort vorbelegt, und du kannst sie beliebig oft
          ändern. Ein Widerruf wirkt für die Zukunft – Daten, die während einer
          früheren Sitzung bereits verarbeitet wurden, lassen sich damit nicht
          rückwirkend zurückholen.
        </p>
      </Section>

      <Section title="Was ohne deine Zustimmung passiert">
        <p>
          Kurz gesagt: fast nichts. <strong>Alle Rechner funktionieren
          vollständig</strong>, sämtliche Texte sind lesbar, es gibt keine
          Funktion, die hinter einer Zustimmung liegt.
        </p>
        <p>
          Deine Eingaben in den Rechnern – Gewicht, Körpergrösse, Einkommen,
          Kreditsummen – werden ohnehin nie übertragen. Sie werden ausschliesslich
          in deinem Browser verarbeitet, unabhängig davon, was du im
          Cookie-Dialog wählst.
        </p>
        <p>
          Lehnst du ab, werden dir keine personalisierten Anzeigen ausgespielt.
          Es können weiterhin nicht personalisierte Anzeigen erscheinen – also
          Werbung, die sich nicht an deinem Verhalten orientiert.
        </p>
      </Section>

      <Section title="Was diese Website selbst speichert">
        <p>
          Unabhängig von der Werbe-Einwilligung legt die Seite genau einen
          Eintrag im lokalen Speicher deines Browsers ab:
        </p>
        <ul>
          <li>
            <code>rp_theme</code> – ob du das helle oder das dunkle Design
            gewählt hast.
          </li>
        </ul>
        <p>
          Dieser Eintrag wird nicht übertragen und enthält keine Kennung, mit
          der sich eine Person identifizieren liesse. Du kannst ihn jederzeit
          über die Einstellungen deines Browsers löschen.
        </p>
      </Section>

      <Section title="Wenn sich die Abfrage nicht öffnen lässt">
        <p>
          Die Schaltfläche oben braucht das Skript unseres Werbepartners. Wenn
          du einen Werbeblocker verwendest, wird es blockiert und die Abfrage
          kann nicht erscheinen. In dem Fall lässt sich deine Einwilligung
          zurücksetzen, indem du im Browser die Cookies und Website-Daten für
          diese Seite löschst.
        </p>
      </Section>

      <div className="mt-10">
        <Callout tone="info" title="Mehr zum Umgang mit Daten">
          Welche Daten überhaupt anfallen und auf welcher Rechtsgrundlage,
          steht in der{" "}
          <Link href="/datenschutz">Datenschutzerklärung</Link>.
        </Callout>
      </div>
    </PageShell>
  );
}
