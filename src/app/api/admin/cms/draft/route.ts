import { adminRequest, sameOrigin } from '@/lib/admin-auth';
export async function PUT(request: Request) { const denied = sameOrigin(request); if (denied) return denied; return adminRequest('/admin/cms/pages/home/draft', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: await request.text() }); }
