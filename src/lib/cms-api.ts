import { defaultHomeContent } from '@/content/default-home-content';
import { isPublicHomeResponse, type HomeContent, type PublicHomeResponse } from '@/types/cms';

const REQUEST_TIMEOUT_MS = 4500;

function apiBaseUrl(): string {
  return (process.env.CMS_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4008/api/v1').replace(/\/$/, '');
}

async function fetchJson(url: string): Promise<unknown> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, { signal: controller.signal, next: { revalidate: 60, tags: ['cms-home'] } });
    if (!response.ok) throw new Error(`CMS request failed with status ${response.status}`);
    return response.json() as Promise<unknown>;
  } finally { clearTimeout(timeout); }
}

export async function getHomeResponse(): Promise<PublicHomeResponse> {
  try {
    const payload = await fetchJson(`${apiBaseUrl()}/public/cms/home`);
    if (isPublicHomeResponse(payload)) return payload;
    console.warn('CMS homepage response failed validation; using fallback content.');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown CMS error';
    console.warn(`CMS homepage fetch failed; using fallback content: ${message}`);
  }
  return { key: 'home', version: 0, publishedAt: null, content: defaultHomeContent };
}

export async function getHomeContent(): Promise<HomeContent> {
  return (await getHomeResponse()).content;
}
