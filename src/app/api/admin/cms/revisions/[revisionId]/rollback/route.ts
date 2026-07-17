import { adminRequest, sameOrigin } from '@/lib/admin-auth';
export async function POST(request: Request, context: { params: Promise<{ revisionId: string }> }) { const denied = sameOrigin(request); if (denied) return denied; const { revisionId } = await context.params; return adminRequest(`/admin/cms/pages/home/revisions/${encodeURIComponent(revisionId)}/rollback`, { method: 'POST' }); }
