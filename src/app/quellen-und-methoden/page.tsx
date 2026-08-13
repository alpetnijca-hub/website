import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, Section } from "@/components/layout/PageShell";
import { SourceList } from "@/components/ui/SourceList";
import { Callout } from "@/components/ui/Callout";
import { pageMetadata } from "@/lib/seo";
import { sources, type SourceId } from "@/data/sources";
import { site } from "@/config/site";

export const metadata: Metadata = pageMetadata({
  title: "Quellen und Methoden",
  description:
    "Welche Formeln auf dieser Website verwendet werden, woher sie stammen und wie wir mit ihrer Genauigkeit umgehen. Vollständiges Quellenverzeichnis.",
  path: "/quellen-und-methoden",
});

const allSourceIds = Object.keys(sources) as SourceId[];

const formulaMap = [
  {
    calculator: "Kalorienbedarf",
    href: "/gesundheit/kalorienbedarf-rechner",
    formula: "Mifflin-St Jeor (1990), PAL-Faktoren 1,2 bis 1,9",
  },
  {
    calculator: "BMI",
    href: "/gesundheit/bmi-rechner",
    formula: "Quetelet-Index, Klassifikation nach WHO",
  },
  {
    calculator: "Idealgewicht",
    href: "/gesundheit/idealgewicht-rechner",
    formula: "Broca, Devine, Robinson, Miller, Hamwi + BMI-Normalbereich",
  },
  {
    calculator: "Kaloriendefizit",
    href: "/gesundheit/kaloriendefizit-rechner",
    formula: "7.700 kcal je kg Körperfett (Wishnofsky 1958)",
  },
  {
    calculator: "Proteinbedarf",
    href: "/gesundheit/proteinbedarf-rechner",
    formula: "0,8 g/kg (DGE) bis 2,2 g/kg (ISSN Position Stand 2017)",
  },
  {
    calculator: "Wasserbedarf",
    href: "/gesundheit/wasserbedarf-rechner",
    formula: "30–42 ml/kg als Faustregel, EFSA-Referenzwerte zum Vergleich",
  },
  {
    calculator: "Kalorienverbrauch",
    href: "/gesundheit/kalorienverbrauch-rechner",
    formula: "MET × 3,5 × kg ÷ 200 (Compendium of Physical Activities 2011)",
  },
  {
    calculator: "Makronährstoffe",
    href: "/gesundheit/makronaehrstoff-rechner",
    formula: "Eiweiss je kg, Fett 25–30 %, Rest Kohlenhydrate; AMDR als Rahmen",
  },
];

export default function Page() {
  return (
    <PageShell
      title="Quellen und Methoden"
      intro="Hier steht an einer Stelle, welche Formel in welchem Rechner steckt, woher sie kommt und wie wir mit ihren Grenzen umgehen."
      breadcrumbs={[{ name: "Quellen und Methoden" }]}
    >
      <Section title="Welche Formel steckt wo?">
        <div className="not-prose mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-text-muted">
                <th scope="col" className="py-2 pr-4 font-medium">
                  Rechner
                </th>
                <th scope="col" className="py-2 font-medium">
                  Verwendete Grundlage
                </th>
              </tr>
            </thead>
            <tbody>
              {formulaMap.map((row) => (
                <tr key={row.calculator} className="border-b border-border">
                  <th scope="row" className="py-3 pr-4 text-left font-semibold">
                    <Link
                      href={row.href}
                      className="text-brand underline underline-offset-2"
                    >
                      {row.calculator}
                    </Link>
                  </th>
                  <td className="py-3 text-text-muted">{row.formula}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Wie wir Quellen auswählen">
        <p>
          Wir nennen für jede Formel die Veröffentlichung, in der sie
          ursprünglich beschrieben wurde – nicht eine beliebige Website, die sie
          zitiert. Wo eine Formel keinen einzelnen Ursprung hat, sondern eine
          eingebürgerte Faustregel ist, schreiben wir das ausdrücklich dazu. Das
          betrifft zum Beispiel die 30-Milliliter-Regel beim Wasserbedarf.
        </p>
        <p>
          Wir erfinden keine Quellen und geben keine Studien an, die eine
          Aussage nicht wirklich stützen. Wenn wir für eine Behauptung keinen
          Beleg haben, formulieren wir sie entsprechend vorsichtig oder lassen
          sie weg.
        </p>
      </Section>

      <Section title="Wie wir mit Genauigkeit umgehen">
        <p>
          Alle Rechner auf dieser Website sind Schätzverfahren. Sie beruhen auf
          Regressionsgleichungen, die aus Messungen an Personengruppen abgeleitet
          wurden. Für die einzelne Person heisst das: Das Ergebnis liegt
          irgendwo in einem Bereich um den wahren Wert herum, nicht exakt darauf.
        </p>
        <p>Daraus folgen drei Entscheidungen, die du überall wiederfindest:</p>
        <ul>
          <li>
            <strong>Spannen statt Punktwerte,</strong> wo die Datenlage keine
            Genauigkeit hergibt – etwa beim Protein- und Wasserbedarf.
          </li>
          <li>
            <strong>Ein eigener Abschnitt „Grenzen“</strong> auf jeder
            Rechnerseite, in dem steht, was die Formel nicht kann und für wen sie
            nicht gilt.
          </li>
          <li>
            <strong>Warnungen bei kritischen Eingaben,</strong> zum Beispiel wenn
            ein Kaloriendefizit zu einer Zufuhr unterhalb sinnvoller Grenzen
            führen würde.
          </li>
        </ul>
      </Section>

      <Section title="Technische Umsetzung">
        <p>
          Die Rechenlogik ist vollständig von der Benutzeroberfläche getrennt und
          durch automatisierte Tests abgesichert. Getestet werden neben den
          Normalfällen vor allem die Randbereiche: leere Eingaben, Text statt
          Zahlen, negative Werte, Null und unrealistisch grosse Zahlen. Eine
          Division durch null kann in keinem Rechner auftreten – solche Fälle
          liefern ein klar gekennzeichnetes „kein Ergebnis“ statt einer
          fehlerhaften Zahl.
        </p>
        <p>
          Sämtliche Berechnungen laufen in deinem Browser. Es werden keine
          Eingaben an einen Server übertragen.
        </p>
      </Section>

      <Section title="Korrekturen">
        <p>
          Wenn du einen Rechenfehler oder eine falsche Quellenangabe findest,
          melde sie uns bitte über die <Link href="/kontakt">Kontaktseite</Link>.
          Wir prüfen jede Meldung und korrigieren nachweisbare Fehler.
        </p>
      </Section>

      <Section title="Vollständiges Quellenverzeichnis">
        <div className="not-prose mt-4">
          <SourceList ids={allSourceIds} />
        </div>
      </Section>

      <div className="mt-10">
        <Callout tone="info" title="Keine Garantie auf Richtigkeit">
          Wir arbeiten sorgfältig, können aber nicht garantieren, dass alle
          Angaben auf {site.name} jederzeit fehlerfrei und auf dem neuesten Stand
          der Forschung sind. Empfehlungen im Ernährungsbereich ändern sich, und
          auch etablierte Formeln werden weiterentwickelt.
        </Callout>
      </div>
    </PageShell>
  );
}
