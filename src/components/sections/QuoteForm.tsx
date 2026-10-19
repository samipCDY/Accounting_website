"use client";

import { useActionState, useEffect, useRef, useState, type ReactNode } from "react";
import { CircleCheck, LoaderCircle, Send } from "lucide-react";
import { submitQuote } from "@/app/actions/quote";
import {
  HONEYPOT_FIELD,
  STARTED_AT_FIELD,
  initialQuoteState,
  quoteLimits,
  serviceOptions,
  type QuoteField,
  type QuoteFormState,
} from "@/lib/quote";

const inputClass =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-muted/70 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-100";

export function QuoteForm() {
  const [state, formAction, pending] = useActionState(submitQuote, initialQuoteState);
  // When the form became usable; sent with each submission for the server's timing check.
  const startedAt = useRef(0);
  const [dismissed, setDismissed] = useState<QuoteFormState | null>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const showSuccess = state.status === "success" && dismissed !== state;
  const errors = state.status === "error" ? state.errors : undefined;
  const values = state.status === "error" ? state.values : undefined;

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (state.status !== "idle") statusRef.current?.focus();
  }, [state]);

  const submitWithTiming = (formData: FormData) => {
    formData.set(STARTED_AT_FIELD, String(startedAt.current));
    formAction(formData);
  };

  if (showSuccess) {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="flex flex-col items-center gap-4 rounded-3xl bg-white p-8 text-center shadow-card focus:outline-none sm:p-10"
      >
        <span className="grid size-14 place-items-center rounded-full bg-brand-50 text-brand-600">
          <CircleCheck className="size-7" aria-hidden="true" />
        </span>
        <h3 className="text-xl font-semibold text-ink">Thank you, {state.name}!</h3>
        <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
          Your quote request has been sent. We&apos;ve emailed you a confirmation and will be in
          touch shortly.
        </p>
        <button
          type="button"
          onClick={() => {
            setDismissed(state);
            startedAt.current = Date.now();
          }}
          className="mt-2 text-sm font-medium text-brand-700 underline-offset-4 hover:underline"
        >
          Send another request
        </button>
      </div>
    );
  }

  const fieldProps = (name: QuoteField) => ({
    id: `quote-${name}`,
    name,
    defaultValue: values?.[name] ?? "",
    "aria-invalid": errors?.[name] ? true : undefined,
    "aria-describedby": errors?.[name] ? `quote-${name}-error` : undefined,
    className: inputClass,
  });

  return (
    <form
      action={submitWithTiming}
      className="relative rounded-3xl bg-white p-6 shadow-card sm:p-8"
      aria-labelledby="quote-form-title"
    >
      <h3 id="quote-form-title" className="text-lg font-semibold text-ink">
        Get a Quote
      </h3>
      <p className="mt-1 text-sm text-muted">
        Fields marked <span aria-hidden="true">*</span>
        <span className="sr-only">with an asterisk</span> are required.
      </p>

      <div
        ref={statusRef}
        tabIndex={-1}
        aria-live="polite"
        className="focus:outline-none"
      >
        {state.status === "error" && (
          <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.message}
          </p>
        )}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Full name" name="name" required error={errors?.name}>
          <input
            {...fieldProps("name")}
            type="text"
            autoComplete="name"
            required
            minLength={quoteLimits.name.min}
            maxLength={quoteLimits.name.max}
          />
        </Field>

        <Field label="Email" name="email" required error={errors?.email}>
          <input
            {...fieldProps("email")}
            type="email"
            autoComplete="email"
            required
            maxLength={quoteLimits.email.max}
          />
        </Field>

        <Field label="Phone" name="phone" required error={errors?.phone}>
          <input
            {...fieldProps("phone")}
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="98XXXXXXXX"
            required
            maxLength={quoteLimits.phone.max}
          />
        </Field>

        <Field label="Company" name="company" error={errors?.company}>
          <input
            {...fieldProps("company")}
            type="text"
            autoComplete="organization"
            maxLength={quoteLimits.company.max}
          />
        </Field>

        <Field label="Service needed" name="service" required error={errors?.service} wide>
          <select {...fieldProps("service")} required>
            <option value="" disabled>
              Select a service
            </option>
            {serviceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>

        <Field label="How can we help?" name="message" required error={errors?.message} wide>
          <textarea
            {...fieldProps("message")}
            rows={4}
            required
            minLength={quoteLimits.message.min}
            maxLength={quoteLimits.message.max}
            placeholder="Briefly describe your business and what you need help with."
          />
        </Field>
      </div>

      {/* Spam protection: honeypot (hidden from people). Fill time is added in submitWithTiming. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`quote-${HONEYPOT_FIELD}`}>Leave this field empty</label>
        <input id={`quote-${HONEYPOT_FIELD}`} type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-6 inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-7 text-base font-medium text-white shadow-sm transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? (
          <>
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            Sending…
          </>
        ) : (
          <>
            Send Request
            <Send className="size-4" aria-hidden="true" />
          </>
        )}
      </button>
      <p className="mt-3 text-center text-xs text-muted">
        We only use your details to respond to this request.
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  required,
  error,
  wide,
  children,
}: {
  label: string;
  name: QuoteField;
  required?: boolean;
  error?: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <label htmlFor={`quote-${name}`} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {required && (
          <span aria-hidden="true" className="text-red-600">
            {" "}
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p id={`quote-${name}-error`} className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
