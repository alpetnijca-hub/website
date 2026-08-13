"use server";

/**
 * Serverseitige Verarbeitung des Kontaktformulars.
 *
 * Wichtig: Solange keine Zustelladresse konfiguriert ist, meldet diese
 * Funktion ausdrücklich, dass die Nachricht NICHT verschickt wurde. Es wird
 * kein Erfolg vorgetäuscht.
 *
 * Um das Formular scharf zu schalten, setze CONTACT_WEBHOOK_URL in .env.local.
 * Das kann sein:
 *   - ein Telegram-Bot-Endpunkt
 *   - ein Dienst wie Formspree oder Web3Forms
 *   - eine eigene Funktion, die eine E-Mail versendet
 * Die Variable hat bewusst KEIN NEXT_PUBLIC_-Präfix und bleibt damit
 * ausschliesslich auf dem Server sichtbar.
 */

export type ContactState = {
  status: "idle" | "demo" | "sent" | "error";
  message: string;
  /** Feldbezogene Fehlermeldungen. */
  errors?: Partial<Record<"name" | "email" | "subject" | "body", string>>;
};

const MAX_LENGTHS = { name: 80, email: 160, subject: 120, body: 4000 };

/** Einfache Plausibilitätsprüfung – keine vollständige RFC-Validierung. */
function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(value);
}

export async function submitContact(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  // Honeypot: von echten Menschen nie ausgefüllt, von einfachen Bots schon.
  const honeypot = String(formData.get("website") ?? "").trim();

  const errors: ContactState["errors"] = {};

  if (name.length < 2) errors.name = "Bitte gib deinen Namen an (mindestens 2 Zeichen).";
  else if (name.length > MAX_LENGTHS.name)
    errors.name = `Der Name darf höchstens ${MAX_LENGTHS.name} Zeichen lang sein.`;

  if (!looksLikeEmail(email))
    errors.email = "Bitte gib eine gültige E-Mail-Adresse an, damit wir antworten können.";
  else if (email.length > MAX_LENGTHS.email)
    errors.email = "Diese E-Mail-Adresse ist zu lang.";

  if (subject.length < 3) errors.subject = "Bitte gib einen kurzen Betreff an.";
  else if (subject.length > MAX_LENGTHS.subject)
    errors.subject = `Der Betreff darf höchstens ${MAX_LENGTHS.subject} Zeichen lang sein.`;

  if (body.length < 10)
    errors.body = "Bitte schreib etwas mehr – mindestens 10 Zeichen.";
  else if (body.length > MAX_LENGTHS.body)
    errors.body = `Die Nachricht darf höchstens ${MAX_LENGTHS.body} Zeichen lang sein.`;

  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Bitte korrigiere die markierten Felder.",
      errors,
    };
  }

  if (honeypot.length > 0) {
    // Automatisierte Einsendung: still verwerfen, aber kein Erfolg melden.
    return {
      status: "error",
      message: "Die Nachricht konnte nicht verarbeitet werden.",
    };
  }

  const webhook = process.env.CONTACT_WEBHOOK_URL;

  if (!webhook) {
    return {
      status: "demo",
      message:
        "Deine Eingaben wurden geprüft, aber NICHT versendet. Für dieses Formular ist noch kein Empfänger eingerichtet. Nutze bitte den Telegram-Kontakt oben – dort erreichst du uns sofort.",
    };
  }

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, subject, message: body }),
    });

    if (!response.ok) {
      return {
        status: "error",
        message:
          "Die Nachricht konnte gerade nicht zugestellt werden. Bitte versuche es später noch einmal oder schreib uns direkt über Telegram.",
      };
    }

    return {
      status: "sent",
      message:
        "Danke für deine Nachricht. Wir haben sie erhalten und melden uns, sobald wir dazu kommen.",
    };
  } catch {
    return {
      status: "error",
      message:
        "Beim Senden ist ein technischer Fehler aufgetreten. Bitte nutze so lange den Telegram-Kontakt.",
    };
  }
}
