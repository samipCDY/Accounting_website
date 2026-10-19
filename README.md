# Accounting Website

Marketing website for a Chartered Accountancy firm in Nepal.

**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS v4 · Motion · deployed on Netlify.
Supabase and Server Actions (contact form) are planned but not yet implemented.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

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
  lib/site-config.ts   Firm details, navigation and homepage content
```

## Before launch

All firm details in `src/lib/site-config.ts` marked with `[brackets]` are placeholders —
name, logo, ICAN registration, PAN, address, phone, email and office hours.
Set `NEXT_PUBLIC_SITE_URL` in Netlify to the production domain so canonical URLs,
the sitemap and Open Graph tags are correct.
