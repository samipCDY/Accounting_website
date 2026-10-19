import Link from "next/link";
import type { ReactNode } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { QUOTE_HREF, navItems, services, siteConfig } from "@/lib/site-config";

// Cached so the prerendered shell can include the year (cacheComponents disallows uncached `new Date()`).
async function CurrentYear() {
  "use cache";
  return <>{new Date().getFullYear()}</>;
}

export function Footer() {
  const { contact, credentials } = siteConfig;

  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="flex flex-col gap-5">
          <Logo inverted />
          <p className="text-sm leading-relaxed text-white/75">{siteConfig.description}</p>
          <dl className="space-y-1 text-xs text-white/60">
            <div>
              <dt className="sr-only">ICAN firm registration</dt>
              <dd>{credentials.icanFirmRegNo}</dd>
            </div>
            <div>
              <dt className="sr-only">PAN</dt>
              <dd>{credentials.panNo}</dd>
            </div>
          </dl>
        </div>

        <FooterColumn title="Quick links">
          {[...navItems, { label: "Get a Quote", href: QUOTE_HREF }].map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="text-white/75 transition-colors hover:text-white">
                {item.label}
              </Link>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title="Services">
          {services.map((service) => (
            <li key={service.title}>
              <Link href="/services" className="text-white/75 transition-colors hover:text-white">
                {service.title}
              </Link>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title="Contact">
          <li className="flex gap-3 text-white/75">
            <MapPin className="mt-0.5 size-4 shrink-0 text-brand-400" aria-hidden="true" />
            <address className="not-italic">
              {contact.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </li>
          <li>
            <a href={contact.phoneHref} className="flex gap-3 text-white/75 hover:text-white">
              <Phone className="mt-0.5 size-4 shrink-0 text-brand-400" aria-hidden="true" />
              {contact.phoneDisplay}
            </a>
          </li>
          <li>
            <a href={contact.emailHref} className="flex gap-3 break-all text-white/75 hover:text-white">
              <Mail className="mt-0.5 size-4 shrink-0 text-brand-400" aria-hidden="true" />
              {contact.email}
            </a>
          </li>
        </FooterColumn>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © <CurrentYear /> {siteConfig.name}. All rights reserved.
          </p>
          <p>{siteConfig.tagline} · Nepal</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="text-sm font-semibold tracking-wide text-white">{title}</h2>
      <ul className="mt-5 space-y-3 text-sm">{children}</ul>
    </div>
  );
}
