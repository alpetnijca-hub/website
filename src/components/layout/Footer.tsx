import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ConsentSettingsLink } from "@/components/consent/ConsentSettingsLink";
import { site } from "@/config/site";
import { activeCalculators } from "@/config/calculators";
import { categories } from "@/config/categories";

const legalLinks = [
  { href: "/impressum", label: "Impressum" },
  { href: "/datenschutz", label: "Datenschutz" },
  { href: "/cookie-einstellungen", label: "Cookies" },
];

const aboutLinks = [
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/kontakt", label: "Kontakt" },
  { href: "/redaktionelle-richtlinien", label: "Redaktionelle Richtlinien" },
  { href: "/quellen-und-methoden", label: "Quellen & Methoden" },
];

export function Footer() {
  const health = activeCalculators().filter((c) => c.category === "gesundheit");

  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <Container className="py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-lg font-bold text-text">{site.name}</p>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              {site.tagline}. Alle Berechnungen laufen direkt in deinem Browser –
              deine Eingaben werden nicht an einen Server übertragen.
            </p>
          </div>

          <nav aria-labelledby="footer-rechner">
            <h2 id="footer-rechner" className="text-sm font-semibold text-text">
              Beliebte Rechner
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {health.slice(0, 6).map((calculator) => (
                <li key={calculator.id}>
                  <Link
                    href={calculator.href}
                    className="text-text-muted hover:text-brand hover:underline"
                  >
                    {calculator.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/rechner"
                  className="font-medium text-brand hover:underline"
                >
                  Alle Rechner ansehen
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-kategorien">
            <h2 id="footer-kategorien" className="text-sm font-semibold text-text">
              Kategorien
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {categories.map((category) => (
                <li key={category.slug}>
                  {category.status === "aktiv" ? (
                    <Link
                      href={category.href}
                      className="text-text-muted hover:text-brand hover:underline"
                    >
                      {category.name}
                    </Link>
                  ) : (
                    <span className="text-text-subtle">
                      {category.name}{" "}
                      <span className="text-xs">(geplant)</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-info">
            <h2 id="footer-info" className="text-sm font-semibold text-text">
              Information
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {aboutLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-muted hover:text-brand hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 text-sm text-text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. Diese Website finanziert
            sich über Werbung.
          </p>
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-brand hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <ConsentSettingsLink className="hover:text-brand hover:underline" />
            </li>
          </ul>
        </div>

        <p className="mt-6 text-xs leading-relaxed text-text-subtle">
          Hinweis: Die Rechner auf dieser Website liefern rechnerische
          Schätzwerte und ersetzen keine medizinische, ernährungsberaterische
          oder rechtliche Beratung.
        </p>
      </Container>
    </footer>
  );
}
