import { round } from "./shared";
import { getMetActivity } from "@/data/mets";

/**
 * Kalorienverbrauch einer Aktivität auf MET-Basis.
 *
 * Formel:
 *   kcal pro Minute = MET × 3,5 × Körpergewicht in kg ÷ 200
 *   Gesamtverbrauch = kcal pro Minute × Dauer in Minuten
 *
 * Herleitung: Ein MET entspricht einer Sauerstoffaufnahme von 3,5 ml je
 * Kilogramm Körpergewicht und Minute. Ein Liter verbrauchter Sauerstoff
 * setzt rund 5 kcal frei, woraus sich der Teiler 200 ergibt
 * (1000 ml ÷ 5 kcal = 200).
 *
 * Der so berechnete Wert ist der Bruttoverbrauch: Er enthält auch die
 * Energie, die der Körper in dieser Zeit ohnehin verbraucht hätte.
 */

export interface ActivityBurnResult {
  /** Bruttoverbrauch der Aktivität in kcal. */
  totalKcal: number;
  /** Verbrauch pro Minute in kcal. */
  kcalPerMinute: number;
  /**
   * Nettoverbrauch: Bruttoverbrauch abzüglich des Ruheumsatzes für dieselbe
   * Zeitspanne (1 MET). Dieser Wert ist relevant, wenn die Aktivität zusätzlich
   * zum bereits berechneten Gesamtumsatz betrachtet wird.
   */
  netKcal: number;
  /** Verwendeter MET-Wert. */
  met: number;
}

/** Umrechnungsfaktor der MET-Formel (siehe Herleitung oben). */
const MET_DIVISOR = 200;
const ML_OXYGEN_PER_MET = 3.5;

export function calculateActivityBurn(input: {
  weightKg: number;
  activityId: string;
  durationMinutes: number;
}): ActivityBurnResult | null {
  const activity = getMetActivity(input.activityId);
  if (!activity) return null;
  if (input.durationMinutes <= 0 || input.weightKg <= 0) return null;

  const kcalPerMinute =
    (activity.met * ML_OXYGEN_PER_MET * input.weightKg) / MET_DIVISOR;
  const total = kcalPerMinute * input.durationMinutes;

  // Ruheumsatz derselben Dauer entspricht 1 MET.
  const restingPerMinute =
    (1 * ML_OXYGEN_PER_MET * input.weightKg) / MET_DIVISOR;
  const net = total - restingPerMinute * input.durationMinutes;

  return {
    totalKcal: round(total),
    kcalPerMinute: round(kcalPerMinute, 1),
    netKcal: round(Math.max(net, 0)),
    met: activity.met,
  };
}
