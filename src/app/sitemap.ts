import type { MetadataRoute } from "next";
import { QUOTE_HREF, navItems, siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...navItems.map((item) => item.href), QUOTE_HREF];
  return paths.map((path) => ({
    url: `${siteConfig.url}${path === "/" ? "" : path}`,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
