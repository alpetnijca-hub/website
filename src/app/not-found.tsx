import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { CalculatorSearch } from "@/components/search/CalculatorSearch";
import { CalculatorCard } from "@/components/ui/Card";
import { featuredCalculators } from "@/config/calculators";

/**
 * 404-Seite.
 *
 * Statt einer Sackgasse bekommen Besucher hier eine Suche und die
 * meistgenutzten Rechner – das ist die häufigste Absicht, mit der jemand
 * auf einer nicht existierenden Unterseite landet.
 */
export default function NotFound() {
  return (
    <Container className="py-16 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand">
          Fehler 404
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-text sm:text-4xl">
          Diese Seite gibt es nicht
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-text-muted">
          Vielleicht hat sich die Adresse geändert, oder in der URL steckt ein
          Tippfehler. Über die Suche findest du in den meisten Fällen schneller
          zum Ziel.
        </p>

        <div className="mt-8">
          <CalculatorSearch />
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-lg bg-brand px-5 py-3 font-semibold text-on-brand hover:bg-brand-strong"
          >
            Zur Startseite
          </Link>
          <Link
            href="/rechner"
            className="rounded-lg border-2 border-brand px-5 py-3 font-semibold text-brand hover:bg-brand-soft"
          >
            Alle Rechner ansehen
          </Link>
        </div>
      </div>

      <section aria-labelledby="beliebt-404" className="mt-16">
        <h2
          id="beliebt-404"
          className="text-center text-xl font-bold tracking-tight text-text"
        >
          Häufig gesucht
        </h2>
        <ul className="mx-auto mt-6 grid max-w-4xl gap-4 sm:grid-cols-2">
          {featuredCalculators().map((calculator) => (
            <li key={calculator.id}>
              <CalculatorCard calculator={calculator} />
            </li>
          ))}
        </ul>
      </section>
    </Container>
  );
}
