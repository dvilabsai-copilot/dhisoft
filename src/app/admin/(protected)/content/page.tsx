import CmsEditor from '@/components/admin/CmsEditor';
import { sessionUser } from '@/lib/admin-auth';
export default async function ContentPage() { const user = await sessionUser(); return <CmsEditor role={user?.role ?? 'VIEWER'} />; }
