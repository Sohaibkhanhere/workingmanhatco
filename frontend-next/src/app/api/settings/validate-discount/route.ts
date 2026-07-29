import { NextRequest, NextResponse } from 'next/server';
import { settings } from '@/lib/staticData';

export async function POST(req: NextRequest) {
  return NextResponse.json({ valid: false, error: 'Demo mode' }, { status: 200 });
}
