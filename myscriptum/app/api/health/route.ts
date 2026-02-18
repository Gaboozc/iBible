import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'iBible API is working',
    timestamp: new Date().toISOString(),
    env: {
      nodeEnv: process.env.NODE_ENV,
      vercelUrl: process.env.VERCEL_URL || 'local',
      hasDataDir: process.env.VERCEL_URL ? 'check build logs' : 'check /data/bible',
    },
  });
}
