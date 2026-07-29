import { NextRequest, NextResponse } from 'next/server';
import { settings } from '@/lib/staticData';
import { authMiddleware } from '@/lib/auth';

export async function GET() {
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const auth = await authMiddleware(req);
  if ('error' in auth) return auth.error;
  return NextResponse.json(settings);
}
