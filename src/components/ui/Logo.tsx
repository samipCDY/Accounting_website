import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

/** Toka "T" mark. Same path as public/logo.svg; inlined so it inherits currentColor. */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="170 330 1025 575" aria-hidden="true" className={className}>
      <path
        fill="currentColor"
        d="M178 370C300 360 400 352 490 348L1185 339C1050 362 880 390 750 406Q742 408 740 412L613 715L410 895Q470 780 540 625L625 418L605 418C560 422 520 431 479 438Z"
      />
    </svg>
  );
}

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-3 rounded-lg"
      aria-label={`${siteConfig.name} — home`}
    >
      <LogoMark className={`h-9 w-auto sm:h-10 ${inverted ? "text-white" : "text-ink"}`} />
      <span className="flex flex-col leading-tight">
        <span className={`text-xl font-semibold tracking-tight sm:text-2xl ${inverted ? "text-white" : "text-ink"}`}>
          {siteConfig.name}
        </span>
        <span className={`text-xs sm:text-sm ${inverted ? "text-white/70" : "text-muted"}`}>
          {siteConfig.tagline}
        </span>
      </span>
    </Link>
  );
}
