import { adminRequest } from '@/lib/admin-auth';
export async function GET() { return adminRequest('/admin/cms/pages/home'); }
