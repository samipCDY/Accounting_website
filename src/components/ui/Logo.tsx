import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

/** Placeholder wordmark — swap the badge for the firm's logo (next/image) when available. */
export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2.5 rounded-lg"
      aria-label={`${siteConfig.name} — home`}
    >
      <span
        aria-hidden="true"
        className="grid size-10 place-items-center rounded-xl bg-brand-600 text-sm font-bold text-white"
      >
        {siteConfig.shortName}
      </span>
      <span className="flex flex-col leading-tight">
        <span className={`text-base font-semibold ${inverted ? "text-white" : "text-ink"}`}>
          {siteConfig.name}
        </span>
        <span className={`text-xs ${inverted ? "text-white/70" : "text-muted"}`}>
          {siteConfig.tagline}
        </span>
      </span>
    </Link>
  );
}
