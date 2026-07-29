import { NextRequest, NextResponse } from 'next/server';
import { products } from '@/lib/staticData';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const sort = searchParams.get('sort');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    let filtered = [...products];

    if (category) filtered = filtered.filter(p => p.category === category);
    if (featured === 'true') filtered = filtered.filter(p => p.featured);
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s) ||
        p.tags.some(t => t.toLowerCase().includes(s))
      );
    }

    if (sort === 'price_asc') filtered.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') filtered.sort((a, b) => b.price - a.price);
    else filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = filtered.length;
    const off = parseInt(offset || '0');
    const lim = parseInt(limit || '100');
    const sliced = filtered.slice(off, off + lim);

    return NextResponse.json({ products: sliced, total });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ message: 'Demo mode - product creation not available' });
}
