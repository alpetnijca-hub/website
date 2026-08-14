/**
 * Zentrale Quellensammlung.
 *
 * Jede Rechnerseite verweist auf die Einträge, die ihrer Berechnung tatsächlich
 * zugrunde liegen. Es werden ausschliesslich real existierende Veröffentlichungen
 * und Institutionen genannt – keine erfundenen Studien und keine Quellen,
 * die eine Formel nur scheinbar belegen.
 */

export interface Source {
  id: string;
  /** Autor bzw. Institution und Jahr. */
  citation: string;
  /** Titel der Veröffentlichung. */
  title: string;
  /** Fundstelle, z. B. Zeitschrift oder Herausgeber. */
  publication: string;
  /** Optionaler Link – nur gesetzt, wenn die Adresse stabil ist. */
  url?: string;
}

export const sources = {
  mifflin: {
    id: "mifflin",
    citation: "Mifflin MD, St Jeor ST, Hill LA, Scott BJ, Daugherty SA, Koh YO (1990)",
    title:
      "A new predictive equation for resting energy expenditure in healthy individuals",
    publication: "The American Journal of Clinical Nutrition 51(2), 241–247",
    url: "https://doi.org/10.1093/ajcn/51.2.241",
  },
  whoBmi: {
    id: "whoBmi",
    citation: "Weltgesundheitsorganisation (WHO)",
    title: "Obesity and overweight – Fact sheet",
    publication: "WHO, Genf",
    url: "https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight",
  },
  compendium: {
    id: "compendium",
    citation: "Ainsworth BE, Haskell WL, Herrmann SD et al. (2011)",
    title:
      "2011 Compendium of Physical Activities: a second update of codes and MET values",
    publication: "Medicine & Science in Sports & Exercise 43(8), 1575–1581",
    url: "https://doi.org/10.1249/MSS.0b013e31821ece12",
  },
  issnProtein: {
    id: "issnProtein",
    citation: "Jäger R, Kerksick CM, Campbell BI et al. (2017)",
    title:
      "International Society of Sports Nutrition Position Stand: protein and exercise",
    publication: "Journal of the International Society of Sports Nutrition 14, 20",
    url: "https://doi.org/10.1186/s12970-017-0177-8",
  },
  dge: {
    id: "dge",
    citation: "Deutsche Gesellschaft für Ernährung (DGE)",
    title: "D-A-CH-Referenzwerte für die Nährstoffzufuhr",
    publication: "DGE, Bonn",
    url: "https://www.dge.de/wissenschaft/referenzwerte/",
  },
  efsaWater: {
    id: "efsaWater",
    citation: "EFSA Panel on Dietetic Products, Nutrition and Allergies (2010)",
    title: "Scientific Opinion on Dietary Reference Values for water",
    publication: "EFSA Journal 8(3), 1459",
    url: "https://doi.org/10.2903/j.efsa.2010.1459",
  },
  devine: {
    id: "devine",
    citation: "Devine BJ (1974)",
    title: "Gentamicin therapy",
    publication: "Drug Intelligence & Clinical Pharmacy 8(11), 650–655",
  },
  robinson: {
    id: "robinson",
    citation: "Robinson JD, Lupkiewicz SM, Palenik L et al. (1983)",
    title: "Determination of ideal body weight for drug dosage calculations",
    publication: "American Journal of Hospital Pharmacy 40(6), 1016–1019",
  },
  miller: {
    id: "miller",
    citation: "Miller DR, Carlson JD, Loyd BJ, Day BJ (1983)",
    title: "Determining ideal body weight (Letter)",
    publication: "American Journal of Hospital Pharmacy 40(10), 1622",
  },
  hamwi: {
    id: "hamwi",
    citation: "Hamwi GJ (1964)",
    title: "Therapy: changing dietary concepts",
    publication:
      "In: Danowski TS (Hrsg.), Diabetes Mellitus: Diagnosis and Treatment, American Diabetes Association",
  },
  wishnofsky: {
    id: "wishnofsky",
    citation: "Wishnofsky M (1958)",
    title: "Caloric equivalents of gained or lost weight",
    publication: "The American Journal of Clinical Nutrition 6(5), 542–546",
    url: "https://doi.org/10.1093/ajcn/6.5.542",
  },
  hall: {
    id: "hall",
    citation: "Hall KD, Sacks G, Chandramohan D et al. (2011)",
    title:
      "Quantification of the effect of energy imbalance on bodyweight",
    publication: "The Lancet 378(9793), 826–837",
    url: "https://doi.org/10.1016/S0140-6736(11)60812-X",
  },
  amdr: {
    id: "amdr",
    citation: "Institute of Medicine (2005)",
    title:
      "Dietary Reference Intakes for Energy, Carbohydrate, Fiber, Fat, Fatty Acids, Cholesterol, Protein, and Amino Acids",
    publication: "The National Academies Press, Washington DC",
    url: "https://doi.org/10.17226/10490",
  },
  ecb: {
    id: "ecb",
    citation: "Europäische Zentralbank",
    title: "Euro foreign exchange reference rates",
    publication: "EZB, Frankfurt am Main – täglich veröffentlichte Referenzkurse",
    url: "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html",
  },
  arbzg: {
    id: "arbzg",
    citation: "Bundesrepublik Deutschland",
    title: "Arbeitszeitgesetz (ArbZG), insbesondere § 3 und § 4",
    publication: "Bundesministerium der Justiz, Gesetze im Internet",
    url: "https://www.gesetze-im-internet.de/arbzg/",
  },
} as const satisfies Record<string, Source>;

export type SourceId = keyof typeof sources;

export function getSources(ids: readonly SourceId[]): Source[] {
  return ids.map((id) => sources[id]);
}
