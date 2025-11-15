import { NextRequest, NextResponse } from 'next/server';
import { invalidateTenantTheme } from '@/lib/cache/theme-cache';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  console.log('[revalidate/theme] 📨 Received revalidation request');
  
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    console.log('[revalidate/theme] 🔑 Token present:', !!token);
    console.log('[revalidate/theme] 🔑 Expected token present:', !!process.env.REVALIDATE_TOKEN);
    
    if (!token || token !== process.env.REVALIDATE_TOKEN) {
      console.error('[revalidate/theme] ❌ Unauthorized: Token mismatch');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { slug } = body;

    console.log('[revalidate/theme] 🏷️  Slug to invalidate:', slug);

    if (!slug) {
      console.error('[revalidate/theme] ❌ Missing slug parameter');
      return NextResponse.json(
        { error: 'Missing slug parameter' },
        { status: 400 }
      );
    }

    console.log('[revalidate/theme] 🔄 Calling invalidateTenantTheme...');
    await invalidateTenantTheme(slug);
    
    const duration = Date.now() - startTime;
    console.log(`[revalidate/theme] ✅ Cache invalidated successfully in ${duration}ms for tenant: ${slug}`);

    return NextResponse.json({
      success: true,
      message: `Theme cache invalidated for tenant: ${slug}`,
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[revalidate/theme] ❌ Error after ${duration}ms:`, error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
