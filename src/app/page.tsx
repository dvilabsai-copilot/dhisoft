
import type { Metadata } from 'next';
import EditorialHomePageClient from '@/components/home/EditorialHomePageClient';
import { getHomeContent } from '@/lib/cms-api';

export async function generateMetadata(): Promise<Metadata> {
  const content = await getHomeContent();

  return {
    title: content.seo.title,
    description: content.seo.description,
    keywords: content.seo.keywords,
    openGraph: {
      title: content.seo.title,
      description: content.seo.description,
      images: content.seo.ogImage
        ? [content.seo.ogImage]
        : undefined
    }
  };
}

export default async function Home() {
  const content = await getHomeContent();
  return <EditorialHomePageClient content={content} />;
}
