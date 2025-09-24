import { NextResponse } from 'next/server';
import { testDatabaseConnections } from '@/lib/db-diagnostics';

export async function GET() {
  try {
    const results = await testDatabaseConnections();
    const allSuccessful = results.every(r => r.success);
    
    return NextResponse.json({
      status: allSuccessful ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      results
    }, {
      status: allSuccessful ? 200 : 503
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }, {
      status: 500
    });
  }
}
