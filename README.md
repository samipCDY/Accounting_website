<p align="center">
  <img src="public/logo.svg" alt="Toka logo" width="160">
</p>

<h1 align="center">Toka</h1>

<p align="center">Website template for Toka, a Chartered Accountancy firm in Nepal.</p>

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Motion · Resend · Netlify.
No database: quote requests are emailed to the firm and are not stored.

## Features

- **Six pages:** Home, About, Services, Industries, Contact and Get a Quote.
- **Interactive industries wheel** on the homepage: tiles orbit a tilted ring. Drag left/right to
  spin it with momentum, drag up/down to tilt it, or use the arrow keys. Click or tap a tile to open
  that industry on the Industries page (scrolled to and highlighted). A pause button stops all
  motion; it stays still for visitors who prefer reduced motion.
- **Get a Quote form** (Server Action + Resend): emails each request to the firm and sends the
  customer a confirmation, with validation and spam protection (see below).
- **Responsive** from 320px phones to wide desktops; light theme only.
- **Accessible:** skip link, keyboard support, visible focus, screen-reader labels, no skipped
  heading levels, content visible even if JavaScript or animations fail.
- **SEO:** per-page titles, descriptions and canonical URLs, Open Graph tags, JSON-LD,
  `sitemap.xml` and `robots.txt`.

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

Then fill in `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
RESEND_API_KEY=re_your_key_here
QUOTE_TO_EMAIL=csamip53@gmail.com
QUOTE_FROM_EMAIL="Toka <onboarding@resend.dev>"
```

