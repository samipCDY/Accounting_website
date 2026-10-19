import { Pill } from "./Pill";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

/** Intro band at the top of inner pages; mirrors the homepage hero styling. */
export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <section aria-labelledby="page-title" className="relative isolate overflow-hidden bg-canvas">
      <div
        aria-hidden="true"
        className="absolute -top-40 -right-40 -z-10 size-[28rem] rounded-full bg-brand-50"
      />
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-5 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Pill>{eyebrow}</Pill>
        <h1
          id="page-title"
          className="max-w-3xl text-4xl leading-[1.1] font-semibold tracking-tight text-balance text-ink sm:text-5xl"
        >
          {title}
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-pretty text-ink-soft sm:text-lg">
          {description}
        </p>
      </div>
    </section>
  );
}
