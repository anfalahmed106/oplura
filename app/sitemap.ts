import type { MetadataRoute } from "next";
import { caseStudies } from "@/lib/case-studies";

const BASE_URL = "https://oplura.co";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/services",
    "/case-studies",
    "/how-we-work",
    "/about",
    "/contact",
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const caseStudyRoutes = caseStudies.map((study) => ({
    url: `${BASE_URL}/case-studies/${study.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...caseStudyRoutes];
}
