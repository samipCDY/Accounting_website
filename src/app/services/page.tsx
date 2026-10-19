import { PageHeader } from "@/components/ui/PageHeader";
import { Services } from "@/components/sections/Services";
import { QuoteBanner } from "@/components/sections/QuoteBanner";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Services",
  description:
    "Audit & assurance, tax advisory, accounting, company registration, payroll & SSF compliance and business advisory for businesses in Nepal.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our Services"
        title="Everything your finances need, under one roof"
        description="From day-to-day bookkeeping to statutory audit and tax filing, we cover the full compliance cycle for businesses operating in Nepal."
      />
      <Services />
      <QuoteBanner />
    </>
  );
}
