import { NextRequest, NextResponse } from 'next/server';
import { invalidateTenantTheme } from '@/lib/cache/theme-cache';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token || token !== process.env.REVALIDATE_TOKEN) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json(
        { error: 'Missing slug parameter' },
        { status: 400 }
      );
    }

    await invalidateTenantTheme(slug);

    return NextResponse.json({
      success: true,
      message: `Theme cache invalidated for tenant: ${slug}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error invalidating theme cache:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
