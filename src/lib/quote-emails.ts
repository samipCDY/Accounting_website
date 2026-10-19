import "server-only";
import { siteConfig } from "@/lib/site-config";
import type { QuoteValues } from "@/lib/quote";

type Email = { subject: string; html: string; text: string };

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// Subjects are single-line headers; strip anything that could break them.
const oneLine = (value: string) => value.replace(/[\r\n]+/g, " ").slice(0, 80);

const layout = (body: string) => `<!doctype html>
<html><body style="margin:0;background:#f4f8fb;font-family:Arial,Helvetica,sans-serif;color:#0f1e3d">
  <div style="max-width:560px;margin:0 auto;padding:32px 16px">
    <div style="background:#ffffff;border-radius:16px;padding:32px;border:1px solid #e3eaf1">${body}</div>
    <p style="font-size:12px;color:#5b6880;text-align:center;margin-top:16px">${escapeHtml(siteConfig.name)} · ${escapeHtml(siteConfig.tagline)}</p>
  </div>
</body></html>`;

/** Notification sent to the firm with the full request. */
export function firmNotificationEmail(v: QuoteValues): Email {
  const rows: [string, string][] = [
    ["Name", v.name],
    ["Email", v.email],
    ["Phone", v.phone],
    ["Company", v.company || "—"],
    ["Service", v.service],
  ];

  const html = layout(`
    <h1 style="font-size:20px;margin:0 0 16px">New quote request</h1>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      ${rows
        .map(
          ([label, value]) =>
            `<tr><td style="padding:8px 0;color:#5b6880;width:110px;vertical-align:top">${label}</td><td style="padding:8px 0">${escapeHtml(value)}</td></tr>`,
        )
        .join("")}
    </table>
    <h2 style="font-size:15px;margin:24px 0 8px">Message</h2>
    <p style="font-size:14px;line-height:1.6;white-space:pre-wrap;margin:0">${escapeHtml(v.message)}</p>
    <p style="font-size:12px;color:#5b6880;margin-top:24px">Reply to this email to respond directly to ${escapeHtml(v.name)}.</p>
  `);

  const text = [
    "New quote request",
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Message:",
    v.message,
  ].join("\n");

  return { subject: `New quote request: ${oneLine(v.service)} — ${oneLine(v.name)}`, html, text };
}

/**
 * Confirmation sent to the customer. Deliberately does not echo their free-text
 * message, so the form can't be used to send arbitrary content to third parties.
 */
export function customerConfirmationEmail(v: QuoteValues): Email {
  const { contact } = siteConfig;

  const html = layout(`
    <h1 style="font-size:20px;margin:0 0 16px">Thank you, ${escapeHtml(v.name)}</h1>
    <p style="font-size:14px;line-height:1.6;margin:0 0 12px">
      We've received your quote request for <strong>${escapeHtml(v.service)}</strong>.
      A member of our team will review it and get back to you shortly.
    </p>
    <p style="font-size:14px;line-height:1.6;margin:0 0 12px">
      If your matter is urgent, call us on ${escapeHtml(contact.phoneDisplay)}.
    </p>
    <p style="font-size:14px;line-height:1.6;margin:24px 0 0">Kind regards,<br>${escapeHtml(siteConfig.name)}</p>
  `);

  const text = [
    `Thank you, ${v.name}`,
    "",
    `We've received your quote request for ${v.service}. A member of our team will review it and get back to you shortly.`,
    "",
    `If your matter is urgent, call us on ${contact.phoneDisplay}.`,
    "",
    "Kind regards,",
    siteConfig.name,
  ].join("\n");

  return { subject: `We've received your quote request — ${siteConfig.name}`, html, text };
}
