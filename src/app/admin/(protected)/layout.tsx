import Link from 'next/link';
import { redirect } from 'next/navigation';
import { sessionUser } from '@/lib/admin-auth';

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const user = await sessionUser(); if (!user) redirect('/admin/login');
  return <div className="min-h-screen bg-slate-100 text-slate-950"><header className="border-b border-slate-200 bg-white px-5 py-4"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4"><div><span className="font-bold">DhiSoft CMS</span><span className="ml-3 text-sm text-slate-500">{user.name} · {user.role}</span></div><nav className="flex gap-4 text-sm font-medium"><Link href="/admin/content">Content</Link><Link href="/admin/leads">Leads</Link>{user.role === 'SUPER_ADMIN' && <Link href="/admin/users">Users</Link>}<form action="/api/admin/auth/logout" method="post"><button className="text-slate-500">Sign out</button></form></nav></div></header><main className="mx-auto max-w-7xl px-5 py-8">{children}</main></div>;
}
