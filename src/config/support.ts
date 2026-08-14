/**
 * Trinkgeld- und Spendenfunktion.
 *
 * Hier stehen **keine** echten Zahlungsadressen im Quelltext. Alles kommt aus
 * Umgebungsvariablen, die du bei Vercel einträgst – so liegt keine
 * Zahlungsadresse im öffentlichen Repository, und du kannst sie ändern, ohne
 * den Code anzufassen.
 *
 * Ist keine einzige Variable gesetzt, verschwindet die Funktion vollständig:
 * kein Menüpunkt, keine Karte, keine Seite in der Sitemap. Es gibt also
 * niemals einen Knopf, der ins Leere führt.
 *
 * Wie du die Werte bekommst, steht Schritt für Schritt in `docs/SPENDEN.md`.
 */

function clean(value: string | undefined): string {
  const trimmed = (value ?? "").trim();
  // Platzhalter aus der Beispieldatei sollen nicht als echte Konten gelten.
  if (!trimmed || trimmed.startsWith("dein")) return "";
  return trimmed;
}

/**
 * Räumt einen Benutzernamen auf, bevor er in eine Adresse eingesetzt wird.
 *
 * Bei allen drei Anbietern ist der Benutzername ohne Zusätze anzugeben. Wer
 * ihn aus dem Profil kopiert, hat aber schnell ein "@" davor oder gleich die
 * ganze Adresse in der Zwischenablage – und beides führt zu einer
 * Fehlerseite beim Anbieter statt zu einer Zahlung. Deshalb wird hier
 * abgeschnitten, was nicht zum Namen gehört.
 */
function handle(value: string | undefined): string {
  let name = clean(value);
  if (!name) return "";
  // Vollständige Adresse eingetragen: nur den letzten Pfadteil behalten.
  if (name.includes("/")) {
    name = name.split("/").filter(Boolean).pop() ?? "";
  }
  // Führendes @ entfernen, Querystring abschneiden.
  name = name.replace(/^@+/, "").split("?")[0].trim();
  return name;
}

/** Benutzername bei PayPal.me, z. B. "alvinr" – ohne paypal.me/ davor. */
const paypalHandle = handle(process.env.NEXT_PUBLIC_PAYPAL_ME);

/** Benutzername bei Ko-fi, z. B. "rechnerliste". */
const kofiHandle = handle(process.env.NEXT_PUBLIC_KOFI);

/** Benutzername bei Buy Me a Coffee. */
const bmacHandle = handle(process.env.NEXT_PUBLIC_BUYMEACOFFEE);

/** Vollständige Adresse eines Stripe-Zahlungslinks. */
const stripeLink = clean(process.env.NEXT_PUBLIC_STRIPE_LINK);

export interface SupportOption {
  id: string;
  /** Anzeigename des Anbieters. */
  name: string;
  /** Ein Satz darüber, was den Besucher dort erwartet. */
  note: string;
  /** Zieladresse ohne Betrag. */
  url: string;
  /**
   * Adresse für einen festen Betrag in Euro, wenn der Anbieter das über die
   * Adresse unterstützt. Sonst null – dann wird der Betrag beim Anbieter
   * gewählt.
   */
  amountUrl: ((euro: number) => string) | null;
}

export const supportOptions: SupportOption[] = [
  paypalHandle && {
    id: "paypal",
    name: "PayPal",
    note: "Zahlung mit PayPal-Konto, Karte oder Lastschrift.",
    url: `https://paypal.me/${encodeURIComponent(paypalHandle)}`,
    amountUrl: (euro: number) =>
      `https://paypal.me/${encodeURIComponent(paypalHandle)}/${euro}EUR`,
  },
  kofiHandle && {
    id: "kofi",
    name: "Ko-fi",
    note: "Ohne Konto nutzbar, Betrag wird dort gewählt.",
    url: `https://ko-fi.com/${encodeURIComponent(kofiHandle)}`,
    amountUrl: null,
  },
  bmacHandle && {
    id: "bmac",
    name: "Buy Me a Coffee",
    note: "Ohne Konto nutzbar, Betrag wird dort gewählt.",
    url: `https://buymeacoffee.com/${encodeURIComponent(bmacHandle)}`,
    amountUrl: null,
  },
  stripeLink && {
    id: "stripe",
    name: "Kreditkarte",
    note: "Sichere Zahlungsseite von Stripe, ohne Anmeldung.",
    url: stripeLink,
    amountUrl: null,
  },
].filter((option): option is SupportOption => Boolean(option));

/** Vorgeschlagene Beträge in Euro. Bewusst niedrig gehalten. */
export const supportAmounts = [2, 5, 10];

/** Wahr, sobald mindestens ein Zahlungsweg eingerichtet ist. */
export const supportEnabled = supportOptions.length > 0;

/**
 * Wofür das Geld verwendet wird. Dieser Satz erscheint auf der Seite und muss
 * der Wahrheit entsprechen – wer hier etwas anderes schreibt, als er mit dem
 * Geld tut, täuscht seine Besucher.
 *
 * Der Text wird über NEXT_PUBLIC_SUPPORT_PURPOSE gesetzt. Ist er leer, steht
 * auf der Seite nur, dass die Einnahmen dem Betrieb und der Weiterentwicklung
 * zugutekommen – eine Aussage, die immer stimmt.
 */
export const supportPurpose = clean(process.env.NEXT_PUBLIC_SUPPORT_PURPOSE);
