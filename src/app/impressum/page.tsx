import type { Metadata } from "next";
import { PageShell, Section } from "@/components/layout/PageShell";
import { PlaceholderNotice } from "@/components/ui/Disclaimer";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/config/site";

export const metadata: Metadata = pageMetadata({
  title: "Impressum",
  description: `Anbieterkennzeichnung von ${site.name}.`,
  path: "/impressum",
  // Solange die Angaben Platzhalter sind, gehört die Seite nicht in den Index.
  noIndex: true,
});

export default function Page() {
  return (
    <PageShell
      title="Impressum"
      breadcrumbs={[{ name: "Impressum" }]}
    >
      <PlaceholderNotice topic="Impressumstext" />

      <Section title="Angaben gemäss § 5 DDG">
        <p className="whitespace-pre-line">
          {`[Vor- und Nachname bzw. Firmenname]
[Strasse und Hausnummer]
[Postleitzahl und Ort]
[Land]`}
        </p>
      </Section>

      <Section title="Kontakt">
        <p className="whitespace-pre-line">
          {`E-Mail: ${site.contactEmail}
Telegram: @${site.telegram}
Telefon: [optional, falls vorhanden]`}
        </p>
      </Section>

      <Section title="Vertreten durch">
        <p>[Bei juristischen Personen: vertretungsberechtigte Person]</p>
      </Section>

      <Section title="Registereintrag">
        <p className="whitespace-pre-line">
          {`[Falls vorhanden: Registergericht und Registernummer]
[Falls vorhanden: Umsatzsteuer-Identifikationsnummer gemäss § 27 a UStG]`}
        </p>
      </Section>

      <Section title="Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV">
        <p className="whitespace-pre-line">
          {`[Name]
[Anschrift]`}
        </p>
      </Section>

      <Section title="Streitschlichtung">
        <p>
          [Hier gehört ein Hinweis zur Verbraucherstreitbeilegung hin. Der
          konkrete Wortlaut hängt davon ab, ob und in welcher Form die Website
          gewerblich betrieben wird.]
        </p>
      </Section>

      <Section title="Haftung für Inhalte und Links">
        <p>
          [Hier gehören Haftungshinweise hin. Vorformulierte Textbausteine aus
          dem Internet sind nicht automatisch passend – der Text muss zum
          tatsächlichen Angebot passen.]
        </p>
      </Section>

      <Section title="Hinweis zum Stand dieser Seite">
        <p>
          Diese Seite ist ein technischer Platzhalter innerhalb der
          Projektvorlage. Die Angaben oben sind nicht ausgefüllt und daher
          rechtlich wirkungslos. Vor der Veröffentlichung müssen sie vollständig
          und korrekt eingetragen werden. Welche Angaben im Einzelfall
          verpflichtend sind, hängt unter anderem davon ab, ob die Website
          gewerblich betrieben wird und ob Einnahmen über Werbung erzielt werden
          – was hier der Fall sein soll. Wir empfehlen ausdrücklich eine
          anwaltliche Prüfung.
        </p>
      </Section>
    </PageShell>
  );
}
