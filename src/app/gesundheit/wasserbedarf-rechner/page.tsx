import type { Metadata } from "next";
import { CalculatorPage } from "@/components/layout/CalculatorPage";
import { WaterCalculator } from "@/components/calculators/WaterCalculator";
import { pageMetadata } from "@/lib/seo";
import { getCalculator } from "@/config/calculators";

const meta = getCalculator("wasserbedarf")!;

export const metadata: Metadata = pageMetadata({
  title: meta.seo.title,
  description: meta.seo.description,
  path: meta.href,
});

export default function Page() {
  return (
    <CalculatorPage
      calculatorId="wasserbedarf"
      intro={
        <p>
          Für die tägliche Trinkmenge gibt es keine exakte Formel – der Bedarf
          hängt von Temperatur, Bewegung, Ernährung und Gesundheitszustand ab.
          Dieser Rechner liefert deshalb ausdrücklich einen Orientierungswert:
          einen Grundbedarf nach Körpergewicht plus einen Zuschlag für Training.
        </p>
      }
      calculator={<WaterCalculator />}
      formula={
        <>
          <p>
            Wir kombinieren zwei gebräuchliche Ansätze: die Faustregel nach
            Körpergewicht und einen Zuschlag für den Schweissverlust beim Sport.
          </p>
          <div className="mt-4 space-y-2 rounded-lg border border-border bg-surface-muted/60 p-4 font-mono text-sm text-text">
            <p>Grundbedarf = Körpergewicht in kg × 30 bis 42 ml</p>
            <p>Trainingszuschlag = Trainingsstunden × 400 bis 800 ml</p>
            <p>Gesamt = Grundbedarf + Trainingszuschlag</p>
          </div>
          <p>
            Der Faktor je Kilogramm richtet sich nach deinem Alltag: 30 bis
            33 ml bei überwiegend sitzender Tätigkeit, 33 bis 37 ml bei
            regelmässiger Bewegung, 37 bis 42 ml bei körperlicher Arbeit,
            intensivem Training oder Hitze.
          </p>
          <p>
            Zum Vergleich: Die Europäische Behörde für Lebensmittelsicherheit
            (EFSA) nennt als Referenzwert für die <em>gesamte</em> Zufuhr –
            Getränke und Nahrung zusammen – rund 2,0 Liter pro Tag für Frauen und
            2,5 Liter für Männer bei moderaten Bedingungen. Etwa 20 bis 30
            Prozent davon stammen üblicherweise aus fester Nahrung.
          </p>
        </>
      }
      example={
        <>
          <p>
            Eine Person wiegt 68 kg, ist im Alltag mässig aktiv und war heute
            45 Minuten laufen.
          </p>
          <ol>
            <li>
              Grundbedarf: 68 × 33 = 2.244 ml bis 68 × 37 = 2.516 ml
            </li>
            <li>Trainingszeit: 45 Minuten = 0,75 Stunden</li>
            <li>
              Zuschlag: 0,75 × 400 = 300 ml bis 0,75 × 800 = 600 ml
            </li>
            <li>
              Gesamt: <strong>rund 2,5 bis 3,1 Liter</strong>
            </li>
          </ol>
          <p>
            Davon kommen etwa 0,5 bis 0,8 Liter üblicherweise über das Essen
            hinzu – zu trinken bleiben also grob 2,0 bis 2,5 Liter.
          </p>
        </>
      }
      interpretation={
        <>
          <p>
            Der wichtigste Hinweis vorweg: Bei gesunden Menschen ist das
            Durstgefühl ein zuverlässiger Regler. Wer auf Durst reagiert und
            regelmässig trinkt, kommt ohne Rechnen gut zurecht. Der Zahlenwert
            hier hilft vor allem dann, wenn du einschätzen willst, ob deine
            bisherige Menge grob im Rahmen liegt.
          </p>
          <p>
            Ein praktischerer Anhaltspunkt als jede Formel ist die Urinfarbe:
            hell bis strohgelb spricht für eine ausreichende Zufuhr,
            dunkelgelb bis bernsteinfarben eher für zu wenig. Auch das ist kein
            exakter Messwert – Vitaminpräparate und einzelne Medikamente färben
            den Urin unabhängig von der Trinkmenge.
          </p>
          <p>
            Beim Sport gilt: Der Verlust über Schweiss schwankt enorm, je nach
            Intensität, Temperatur und Person zwischen etwa 0,3 und über 2 Litern
            pro Stunde. Wer sich vor und nach einer Einheit wiegt, bekommt den
            genauesten persönlichen Wert – jedes fehlende Kilogramm entspricht
            etwa einem Liter Flüssigkeit.
          </p>
        </>
      }
      limits={
        <>
          <ul>
            <li>
              <strong>Die 30-ml-Regel ist eine Faustformel.</strong> Sie beruht
              nicht auf einer eigenständigen wissenschaftlichen Herleitung,
              sondern hat sich in der Praxis eingebürgert. Behandle sie
              entsprechend.
            </li>
            <li>
              <strong>Getränke sind nicht alles.</strong> Obst, Gemüse, Suppen
              und Milchprodukte tragen erheblich zur Flüssigkeitszufuhr bei. Der
              Rechner kann das nicht wissen.
            </li>
            <li>
              <strong>Umgebung wird nur grob berücksichtigt.</strong> Ein
              Hochsommertag, Höhenaufenthalt oder trockene Heizungsluft
              verändern den Bedarf deutlich.
            </li>
            <li>
              <strong>Bei bestimmten Erkrankungen gilt das Gegenteil.</strong>{" "}
              Bei Herzschwäche, fortgeschrittener Niereninsuffizienz oder unter
              bestimmten Medikamenten wird die Trinkmenge ärztlich begrenzt. In
              diesen Fällen ist die ärztliche Vorgabe massgeblich, nicht dieser
              Rechner.
            </li>
            <li>
              <strong>Zu viel ist auch nicht gut.</strong> Sehr grosse Mengen in
              kurzer Zeit können den Natriumspiegel im Blut gefährlich
              absenken. Das betrifft vor allem Ausdauersportler, die während
              langer Belastungen ausschliesslich Wasser trinken.
            </li>
          </ul>
        </>
      }
      faq={[
        {
          question: "Zählen Kaffee und Tee mit?",
          answer:
            "Ja. Die früher verbreitete Annahme, Kaffee entziehe dem Körper Flüssigkeit, gilt als überholt. Bei moderatem Konsum zählen Kaffee und Tee zur Flüssigkeitsbilanz dazu. Bei sehr hohen Mengen wirkt Koffein zwar leicht harntreibend, der Nettoeffekt bleibt aber positiv.",
        },
        {
          question: "Muss ich zwei Liter am Tag trinken?",
          answer:
            "Die verbreitete Zwei-Liter-Regel ist eine Vereinfachung. Der tatsächliche Bedarf hängt von Körpergrösse, Aktivität und Temperatur ab und kann darunter oder deutlich darüber liegen. Wichtiger als eine feste Zahl ist, über den Tag verteilt zu trinken und auf Durst zu reagieren.",
        },
        {
          question: "Woran merke ich, dass ich zu wenig trinke?",
          answer:
            "Typische frühe Anzeichen sind Kopfschmerzen, Müdigkeit, Konzentrationsprobleme und dunkler Urin. Trockener Mund und starkes Durstgefühl treten oft erst auf, wenn bereits ein spürbares Defizit besteht. Bei älteren Menschen ist das Durstempfinden zusätzlich abgeschwächt.",
        },
        {
          question: "Brauche ich beim Sport ein Elektrolytgetränk?",
          answer:
            "Bei Einheiten unter etwa einer Stunde reicht Wasser in aller Regel aus. Bei längeren Belastungen, starkem Schwitzen oder Hitze kann eine Zufuhr von Natrium sinnvoll sein – das geht auch über eine salzhaltige Mahlzeit danach.",
        },
      ]}
      sources={["efsaWater", "dge"]}
    />
  );
}
