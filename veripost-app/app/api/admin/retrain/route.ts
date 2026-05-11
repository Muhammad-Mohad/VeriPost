import { NextResponse } from 'next/server';
import { proxy } from '@/lib/flask';

export const maxDuration = 60;

export async function POST(request: Request) {
  const token = request.headers.get('x-admin-token') || '';
  const body = await request.json().catch(() => ({}));
  const { status, data } = await proxy('/admin/retrain', {
    method: 'POST',
    body,
    headers: token ? { 'X-Admin-Token': token } : {},
  });
  return NextResponse.json(data, { status });
}
