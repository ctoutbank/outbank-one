import { unstable_cache } from 'next/cache';
import { getThemeByTenant as _getThemeByTenant, getNameByTenant as _getNameByTenant, type ThemeData } from '@/lib/getThemeByTenant';

export const getThemeByTenant = unstable_cache(
  async (slug: string) => {
    return await _getThemeByTenant(slug);
  },
  ['theme-data'],
  {
    revalidate: 3600, // 1 hour
    tags: ['theme']
  }
);

export const getNameByTenant = unstable_cache(
  async (slug: string) => {
    return await _getNameByTenant(slug);
  },
  ['name-data'],
  {
    revalidate: 3600, // 1 hour
    tags: ['theme']
  }
);

export type { ThemeData };

export async function invalidateTenantTheme(slug: string) {
  const { revalidateTag } = await import('next/cache');
  revalidateTag(`tenant-${slug}`);
  revalidateTag('theme');
}

export async function invalidateAllThemes() {
  const { revalidateTag } = await import('next/cache');
  revalidateTag('theme');
}
