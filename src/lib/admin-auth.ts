import { NextRequest } from 'next/server';

export function validateAdminToken(request: NextRequest): boolean {
  const auth = request.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return false;

  const token = auth.slice(7);
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;

  const expected = Buffer.from(`${adminPassword}:${new Date().toISOString().slice(0, 10)}`).toString('base64');
  return token === expected;
}
