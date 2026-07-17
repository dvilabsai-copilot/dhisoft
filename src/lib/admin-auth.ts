import { cookies } from 'next/headers';

export type AdminUser = { id: string; email: string; name: string; role: 'SUPER_ADMIN' | 'EDITOR' | 'VIEWER' };
type AuthTokens = { accessToken: string; refreshToken: string; expiresIn: string };

const ACCESS_COOKIE = 'dhisoft_admin_access';
const REFRESH_COOKIE = 'dhisoft_admin_refresh';
const USER_COOKIE = 'dhisoft_admin_user';

export function backendBaseUrl(): string { return (process.env.CMS_API_BASE_URL ?? 'http://localhost:4008/api/v1').replace(/\/$/, ''); }
export function cookieOptions(maxAge?: number) { return { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, path: '/', ...(maxAge === undefined ? {} : { maxAge }) }; }

export async function storeSession(user: AdminUser, tokens: AuthTokens): Promise<void> {
  const jar = await cookies();
  jar.set(ACCESS_COOKIE, tokens.accessToken, cookieOptions(15 * 60));
  jar.set(REFRESH_COOKIE, tokens.refreshToken, cookieOptions(30 * 24 * 60 * 60));
  jar.set(USER_COOKIE, JSON.stringify(user), cookieOptions(30 * 24 * 60 * 60));
}

export async function clearSession(): Promise<void> { const jar = await cookies(); jar.delete(ACCESS_COOKIE); jar.delete(REFRESH_COOKIE); jar.delete(USER_COOKIE); }
export async function sessionUser(): Promise<AdminUser | null> { const value = (await cookies()).get(USER_COOKIE)?.value; if (!value) return null; try { const parsed: unknown = JSON.parse(value); return isAdminUser(parsed) ? parsed : null; } catch { return null; } }
export async function accessToken(): Promise<string | undefined> { return (await cookies()).get(ACCESS_COOKIE)?.value; }
export async function refreshToken(): Promise<string | undefined> { return (await cookies()).get(REFRESH_COOKIE)?.value; }
export function isAdminUser(value: unknown): value is AdminUser { if (!value || typeof value !== 'object') return false; const item = value as Record<string, unknown>; return typeof item.id === 'string' && typeof item.email === 'string' && typeof item.name === 'string' && (item.role === 'SUPER_ADMIN' || item.role === 'EDITOR' || item.role === 'VIEWER'); }

export function sameOrigin(request: Request): Response | null {
  const origin = request.headers.get('origin');
  if (!origin) return null;
  try { if (new URL(origin).host !== new URL(request.url).host) return new Response('Forbidden', { status: 403 }); } catch { return new Response('Forbidden', { status: 403 }); }
  return null;
}

async function backendFetch(path: string, init: RequestInit, token?: string): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 7000);
  try { return await fetch(`${backendBaseUrl()}${path}`, { ...init, signal: controller.signal, headers: { ...(init.headers ?? {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) } }); }
  finally { clearTimeout(timer); }
}

async function browserResponse(response: Response): Promise<Response> {
  const headers = new Headers();
  response.headers.forEach((value, key) => {
    if (!['connection', 'content-encoding', 'content-length', 'keep-alive', 'transfer-encoding'].includes(key)) headers.set(key, value);
  });
  return new Response(await response.arrayBuffer(), { status: response.status, statusText: response.statusText, headers });
}

export async function adminRequest(path: string, init: RequestInit = {}): Promise<Response> {
  let response = await backendFetch(path, init, await accessToken());
  if (response.status !== 401) return browserResponse(response);
  const rawRefresh = await refreshToken();
  if (!rawRefresh) return browserResponse(response);
  const refreshed = await backendFetch('/auth/refresh', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refreshToken: rawRefresh }) });
  if (!refreshed.ok) { await clearSession(); return browserResponse(response); }
  const payload: unknown = await refreshed.json();
  if (!isRefreshPayload(payload)) { await clearSession(); return browserResponse(response); }
  await storeSession(payload.user, payload.tokens);
  response = await backendFetch(path, init, payload.tokens.accessToken);
  return browserResponse(response);
}

function isRefreshPayload(value: unknown): value is { user: AdminUser; tokens: AuthTokens } { if (!value || typeof value !== 'object') return false; const item = value as Record<string, unknown>; return isAdminUser(item.user) && typeof item.tokens === 'object' && item.tokens !== null && typeof (item.tokens as Record<string, unknown>).accessToken === 'string' && typeof (item.tokens as Record<string, unknown>).refreshToken === 'string'; }

export async function jsonBody(request: Request): Promise<string> { return request.text(); }
