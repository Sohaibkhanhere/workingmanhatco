import { NextRequest, NextResponse } from 'next/server';
import { adminUser } from '@/lib/staticData';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const result = await verifyToken(req);
    if ('error' in result) return result.error;
    return NextResponse.json({ user: adminUser });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
