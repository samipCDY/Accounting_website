import { PageHeader } from "@/components/ui/PageHeader";
import { AboutPreview } from "@/components/sections/AboutPreview";
import { QuoteBanner } from "@/components/sections/QuoteBanner";
import { pageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";

export const metadata = pageMetadata({
  title: "About Us",
  description: `Learn about ${siteConfig.name}, a Chartered Accountancy firm in Nepal providing audit, tax, accounting and compliance services.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title={`Meet ${siteConfig.name}`}
        description="A Chartered Accountancy practice helping businesses in Nepal stay compliant, keep accurate records and make confident financial decisions."
      />
      <AboutPreview />
      <QuoteBanner />
    </>
  );
}
