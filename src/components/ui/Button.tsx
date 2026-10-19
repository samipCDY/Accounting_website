import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

type Variant = "primary" | "outline" | "light" | "ghost-light";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-200 whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-brand-600 text-white shadow-sm hover:bg-brand-700",
  outline:
    "border-2 border-brand-500 text-brand-700 hover:bg-brand-50",
  light: "bg-white text-ink hover:bg-brand-50",
  "ghost-light": "border-2 border-white/40 text-white hover:bg-white/10",
};

const sizes: Record<Size, string> = {
  md: "h-12 px-6 text-base",
  lg: "h-13 px-7 text-base",
};

type ButtonLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  href: string;
  variant?: Variant;
  size?: Size;
};

/** Link styled as a button. Uses next/link for in-app routes, a plain <a> for tel:/mailto:/external. */
export function ButtonLink({
  href,
  variant = "primary",
  size = "lg",
  className = "",
  ...props
}: ButtonLinkProps) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  const isInternal = href.startsWith("/") || href.startsWith("#");

  if (isInternal) {
    return <Link href={href} className={classes} {...props} />;
  }
  return <a href={href} className={classes} {...props} />;
}
