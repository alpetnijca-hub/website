import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, Section } from "@/components/layout/PageShell";
import { ConsentSettingsLink } from "@/components/consent/ConsentSettingsLink";
import { ConsentStatus } from "@/components/consent/ConsentStatus";
import { pageMetadata } from "@/lib/seo";
import { consentCategoryInfo, type ConsentCategory } from "@/types/consent";

export const metadata: Metadata = pageMetadata({
  title: "Cookie-Einstellungen",
  description:
    "Deine Einwilligung einsehen, ändern oder vollständig widerrufen. Übersicht aller Kategorien und was sie jeweils bedeuten.",
  path: "/cookie-einstellungen",
});

export default function Page() {
  const categories = Object.keys(consentCategoryInfo) as ConsentCategory[];

  return (
    <PageShell
      title="Cookie-Einstellungen"
      intro="Hier siehst du, wofür du deine Zustimmung gegeben hast, und kannst sie jederzeit ändern oder widerrufen."
      breadcrumbs={[{ name: "Cookie-Einstellungen" }]}
    >
      <div className="not-prose">
        <ConsentStatus />
      </div>

      <Section title="Die Kategorien im Einzelnen">
        <dl className="not-prose mt-4 space-y-4">
          {categories.map((key) => {
            const info = consentCategoryInfo[key];
            return (
              <div
                key={key}
                className="rounded-lg border border-border bg-surface p-4"
              >
                <dt className="font-semibold text-text">
                  {info.title}
                  {info.required && (
                    <span className="ml-2 text-xs font-normal text-text-subtle">
                      nicht abwählbar
                    </span>
                  )}
                </dt>
                <dd className="mt-1 text-sm leading-relaxed text-text-muted">
                  {info.description}
                </dd>
              </div>
            );
          })}
        </dl>
      </Section>

      <Section title="Was gespeichert wird">
        <p>
          Deine Entscheidung liegt ausschliesslich in deinem Browser, im
          sogenannten localStorage, unter dem Schlüssel{" "}
          <code>rp_consent</code>. Gespeichert werden die gewählten Kategorien,
          ein Zeitstempel und eine Versionsnummer – keine Kennung, die dich
          identifizieren könnte.
        </p>
        <p>
          Zusätzlich merkt sich der Browser unter <code>rp_theme</code>, ob du
          das helle oder dunkle Design gewählt hast. Beide Einträge kannst du
          jederzeit über die Einstellungen deines Browsers löschen. Danach
          erscheint der Einwilligungsdialog beim nächsten Besuch erneut.
        </p>
      </Section>

      <Section title="Widerruf">
        <p>
          Ein Widerruf wirkt für die Zukunft. Skripte, die während einer früheren
          Sitzung bereits geladen wurden, lassen sich rückwirkend nicht
          entfernen – nach dem Widerruf werden sie aber nicht mehr geladen.
        </p>
        <p className="not-prose mt-4">
          <ConsentSettingsLink className="rounded-lg bg-brand px-5 py-3 font-semibold text-on-brand hover:bg-brand-strong">
            Einstellungen öffnen
          </ConsentSettingsLink>
        </p>
      </Section>

      <Section title="Und wenn ich alles ablehne?">
        <p>
          Dann funktioniert die Website vollständig. Alle Rechner, alle Texte,
          alle Funktionen bleiben nutzbar – die Werbeflächen bleiben lediglich
          leer. Es gibt keine Inhalte, die hinter einer Zustimmung liegen.
        </p>
        <p>
          Details dazu, welche Daten überhaupt anfallen, stehen in der{" "}
          <Link href="/datenschutz">Datenschutzerklärung</Link>.
        </p>
      </Section>
    </PageShell>
  );
}
