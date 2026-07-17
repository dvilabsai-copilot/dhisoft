import type { Metadata } from 'next';
import HomePageClient from '@/components/home/HomePageClient';
import { getHomeContent } from '@/lib/cms-api';

export async function generateMetadata(): Promise<Metadata> {
  const content = await getHomeContent();
  return { title: content.seo.title, description: content.seo.description, keywords: content.seo.keywords, openGraph: { title: content.seo.title, description: content.seo.description, images: content.seo.ogImage ? [content.seo.ogImage] : undefined } };
}

export default async function Home() {
  return <HomePageClient content={await getHomeContent()} />;
}
