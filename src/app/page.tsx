import type { Metadata } from "next";
import EditorialHomePageClient from "@/components/home/EditorialHomePageClient";
import { getHomeContent } from "@/lib/cms-api";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getHomeContent();
  // Preserve CMS-provided PNG/JPG/WebP images; use generated PNG instead of AVIF/SVG.
  const configuredImage = content.seo.ogImage?.trim();
  const image =
    configuredImage && !/\.(?:avif|svg)(?:[?#]|$)/i.test(configuredImage)
      ? configuredImage
      : "/social-preview";

  return {
    // The CMS title already contains DHISOFT; avoid appending it twice.
    title: { absolute: content.seo.title },
    description: content.seo.description,
    keywords: content.seo.keywords,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName: "DHISOFT",
      url: "/",
      title: content.seo.title,
      description: content.seo.description,
      images: [{ url: image, alt: "DHISOFT — Software engineering and SaaS products" }],
    },
    twitter: {
      card: "summary_large_image",
      title: content.seo.title,
      description: content.seo.description,
      images: [image],
    },
  };
}

export default async function Home() {
  const content = await getHomeContent();
  return <EditorialHomePageClient content={content} />;
}
