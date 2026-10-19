import { ArrowRight, Building2 } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { approachPoints, siteConfig } from "@/lib/site-config";

export function AboutPreview() {
  return (
    <section id="about" aria-labelledby="about-title" className="py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
        <Reveal className="relative order-last lg:order-first">
          {/* Placeholder for an office or team photo */}
          <div
            aria-hidden="true"
            className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-100 to-brand-50"
          >
            <div className="absolute -right-16 -bottom-16 size-64 rounded-full bg-white/50" />
            <Building2 strokeWidth={1} className="size-32 text-brand-500/40" />
          </div>

          <div className="absolute -bottom-6 left-4 rounded-2xl bg-white px-5 py-4 shadow-chip ring-1 ring-line sm:left-8">
            <p className="text-xs font-medium tracking-wide text-muted uppercase">Registered with ICAN</p>
            <p className="mt-1 text-sm font-semibold text-ink">{siteConfig.credentials.icanFirmRegNo}</p>
          </div>
        </Reveal>

        <div className="flex flex-col gap-8">
          <SectionHeading
            id="about-title"
            align="left"
            eyebrow="About Us"
            title="A Chartered Accountancy practice built around your business"
            description={`${siteConfig.name} is a firm of Chartered Accountants based in [City], Nepal. [Add a short, factual introduction — founding partners, focus areas and how you work with clients.]`}
          />

          <ul className="flex flex-col gap-4">
            {approachPoints.map(({ title, icon: Icon }) => (
              <li key={title} className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600">
                  <Icon className="size-4.5" aria-hidden="true" />
                </span>
                <span className="pt-1.5 text-base text-ink-soft">{title}</span>
              </li>
            ))}
          </ul>

          <div>
            <ButtonLink href="/#contact" variant="outline">
              Talk to our team
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
