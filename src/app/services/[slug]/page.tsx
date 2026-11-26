import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetailPage } from "@/components/home/MarketingPage";
import { getServicePage, servicePages } from "@/content/service-pages";

export function generateStaticParams() {
  return servicePages.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = getServicePage(slug);
  if (!service) return { title: "Service not found" };
  const title = service.searchTitle ?? service.title;
  return {
    title,
    description: service.summary,
    alternates: { canonical: `/services/${slug}` },
    openGraph: { title: `${title} | DHISOFT`, description: service.summary, url: `/services/${slug}` },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getServicePage(slug);
  if (!service) notFound();
  return <ServiceDetailPage service={service} />;
}
