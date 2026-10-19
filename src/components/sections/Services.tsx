import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { services, type Tone } from "@/lib/site-config";

const toneClasses: Record<Tone, string> = {
  brand: "bg-brand-50 text-brand-600",
  orange: "bg-orange-50 text-orange-600",
  coral: "bg-red-50 text-red-600",
  blue: "bg-blue-50 text-blue-600",
};

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="bg-canvas py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="services-title"
          eyebrow="Our Services"
          title="Everything your finances need, under one roof"
          description="From day-to-day bookkeeping to statutory audit and tax filing, we cover the full compliance cycle for businesses operating in Nepal."
        />

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <Reveal as="li" key={service.title} delay={(i % 3) * 0.08}>
                <article className="group h-full rounded-3xl bg-white p-7 shadow-card ring-1 ring-line transition-transform duration-300 motion-safe:hover:-translate-y-1">
                  <span
                    className={`grid size-12 place-items-center rounded-2xl ${toneClasses[service.tone]}`}
                  >
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 text-lg font-semibold text-ink">{service.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{service.description}</p>
                </article>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
