import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, Section } from "@/components/layout/PageShell";
import { PlaceholderNotice } from "@/components/ui/Disclaimer";
import { ConsentSettingsLink } from "@/components/consent/ConsentSettingsLink";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/config/site";

export const metadata: Metadata = pageMetadata({
  title: "Datenschutzerklärung",
  description: `Wie ${site.name} mit Daten umgeht: Berechnungen laufen lokal im Browser, Werbe- und Analyseskripte erst nach Einwilligung.`,
  path: "/datenschutz",
  noIndex: true,
});

export default function Page() {
  return (
    <PageShell
      title="Datenschutzerklärung"
      breadcrumbs={[{ name: "Datenschutz" }]}
    >
      <PlaceholderNotice topic="Datenschutztext" />

      <Section title="Was technisch tatsächlich passiert">
        <p>
          Die folgenden Punkte beschreiben den technischen Stand dieser
          Installation. Sie sind kein fertiger Rechtstext, aber eine
          zuverlässige Grundlage für den, der ihn erstellt.
        </p>
        <ul>
          <li>
            <strong>Berechnungen laufen lokal.</strong> Alle Rechner arbeiten
            ausschliesslich in deinem Browser. Gewicht, Körpergrösse, Alter und
            alle weiteren Eingaben werden nicht an einen Server übertragen und
            nicht gespeichert.
          </li>
          <li>
            <strong>Keine Speicherung von Ergebnissen.</strong> Es werden weder
            Eingaben noch Ergebnisse dauerhaft im Browser abgelegt.
          </li>
          <li>
            <strong>Lokal gespeichert werden nur zwei Dinge:</strong> deine
            Cookie-Entscheidung (Schlüssel <code>rp_consent</code>) und deine
            Auswahl zwischen hellem und dunklem Design (<code>rp_theme</code>).
            Beides liegt im localStorage deines Browsers, wird nicht übertragen
            und lässt sich über die Browsereinstellungen löschen.
          </li>
          <li>
            <strong>Ohne Einwilligung keine Skripte Dritter.</strong> Werbe- und
            Analyseskripte werden erst nach deiner Zustimmung geladen. Lehnst du
            ab, findet kein Verbindungsaufbau zu Werbenetzwerken statt.
          </li>
          <li>
            <strong>Kontaktformular.</strong> Wenn du es nutzt, werden Name,
            E-Mail-Adresse, Betreff und Nachricht zur Verarbeitung an den Server
            übermittelt. [Hier muss ergänzt werden, wohin die Nachricht
            weitergeleitet wird und wie lange sie aufbewahrt wird.]
          </li>
          <li>
            <strong>Server-Logdateien.</strong> [Hier gehört hin, welche Daten
            dein Hosting-Anbieter protokolliert – etwa IP-Adresse, Zeitpunkt und
            abgerufene Seite – und wie lange.]
          </li>
        </ul>
      </Section>

      <Section title="Deine Einwilligung ändern">
        <p>
          Du kannst deine Entscheidung jederzeit anpassen oder vollständig
          widerrufen:
        </p>
        <p className="not-prose mt-3">
          <ConsentSettingsLink className="rounded-lg bg-brand px-5 py-3 font-semibold text-on-brand hover:bg-brand-strong">
            Cookie-Einstellungen öffnen
          </ConsentSettingsLink>
        </p>
        <p className="mt-3">
          Mehr dazu auf der Seite{" "}
          <Link href="/cookie-einstellungen">Cookie-Einstellungen</Link>.
        </p>
      </Section>

      <Section title="Was der fertige Text noch enthalten muss">
        <p>
          Die folgenden Abschnitte fehlen und müssen vor der Veröffentlichung
          ergänzt werden. Sie hängen davon ab, welche Dienste du tatsächlich
          einsetzt und wo du hostest:
        </p>
        <ul>
          <li>Name und Kontaktdaten des Verantwortlichen</li>
          <li>
            Rechtsgrundlagen der Verarbeitung (insbesondere Art. 6 Abs. 1 DSGVO)
          </li>
          <li>Hosting-Anbieter und Auftragsverarbeitungsvertrag</li>
          <li>
            Eingesetztes Werbenetzwerk mit Angaben zur Datenübermittlung, auch in
            Drittländer
          </li>
          <li>Eingesetzte Webanalyse, falls vorhanden</li>
          <li>Speicherdauer der jeweiligen Daten</li>
          <li>
            Betroffenenrechte: Auskunft, Berichtigung, Löschung, Einschränkung,
            Datenübertragbarkeit, Widerspruch und Beschwerderecht bei einer
            Aufsichtsbehörde
          </li>
          <li>Zuständige Datenschutz-Aufsichtsbehörde</li>
        </ul>
      </Section>

      <Section title="Wichtiger Hinweis zur Einwilligungslösung">
        <p>
          Das Cookie-Banner dieser Website ist eine Eigenentwicklung. Es setzt
          die technischen Anforderungen um – gleichwertige Schaltflächen, keine
          Vorauswahl optionaler Kategorien, Speicherung der Entscheidung mit
          Zeitstempel, jederzeitiger Widerruf und Vorbereitung des Google Consent
          Mode v2.
        </p>
        <p>
          <strong>
            Für den Betrieb von Google AdSense mit Nutzern aus dem Europäischen
            Wirtschaftsraum und dem Vereinigten Königreich verlangt Google
            zusätzlich eine von Google zertifizierte Consent-Management-Plattform.
          </strong>{" "}
          Die Eigenentwicklung erfüllt diese Anforderung nicht. Wie sich eine
          zertifizierte Lösung einbinden lässt, steht in der Datei{" "}
          <code>docs/CONSENT.md</code> im Projektverzeichnis.
        </p>
      </Section>
    </PageShell>
  );
}
