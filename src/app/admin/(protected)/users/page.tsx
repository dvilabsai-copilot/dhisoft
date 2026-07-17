import UserManagement from '@/components/admin/UserManagement';
import { sessionUser } from '@/lib/admin-auth';
export default async function UsersPage() { const user = await sessionUser(); if (user?.role !== 'SUPER_ADMIN') return <p role="alert" className="rounded-2xl bg-white p-6 text-red-600">Super administrator access is required.</p>; return <UserManagement currentUserId={user.id} />; }
