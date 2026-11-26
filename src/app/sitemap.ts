import type { MetadataRoute } from "next";
import { caseStudies, caseStudyHref } from "@/content/case-studies";
import { servicePages } from "@/content/service-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dhisoft.in";
  const paths = [
    "",
    "/services",
    ...servicePages.map(({ slug }) => `/services/${slug}`),
    ...caseStudies.map(({ slug }) => caseStudyHref(slug)),
    "/industries/travel-hospitality",
    "/about",
  ];
  return paths.map((path) => ({ url: new URL(path, siteUrl).toString() }));
}