| Variable               | What it is                                                                 |
| ---------------------- | -------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | The site's address (used for canonical URLs, sitemap, Open Graph)          |
| `RESEND_API_KEY`       | API key from [resend.com](https://resend.com) → API Keys                   |
| `QUOTE_TO_EMAIL`       | Where quote requests are delivered                                         |
| `QUOTE_FROM_EMAIL`     | Sender address — `onboarding@resend.dev` for testing, your domain for live |
| `QUOTE_FORM_SECRET`    | *Optional.* Signs form tokens; derived from `RESEND_API_KEY` if unset      |

Restart `npm run dev` after editing (env files are only read at startup). Without these values the
site still works, but form submissions show a "couldn't send" message.

`.env.local` is git-ignored — never commit it or share your API key.

## Quote form (Server Action + Resend)

`src/app/actions/quote.ts` validates the "Get a Quote" form and sends two emails via Resend:

1. **To the firm** (`QUOTE_TO_EMAIL`), with the full request; replying goes straight to the customer.
2. **To the customer**, a confirmation. It does not repeat their message, so the form can't be
   used to send arbitrary text to someone else's inbox. If this email fails, the request still
   succeeds and the success message says no confirmation was sent.

Spam protection (`src/lib/quote-security.ts`), designed to hold across Netlify serverless instances:

- **Signed form token:** the server signs a token (HMAC) when the form loads. Any instance can
  verify it statelessly; it can't be forged, expires after 2 hours, and enforces a 3-second
  minimum fill time.
- **Shared rate limits** in [Netlify Blobs](https://docs.netlify.com/blobs/overview/) (no database):
  5 requests per IP per 15 min and 3 per recipient email per hour, using compare-and-swap writes.
  IPs and emails are stored only as keyed hashes. Outside Netlify (local dev) the limits fall back
  to in-memory counters.
- Hidden honeypot field, server-side validation (including strict email format and phone length),
  length limits, and HTML-escaped emails.
- **Idempotency keys** cover every field, so an identical resubmission is de-duplicated while a
  corrected name, phone or company is sent as a new request.

Without JavaScript the form shows the email and phone number instead (its submit button stays
disabled because the signed token can't load).

### Resend: testing vs. live

| | Sender (`QUOTE_FROM_EMAIL`) | Firm receives requests | Customer gets confirmation |
| --- | --- | --- | --- |
| **Testing** | `Toka <onboarding@resend.dev>` | ✅ (if `QUOTE_TO_EMAIL` is your Resend account email) | ❌ |
| **Live** | `Toka <quotes@your-domain>` on a domain verified in Resend | ✅ | ✅ |

To go live: in Resend → **Domains** → **Add Domain**, add the DNS records it shows at your domain
provider, wait for **Verified**, then switch `QUOTE_FROM_EMAIL` to an address on that domain.
Gmail addresses can't be used as the sender, and placeholder domains are rejected.

## Deploying to Netlify

1. Push this repository to GitHub, then in Netlify choose **Add new site → Import an existing
   project** and pick the repo. Next.js is detected automatically (build command `npm run build`).
2. In **Site configuration → Environment variables**, add `NEXT_PUBLIC_SITE_URL` (your real
   domain), `RESEND_API_KEY`, `QUOTE_TO_EMAIL` and `QUOTE_FROM_EMAIL`.
3. Deploy. Netlify Blobs (used for rate limiting) needs no setup.
4. Test the form once live. Submitting six times quickly should show a rate-limit message on the
   sixth.

## Scripts

| Command             | Purpose                                   |
| ------------------- | ----------------------------------------- |
| `npm run dev`       | Start the dev server                      |
| `npm run lint`      | ESLint                                    |
| `npm run typecheck` | Generate route types, then `tsc --noEmit` |
| `npm run build`     | Production build                          |

## Project structure

| Page        | Route          |
| ----------- | -------------- |
| Home        | `/`            |
| About       | `/about`       |
| Services    | `/services`    |
| Industries  | `/industries`  |
| Contact     | `/contact`     |
| Get a Quote | `/get-a-quote` |

```
src/
  app/                  one folder per page, plus layout, robots.ts, sitemap.ts, global styles
  app/actions/quote.ts  Server Actions for the quote form (submit + form token)
  components/
    layout/             Navbar, Footer
    sections/           Hero, HeroVisual, Services, AboutPreview, Industries, ImageWheel,
                        QuoteBanner, QuoteSection, QuoteForm
    ui/                 Button, Pill, SectionHeading, PageHeader, Logo, Reveal (scroll animation),
                        HashHighlight (highlights /industries#<slug> targets)
  lib/site-config.ts    Firm details, navigation, services and industries content
  lib/metadata.ts       Per-page SEO metadata helper
  lib/quote.ts          Quote form fields, limits and validation (shared client/server)
  lib/quote-emails.ts   Email templates (server-only)
  lib/quote-security.ts Signed form tokens and shared rate limits (server-only)
```

Almost all content lives in **`src/lib/site-config.ts`**: firm name, contact details,
navigation, services (with "what's included" lists) and industries.

## Before launch

- [ ] Replace the placeholders in `src/lib/site-config.ts` marked with `[brackets]`: phone,
      address, office hours, ICAN registration and PAN.
- [ ] Replace the About text placeholder in `src/components/sections/AboutPreview.tsx`.
- [ ] Confirm each service's "what's included" list matches what the firm actually offers.
- [ ] *(Optional)* Add photos to the industries wheel: put them in `public/wheel/` and add
      `image: "/wheel/your-photo.jpg"` to that industry in `site-config.ts`. Tiles show a colour
      and icon until then.
- [ ] Verify a domain in Resend and set `QUOTE_FROM_EMAIL` to an address on it.
- [ ] Set all environment variables in Netlify, with `NEXT_PUBLIC_SITE_URL` as the production
      domain.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| Form says "couldn't send your request" | Check the three Resend variables in `.env.local` and restart `npm run dev`. |
| "domain is not verified" in the terminal | `QUOTE_FROM_EMAIL` uses a domain you haven't verified — use `onboarding@resend.dev` for testing. |
| Quote email not arriving | Check Spam. With the test sender, `QUOTE_TO_EMAIL` must be your Resend account email. |
| "Another next dev server is already running" | A dev server is already open — use it, or stop it with `Ctrl + C` first. |
| Changes to `.env.local` ignored | Restart `npm run dev`. |
