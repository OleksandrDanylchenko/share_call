import Router from 'next/router';

import { DashboardSceneType } from '@/components/DashboardScene';

const goToPage = (path: string): Promise<boolean> =>
  Router.push(path, undefined, { shallow: true });

export const goToDashboard = (): Promise<boolean> => goToPage('/');

export const goToDashboardScene = (
  scene: DashboardSceneType,
  queryOptions: Record<string, string> = {},
): Promise<boolean> =>
  Router.push({ query: { ...queryOptions, scene } }, undefined, {
    shallow: true,
  });

export const goToPreviewPage = (roomId: string): Promise<boolean> =>
  goToPage(`/preview/${roomId}`);

export const goToCallPage = (roomId: string): Promise<boolean> =>
  goToPage(`/call/${roomId}`);
