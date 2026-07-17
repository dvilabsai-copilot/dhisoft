import { NextResponse } from 'next/server';
import { adminRequest, clearSession, refreshToken, sameOrigin } from '@/lib/admin-auth';

export async function POST(request: Request) { const denied = sameOrigin(request); if (denied) return denied; await adminRequest('/auth/logout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refreshToken: await refreshToken() ?? '' }) }).catch(() => undefined); await clearSession(); return new NextResponse(null, { status: 204 }); }
