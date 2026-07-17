import { adminRequest } from '@/lib/admin-auth';
export async function GET(request: Request) { const query = new URL(request.url).search; return adminRequest(`/admin/leads${query}`); }
