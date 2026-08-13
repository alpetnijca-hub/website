import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, Section } from "@/components/layout/PageShell";
import { Callout } from "@/components/ui/Callout";
import { pageMetadata } from "@/lib/seo";
import { operatorAddress, site } from "@/config/site";

export const metadata: Metadata = pageMetadata({
  title: "Impressum",
  description: `Anbieterkennzeichnung und Kontaktangaben für ${site.name}.`,
  path: "/impressum",
});

export default function Page() {
  return (
    <PageShell title="Impressum" breadcrumbs={[{ name: "Impressum" }]}>
      <Section title="Verantwortlich für dieses Angebot">
        <p className="whitespace-pre-line">{operatorAddress}</p>
      </Section>

      <Section title="Kontakt">
        <p className="whitespace-pre-line">
          {`E-Mail: ${site.contactEmail}
Telefon: ${site.operator.phone}
Telegram: @${site.telegram}`}
        </p>
        <p className="mt-3">
          Für Fragen zur Website nutze am besten die{" "}
          <Link href="/kontakt">Kontaktseite</Link>. Wir beantworten keine
          individuellen Gesundheits- oder Finanzfragen.
        </p>
      </Section>

      <Section title="Verantwortlich für den Inhalt">
        <p className="whitespace-pre-line">{operatorAddress}</p>
      </Section>

      <Section title="Art des Angebots">
        <p>
          {site.name} ist ein privat betriebenes Informationsangebot mit
          kostenlosen Online-Rechnern. Die Website finanziert sich über
          Werbeanzeigen. Es werden keine Waren oder Dienstleistungen verkauft,
          keine Verträge geschlossen und keine Zahlungen entgegengenommen.
        </p>
      </Section>

      <Section title="Haftung für Inhalte">
        <p>
          Die Inhalte dieser Website werden mit Sorgfalt erstellt. Für die
          Richtigkeit, Vollständigkeit und Aktualität der Rechenergebnisse und
          Erklärungen können wir jedoch keine Gewähr übernehmen. Alle Rechner
          liefern rechnerische Schätzwerte auf Basis der jeweils angegebenen
          Formeln und ersetzen keine ärztliche, ernährungsberaterische,
          steuerliche oder finanzielle Beratung.
        </p>
        <p>
          Welche Formel einem Ergebnis zugrunde liegt und wo ihre Grenzen
          liegen, steht auf jeder Rechnerseite und zusammengefasst unter{" "}
          <Link href="/quellen-und-methoden">Quellen und Methoden</Link>.
        </p>
      </Section>

      <Section title="Haftung für Links">
        <p>
          Diese Website verweist an einzelnen Stellen auf externe Seiten, etwa
          auf wissenschaftliche Veröffentlichungen im Quellenverzeichnis. Auf
          deren Inhalte haben wir keinen Einfluss. Für die Inhalte verlinkter
          Seiten ist ausschliesslich deren Betreiber verantwortlich. Zum
          Zeitpunkt der Verlinkung waren keine rechtswidrigen Inhalte
          erkennbar. Wird uns eine Rechtsverletzung bekannt, entfernen wir den
          Link umgehend.
        </p>
      </Section>

      <Section title="Urheberrecht">
        <p>
          Die auf dieser Website erstellten Inhalte und Werke unterliegen dem
          Urheberrecht. Die Formeln selbst sind Allgemeingut beziehungsweise
          stammen aus den im Quellenverzeichnis genannten Veröffentlichungen –
          urheberrechtlich geschützt sind die Texte, die Gestaltung und die
          Umsetzung.
        </p>
      </Section>

      <Section title="Streitbeilegung">
        <p>
          Wir sind nicht bereit und nicht verpflichtet, an
          Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
          teilzunehmen.
        </p>
      </Section>

      <div className="mt-10">
        <Callout tone="info" title="Hinweis zum Stand dieser Seite">
          Die Angaben oben sind vollständig und aktuell. Ob im Einzelfall
          weitere Pflichtangaben erforderlich sind – etwa bei einer späteren
          gewerblichen Anmeldung, bei Umsatzsteuerpflicht oder bei einem
          Vertreter nach Art. 27 DSGVO – hängt von der weiteren Entwicklung des
          Angebots ab und sollte fachkundig geprüft werden.
        </Callout>
      </div>
    </PageShell>
  );
}
