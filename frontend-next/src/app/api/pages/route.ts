import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({});
}

export async function PUT(req: NextRequest) {
  return NextResponse.json({ message: 'Saved (demo)' });
}
