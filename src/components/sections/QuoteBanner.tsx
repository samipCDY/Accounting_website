import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { QUOTE_HREF } from "@/lib/site-config";

/** Closing call-to-action used at the bottom of pages; links to the Get a Quote page. */
export function QuoteBanner() {
  return (
    <section aria-labelledby="quote-banner-title" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[2rem] bg-ink px-6 py-14 sm:px-12 sm:py-16 lg:px-16">
            <div aria-hidden="true" className="absolute -top-24 -right-24 -z-10 size-80 rounded-full bg-brand-600/30" />
            <div aria-hidden="true" className="absolute -bottom-32 left-1/3 -z-10 size-72 rounded-full bg-brand-500/15" />

            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <h2
                  id="quote-banner-title"
                  className="text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl"
                >
                  Get a quote from a Chartered Accountant
                </h2>
                <p className="mt-4 text-base leading-relaxed text-white/80 sm:text-lg">
                  Tell us about your business and what you need help with. We&apos;ll explain the
                  options, timelines and fees before any work begins.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:gap-4">
                <ButtonLink href={QUOTE_HREF} variant="light">
                  Get a Quote
                  <ArrowRight className="size-4" aria-hidden="true" />
                </ButtonLink>
                <ButtonLink href="/contact" variant="ghost-light">
                  Contact Us
                </ButtonLink>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
