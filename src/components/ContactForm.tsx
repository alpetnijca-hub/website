"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitContact, type ContactState } from "@/app/kontakt/actions";
import { Callout } from "@/components/ui/Callout";

const initialState: ContactState = { status: "idle", message: "" };

const inputClasses =
  "w-full rounded-lg border bg-surface px-3 py-2.5 text-base text-text placeholder:text-text-subtle focus:outline-none";

function border(hasError: boolean): string {
  return hasError
    ? "border-danger ring-1 ring-danger"
    : "border-border hover:border-text-subtle";
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-brand px-5 py-3 font-semibold text-on-brand transition-colors hover:bg-brand-strong disabled:opacity-60 sm:w-auto"
    >
      {pending ? "Wird geprüft …" : "Nachricht absenden"}
    </button>
  );
}

/**
 * Kontaktformular mit serverseitiger Prüfung.
 *
 * Ohne konfigurierten Empfänger (CONTACT_WEBHOOK_URL) meldet die Server Action
 * ausdrücklich, dass nichts versendet wurde – ein Erfolg wird nie vorgetäuscht.
 */
export function ContactForm() {
  const [state, formAction] = useActionState(submitContact, initialState);
  const errors = state.errors ?? {};

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <div aria-live="polite">
        {state.status === "demo" && (
          <Callout tone="warnung" title="Nicht versendet – Demo-Zustand">
            {state.message}
          </Callout>
        )}
        {state.status === "sent" && (
          <Callout tone="info" title="Nachricht angekommen">
            {state.message}
          </Callout>
        )}
        {state.status === "error" && (
          <Callout tone="achtung" title="Da fehlt noch etwas">
            {state.message}
          </Callout>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={80}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={`mt-1.5 ${inputClasses} ${border(Boolean(errors.name))}`}
          />
          {errors.name && (
            <p id="name-error" className="mt-1.5 text-sm font-medium text-danger">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text">
            E-Mail-Adresse
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={160}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={`mt-1.5 ${inputClasses} ${border(Boolean(errors.email))}`}
          />
          {errors.email && (
            <p id="email-error" className="mt-1.5 text-sm font-medium text-danger">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-text">
          Betreff
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          maxLength={120}
          aria-invalid={errors.subject ? true : undefined}
          aria-describedby={errors.subject ? "subject-error" : undefined}
          className={`mt-1.5 ${inputClasses} ${border(Boolean(errors.subject))}`}
        />
        {errors.subject && (
          <p id="subject-error" className="mt-1.5 text-sm font-medium text-danger">
            {errors.subject}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="body" className="block text-sm font-medium text-text">
          Deine Nachricht
        </label>
        <p id="body-hint" className="mt-0.5 text-xs text-text-subtle">
          Bitte schick uns keine Gesundheitsdaten oder andere sensible
          Informationen über dieses Formular.
        </p>
        <textarea
          id="body"
          name="body"
          rows={7}
          required
          maxLength={4000}
          aria-invalid={errors.body ? true : undefined}
          aria-describedby={`body-hint${errors.body ? " body-error" : ""}`}
          className={`mt-1.5 ${inputClasses} ${border(Boolean(errors.body))}`}
        />
        {errors.body && (
          <p id="body-error" className="mt-1.5 text-sm font-medium text-danger">
            {errors.body}
          </p>
        )}
      </div>

      {/* Honeypot gegen einfache Bots – für Menschen unsichtbar und
          für Screenreader ausgeblendet. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website (bitte leer lassen)</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <SubmitButton />
    </form>
  );
}
