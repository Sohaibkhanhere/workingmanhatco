import { NextRequest, NextResponse } from 'next/server';
import { orders } from '@/lib/staticData';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = orders.find(o => o._id === id || o.orderNumber === id);
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  return NextResponse.json(order);
}
