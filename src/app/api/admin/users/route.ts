import { adminRequest, sameOrigin } from '@/lib/admin-auth';
export async function GET() { return adminRequest('/admin/users'); }
export async function POST(request: Request) { const denied = sameOrigin(request); if (denied) return denied; return adminRequest('/admin/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: await request.text() }); }
