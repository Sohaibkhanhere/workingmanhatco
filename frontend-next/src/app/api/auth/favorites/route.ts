import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const auth = await authMiddleware(req);
  if ('error' in auth) return auth.error;
  return NextResponse.json({ favorites: [] });
}

export async function POST(req: NextRequest) {
  const auth = await authMiddleware(req);
  if ('error' in auth) return auth.error;
  return NextResponse.json({ favorited: true, favorites: [] });
}
