import { NextResponse } from 'next/server';
import { backendBaseUrl, sameOrigin, storeSession, isAdminUser } from '@/lib/admin-auth';

export async function POST(request: Request) {
  const denied = sameOrigin(request); if (denied) return denied;
  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') return NextResponse.json({ message: 'Invalid request.' }, { status: 400 });
  const payload = body as Record<string, unknown>;
  if (typeof payload.email !== 'string' || typeof payload.password !== 'string') return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
  try {
    const response = await fetch(`${backendBaseUrl()}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: payload.email, password: payload.password }) });
    const result: unknown = await response.json().catch(() => null);
    if (!response.ok || !result || typeof result !== 'object') return NextResponse.json({ message: 'Invalid email or password.' }, { status: response.status || 401 });
    const data = result as Record<string, unknown>;
    if (!isAdminUser(data.user) || !data.tokens || typeof data.tokens !== 'object') return NextResponse.json({ message: 'Invalid authentication response.' }, { status: 502 });
    const tokens = data.tokens as Record<string, unknown>;
    if (typeof tokens.accessToken !== 'string' || typeof tokens.refreshToken !== 'string' || typeof tokens.expiresIn !== 'string') return NextResponse.json({ message: 'Invalid authentication response.' }, { status: 502 });
    await storeSession(data.user, { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, expiresIn: tokens.expiresIn });
    return NextResponse.json({ user: data.user });
  } catch { return NextResponse.json({ message: 'Authentication service is unavailable.' }, { status: 502 }); }
}
