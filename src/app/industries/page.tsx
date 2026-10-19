import { PageHeader } from "@/components/ui/PageHeader";
import { Industries } from "@/components/sections/Industries";
import { QuoteBanner } from "@/components/sections/QuoteBanner";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Industries",
  description:
    "Sector-aware audit, tax and accounting support for manufacturing, trading, hospitality, IT, healthcare, education, NGOs and cooperatives in Nepal.",
  path: "/industries",
});

export default function IndustriesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Industries"
        title="Sector-aware advice for Nepal's businesses"
        description="Every industry has its own tax treatment, reporting rules and regulators. We tailor our work to the sector you operate in."
      />
      <Industries />
      <QuoteBanner />
    </>
  );
}
