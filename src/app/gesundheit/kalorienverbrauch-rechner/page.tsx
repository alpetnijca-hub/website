import type { Metadata } from "next";
import Link from "next/link";
import { CalculatorPage } from "@/components/layout/CalculatorPage";
import { ActivityBurnCalculator } from "@/components/calculators/ActivityBurnCalculator";
import { pageMetadata } from "@/lib/seo";
import { getCalculator } from "@/config/calculators";

const meta = getCalculator("kalorienverbrauch")!;

export const metadata: Metadata = pageMetadata({
  title: meta.seo.title,
  description: meta.seo.description,
  path: meta.href,
});

export default function Page() {
  return (
    <CalculatorPage
      calculatorId="kalorienverbrauch"
      intro={
        <p>
          Wie viel eine Sporteinheit tatsächlich verbraucht, lässt sich ohne
          Labor nicht exakt messen – gut abschätzen aber schon. Dieser Rechner
          arbeitet mit MET-Werten aus dem Compendium of Physical Activities, der
          wissenschaftlichen Standardreferenz für den Energieaufwand von
          Tätigkeiten.
        </p>
      }
      calculator={<ActivityBurnCalculator />}
      formula={
        <>
          <p>
            MET steht für „metabolisches Äquivalent“. Ein MET entspricht dem
            Energieumsatz in völliger Ruhe, also etwa 3,5 Millilitern Sauerstoff
            je Kilogramm Körpergewicht und Minute. Eine Tätigkeit mit 8 MET
            verbraucht demnach das Achtfache von ruhigem Sitzen.
          </p>
          <div className="mt-4 space-y-2 rounded-lg border border-border bg-surface-muted/60 p-4 font-mono text-sm text-text">
            <p>kcal pro Minute = MET × 3,5 × Gewicht in kg ÷ 200</p>
            <p>Gesamtverbrauch = kcal pro Minute × Dauer in Minuten</p>
          </div>
          <p>
            Woher kommt der Teiler 200? Ein Liter verbrauchter Sauerstoff setzt
            rund 5 Kilokalorien frei. Rechnet man Milliliter in Liter um (÷ 1000)
            und multipliziert mit 5 kcal, ergibt sich genau dieser Faktor:
            1000 ÷ 5 = 200.
          </p>
          <p>
            Der Rechner gibt zwei Werte aus. Der <strong>Bruttoverbrauch</strong>{" "}
            ist der gesamte Umsatz während der Aktivität. Der{" "}
            <strong>Nettoverbrauch</strong> zieht davon ab, was du in derselben
            Zeit auch in Ruhe verbraucht hättest (1 MET).
          </p>
        </>
      }
      example={
        <>
          <p>
            Eine 72 kg schwere Person fährt 45 Minuten Rad mit rund 18 km/h
            (6,8 MET).
          </p>
          <ol>
            <li>
              Pro Minute: 6,8 × 3,5 × 72 ÷ 200 = <strong>8,57 kcal</strong>
            </li>
            <li>
              Brutto gesamt: 8,57 × 45 = <strong>386 kcal</strong>
            </li>
            <li>Ruheumsatz derselben Zeit: 1 × 3,5 × 72 ÷ 200 × 45 = 57 kcal</li>
            <li>
              Netto: 386 − 57 = <strong>329 kcal</strong>
            </li>
          </ol>
          <p>
            Der Unterschied zwischen beiden Werten beträgt hier rund 15 Prozent.
            Je niedriger der MET-Wert der Tätigkeit, desto grösser wird dieser
            Anteil – bei Yoga mit 2,5 MET sind es bereits 40 Prozent.
          </p>
        </>
      }
      interpretation={
        <>
          <p>
            Die häufigste Fehleranwendung ist das doppelte Anrechnen. Wenn du
            deinen Tagesbedarf im{" "}
            <Link href="/gesundheit/kalorienbedarf-rechner">
              Kalorienbedarf-Rechner
            </Link>{" "}
            mit einem Aktivitätsfaktor ab 1,375 ermittelt hast, ist regelmässiger
            Sport dort bereits eingerechnet. Zusätzlich noch jede Einheit
            draufzuschlagen, führt zu einer deutlichen Überschätzung – und ist
            einer der häufigsten Gründe, warum eine Diät nicht funktioniert.
          </p>
          <p>
            Sinnvoll ist der Rechner für zwei Dinge: um einzelne Aktivitäten
            miteinander zu vergleichen, und um ein Gefühl für Grössenordnungen zu
            bekommen. Eine Stunde zügiges Gehen liegt bei etwa 250 bis 350 kcal.
            Das ist ungefähr ein Stück Kuchen. Diese Relation ist ernüchternd,
            aber hilfreich: Über die Ernährung lässt sich ein Defizit fast immer
            leichter erzeugen als über zusätzliches Training.
          </p>
          <p>
            Das heisst nicht, dass Sport unwichtig wäre – im Gegenteil. Nur wirkt
            er vor allem über Muskelerhalt, Herz-Kreislauf-Gesundheit und
            Wohlbefinden, weniger über die reine Kalorienbilanz.
          </p>
        </>
      }
      limits={
        <>
          <ul>
            <li>
              <strong>MET-Werte sind Gruppendurchschnitte.</strong> Sie stammen
              aus Messreihen an Erwachsenen mit rund 70 kg Körpergewicht.
              Individuelle Abweichungen von 20 bis 30 Prozent sind normal.
            </li>
            <li>
              <strong>Trainingszustand wird nicht erfasst.</strong> Eine geübte
              Läuferin bewegt sich ökonomischer und verbraucht bei gleichem Tempo
              weniger Energie als jemand, der gerade anfängt.
            </li>
            <li>
              <strong>Intensität innerhalb einer Sportart schwankt stark.</strong>{" "}
              „Krafttraining“ kann ein lockerer Satz mit langen Pausen sein oder
              ein dichtes Zirkelprogramm – der Unterschied ist erheblich.
            </li>
            <li>
              <strong>Der Nachbrenneffekt fehlt.</strong> Nach intensiven
              Einheiten bleibt der Umsatz noch eine Weile erhöht. Das ist im
              MET-Wert nicht enthalten, macht aber ohnehin meist nur wenige
              Prozent aus.
            </li>
            <li>
              <strong>Fitnesstracker rechnen anders.</strong> Abweichungen zu
              deiner Uhr sind normal – sie nutzen Herzfrequenzdaten und eigene,
              nicht offengelegte Modelle. Weder das eine noch das andere ist
              „richtig“.
            </li>
          </ul>
        </>
      }
      faq={[
        {
          question: "Warum zeigt meine Sportuhr einen anderen Wert an?",
          answer:
            "Uhren schätzen den Verbrauch meist über die Herzfrequenz und berücksichtigen zusätzlich Alter und Geschlecht. MET-Werte gehen dagegen von einem festen Durchschnitt für die Aktivität aus. Beide Verfahren haben eine Fehlerspanne im Bereich von 20 bis 30 Prozent – Unterschiede von 50 bis 100 kcal bei einer Stunde Training sind völlig normal.",
        },
        {
          question: "Welchen Wert soll ich in meine Kalorienbilanz eintragen?",
          answer:
            "Wenn dein Tagesbedarf bereits einen Aktivitätsfaktor enthält: gar keinen. Wenn du mit dem Grundumsatz plus einzelnen Aktivitäten rechnest, nimm den Nettowert – er ist der ehrlichere, weil er den ohnehin anfallenden Ruheumsatz abzieht.",
        },
        {
          question: "Verbrennt Krafttraining wirklich so wenig?",
          answer:
            "Während der Einheit ja, weil ein grosser Teil der Zeit auf Pausen entfällt. Der Nutzen von Krafttraining liegt woanders: Muskelmasse erhöht den Grundumsatz dauerhaft und schützt im Kaloriendefizit vor Muskelverlust. Für die Körperzusammensetzung ist es damit oft wirksamer als reines Ausdauertraining.",
        },
        {
          question: "Zählt Alltagsbewegung auch?",
          answer:
            "Ja, und zwar mehr, als viele denken. Der Anteil an Bewegung ausserhalb des Sports – Gehen, Stehen, Treppensteigen, Hausarbeit – macht bei aktiven Menschen mehrere hundert Kilokalorien am Tag aus und unterscheidet sich zwischen Personen erheblich.",
        },
        {
          question: "Warum ist Schwimmen nicht höher eingestuft?",
          answer:
            "Der MET-Wert hängt stark von Technik und Tempo ab. Ruhiges Bahnenschwimmen liegt bei etwa 5,8 MET, kräftiges Freistilschwimmen bei 9,8 und mehr. Wähle die Variante, die deiner Belastung tatsächlich entspricht.",
        },
      ]}
      sources={["compendium", "dge"]}
    />
  );
}
