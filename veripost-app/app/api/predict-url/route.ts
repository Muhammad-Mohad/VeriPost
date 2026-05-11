import { NextResponse } from 'next/server';
import { proxy } from '@/lib/flask';

export const maxDuration = 60;

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { status, data } = await proxy('/predict-url', { method: 'POST', body });
  return NextResponse.json(data, { status });
}
