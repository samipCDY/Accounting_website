import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { AboutPreview } from "@/components/sections/AboutPreview";
import { Industries } from "@/components/sections/Industries";
import { QuoteBanner } from "@/components/sections/QuoteBanner";
import { services, siteConfig } from "@/lib/site-config";

// Social tags come from the root layout (other pages override them via pageMetadata).
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AccountingService",
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  telephone: siteConfig.contact.phoneHref.replace("tel:", ""),
  address: {
    "@type": "PostalAddress",
    addressCountry: "NP",
  },
  areaServed: { "@type": "Country", name: "Nepal" },
  knowsAbout: services.map((s) => s.title),
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Hero />
      <Services preview />
      <AboutPreview preview />
      <Industries preview />
      <QuoteBanner />
    </>
  );
}
