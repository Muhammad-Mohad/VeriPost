import { NextResponse } from 'next/server';
import { proxy } from '@/lib/flask';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const formData = await request.formData();
  const { status, data } = await proxy('/predict-batch', { method: 'POST', formData });
  return NextResponse.json(data, { status });
}
