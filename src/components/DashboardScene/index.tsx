import { FC } from 'react';

import { useRouter } from 'next/router';

import DashboardCreateRoom from '@/components/DashboardScene/CreateRoom';
import DashboardOptions from '@/components/DashboardScene/Options';
import { isValueInStringEnum } from '@/utils/types';

export enum DashboardSceneType {
  Options = 'options',
  Rooms = 'rooms',
  CreateRoom = 'create-room',
  JoinCall = 'join-call',
}

export interface DashboardSceneProps {
  onSceneChange: (path: string) => Promise<boolean>;
}

const DashboardScene: FC = () => {
  const router = useRouter();
  const scene = useDashboardSceneType();

  const handleSceneChange: DashboardSceneProps['onSceneChange'] = (path) =>
    router.push(path, undefined, { shallow: true });

  switch (scene) {
    case DashboardSceneType.Options:
      return <DashboardOptions onSceneChange={handleSceneChange} />;
    case DashboardSceneType.Rooms:
      return <DashboardOptions onSceneChange={handleSceneChange} />;
    case DashboardSceneType.CreateRoom:
      return <DashboardCreateRoom onSceneChange={handleSceneChange} />;
    case DashboardSceneType.JoinCall:
      return <DashboardOptions onSceneChange={handleSceneChange} />;
  }
};

export const useDashboardSceneType = (): DashboardSceneType => {
  const router = useRouter();
  const sceneQuery = router.query.scene as string | undefined;
  return isValueInStringEnum(sceneQuery, DashboardSceneType)
    ? sceneQuery
    : DashboardSceneType.Options;
};

export default DashboardScene;
