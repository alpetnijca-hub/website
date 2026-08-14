import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, Section } from "@/components/layout/PageShell";
import { Callout } from "@/components/ui/Callout";
import { ConsentSettingsLink } from "@/components/consent/ConsentSettingsLink";
import { pageMetadata } from "@/lib/seo";
import { operatorAddress, site } from "@/config/site";

export const metadata: Metadata = pageMetadata({
  title: "Datenschutzerklärung",
  description: `Welche Daten ${site.name} verarbeitet und welche nicht. Alle Berechnungen laufen lokal im Browser, deine Eingaben werden nicht übertragen.`,
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
        und nicht gespeichert. Für Werbung fragen wir dich vorher um
        Einwilligung – ohne deine Zustimmung erfolgt keine personalisierte
        Werbung.
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
          Sicherheit des Betriebs, Beantwortung von Kontaktanfragen und
          Werbung – letztere auf Grundlage deiner Einwilligung. Eine eigene
          Webanalyse setzen wir derzeit nicht ein.
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
            Werbung und personalisierte Werbung. Die Einwilligung holen wir
            über die Consent-Plattform ein, und du kannst sie jederzeit
            widerrufen.
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
          Diese Website selbst legt genau einen Eintrag im lokalen Speicher
          deines Browsers ab:
        </p>
        <ul>
          <li>
            <code>rp_theme</code> – ob du das helle oder dunkle Design gewählt
            hast.
          </li>
        </ul>
        <p>
          Er wird <strong>nicht an einen Server übertragen</strong> und enthält
          keine Kennung, mit der sich eine Person identifizieren liesse. Du
          kannst ihn jederzeit über die Einstellungen deines Browsers löschen.
        </p>
        <p>
          Zusätzlich speichert die Consent-Plattform deine
          Einwilligungsentscheidung, damit du nicht bei jedem Besuch erneut
          gefragt wirst.
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
        <p>
          Eine Besonderheit gilt für den{" "}
          <Link href="/waehrungen/waehrungsrechner">Währungsrechner</Link>: Er
          braucht aktuelle Wechselkurse. Diese Kurstabelle wird{" "}
          <strong>von unserem Server</strong> bei der Europäischen Zentralbank
          abgerufen und in die Seite eingebaut, mehrmals täglich und unabhängig
          davon, ob und was jemand eingibt. Dein Browser nimmt dabei keine
          Verbindung zur EZB auf, es werden keine Daten über dich übermittelt,
          und die Umrechnung selbst läuft wie bei allen anderen Rechnern lokal
          auf deinem Gerät.
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
          Für Werbezwecke setzen wir sie nur mit deiner Einwilligung ein.
        </p>
        <p>
          Die Einwilligung wird über eine <strong>von Google zertifizierte
          Consent-Management-Plattform</strong> eingeholt. Sie erscheint beim
          ersten Besuch, bietet Zustimmung und Ablehnung als gleichwertig
          sichtbare Schaltflächen an und speichert deine Entscheidung, damit du
          nicht bei jedem Besuch erneut gefragt wirst. Über den Link
          „Cookie-Einstellungen“ im Footer lässt sich die Abfrage jederzeit
          erneut öffnen und die Einwilligung mit Wirkung für die Zukunft
          widerrufen.
        </p>
        <p>
          Die Plattform wird zusammen mit dem Werbeskript geladen. Das ist
          technisch notwendig, damit die Abfrage überhaupt angezeigt werden
          kann. Ohne deine Zustimmung erfolgt keine personalisierte Werbung und
          keine auf deinem Verhalten beruhende Auswertung.
        </p>
        <p>
          Unabhängig davon speichert diese Website einen einzigen eigenen
          Eintrag in deinem Browser: <code>rp_theme</code> für die Auswahl
          zwischen hellem und dunklem Design. Er wird nicht übertragen und
          enthält keine Kennung, mit der sich eine Person identifizieren liesse.
        </p>
        <p className="not-prose mt-4">
          <ConsentSettingsLink className="rounded-lg bg-brand px-5 py-3 font-semibold text-on-brand hover:bg-brand-strong">
            Cookie-Einstellungen öffnen
          </ConsentSettingsLink>
        </p>
      </Section>

      <Section title="Werbung">
        <p>
          Diese Website finanziert sich über Werbeanzeigen von Google AdSense,
          betrieben von Google Ireland Limited, Gordon House, Barrow Street,
          Dublin 4, Irland. Dabei kann der Anbieter Cookies setzen und deine
          IP-Adresse, Geräteinformationen sowie Angaben zu den aufgerufenen
          Seiten verarbeiten, um Anzeigen auszuliefern und deren Wirkung zu
          messen.
        </p>
        <p>
          Stimmst du personalisierter Werbung zu, kann der Anbieter Anzeigen
          auf Grundlage deines Nutzungsverhaltens auswählen. Lehnst du ab,
          erfolgt keine solche Auswertung; es können weiterhin nicht
          personalisierte Anzeigen erscheinen.
        </p>
        <p>
          Rechtsgrundlage für die einwilligungspflichtigen Verarbeitungen ist
          deine Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), die du jederzeit mit
          Wirkung für die Zukunft widerrufen kannst.
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
