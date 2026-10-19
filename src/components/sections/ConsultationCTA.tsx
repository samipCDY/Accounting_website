import { Clock, Mail, Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/site-config";

export function ConsultationCTA() {
  const { contact } = siteConfig;

  return (
    <section id="contact" aria-labelledby="contact-title" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[2rem] bg-ink px-6 py-14 sm:px-12 sm:py-16 lg:px-16">
            <div aria-hidden="true" className="absolute -top-24 -right-24 -z-10 size-80 rounded-full bg-brand-600/30" />
            <div aria-hidden="true" className="absolute -bottom-32 left-1/3 -z-10 size-72 rounded-full bg-brand-500/15" />

            <div className="grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <h2
                  id="contact-title"
                  className="text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl"
                >
                  Book a consultation with a Chartered Accountant
                </h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
                  Tell us about your business and what you need help with. We&apos;ll explain the
                  options, timelines and fees before any work begins.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
                  <ButtonLink href={contact.phoneHref} variant="light">
                    <Phone className="size-4" aria-hidden="true" />
                    Call us
                  </ButtonLink>
                  <ButtonLink href={contact.emailHref} variant="ghost-light">
                    <Mail className="size-4" aria-hidden="true" />
                    Email us
                  </ButtonLink>
                </div>
              </div>

              <dl className="grid gap-5 rounded-3xl bg-white/5 p-6 text-sm ring-1 ring-white/10 sm:p-8">
                <ContactRow icon={Phone} label="Phone" value={contact.phoneDisplay} />
                <ContactRow icon={Mail} label="Email" value={contact.email} />
                <ContactRow icon={Clock} label="Office hours" value={contact.hours} />
              </dl>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/10 text-brand-200">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <div>
        <dt className="text-white/60">{label}</dt>
        <dd className="mt-0.5 font-medium break-all text-white">{value}</dd>
      </div>
    </div>
  );
}
