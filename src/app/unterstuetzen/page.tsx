import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell, Section } from "@/components/layout/PageShell";
import { TipJar } from "@/components/support/TipJar";
import { CryptoTips } from "@/components/support/CryptoTips";
import { Callout } from "@/components/ui/Callout";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/config/site";
import {
  cryptoOptions,
  supportEnabled,
  supportOptions,
  supportPurpose,
} from "@/config/support";
import { activeCalculators } from "@/config/calculators";

export const metadata: Metadata = pageMetadata({
  title: "Unterstützen",
  description: `${site.name} ist kostenlos und bleibt es. Wer möchte, kann ein freiwilliges Trinkgeld dalassen – ohne Gegenleistung und ohne Anmeldung.`,
  path: "/unterstuetzen",
});

export default function Page() {
  // Ohne eingerichteten Zahlungsweg gibt es diese Seite nicht. Besser eine
  // ehrliche 404 als eine Seite mit Knöpfen, die ins Leere führen.
  if (!supportEnabled) notFound();

  return (
    <PageShell
      title="Unterstützen"
      intro="Alle Rechner sind kostenlos und bleiben es. Wenn dir die Seite geholfen hat, kannst du freiwillig ein Trinkgeld dalassen."
      breadcrumbs={[{ name: "Unterstützen" }]}
    >
      {supportOptions.length > 0 && (
        <div className="rounded-xl border border-border bg-surface p-5 sm:p-6">
          <TipJar />
        </div>
      )}

      {cryptoOptions.length > 0 && (
        <Section title="Mit Kryptowährung" id="krypto">
          <p>
            Diese Adressen gehören zu meinen Wallets. Es gibt hier keinen
            Zahlungsdienst dazwischen – du sendest direkt, und ich sehe nur die
            Transaktion in der Blockchain.
          </p>
          <div className="not-prose mt-4">
            <CryptoTips />
          </div>
        </Section>
      )}

      <Section title="Warum es diese Seite gibt">
        <p>
          {site.name} finanziert sich über Werbung. Das trägt den Betrieb, aber
          es bedeutet auch: Je mehr Werbung, desto mehr Einnahmen. Diesem Druck
          will ich nicht nachgeben – keine Anzeigen, die den Rechner verdecken,
          keine Seite, die künstlich auf fünf Klicks aufgeteilt wird, und keine
          Bezahlschranke.
        </p>
        <p>
          Ein Trinkgeld ist die Alternative dazu. Es ist freiwillig, du bekommst
          dafür nichts, was du nicht ohnehin bekommst, und alle{" "}
          {activeCalculators().length} Rechner funktionieren ohne Zahlung
          vollständig.
        </p>
        {supportPurpose && (
          <p>
            <strong>Wofür das Geld verwendet wird:</strong> {supportPurpose}
          </p>
        )}
      </Section>

      <Section title="Was du dafür bekommst">
        <p>Ehrliche Antwort: nichts Zusätzliches.</p>
        <ul>
          <li>Keine werbefreie Version – die gibt es für niemanden.</li>
          <li>Keine zusätzlichen Funktionen und keine Rechner exklusiv.</li>
          <li>Kein Abonnement, keine wiederkehrende Zahlung.</li>
          <li>Keine Registrierung, kein Konto, keine Adressdaten nötig.</li>
        </ul>
        <p>
          Wer trotzdem etwas dalässt, tut das, weil ihm die Seite geholfen hat.
          Genau so ist es gemeint.
        </p>
      </Section>

      <Section title="Es geht auch ohne Geld">
        <p>
          Wenn du nichts zahlen möchtest oder kannst, ist das völlig in Ordnung.
          Es hilft auch, wenn du einen Rechner weiterempfiehlst, den Link teilst
          oder mir über die <Link href="/kontakt">Kontaktseite</Link> schreibst,
          was fehlt oder falsch ist. Hinweise auf Rechenfehler sind mir mehr
          wert als jede Zahlung.
        </p>
      </Section>

      <Callout tone="info" title="Keine Spende im steuerlichen Sinn">
        <p>
          Hinter {site.name} steht eine Privatperson, kein gemeinnütziger
          Verein und keine anerkannte Organisation. Ein Trinkgeld ist deshalb
          eine freiwillige Zuwendung ohne Gegenleistung – es ist{" "}
          <strong>nicht steuerlich absetzbar</strong>, und es kann dafür{" "}
          <strong>keine Spendenbescheinigung</strong> ausgestellt werden. Wenn
          dir die steuerliche Absetzbarkeit wichtig ist, ist eine anerkannte
          gemeinnützige Organisation die richtige Adresse.
        </p>
      </Callout>
    </PageShell>
  );
}
