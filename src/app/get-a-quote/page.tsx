import { PageHeader } from "@/components/ui/PageHeader";
import { QuoteSection } from "@/components/sections/QuoteSection";
import { pageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";

export const metadata = pageMetadata({
  title: "Get a Quote",
  description: `Request a quote from ${siteConfig.name} for audit, tax, accounting, company registration or payroll services in Nepal.`,
  path: "/get-a-quote",
});

export default function GetAQuotePage() {
  return (
    <>
      <PageHeader
        eyebrow="Get a Quote"
        title="Get a quote from a Chartered Accountant"
        description="Tell us about your business and what you need help with. We'll explain the options, timelines and fees before any work begins."
      />
      <QuoteSection />
    </>
  );
}
