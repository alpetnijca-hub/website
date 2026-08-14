import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { CalculatorSearch } from "@/components/search/CalculatorSearch";
import { CalculatorCard } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { AdSlot } from "@/components/ads/AdSlot";
import { JsonLd } from "@/components/ui/JsonLd";
import { SupportCard } from "@/components/support/SupportCard";
import { websiteSchema } from "@/lib/schema";
import { site } from "@/config/site";
import { categories } from "@/config/categories";
import {
  activeCalculators,
  calculatorsByCategory,
  featuredCalculators,
} from "@/config/calculators";

const benefits = [
  {
    title: "Rechnen im Browser",
    text: "Deine Eingaben verlassen dein Gerät nicht. Es gibt keine Anmeldung, kein Nutzerkonto und keine Speicherung deiner Werte auf einem Server.",
  },
  {
    title: "Formeln offengelegt",
    text: "Bei jedem Rechner steht, welche Formel verwendet wird, woher sie stammt und wie das Ergebnis zustande kommt.",
  },
  {
    title: "Auf dem Handy nutzbar",
    text: "Grosse Eingabefelder, klare Beschriftungen und ein Ergebnis, das ohne Scrollen sichtbar wird.",
  },
  {
    title: "Ohne Bezahlschranke",
    text: "Alle Rechner sind vollständig nutzbar. Die Website finanziert sich über Werbeflächen, nicht über Abos.",
  },
];

