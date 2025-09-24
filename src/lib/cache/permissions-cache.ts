import { unstable_cache } from 'next/cache';
import { getUserGroupPermissions as _getUserGroupPermissions } from '@/features/users/server/users';

export const getUserGroupPermissions = unstable_cache(
  async (userSlug: string, group: string) => {
    return await _getUserGroupPermissions(userSlug, group);
  },
  ['user-permissions'],
  {
    revalidate: 300, // 5 minutes
    tags: ['permissions']
  }
);

export async function invalidateUserPermissions(userSlug: string) {
  const { revalidateTag } = await import('next/cache');
  revalidateTag(`user-${userSlug}`);
  revalidateTag('permissions');
}

export async function invalidateAllPermissions() {
  const { revalidateTag } = await import('next/cache');
  revalidateTag('permissions');
}
