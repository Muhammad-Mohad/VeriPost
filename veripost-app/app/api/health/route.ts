import { NextResponse } from 'next/server';
import { proxy } from '@/lib/flask';

export const maxDuration = 60;

export async function GET() {
  const { status, data } = await proxy('/health');
  return NextResponse.json(data, { status });
}
