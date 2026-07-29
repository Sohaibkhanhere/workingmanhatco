import { NextRequest, NextResponse } from 'next/server';
import { products } from '@/lib/staticData';

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find(p => p.slug === slug);
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function PUT(req: NextRequest) {
  return NextResponse.json({ message: 'Demo mode' }, { status: 200 });
}

export async function DELETE() {
  return NextResponse.json({ message: 'Demo mode' }, { status: 200 });
}
