"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { Resend, type CreateEmailOptions } from "resend";
import {
  HONEYPOT_FIELD,
  TOKEN_FIELD,
  readQuoteValues,
  validateQuote,
  type QuoteFormState,
  type QuoteValues,
} from "@/lib/quote";
import { customerConfirmationEmail, firmNotificationEmail } from "@/lib/quote-emails";
import { isRateLimited, issueFormToken, rateLimitKey, verifyFormToken } from "@/lib/quote-security";
import { siteConfig } from "@/lib/site-config";

const LIMITS = {
  /** Submissions per visitor IP. */
  ip: { max: 5, windowMs: 15 * 60 * 1000 },
  /** Confirmation emails per recipient, so the form can't be used to flood someone's inbox. */
  recipient: { max: 3, windowMs: 60 * 60 * 1000 },
};

const sendFailure = (values: QuoteValues): QuoteFormState => ({
  status: "error",
  message: `Sorry, we couldn't send your request right now. Please try again in a few minutes, or email us at ${siteConfig.contact.email}.`,
  values,
});

/** Issued when the form loads; proves the request came from our page and when it was opened. */
export async function getQuoteFormToken(): Promise<string> {
  return issueFormToken();
}

/**
 * Sends with an idempotency key so retries of the same request don't email twice. If Resend
 * still rejects the key as reused with different content (e.g. an email template changed
 * between deploys), the send is retried once without it rather than failing the request.
 */
async function sendEmail(resend: Resend, email: CreateEmailOptions, idempotencyKey: string) {
  const result = await resend.emails.send(email, { idempotencyKey });
  if (result.error?.name === "invalid_idempotent_request") {
    console.warn("[quote] Idempotency key reused with different content; sending without it.");
    return resend.emails.send(email);
  }
  return result;
}

export async function submitQuote(_prev: QuoteFormState, formData: FormData): Promise<QuoteFormState> {
  const values = readQuoteValues(formData);

  // 1. Honeypot: pretend it worked so bots get no signal.
  const honeypot = formData.get(HONEYPOT_FIELD);
  if (typeof honeypot === "string" && honeypot.length > 0) {
    return { status: "success", name: values.name, confirmationSent: true };
  }

  // 2. Signed form token: must come from our page, and not be submitted implausibly fast.
  //    A visible message (not a fake success) means a genuinely quick person never loses a request.
  const token = verifyFormToken(formData.get(TOKEN_FIELD));
  if (!token.ok) {
    return token.reason === "too-fast"
      ? { status: "error", message: "That was quick! Please check your details, then submit again.", values }
      : {
          status: "error",
          code: "token",
          message: `This form has expired. Please submit again, or email us at ${siteConfig.contact.email}.`,
          values,
        };
  }

  // 3. Validation (authoritative; the browser checks are only a convenience).
  const errors = validateQuote(values);
  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Please check the highlighted fields.", errors, values };
  }

  // 4. Rate limits shared across all server instances (Netlify sets x-nf-client-connection-ip).
  const h = await headers();
  const ip =
    h.get("x-nf-client-connection-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (
    (await isRateLimited(rateLimitKey("ip", ip), LIMITS.ip)) ||
    (await isRateLimited(rateLimitKey("email", values.email), LIMITS.recipient))
  ) {
    return {
      status: "error",
      message: `You've sent several requests in a short time. Please wait a while and try again, or email us at ${siteConfig.contact.email}.`,
      values,
    };
  }

  // 5. Send emails.
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.QUOTE_TO_EMAIL;
  const from = process.env.QUOTE_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    console.error("[quote] Missing RESEND_API_KEY, QUOTE_TO_EMAIL or QUOTE_FROM_EMAIL");
    return sendFailure(values);
  }

  const resend = new Resend(apiKey);
  // Keyed on every field: an identical resubmission is de-duplicated, while a corrected
  // name, phone, company or message is a new request with its own key.
  const requestHash = createHash("sha256").update(JSON.stringify(values)).digest("hex");

  try {
    const { error } = await sendEmail(
      resend,
      { from, to, replyTo: values.email, ...firmNotificationEmail(values) },
      `quote-firm-${requestHash}`,
    );
    // A concurrent identical request is already sending this exact email.
    if (error && error.name !== "concurrent_idempotent_requests") {
      console.error("[quote] Firm notification failed:", error.name, error.message);
      return sendFailure(values);
    }
  } catch (err) {
    console.error("[quote] Firm notification threw:", err);
    return sendFailure(values);
  }

  // The firm has the request; a failed confirmation shouldn't fail the submission,
  // but the success message must not claim it was sent.
  let confirmationSent = false;
  try {
    const { error } = await sendEmail(
      resend,
      { from, to: values.email, replyTo: to, ...customerConfirmationEmail(values) },
      `quote-customer-${requestHash}`,
    );
    if (error) console.error("[quote] Customer confirmation failed:", error.name, error.message);
    else confirmationSent = true;
  } catch (err) {
    console.error("[quote] Customer confirmation threw:", err);
  }

  return { status: "success", name: values.name, confirmationSent };
}
