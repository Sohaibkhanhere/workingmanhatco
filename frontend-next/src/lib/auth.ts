import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { adminUser } from '@/lib/staticData';

const JWT_SECRET = process.env.JWT_SECRET || 'workinman_hat_co_secret_key_2024';

export async function authMiddleware(req: NextRequest): Promise<{ user: typeof adminUser } | { error: NextResponse }> {
  const header = req.headers.get('authorization');
  if (!header || !header.startsWith('Bearer ')) {
    return { error: NextResponse.json({ error: 'No token provided' }, { status: 401 }) };
  }

  try {
    const token = header.split(' ')[1];
    jwt.verify(token, JWT_SECRET);
    return { user: adminUser };
  } catch {
    return { error: NextResponse.json({ error: 'Invalid token' }, { status: 401 }) };
  }
}

export async function verifyToken(req: NextRequest) {
  return authMiddleware(req);
}

export function signToken(userId: string) {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '30d' });
}
