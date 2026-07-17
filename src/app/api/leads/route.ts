const BACKEND_URL = (process.env.CMS_API_BASE_URL ?? 'http://localhost:4008/api/v1').replace(/\/$/, '');

export async function POST(request: Request): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 7000);
  try {
    const response = await fetch(`${BACKEND_URL}/public/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: await request.text(),
      signal: controller.signal,
    });
    return new Response(await response.text(), { status: response.status, headers: { 'Content-Type': response.headers.get('content-type') ?? 'application/json' } });
  } catch (error) {
    const message = error instanceof Error && error.name === 'AbortError' ? 'The enquiry service timed out.' : 'The enquiry service is unavailable.';
    return Response.json({ message }, { status: 502 });
  } finally {
    clearTimeout(timer);
  }
}
