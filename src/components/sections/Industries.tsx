import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { industries } from "@/lib/site-config";
import { ImageWheel } from "./ImageWheel";

/** `preview` (homepage) shows the animated industries wheel; the Industries page shows the full grid. */
export function Industries({ preview = false }: { preview?: boolean }) {
  if (preview) return <IndustriesWheel />;

  return (
    <section aria-label="Industries we serve" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-5">
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

function IndustriesWheel() {
  return (
    <section aria-labelledby="industries-title" className="overflow-hidden bg-ink py-20 text-white sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ImageWheel />

        <div className="mt-10 flex flex-col gap-6 sm:mt-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <span className="inline-flex rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium ring-1 ring-white/15">
              Industries
            </span>
            <h2 id="industries-title" className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Sector-aware advice for Nepal&apos;s businesses
            </h2>
            <p className="mt-3 text-base leading-relaxed text-white/70 sm:text-lg">
              Every industry has its own tax treatment, reporting rules and regulators. We tailor our
              work to the sector you operate in.
            </p>
          </div>
          <Link
            href="/industries"
            className="inline-flex items-center gap-2 self-start rounded-full text-base font-medium text-white hover:text-brand-200 lg:self-auto"
          >
            View all industries
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
