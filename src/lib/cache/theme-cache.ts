import { unstable_cache } from 'next/cache';
import { getThemeByTenant as _getThemeByTenant, getNameByTenant as _getNameByTenant, type ThemeData } from '@/lib/getThemeByTenant';

export const getThemeByTenant = (slug: string) => unstable_cache(
  async () => {
    return await _getThemeByTenant(slug);
  },
  ['theme-data', slug],
  {
    revalidate: 3600,
    tags: [`tenant-${slug}`, 'theme']
  }
)();

export const getNameByTenant = (slug: string) => unstable_cache(
  async () => {
    return await _getNameByTenant(slug);
  },
  ['name-data', slug],
  {
    revalidate: 3600,
    tags: [`tenant-${slug}`, 'theme']
  }
)();

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
