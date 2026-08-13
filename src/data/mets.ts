/**
 * MET-Werte (Metabolisches Äquivalent) für gängige Aktivitäten.
 *
 * Quelle: Ainsworth BE et al., 2011 Compendium of Physical Activities,
 * Medicine & Science in Sports & Exercise 43(8), 1575–1581.
 *
 * Ein MET entspricht dem Energieumsatz in Ruhe (rund 3,5 ml Sauerstoff je
 * Kilogramm Körpergewicht und Minute). Ein Wert von 8 MET bedeutet also
 * einen etwa achtfachen Umsatz gegenüber ruhigem Sitzen.
 *
 * Die Werte im Compendium sind Durchschnittswerte aus Messreihen. Sie
 * berücksichtigen weder das individuelle Fitnessniveau noch die Technik
 * oder die Umgebungsbedingungen.
 */

export interface MetActivity {
  id: string;
  label: string;
  /** MET-Wert laut Compendium. */
  met: number;
  group: "Ausdauer" | "Kraft & Fitness" | "Ballsport" | "Alltag";
}

export const metActivities: MetActivity[] = [
  // Ausdauer
  { id: "gehen-5", label: "Gehen, gemütlich (5 km/h)", met: 3.5, group: "Ausdauer" },
  { id: "gehen-6", label: "Zügiges Gehen (6,4 km/h)", met: 5.0, group: "Ausdauer" },
  { id: "wandern", label: "Wandern, hügelig", met: 6.0, group: "Ausdauer" },
  { id: "joggen-8", label: "Joggen (8 km/h)", met: 8.3, group: "Ausdauer" },
  { id: "laufen-10", label: "Laufen (10 km/h)", met: 9.8, group: "Ausdauer" },
  { id: "laufen-12", label: "Laufen, schnell (12 km/h)", met: 11.8, group: "Ausdauer" },
  { id: "rad-18", label: "Radfahren (16–19 km/h)", met: 6.8, group: "Ausdauer" },
  { id: "rad-21", label: "Radfahren, zügig (19–22 km/h)", met: 8.0, group: "Ausdauer" },
  { id: "schwimmen-moderat", label: "Schwimmen, ruhig", met: 5.8, group: "Ausdauer" },
  { id: "schwimmen-intensiv", label: "Schwimmen, kräftig", met: 9.8, group: "Ausdauer" },
  { id: "rudern", label: "Rudergerät, moderat", met: 7.0, group: "Ausdauer" },
  { id: "crosstrainer", label: "Crosstrainer, moderat", met: 5.0, group: "Ausdauer" },

  // Kraft & Fitness
  { id: "kraft-moderat", label: "Krafttraining, moderat", met: 3.5, group: "Kraft & Fitness" },
  { id: "kraft-intensiv", label: "Krafttraining, intensiv", met: 6.0, group: "Kraft & Fitness" },
  { id: "zirkeltraining", label: "Zirkeltraining", met: 8.0, group: "Kraft & Fitness" },
  { id: "seilspringen", label: "Seilspringen, moderat", met: 11.8, group: "Kraft & Fitness" },
  { id: "yoga", label: "Yoga (Hatha)", met: 2.5, group: "Kraft & Fitness" },
  { id: "aerobic", label: "Aerobic, allgemein", met: 7.3, group: "Kraft & Fitness" },

  // Ballsport
  { id: "fussball", label: "Fussball, allgemein", met: 7.0, group: "Ballsport" },
  { id: "basketball", label: "Basketball, Spiel", met: 8.0, group: "Ballsport" },
  { id: "tennis", label: "Tennis, Einzel", met: 8.0, group: "Ballsport" },
  { id: "volleyball", label: "Volleyball, Freizeit", met: 3.0, group: "Ballsport" },

  // Alltag
  { id: "hausarbeit", label: "Hausarbeit, Putzen", met: 3.3, group: "Alltag" },
  { id: "gartenarbeit", label: "Gartenarbeit", met: 3.8, group: "Alltag" },
  { id: "treppensteigen", label: "Treppensteigen, zügig", met: 8.8, group: "Alltag" },
];

export function getMetActivity(id: string): MetActivity | undefined {
  return metActivities.find((activity) => activity.id === id);
}

/** Aktivitäten nach Gruppe, für die Auswahlliste im Formular. */
export function metActivityGroups(): {
  group: MetActivity["group"];
  items: MetActivity[];
}[] {
  const groups: MetActivity["group"][] = [
    "Ausdauer",
    "Kraft & Fitness",
    "Ballsport",
    "Alltag",
  ];
  return groups.map((group) => ({
    group,
    items: metActivities.filter((activity) => activity.group === group),
  }));
}
