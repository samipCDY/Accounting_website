import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { industries } from "@/lib/site-config";

export function Industries() {
  return (
    <section id="industries" aria-labelledby="industries-title" className="bg-canvas py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="industries-title"
          eyebrow="Industries"
          title="Sector-aware advice for Nepal's businesses"
          description="Every industry has its own tax treatment, reporting rules and regulators. We tailor our work to the sector you operate in."
        />

        <ul className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-5">
          {industries.map(({ name, icon: Icon }, i) => (
            <Reveal as="li" key={name} delay={(i % 4) * 0.06}>
              <div className="flex h-full flex-col items-start gap-4 rounded-2xl bg-white p-5 ring-1 ring-line transition-colors hover:ring-brand-200 sm:flex-row sm:items-center sm:p-6">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="text-sm font-medium text-ink sm:text-base">{name}</span>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
