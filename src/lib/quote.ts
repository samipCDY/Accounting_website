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
export const STARTED_AT_FIELD = "startedAt";

export type QuoteField = "name" | "email" | "phone" | "company" | "service" | "message";
export type QuoteValues = Record<QuoteField, string>;
export type QuoteErrors = Partial<Record<QuoteField, string>>;

export type QuoteFormState =
  | { status: "idle" }
  | { status: "success"; name: string }
  | { status: "error"; message: string; errors?: QuoteErrors; values?: QuoteValues };

export const initialQuoteState: QuoteFormState = { status: "idle" };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Digits with optional +, spaces, dashes or brackets; 7–15 digits covers Nepal mobiles and landlines.
const PHONE_RE = /^\+?[\d\s()-]+$/;

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
  else if (email.length > quoteLimits.email.max || !EMAIL_RE.test(email))
    errors.email = "Please enter a valid email address.";

  const phoneDigits = phone.replace(/\D/g, "");
  if (!phone) errors.phone = "Please enter a phone number.";
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
