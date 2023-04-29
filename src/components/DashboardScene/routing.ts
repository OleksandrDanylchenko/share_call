import { useRouter } from 'next/router';

import { DashboardSceneType } from '@/components/DashboardScene';
import { isValueInStringEnum } from '@/utils/types';

export const useDashboardSceneType = (): DashboardSceneType | null => {
  const router = useRouter();
  const sceneQuery = router.query.scene as string | undefined;
  return isValueInStringEnum(sceneQuery, DashboardSceneType)
    ? sceneQuery
    : null;
};
