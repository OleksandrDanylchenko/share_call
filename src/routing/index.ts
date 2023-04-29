import Router from 'next/router';

import { DashboardSceneType } from '@/components/DashboardScene';

export const goToDashboard = (): Promise<boolean> =>
  Router.push('/', undefined, { shallow: true });

export const goToDashboardScene = (
  scene: DashboardSceneType,
  queryOptions: Record<string, string> = {},
): Promise<boolean> =>
  Router.push({ query: { scene, ...queryOptions } }, undefined, {
    shallow: true,
  });
