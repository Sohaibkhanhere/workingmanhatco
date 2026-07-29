import { NextRequest, NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ message: 'Demo mode - no database needed', products: 25, orders: 4 });
}
