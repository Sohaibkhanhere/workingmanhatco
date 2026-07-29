import { NextRequest, NextResponse } from 'next/server';
import { orders } from '@/lib/staticData';
import { authMiddleware } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const auth = await authMiddleware(req);
  if ('error' in auth) return auth.error;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const limit = searchParams.get('limit');
  const offset = searchParams.get('offset');

  let filtered = [...orders];
  if (status) filtered = filtered.filter(o => o.status === status);
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const total = filtered.length;
  const off = parseInt(offset || '0');
  const lim = parseInt(limit || '100');

  return NextResponse.json({ orders: filtered.slice(off, off + lim), total });
}

export async function POST(req: NextRequest) {
  return NextResponse.status(201).json({ message: 'Order placed (demo)' });
}
