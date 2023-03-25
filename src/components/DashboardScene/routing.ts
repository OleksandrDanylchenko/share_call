import { useRouter } from 'next/router';

import { DashboardSceneType } from '@/components/DashboardScene';
import { isValueInStringEnum } from '@/utils/types';

export const goToOptions = (
  router: ReturnType<typeof useRouter>,
): Promise<boolean> => router.push('/', undefined, { shallow: true });

export const goToScene = (
  router: ReturnType<typeof useRouter>,
  scene: DashboardSceneType,
  sceneOptions: Record<string, string> = {},
): Promise<boolean> =>
  router.push({ query: { scene, ...sceneOptions } }, undefined, {
    shallow: true,
  });

export const useDashboardSceneType = (): DashboardSceneType | null => {
  const router = useRouter();
  const sceneQuery = router.query.scene as string | undefined;
  return isValueInStringEnum(sceneQuery, DashboardSceneType)
    ? sceneQuery
    : null;
};
