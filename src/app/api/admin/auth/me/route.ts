import { NextResponse } from 'next/server';
import { sessionUser } from '@/lib/admin-auth';
export async function GET() { const user = await sessionUser(); return user ? NextResponse.json({ user }) : NextResponse.json({ message: 'Unauthenticated.' }, { status: 401 }); }
