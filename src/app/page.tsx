
import type { Metadata } from 'next';
import EditorialHomePageClient from '@/components/home/EditorialHomePageClient';
import { getHomeContent } from '@/lib/cms-api';
import { homeSearchDescription, homeSearchTitle } from '@/content/home-seo';
import { aboutDhi } from '@/content/service-pages';

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getHomeContent();
  // Published CMS documents may still contain the previous bundled defaults.
  const title = seo.title.trim() && seo.title !== "DHISOFT | SaaS & Product Engineering Studio"
    ? seo.title
    : homeSearchTitle;
  const description = seo.description.trim() && seo.description !== "DHISOFT designs and builds production-oriented SaaS products, workflow systems, APIs and automation for complex businesses."
    ? seo.description
    : homeSearchDescription;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: "/" },
    openGraph: {
      url: "/",
      title,
      description,
      images: seo.ogImage
        ? [seo.ogImage]
        : undefined
    }
  };
}

export default async function Home() {
  const content = await getHomeContent();
  const url = new URL("/", process.env.NEXT_PUBLIC_SITE_URL ?? "https://dhisoft.in");
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": new URL("/#organization", url).href,
    name: "DHISOFT",
    legalName: aboutDhi.legalName,
    url: url.href,
    logo: new URL("/images/dhisoft-logo.png", url).href,
    address: { "@type": "PostalAddress", addressLocality: "Hyderabad", addressCountry: "IN" },
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }} />
    <EditorialHomePageClient content={content} />
  </>;
}
