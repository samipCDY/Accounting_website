import { services } from "@/lib/site-config";

/** Shared between the quote form (client) and the submitQuote Server Action. */

export const OTHER_SERVICE = "Other / Not sure";
export const serviceOptions = [...services.map((s) => s.title), OTHER_SERVICE];

export const quoteLimits = {
  name: { min: 2, max: 80 },
  email: { max: 120 },
  phone: { max: 20 },
  company: { max: 120 },
  message: { min: 10, max: 2000 },
} as const;

/** Honeypot field name — hidden from people, often filled in by bots. */
export const HONEYPOT_FIELD = "website";
/** Hidden field carrying the signed form token issued by the server (see quote-security.ts). */
export const TOKEN_FIELD = "formToken";

export type QuoteField = "name" | "email" | "phone" | "company" | "service" | "message";
export type QuoteValues = Record<QuoteField, string>;
export type QuoteErrors = Partial<Record<QuoteField, string>>;

export type QuoteFormState =
  | { status: "idle" }
  /** `confirmationSent` is false when the firm got the request but the customer's copy failed. */
  | { status: "success"; name: string; confirmationSent: boolean }
  | {
      status: "error";
      message: string;
      errors?: QuoteErrors;
      values?: QuoteValues;
      /** Set when the form token was missing/expired, so the client fetches a fresh one. */
      code?: "token";
    };

export const initialQuoteState: QuoteFormState = { status: "idle" };

// Digits with optional +, spaces, dashes or brackets; 7–15 digits covers Nepal mobiles and landlines.
const PHONE_RE = /^\+?[\d\s()-]+$/;

// Dot-atom local part: no leading, trailing or consecutive dots; no quotes, spaces, commas or <>.
const EMAIL_LOCAL_RE = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*$/;
const DOMAIN_LABEL_RE = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/;
const TLD_RE = /^[A-Za-z]{2,63}$/;

/** Practical address check: rejects malformed input like `a@b..com`, `.a@b.com`, `a@-b.com`, `a@b.c`, `a,b@c.com`. */
export function isValidEmail(email: string): boolean {
  if (email.length > quoteLimits.email.max) return false;
  const at = email.indexOf("@");
  if (at < 1 || at !== email.lastIndexOf("@")) return false;

  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  if (local.length > 64 || !EMAIL_LOCAL_RE.test(local)) return false;
  if (domain.length > 253) return false;

  const labels = domain.split(".");
  if (labels.length < 2) return false;
  const tld = labels[labels.length - 1];
  return labels.every((label) => DOMAIN_LABEL_RE.test(label)) && TLD_RE.test(tld);
}

export function readQuoteValues(formData: FormData): QuoteValues {
  const get = (key: QuoteField) => {
    const value = formData.get(key);
    return typeof value === "string" ? value.trim() : "";
  };
  return {
    name: get("name"),
    email: get("email").toLowerCase(),
    phone: get("phone"),
    company: get("company"),
    service: get("service"),
    message: get("message"),
  };
}

export function validateQuote(values: QuoteValues): QuoteErrors {
  const errors: QuoteErrors = {};
  const { name, email, phone, company, service, message } = values;

  if (name.length < quoteLimits.name.min) errors.name = "Please enter your full name.";
  else if (name.length > quoteLimits.name.max) errors.name = `Name must be under ${quoteLimits.name.max} characters.`;

  if (!email) errors.email = "Please enter your email address.";
  else if (!isValidEmail(email)) errors.email = "Please enter a valid email address.";

  const phoneDigits = phone.replace(/\D/g, "");
  if (!phone) errors.phone = "Please enter a phone number.";
  else if (phone.length > quoteLimits.phone.max)
    errors.phone = `Phone number must be ${quoteLimits.phone.max} characters or fewer.`;
  else if (!PHONE_RE.test(phone) || phoneDigits.length < 7 || phoneDigits.length > 15)
    errors.phone = "Please enter a valid phone number.";

  if (company.length > quoteLimits.company.max)
    errors.company = `Company name must be under ${quoteLimits.company.max} characters.`;

  if (!serviceOptions.includes(service)) errors.service = "Please choose a service.";

  if (message.length < quoteLimits.message.min)
    errors.message = "Please tell us a little more about what you need.";
  else if (message.length > quoteLimits.message.max)
    errors.message = `Message must be under ${quoteLimits.message.max} characters.`;

  return errors;
}
