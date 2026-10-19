import { Clock, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { QuoteBanner } from "@/components/sections/QuoteBanner";
import { pageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";

export const metadata = pageMetadata({
  title: "Contact Us",
  description: `Contact ${siteConfig.name} by phone or email, or visit our office in Nepal.`,
  path: "/contact",
});

export default function ContactPage() {
  const { contact } = siteConfig;

  const cards: { icon: LucideIcon; label: string; lines: readonly string[]; href?: string }[] = [
    { icon: Phone, label: "Call us", lines: [contact.phoneDisplay], href: contact.phoneHref },
    { icon: Mail, label: "Email us", lines: [contact.email], href: contact.emailHref },
    { icon: MapPin, label: "Visit our office", lines: contact.addressLines },
    { icon: Clock, label: "Office hours", lines: [contact.hours] },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="We'd love to hear from you"
        description="Call, email or visit us during office hours. For a fee estimate, use the Get a Quote form and we'll get back to you."
      />

      <section aria-label="Contact details" className="py-16 sm:py-20">
        <ul className="mx-auto grid max-w-7xl gap-5 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {cards.map(({ icon: Icon, label, lines, href }) => {
            const body = (
              <>
                <span className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <h2 className="mt-6 text-lg font-semibold text-ink">{label}</h2>
                <p className="mt-2 text-sm leading-relaxed break-words text-ink-soft">
                  {lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </>
            );
            const cardClass = "block h-full rounded-3xl bg-white p-7 shadow-card ring-1 ring-line";
            return (
              <li key={label}>
                {href ? (
                  <a href={href} className={`${cardClass} transition-colors hover:ring-brand-200`}>
                    {body}
                  </a>
                ) : (
                  <div className={cardClass}>{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <QuoteBanner />
    </>
  );
}
