import { NextResponse } from 'next/server';
import { proxy } from '@/lib/flask';

export async function POST(request: Request) {
  const token = request.headers.get('x-admin-token') || '';
  const body = await request.json().catch(() => ({}));
  const { status, data } = await proxy('/admin/activate', {
    method: 'POST',
    body,
    headers: token ? { 'X-Admin-Token': token } : {},
  });
  return NextResponse.json(data, { status });
}
