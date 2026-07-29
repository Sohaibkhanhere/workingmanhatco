import { NextRequest, NextResponse } from 'next/server';
import { orders, products } from '@/lib/staticData';
import { authMiddleware } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const auth = await authMiddleware(req);
  if ('error' in auth) return auth.error;

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => o.status !== 'cancelled' ? sum + o.total : sum, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const processingOrders = orders.filter(o => o.status === 'processing').length;
  const shippedOrders = orders.filter(o => o.status === 'shipped').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return NextResponse.json({
    totalOrders,
    totalRevenue,
    pendingOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders,
    recentOrders,
    monthlyRevenue: [
      { _id: '2026-07', revenue: orders.filter(o => o.createdAt.startsWith('2026-07')).reduce((s, o) => s + o.total, 0), count: orders.filter(o => o.createdAt.startsWith('2026-07')).length }
    ]
  });
}
