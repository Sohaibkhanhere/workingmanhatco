import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
  return NextResponse.json({ user: { name: 'Admin', phone: '' } });
}
