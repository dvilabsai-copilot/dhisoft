import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetailPage } from "@/components/home/MarketingPage";
import { getServicePage, servicePages } from "@/content/service-pages";
import { serializeJsonLd, serviceJsonLd } from "@/lib/seo";

const searchDescriptions: Record<string, string> = {
  "custom-software":
    "Custom software development for businesses: web applications, portals, approvals, operational dashboards and integrations engineered by DHISOFT.",
  "saas-product-engineering":
    "Build B2B SaaS platforms with multi-tenant architecture, role-based access, workflows and reporting. Product engineering from concept to launch.",
  "enterprise-workflows":
    "Replace disconnected spreadsheets and approvals with enterprise workflow software, operational dashboards and audit-friendly business processes.",
  "api-integrations":
    "API development and third-party integrations for booking, payments and supplier systems, with reliable webhooks, retries and observability.",
  "ai-automation":
    "Practical AI integration and business automation with human review, controlled workflows and connections to existing business systems.",
};

export function generateStaticParams() {
  return servicePages.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServicePage(slug);
  if (!service) return { title: "Service not found", robots: { index: false } };

  const description = searchDescriptions[slug] ?? service.summary;
  return {
    title: service.title,
    description,
    alternates: { canonical: "/services/" + slug },
    openGraph: {
      type: "website",
      siteName: "DHISOFT",
      url: "/services/" + slug,
      title: service.title + " | DHISOFT",
      description,
      images: ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title: service.title + " | DHISOFT",
      description,
      images: ["/opengraph-image"],
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServicePage(slug);
  if (!service) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(serviceJsonLd(service)),
        }}
      />
      <ServiceDetailPage service={service} />
    </>
  );
}
