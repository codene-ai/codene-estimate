import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json({ error: 'Admin not configured' }, { status: 503 });
    }

    if (password !== adminPassword) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Return a simple token (hash of password + date seed for rotation)
    const token = Buffer.from(`${adminPassword}:${new Date().toISOString().slice(0, 10)}`).toString('base64');

    return NextResponse.json({ token });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
