import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { adminUser } from '@/lib/staticData';

const JWT_SECRET = process.env.JWT_SECRET || 'workinman_hat_co_secret_key_2024';

export async function POST(req: NextRequest) {
  return NextResponse.json({ error: 'Registration not available in demo mode' }, { status: 400 });
}
