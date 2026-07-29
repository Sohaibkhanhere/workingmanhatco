import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/lib/auth';
import { orders } from '@/lib/staticData';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authMiddleware(req);
  if ('error' in auth) return auth.error;
  const { id } = await params;
  const order = orders.find(o => o._id === id);
  return NextResponse.json(order || { message: 'Order updated (demo)' });
}
