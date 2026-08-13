import { KCAL_PER_KG_BODY_FAT, round, type Sex } from "./shared";
import { MINIMUM_CALORIES } from "./tdee";

/**
 * Kaloriendefizit und geschätzte Gewichtsveränderung.
 *
 * Rechenweg:
 *   Zufuhr        = Gesamtumsatz − tägliches Defizit
 *   Wochendefizit = tägliches Defizit × 7
 *   Veränderung   = Wochendefizit ÷ 7700 kcal je kg Körperfett
 *
 * Der Umrechnungsfaktor geht auf Wishnofsky (1958) zurück. Er beschreibt
 * reines Fettgewebe und überschätzt den langfristigen Gewichtsverlust, weil
 * der Energieverbrauch mit sinkendem Körpergewicht ebenfalls sinkt
 * (Hall et al. 2011). Der Rechner weist darauf hin.
 */

export type DeficitWarningLevel = "hinweis" | "warnung" | "kritisch";

export interface DeficitWarning {
  level: DeficitWarningLevel;
  title: string;
  text: string;
}

export interface DeficitInput {
  /** Aktueller Gesamtumsatz in kcal pro Tag. */
  tdee: number;
  /** Gewünschtes tägliches Defizit in kcal (positiv). */
  dailyDeficit: number;
  sex: Sex;
}

export interface DeficitResult {
  /** Resultierende Tageszufuhr in kcal. */
  intake: number;
  /** Defizit als Anteil des Gesamtumsatzes in Prozent. */
  deficitPercent: number;
  /** Geschätzte Gewichtsabnahme pro Woche in kg. */
  weeklyChangeKg: number;
  /** Geschätzte Gewichtsabnahme pro Monat (30 Tage) in kg. */
  monthlyChangeKg: number;
  /** Tage bis zu einem Verlust von einem Kilogramm; null bei Defizit 0. */
  daysPerKg: number | null;
  warnings: DeficitWarning[];
}

/** Ab diesem Anteil des Gesamtumsatzes gilt ein Defizit als sehr hoch. */
export const HIGH_DEFICIT_PERCENT = 25;

export function calculateDeficit(input: DeficitInput): DeficitResult {
  const { tdee, dailyDeficit, sex } = input;

  // Negative Defizite werden nicht zugelassen; die Eingabeprüfung fängt sie
  // bereits ab, hier gilt zusätzlich der Sicherheitsboden 0.
  const deficit = Math.max(dailyDeficit, 0);
  const intake = tdee - deficit;
  const deficitPercent = tdee > 0 ? (deficit / tdee) * 100 : 0;

  const weeklyChange = (deficit * 7) / KCAL_PER_KG_BODY_FAT;
  const monthlyChange = (deficit * 30) / KCAL_PER_KG_BODY_FAT;
  const daysPerKg = deficit > 0 ? KCAL_PER_KG_BODY_FAT / deficit : null;

  const minimum = MINIMUM_CALORIES[sex];
  const warnings: DeficitWarning[] = [];

  if (intake < minimum) {
    warnings.push({
      level: "kritisch",
      title: "Diese Zufuhr ist zu niedrig",
      text: `Mit ${Math.round(intake)} kcal pro Tag liegst du unter ${minimum} kcal. In diesem Bereich ist eine ausreichende Versorgung mit Eiweiss, Vitaminen und Mineralstoffen kaum noch möglich. Eine so niedrige Zufuhr gehört fachlich begleitet und ist nichts, was man allein ausprobieren sollte.`,
    });
  }

  if (deficitPercent > HIGH_DEFICIT_PERCENT) {
    warnings.push({
      level: "warnung",
      title: "Sehr hohes Defizit",
      text: `Dein Defizit entspricht ${Math.round(deficitPercent)} % deines Gesamtumsatzes. Ab etwa ${HIGH_DEFICIT_PERCENT} % nehmen Muskelabbau, Heisshunger und Konzentrationsprobleme spürbar zu. Ein kleineres Defizit über einen längeren Zeitraum ist in aller Regel besser durchzuhalten.`,
    });
  }

  if (weeklyChange > 1) {
    warnings.push({
      level: "warnung",
      title: "Sehr schnelles Abnehmtempo",
      text: `Rechnerisch wären das ${round(weeklyChange, 2).toLocaleString("de-DE")} kg pro Woche. Als gut verträglich gilt üblicherweise ein Bereich von etwa 0,25 bis 1,0 kg pro Woche, bei höherem Ausgangsgewicht eher am oberen Rand.`,
    });
  }

  if (deficit === 0) {
    warnings.push({
      level: "hinweis",
      title: "Kein Defizit gewählt",
      text: "Ohne Defizit bleibt das Gewicht rechnerisch gleich. Das ist genau richtig, wenn du dein Gewicht halten möchtest.",
    });
  }

  return {
    intake: round(intake),
    deficitPercent: round(deficitPercent, 1),
    weeklyChangeKg: round(weeklyChange, 2),
    monthlyChangeKg: round(monthlyChange, 2),
    daysPerKg: daysPerKg === null ? null : round(daysPerKg),
    warnings,
  };
}
