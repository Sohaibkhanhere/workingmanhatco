import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { adminUser } from '@/lib/staticData';

const JWT_SECRET = process.env.JWT_SECRET || 'workinman_hat_co_secret_key_2024';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (email === 'admin@workinmanhatco.com' && password === 'admin123') {
      const token = jwt.sign({ id: adminUser._id }, JWT_SECRET, { expiresIn: '30d' });
      return NextResponse.json({ token, user: adminUser });
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