export default function HomePage() {
  const featured = featuredCalculators();
  const health = calculatorsByCategory("gesundheit").filter(
    (c) => c.status === "aktiv",
  );
  const totalActive = activeCalculators().length;

  return (
    <>
      {/* Hero */}
      <section className="hero-surface border-b border-border">
        <Container className="py-14 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3.5 py-1.5 text-sm font-medium text-text-muted shadow-sm">
              <span className="h-2 w-2 rounded-full bg-brand" aria-hidden="true" />
              {totalActive} Rechner · kostenlos · ohne Anmeldung
            </p>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-text sm:text-6xl">
              Rechnen statt <span className="text-gradient">raten</span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-text-muted sm:text-xl">
              {site.name} bündelt verständliche Rechner für Gesundheit,
              Finanzen und Alltag. Zahlen eingeben, Ergebnis ablesen – und
              darunter nachlesen, wie es berechnet wurde.
            </p>
            <div className="mt-8">
              <CalculatorSearch />
            </div>
            <p className="mt-3 text-sm text-text-subtle">
              Häufig gesucht:{" "}
              <Link
                href="/gesundheit/kalorienbedarf-rechner"
                className="text-brand underline underline-offset-2"
              >
                Kalorienbedarf
              </Link>
              {", "}
              <Link
                href="/waehrungen/waehrungsrechner"
                className="text-brand underline underline-offset-2"
              >
                Währungen
              </Link>
              {", "}
              <Link
                href="/arbeit/stundenlohnrechner"
                className="text-brand underline underline-offset-2"
              >
                Stundenlohn
              </Link>
            </p>
          </div>

          {/* Kennzahlen: kurz, überprüfbar, keine Werbeversprechen. */}
          <dl className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { value: String(totalActive), label: "Rechner" },
              { value: "0 €", label: "Kosten" },
              { value: "100 %", label: "im Browser gerechnet" },
              { value: "Alle", label: "Formeln offengelegt" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border bg-surface/70 px-4 py-3 text-center backdrop-blur-sm"
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block text-2xl font-bold tracking-tight text-text">
                    {stat.value}
                  </span>
                  <span className="mt-0.5 block text-xs leading-snug text-text-subtle">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <Container>
        <AdSlot placement="after-intro" />

        {/* Beliebte Rechner */}
        <section aria-labelledby="beliebt" className="mt-4">
          <div className="flex items-end justify-between gap-4">
            <h2
              id="beliebt"
              className="heading-accent text-2xl font-bold tracking-tight text-text"
            >
              Häufig genutzte Rechner
            </h2>
            <Link
              href="/rechner"
              className="shrink-0 text-sm font-medium text-brand hover:underline"
            >
              Alle ansehen
            </Link>
          </div>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {featured.map((calculator) => (
              <li key={calculator.id}>
                <CalculatorCard calculator={calculator} />
              </li>
            ))}
          </ul>
        </section>

        {/* Kategorien */}
        <section aria-labelledby="kategorien" className="mt-14">
          <h2
            id="kategorien"
            className="heading-accent text-2xl font-bold tracking-tight text-text"
          >
            Kategorien
          </h2>
          <p className="mt-2 max-w-2xl text-text-muted">
            Jeder Bereich hat seine eigene Farbe – so siehst du in gemischten
            Listen sofort, woher ein Rechner stammt. Was noch nicht fertig ist,
            steht als Vorschau da und wird erst verlinkt, wenn Formel,
            Erklärung und Tests stehen.
          </p>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const count = calculatorsByCategory(category.slug).filter(
                (c) => c.status === "aktiv",
              ).length;
              const isActive = category.status === "aktiv";
              const body = (
                <>
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                      isActive
                        ? "bg-accent-soft text-accent"
                        : "bg-surface-muted text-text-subtle"
                    }`}
                  >
                    <Icon name={category.icon} className="h-5.5 w-5.5" />
                  </span>
                  <h3 className="mt-3.5 font-semibold text-text">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-text-muted">
                    {category.description}
                  </p>
                  <p
                    className={`mt-3 text-sm font-medium ${
                      isActive ? "text-accent" : "text-text-subtle"
                    }`}
                  >
                    {isActive
                      ? `${count} Rechner ansehen →`
                      : "In Vorbereitung"}
                  </p>
                </>
              );

              return (
                <li key={category.slug} data-accent={category.slug}>
                  {isActive ? (
                    <Link
                      href={category.href}
                      className="card-lift block h-full rounded-xl border border-border bg-surface p-5 shadow-sm hover:border-accent"
                    >
                      {body}
                    </Link>
                  ) : (
                    <div className="h-full rounded-xl border border-dashed border-border bg-surface/60 p-5">
                      {body}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        <AdSlot placement="in-content" />

        {/* Vorteile */}
        <section aria-labelledby="vorteile" className="mt-4">
          <h2
            id="vorteile"
            className="heading-accent text-2xl font-bold tracking-tight text-text"
          >
            Warum {site.name}
          </h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <li
                key={benefit.title}
                className="rounded-xl border border-border bg-surface p-5"
              >
                <h3 className="font-semibold text-text">{benefit.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
                  {benefit.text}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Genauigkeit */}
        <section
          aria-labelledby="genauigkeit"
          className="mt-14 rounded-xl border border-border bg-surface p-6 sm:p-8"
        >
          <h2
            id="genauigkeit"
            className="heading-accent text-2xl font-bold tracking-tight text-text"
          >
            Wie genau sind diese Rechner?
          </h2>
          <div className="mt-3 max-w-3xl space-y-3 leading-relaxed text-text-muted">
            <p>
              Alle Rechner im Bereich Ernährung und Fitness beruhen auf
              Schätzformeln, die aus Messreihen an Gruppen von Menschen
              abgeleitet wurden. Sie beschreiben den Durchschnitt – nicht dich.
              Beim Kalorienbedarf liegt die Abweichung zwischen Schätzung und
              tatsächlich gemessenem Verbrauch bei einem erheblichen Teil der
              Personen im Bereich von etwa zehn Prozent nach oben oder unten,
              in Einzelfällen mehr.
            </p>
            <p>
              Praktisch heisst das: Nimm das Ergebnis als Startwert, nicht als
              feste Vorgabe. Beobachte über zwei bis drei Wochen, wie sich
              Gewicht und Wohlbefinden entwickeln, und passe den Wert dann an.
              Wir geben bei jedem Rechner an, welche Formel dahintersteckt und
              wo ihre Grenzen liegen – nachzulesen unter{" "}
              <Link
                href="/quellen-und-methoden"
                className="text-brand underline underline-offset-2"
              >
                Quellen und Methoden
              </Link>
              .
            </p>
          </div>
        </section>

        {/* Alle Gesundheitsrechner als interne Verlinkung */}
        <section aria-labelledby="alle-gesundheit" className="mt-14">
          <h2
            id="alle-gesundheit"
            className="heading-accent text-2xl font-bold tracking-tight text-text"
          >
            Alle Rechner für Gesundheit &amp; Fitness
          </h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {health.map((calculator) => (
              <li key={calculator.id}>
                <CalculatorCard calculator={calculator} />
              </li>
            ))}
          </ul>
        </section>

        <SupportCard className="mt-14" />

        <div className="mt-14 rounded-xl border border-border bg-surface-muted/60 p-6 text-sm leading-relaxed text-text-muted">
          <p>
            <strong className="text-text">Hinweis:</strong> Die Inhalte auf{" "}
            {site.name} dienen der allgemeinen Information. Sie ersetzen keine
            ärztliche Beratung, Diagnose oder Behandlung. Weitere Informationen
            findest du in unseren{" "}
            <Link
              href="/redaktionelle-richtlinien"
              className="text-brand underline underline-offset-2"
            >
              redaktionellen Richtlinien
            </Link>
            .
          </p>
        </div>
      </Container>

      <JsonLd data={websiteSchema()} />
    </>
  );
}
