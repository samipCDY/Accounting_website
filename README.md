<p align="center">
  <img src="public/logo.svg" alt="Toka logo" width="160">
</p>

<h1 align="center">Toka</h1>

<p align="center">Website for Toka, a Chartered Accountancy firm in Nepal.</p>

**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS v4 · Motion · Resend · deployed on Netlify.
No database: quote requests are emailed to the firm and are not stored.

## Getting started

Requires [Node.js](https://nodejs.org) 20.9 or newer.

**1. Install packages** (first time only, or after pulling new changes):

```bash
npm install
```

**2. Run the site:**

```bash
npm run dev
```

Open **http://localhost:3000** in your browser. Press `Ctrl + C` in the terminal to stop.

**3. (Optional) Enable the Get a Quote emails.** Create your env file:

```bash
# Windows (PowerShell / CMD)
copy .env.example .env.local

# macOS / Linux / Git Bash
cp .env.example .env.local
```

Fill in `RESEND_API_KEY`, `QUOTE_TO_EMAIL` and `QUOTE_FROM_EMAIL` in `.env.local`, then restart
`npm run dev`. The site works without these, but form submissions will show a "couldn't send" message.

**Before deploying**, check everything builds:

```bash
npm run lint
npm run typecheck
npm run build
```

## Quote form (Server Action + Resend)

`src/app/actions/quote.ts` validates the "Get a Quote" form and sends two emails via Resend:

1. **To the firm** (`QUOTE_TO_EMAIL`), with the full request; replying goes straight to the customer.
2. **To the customer**, a confirmation. It does not repeat their message, so the form can't be
   used to send arbitrary text to someone else's inbox.

Spam protection: hidden honeypot field, minimum fill time, per-IP rate limit (5 per 15 min,
best-effort per server instance), server-side validation and length limits, HTML-escaped emails,
and idempotency keys so double submits don't send duplicates.

**Resend setup:**

1. Create an API key at resend.com → `RESEND_API_KEY`.
2. Verify the firm's domain in Resend (DNS records) and use an address on it for
   `QUOTE_FROM_EMAIL`. Gmail addresses cannot be used as the sender. Without a verified domain,
   Resend only delivers to your own account email, so customer confirmations will fail.
3. Set `QUOTE_TO_EMAIL` to the CA's Gmail.
4. Add all variables in Netlify → Site configuration → Environment variables.

## Scripts

| Command             | Purpose                                  |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Start the dev server                     |
| `npm run lint`      | ESLint                                   |
| `npm run typecheck` | Generate route types, then `tsc --noEmit` |
| `npm run build`     | Production build                         |

## Project structure

```
src/
  app/                 layout, homepage, robots.ts, sitemap.ts, global styles/tokens
  components/
    layout/            Navbar, Footer
    sections/          Hero, Services, AboutPreview, Industries, ConsultationCTA
    ui/                Button, Pill, SectionHeading, Logo, Reveal (scroll animation)
  app/actions/quote.ts Server Action for the quote form
  lib/site-config.ts   Firm details, navigation and homepage content
  lib/quote.ts         Quote form fields, limits and validation (shared client/server)
  lib/quote-emails.ts  Email templates (server-only)
```

## Before launch

Firm details in `src/lib/site-config.ts` marked with `[brackets]` are still placeholders —
ICAN registration, PAN, address, phone, email and office hours.
Set `NEXT_PUBLIC_SITE_URL` in Netlify to the production domain so canonical URLs,
the sitemap and Open Graph tags are correct.
