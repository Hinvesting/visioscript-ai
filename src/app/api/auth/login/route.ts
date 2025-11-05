import dbConnect from '@/lib/db';
import User from '@/lib/models/user.model';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const normalizedEmail = (email as string).toLowerCase();

    const user = await User.findOne({ email: normalizedEmail }).exec();

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const passwordMatches = await bcrypt.compare(password as string, user.passwordHash);

    if (!passwordMatches) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET is not defined in environment');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

  const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '1d' });

    return NextResponse.json({ token }, { status: 200 });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
