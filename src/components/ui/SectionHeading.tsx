import { Pill } from "./Pill";

type SectionHeadingProps = {
  id?: string;
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  align = "center",
}: SectionHeadingProps) {
  const alignment = align === "center" ? "mx-auto text-center items-center" : "items-start";

  return (
    <div className={`flex max-w-2xl flex-col gap-4 ${alignment}`}>
      <Pill>{eyebrow}</Pill>
      <h2
        id={id}
        className="text-3xl font-semibold tracking-tight text-balance text-ink sm:text-4xl"
      >
        {title}
      </h2>
      {description && (
        <p className="text-base leading-relaxed text-pretty text-ink-soft sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
