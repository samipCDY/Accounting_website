import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { AboutPreview } from "@/components/sections/AboutPreview";
import { Industries } from "@/components/sections/Industries";
import { ConsultationCTA } from "@/components/sections/ConsultationCTA";
import { services, siteConfig } from "@/lib/site-config";

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
      <Services />
      <AboutPreview />
      <Industries />
      <ConsultationCTA />
    </>
  );
}
