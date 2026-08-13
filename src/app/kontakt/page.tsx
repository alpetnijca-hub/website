import type { Metadata } from "next";
import { PageShell, Section } from "@/components/layout/PageShell";
import { ContactForm } from "@/components/ContactForm";
import { Callout } from "@/components/ui/Callout";
import { pageMetadata } from "@/lib/seo";
import { site, telegramConfigured, telegramUrl } from "@/config/site";

export const metadata: Metadata = pageMetadata({
  title: "Kontakt",
  description: `Fragen, Fehler gefunden oder ein Rechner-Wunsch? So erreichst du das Team von ${site.name} – am schnellsten über Telegram.`,
  path: "/kontakt",
});

export default function Page() {
  return (
    <PageShell
      title="Kontakt"
      intro="Du hast eine Frage, einen Fehler entdeckt oder wünschst dir einen bestimmten Rechner? Schreib uns – am schnellsten geht es über Telegram."
      breadcrumbs={[{ name: "Kontakt" }]}
    >
      <Section title="Am schnellsten: Telegram">
        <p>
          Für Fragen und Wünsche erreichst du uns direkt über Telegram. Dort
          antworten wir in der Regel am schnellsten – auch wenn du nur kurz
          etwas melden willst.
        </p>

        {telegramConfigured ? (
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="not-prose mt-4 inline-flex items-center gap-3 rounded-xl bg-brand px-5 py-3.5 font-semibold text-on-brand transition-colors hover:bg-brand-strong"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M21.9 4.3 18.8 19c-.2 1-.9 1.3-1.7.8l-4.7-3.5-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.8 8.8-8c.4-.3-.1-.5-.6-.2L6.8 13.2 2.1 11.7c-1-.3-1-1 .2-1.5l18.3-7c.9-.3 1.6.2 1.3 1.1Z" />
            </svg>
            @{site.telegram} auf Telegram schreiben
          </a>
        ) : (
          <Callout tone="warnung" title="Telegram-Name noch nicht eingetragen">
            In <code>src/config/site.ts</code> steht beim Feld{" "}
            <code>telegram</code> noch der Platzhalter. Trage dort deinen echten
            Benutzernamen ein (ohne @), dann erscheint hier automatisch ein
            funktionierender Link.
          </Callout>
        )}

        <p className="mt-4">
          Besonders willkommen sind Hinweise auf Rechenfehler oder auf Stellen,
          die missverständlich formuliert sind. Wir prüfen jede Meldung und
          korrigieren, wenn sie zutrifft.
        </p>
      </Section>

      <Section title="Worum es hier nicht gehen kann">
        <Callout tone="warnung" title="Keine individuelle Gesundheitsberatung">
          Wir sind keine Ärztinnen, Ärzte oder Ernährungsfachkräfte und dürfen
          keine persönlichen Empfehlungen zu Ernährung, Training, Medikamenten
          oder Erkrankungen geben. Bitte schick uns auch keine Befunde, Diagnosen
          oder andere Gesundheitsdaten – solche Nachrichten können wir nicht
          beantworten und löschen sie.
        </Callout>
      </Section>

      <Section title="Kontaktformular">
        <p>
          Alternativ kannst du dieses Formular nutzen. Deine Angaben werden beim
          Absenden serverseitig geprüft.
        </p>
        <div className="not-prose mt-6">
          <ContactForm />
        </div>
      </Section>

      <Section title="Wie schnell bekomme ich eine Antwort?">
        <p>
          {site.name} wird nebenbei betrieben. Wir lesen alles, schaffen es aber
          nicht immer, jede Nachricht zu beantworten. Bei konkreten Fehlermeldungen
          melden wir uns in der Regel innerhalb weniger Tage.
        </p>
        <p>
          Für rechtliche Anliegen findest du die Angaben im{" "}
          <a href="/impressum">Impressum</a>. Fragen zum Umgang mit Daten
          beantwortet die <a href="/datenschutz">Datenschutzerklärung</a>.
        </p>
      </Section>
    </PageShell>
  );
}
