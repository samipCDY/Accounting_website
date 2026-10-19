import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { QuoteForm } from "./QuoteForm";

/** Contact details beside the quote form. Not wrapped in Reveal: the form must be visible before JS loads. */
export function QuoteSection() {
  const { contact } = siteConfig;

  return (
    <section aria-labelledby="quote-section-title" className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-ink px-5 py-12 sm:px-12 sm:py-16 lg:px-16">
          <div aria-hidden="true" className="absolute -top-24 -right-24 -z-10 size-80 rounded-full bg-brand-600/30" />
          <div aria-hidden="true" className="absolute -bottom-32 left-1/4 -z-10 size-72 rounded-full bg-brand-500/15" />

          <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
            <div className="lg:pt-4">
              <h2
                id="quote-section-title"
                className="text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl"
              >
                Tell us what you need
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
                Share a few details and we&apos;ll come back with the options, timelines and fees
                before any work begins. Prefer to talk? Reach us directly.
              </p>

              <ul className="mt-10 grid gap-5 text-sm">
                <ContactRow icon={Phone} label="Phone" value={contact.phoneDisplay} href={contact.phoneHref} />
                <ContactRow icon={Mail} label="Email" value={contact.email} href={contact.emailHref} />
                <ContactRow icon={MapPin} label="Office" value={contact.addressLines.join(", ")} />
                <ContactRow icon={Clock} label="Office hours" value={contact.hours} />
              </ul>
            </div>

            <QuoteForm />
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/10 text-brand-200">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-white/60">{label}</span>
        <span className="mt-0.5 block font-medium text-white [overflow-wrap:anywhere]">{value}</span>
      </span>
    </>
  );

  return (
    <li>
      {href ? (
        <a href={href} className="flex items-start gap-4 rounded-xl hover:opacity-90">
          {content}
        </a>
      ) : (
        <div className="flex items-start gap-4">{content}</div>
      )}
    </li>
  );
}
