import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, Section } from "@/components/layout/PageShell";
import { Callout } from "@/components/ui/Callout";
import { ConsentSettingsLink } from "@/components/consent/ConsentSettingsLink";
import { pageMetadata } from "@/lib/seo";
import { operatorAddress, site } from "@/config/site";

export const metadata: Metadata = pageMetadata({
  title: "Datenschutzerklärung",
  description: `Welche Daten ${site.name} verarbeitet und welche nicht. Alle Berechnungen laufen lokal im Browser, Werbe- und Analyseskripte erst nach Einwilligung.`,
  path: "/datenschutz",
});

export default function Page() {
  return (
    <PageShell
      title="Datenschutzerklärung"
      intro="Diese Erklärung beschreibt, welche Daten bei der Nutzung dieser Website verarbeitet werden – und welche ausdrücklich nicht."
      breadcrumbs={[{ name: "Datenschutz" }]}
    >
      <Callout tone="info" title="Das Wichtigste vorweg">
        Alle Rechner auf dieser Website arbeiten ausschliesslich in deinem
        Browser. Gewicht, Körpergrösse, Alter, Einkommen, Kreditsummen und alle
        anderen Eingaben werden <strong>nicht an einen Server übertragen</strong>{" "}
        und nicht gespeichert. Ohne deine Einwilligung wird ausserdem kein
        Werbe- oder Analyseskript geladen.
      </Callout>

      <Section title="Verantwortliche Stelle">
        <p className="whitespace-pre-line">{operatorAddress}</p>
        <p className="mt-3 whitespace-pre-line">
          {`E-Mail: ${site.contactEmail}
Telefon: ${site.operator.phone}`}
        </p>
      </Section>

      <Section title="Übersicht der Verarbeitungen">
        <p>
          <strong>Verarbeitete Datenarten:</strong> Kontaktdaten (E-Mail-Adresse,
          Name bei Nutzung des Kontaktformulars), Inhaltsdaten (Text deiner
          Nachricht), Meta- und Kommunikationsdaten (IP-Adresse,
          Geräteinformationen, Zeitpunkt des Zugriffs), Nutzungsdaten (aufgerufene
          Seiten) – letztere nur, soweit du eingewilligt hast.
        </p>
        <p>
          <strong>Betroffene Personen:</strong> Nutzerinnen und Nutzer dieser
          Website sowie Personen, die uns kontaktieren.
        </p>
        <p>
          <strong>Zwecke:</strong> Bereitstellung des Onlineangebots,
          Sicherheit des Betriebs, Beantwortung von Kontaktanfragen,
          Reichweitenmessung und Werbung – die beiden letzten ausschliesslich
          auf Grundlage deiner Einwilligung.
        </p>
        <p>
          <strong>Nicht verarbeitet werden:</strong> Zahlungsdaten,
          Vertragsdaten, Gesundheitsdaten und Bewerber- oder Beschäftigtendaten.
          Es gibt auf dieser Website kein Nutzerkonto, keinen Bestellvorgang und
          keine Zahlungsfunktion.
        </p>
      </Section>

      <Section title="Rechtsgrundlagen">
        <p>
          Wir verarbeiten personenbezogene Daten auf Grundlage der
          Datenschutz-Grundverordnung (DSGVO). Da die verantwortliche Stelle
          ihren Sitz in der Schweiz hat, gilt ergänzend das revidierte
          Schweizer Datenschutzgesetz (revDSG).
        </p>
        <ul>
          <li>
            <strong>Einwilligung</strong> (Art. 6 Abs. 1 lit. a DSGVO) – für
            Statistik, Werbung und personalisierte Werbung. Diese Einwilligung
            holen wir über das Einwilligungsbanner ein und du kannst sie
            jederzeit widerrufen.
          </li>
          <li>
            <strong>Berechtigte Interessen</strong> (Art. 6 Abs. 1 lit. f
            DSGVO) – für den technisch sicheren Betrieb der Website,
            insbesondere für Server-Logdateien.
          </li>
          <li>
            <strong>Vorvertragliche Massnahmen</strong> beziehungsweise
            berechtigte Interessen (Art. 6 Abs. 1 lit. b und f DSGVO) – für die
            Beantwortung deiner Kontaktanfrage.
          </li>
        </ul>
      </Section>

      <Section title="Was lokal in deinem Browser gespeichert wird">
        <p>
          Zwei Angaben legt die Website im lokalen Speicher deines Browsers ab.
          Beide werden <strong>nicht an einen Server übertragen</strong> und
          enthalten keine Kennung, mit der sich eine Person identifizieren
          liesse:
        </p>
        <ul>
          <li>
            <code>rp_consent</code> – deine Cookie-Entscheidung mit Zeitstempel
            und Versionsnummer. Sie dient dem Nachweis der Einwilligung und
            verhindert, dass du bei jedem Besuch erneut gefragt wirst.
          </li>
          <li>
            <code>rp_theme</code> – ob du das helle oder dunkle Design gewählt
            hast.
          </li>
        </ul>
        <p>
          Beide Einträge kannst du jederzeit über die Einstellungen deines
          Browsers löschen. Danach erscheint das Einwilligungsbanner beim
          nächsten Besuch erneut.
        </p>
      </Section>

      <Section title="Berechnungen und Eingaben">
        <p>
          Sämtliche Rechner dieser Website führen ihre Berechnungen
          ausschliesslich lokal in deinem Browser aus. Deine Eingaben verlassen
          dein Gerät nicht, werden nicht protokolliert und nicht gespeichert –
          weder auf einem Server noch dauerhaft im Browser. Lädst du eine
          Rechnerseite neu, stehen die Felder wieder auf ihren Ausgangswerten.
        </p>
        <p>
          Das gilt ausdrücklich auch für Angaben, die sich auf deine Gesundheit
          beziehen könnten, etwa Gewicht, Körpergrösse oder Alter im
          BMI-Rechner. Wir erheben solche Daten nicht.
        </p>
      </Section>

      <Section title="Hosting und Server-Logdateien">
        <p>
          Diese Website wird bei einem externen Anbieter gehostet. Beim Aufruf
          einer Seite werden durch den Server automatisch Daten in sogenannten
          Logdateien erfasst, die dein Browser übermittelt: IP-Adresse,
          Zeitpunkt des Zugriffs, aufgerufene Adresse, übertragene Datenmenge,
          Browsertyp und Betriebssystem sowie die zuvor besuchte Seite.
        </p>
        <p>
          Diese Verarbeitung ist technisch erforderlich, um die Website
          auszuliefern, und dient der Betriebssicherheit. Rechtsgrundlage ist
          unser berechtigtes Interesse an einem stabilen und sicheren Betrieb
          (Art. 6 Abs. 1 lit. f DSGVO). Eine Zusammenführung dieser Daten mit
          anderen Datenquellen findet nicht statt.
        </p>
        <p>
          Mit dem Hosting-Anbieter besteht ein Vertrag zur Auftragsverarbeitung
          nach Art. 28 DSGVO. Die Speicherdauer der Logdateien richtet sich nach
          den Vorgaben des Anbieters.
        </p>
      </Section>

      <Section title="Cookies und Einwilligungsverwaltung">
        <p>
          Cookies sind kleine Dateien, die auf deinem Gerät gespeichert werden.
          Wir unterscheiden vier Kategorien:
        </p>
        <ul>
          <li>
            <strong>Notwendig</strong> – technisch erforderlich, etwa um deine
            Cookie-Entscheidung und die Designauswahl zu speichern. Nicht
            abwählbar, da ohne sie der Betrieb nicht möglich wäre.
          </li>
          <li>
            <strong>Statistik</strong> – Reichweitenmessung, um zu verstehen,
            welche Rechner genutzt werden. Nur mit deiner Einwilligung.
          </li>
          <li>
            <strong>Marketing</strong> – Ausspielung von Werbeanzeigen, über die
            sich diese Website finanziert. Nur mit deiner Einwilligung.
          </li>
          <li>
            <strong>Personalisierte Werbung</strong> – Auswahl von Anzeigen auf
            Basis deines Nutzungsverhaltens. Nur mit deiner Einwilligung.
            Lehnst du ab, können weiterhin nicht personalisierte Anzeigen
            erscheinen.
          </li>
        </ul>
        <p>
          Optionale Kategorien sind standardmässig deaktiviert und nicht
          vorausgewählt. Solange keine Einwilligung vorliegt, werden keine
          Skripte Dritter geladen – es findet also auch kein Verbindungsaufbau
          zu deren Servern statt.
        </p>
        <p className="not-prose mt-4">
          <ConsentSettingsLink className="rounded-lg bg-brand px-5 py-3 font-semibold text-on-brand hover:bg-brand-strong">
            Cookie-Einstellungen öffnen
          </ConsentSettingsLink>
        </p>
      </Section>

      <Section title="Werbung">
        <p>
          Diese Website finanziert sich über Werbeanzeigen. Wenn du in die
          Kategorie „Marketing“ einwilligst, wird das Skript des Werbenetzwerks
          geladen. Der Anbieter kann dabei Cookies setzen und deine IP-Adresse,
          Geräteinformationen sowie Angaben zu den aufgerufenen Seiten
          verarbeiten, um Anzeigen auszuliefern und deren Wirkung zu messen.
        </p>
        <p>
          Willigst du zusätzlich in personalisierte Werbung ein, kann der
          Anbieter Anzeigen auf Grundlage deines Nutzungsverhaltens auswählen.
          Ohne diese Einwilligung erfolgt keine solche Auswertung.
        </p>
        <p>
          Rechtsgrundlage ist in beiden Fällen ausschliesslich deine
          Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Du kannst sie jederzeit mit
          Wirkung für die Zukunft über die Cookie-Einstellungen widerrufen.
        </p>
      </Section>

      <Section title="Datenverarbeitung in Drittländern">
        <p>
          Der Werbeanbieter und gegebenenfalls der Hosting-Anbieter verarbeiten
          Daten teilweise ausserhalb der Europäischen Union, insbesondere in den
          Vereinigten Staaten. Eine solche Übermittlung erfolgt nur auf
          Grundlage der gesetzlichen Vorgaben, also bei Vorliegen eines
          Angemessenheitsbeschlusses, einer Zertifizierung nach dem
          EU-US Data Privacy Framework oder auf Basis von Standardvertrags­klauseln
          der EU-Kommission (Art. 44 bis 49 DSGVO).
        </p>
      </Section>

      <Section title="Kontaktaufnahme">
        <p>
          Wenn du uns über das Kontaktformular, per E-Mail oder über Telegram
          schreibst, verarbeiten wir die von dir angegebenen Daten, um deine
          Anfrage zu beantworten. Beim Kontaktformular sind das Name,
          E-Mail-Adresse, Betreff und der Text deiner Nachricht.
        </p>
        <p>
          Wir löschen Anfragen, sobald sie erledigt sind und keine gesetzlichen
          Aufbewahrungspflichten entgegenstehen. Bitte übermittle uns über diese
          Wege keine Gesundheitsdaten oder andere besonders schützenswerten
          Angaben – solche Nachrichten können wir nicht beantworten und löschen
          sie.
        </p>
        <p>
          Für die Kommunikation über Telegram gelten zusätzlich die
          Datenschutzbestimmungen des Anbieters Telegram. Auf dessen
          Datenverarbeitung haben wir keinen Einfluss.
        </p>
      </Section>

      <Section title="Sicherheitsmassnahmen">
        <p>
          Die Website wird ausschliesslich verschlüsselt ausgeliefert
          (TLS/HTTPS), erkennbar am Präfix <code>https://</code> in der
          Adresszeile deines Browsers. Darüber hinaus treffen wir dem Stand der
          Technik entsprechende Massnahmen, um die Vertraulichkeit, Integrität
          und Verfügbarkeit der Daten zu schützen.
        </p>
        <p>
          Der wirksamste Schutz ist dabei struktureller Natur: Daten, die gar
          nicht erst erhoben werden, können auch nicht verloren gehen. Deshalb
          laufen alle Berechnungen lokal und es gibt keine Nutzerkonten.
        </p>
      </Section>

      <Section title="Deine Rechte">
        <p>Dir stehen nach der DSGVO unter anderem folgende Rechte zu:</p>
        <ul>
          <li>Auskunft über die zu dir gespeicherten Daten (Art. 15)</li>
          <li>Berichtigung unrichtiger Daten (Art. 16)</li>
          <li>Löschung (Art. 17)</li>
          <li>Einschränkung der Verarbeitung (Art. 18)</li>
          <li>Datenübertragbarkeit (Art. 20)</li>
          <li>
            Widerspruch gegen Verarbeitungen auf Grundlage berechtigter
            Interessen (Art. 21)
          </li>
          <li>
            Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft
            (Art. 7 Abs. 3) – für Cookies direkt über die Cookie-Einstellungen
          </li>
          <li>
            Beschwerde bei einer Datenschutz-Aufsichtsbehörde (Art. 77). In der
            Schweiz ist dies der Eidgenössische Datenschutz- und
            Öffentlichkeitsbeauftragte (EDÖB).
          </li>
        </ul>
        <p>
          Für die Ausübung genügt eine formlose Nachricht an{" "}
          {site.contactEmail}.
        </p>
      </Section>

      <Section title="Änderungen dieser Erklärung">
        <p>
          Wir passen diese Datenschutzerklärung an, wenn sich die
          Datenverarbeitung ändert – etwa wenn ein Analysewerkzeug ergänzt oder
          das Werbenetzwerk gewechselt wird. Es gilt jeweils die auf dieser
          Seite veröffentlichte Fassung.
        </p>
        <p>
          Weitere Informationen dazu, wie diese Website arbeitet, findest du
          unter <Link href="/cookie-einstellungen">Cookie-Einstellungen</Link>{" "}
          und in den{" "}
          <Link href="/redaktionelle-richtlinien">
            redaktionellen Richtlinien
          </Link>
          .
        </p>
      </Section>
    </PageShell>
  );
}
