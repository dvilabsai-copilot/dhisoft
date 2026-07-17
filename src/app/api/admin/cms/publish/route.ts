import { adminRequest, sameOrigin } from '@/lib/admin-auth';
export async function POST(request: Request) { const denied = sameOrigin(request); if (denied) return denied; return adminRequest('/admin/cms/pages/home/publish', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: await request.text() }); }
