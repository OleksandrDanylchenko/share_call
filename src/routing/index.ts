import { useRouter } from 'next/router';

import { DashboardSceneType } from '@/components/DashboardScene';

export const goToDashboard = (
  router: ReturnType<typeof useRouter>,
): Promise<boolean> => router.push('/', undefined, { shallow: true });

export const goToDashboardScene = (
  router: ReturnType<typeof useRouter>,
  scene: DashboardSceneType,
  queryOptions: Record<string, string> = {},
): Promise<boolean> =>
  router.push({ query: { scene, ...queryOptions } }, undefined, {
    shallow: true,
  });
