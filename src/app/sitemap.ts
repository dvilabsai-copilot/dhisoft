import type { MetadataRoute } from "next";
import { servicePages } from "@/content/service-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dhisoft.in";
  const paths = [
    "",
    "/services",
    ...servicePages.map(({ slug }) => `/services/${slug}`),
    "/industries/travel-hospitality",
    "/about",
  ];
  return paths.map((path) => ({
    url: new URL(path, siteUrl).toString(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/services" ? 0.8 : 0.65,
  }));
}
