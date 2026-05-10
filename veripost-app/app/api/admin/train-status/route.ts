import { NextResponse } from 'next/server';
import { proxy } from '@/lib/flask';

export async function GET(request: Request) {
  const token = request.headers.get('x-admin-token') || '';
  const { status, data } = await proxy('/admin/train-status', {
    headers: token ? { 'X-Admin-Token': token } : {},
  });
  return NextResponse.json(data, { status });
}
