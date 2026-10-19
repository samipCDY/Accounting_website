"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { Resend } from "resend";
import {
  HONEYPOT_FIELD,
  STARTED_AT_FIELD,
  readQuoteValues,
  validateQuote,
  type QuoteFormState,
  type QuoteValues,
} from "@/lib/quote";
import { customerConfirmationEmail, firmNotificationEmail } from "@/lib/quote-emails";
import { siteConfig } from "@/lib/site-config";

const MIN_FILL_TIME_MS = 3_000;
const MAX_FILL_TIME_MS = 24 * 60 * 60 * 1000;

// Best-effort, per-instance rate limit. Serverless instances don't share memory,
// so this slows down bursts rather than guaranteeing a global limit.
const RATE_LIMIT = { max: 5, windowMs: 15 * 60 * 1000 };
const submissionsByIp = new Map<string, number[]>();

function isRateLimited(ip: string, now: number) {
  const recent = (submissionsByIp.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT.windowMs);
  if (recent.length >= RATE_LIMIT.max) {
    submissionsByIp.set(ip, recent);
    return true;
  }
  recent.push(now);
  submissionsByIp.set(ip, recent);
  return false;
}

const sendFailure = (values: QuoteValues): QuoteFormState => ({
  status: "error",
  message: `Sorry, we couldn't send your request right now. Please try again in a few minutes, or email us at ${siteConfig.contact.email}.`,
  values,
});

export async function submitQuote(_prev: QuoteFormState, formData: FormData): Promise<QuoteFormState> {
  const now = Date.now();
  const values = readQuoteValues(formData);

  // 1. Honeypot: pretend it worked so bots get no signal.
  const honeypot = formData.get(HONEYPOT_FIELD);
  if (typeof honeypot === "string" && honeypot.length > 0) {
    return { status: "success", name: values.name };
  }

  // 2. Timing: real people take more than a few seconds to fill the form. A visible
  //    message (not a fake success) means a genuinely quick person never loses a request.
  const startedAt = Number(formData.get(STARTED_AT_FIELD));
  const elapsed = now - startedAt;
  if (!Number.isFinite(startedAt) || startedAt <= 0 || elapsed > MAX_FILL_TIME_MS) {
    return {
      status: "error",
      message: `Please reload the page and try again, or email us at ${siteConfig.contact.email}.`,
      values,
    };
  }
  if (elapsed < MIN_FILL_TIME_MS) {
    return {
      status: "error",
      message: "That was quick! Please check your details, then submit again.",
      values,
    };
  }

  // 3. Validation.
  const errors = validateQuote(values);
  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Please check the highlighted fields.", errors, values };
  }

  // 4. Rate limit by client IP (Netlify sets x-nf-client-connection-ip).
  const h = await headers();
  const ip =
    h.get("x-nf-client-connection-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip, now)) {
    return {
      status: "error",
      message: "You've sent several requests in a short time. Please wait a few minutes and try again.",
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
  // Same content within 24h → same key, so double submits don't send duplicate emails.
  const idempotencyKey = createHash("sha256")
    .update(`${values.email}|${values.service}|${values.message}`)
    .digest("hex");

  try {
    const firmEmail = firmNotificationEmail(values);
    const { error } = await resend.emails.send(
      { from, to, replyTo: values.email, ...firmEmail },
      { idempotencyKey: `quote-firm-${idempotencyKey}` },
    );
    if (error) {
      console.error("[quote] Firm notification failed:", error.name, error.message);
      return sendFailure(values);
    }
  } catch (err) {
    console.error("[quote] Firm notification threw:", err);
    return sendFailure(values);
  }

  // The firm has the request; a failed confirmation shouldn't fail the submission.
  try {
    const { error } = await resend.emails.send(
      { from, to: values.email, replyTo: to, ...customerConfirmationEmail(values) },
      { idempotencyKey: `quote-customer-${idempotencyKey}` },
    );
    if (error) console.error("[quote] Customer confirmation failed:", error.name, error.message);
  } catch (err) {
    console.error("[quote] Customer confirmation threw:", err);
  }

  return { status: "success", name: values.name };
}
