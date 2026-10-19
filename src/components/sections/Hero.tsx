import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { QUOTE_HREF } from "@/lib/site-config";
import { HeroVisual } from "./HeroVisual";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute -bottom-48 -left-48 -z-10 size-[32rem] rounded-full bg-brand-50"
      />

      <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 pt-10 pb-20 sm:px-6 sm:pt-14 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:pt-16 lg:pb-28">
        <div className="flex flex-col items-start gap-6">
          <Pill>We manage the compliance. You scale.</Pill>

          <h1
            id="hero-title"
            className="text-4xl leading-[1.08] font-semibold tracking-tight text-balance text-ink sm:text-5xl lg:text-6xl"
          >
            We handle the numbers. You focus on growth.
          </h1>

          {/* Hero copy is intentionally not animated so it paints before JS loads. */}
          <p className="max-w-xl text-base leading-relaxed text-pretty text-ink-soft sm:text-lg">
            Free up your time for what really matters. Our Chartered Accountants take care of
            audit, tax, accounting and regulatory compliance in Nepal, so you can make
            decisions with confidence.
          </p>

          <div className="flex w-full flex-col gap-3 pt-2 sm:w-auto sm:flex-row sm:gap-4">
            <ButtonLink href={QUOTE_HREF}>
              Get a Quote
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="/services" variant="outline">
              Explore Services
            </ButtonLink>
          </div>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}
