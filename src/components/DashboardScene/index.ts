import { FC } from 'react';

import DashboardCreateRoom from '@/components/DashboardScene/CreateRoom';
import DashboardOptions from '@/components/DashboardScene/Options';

export enum DashboardSceneType {
  Options,
  Rooms,
  CreateRoom,
  JoinCall,
}
export type DashboardSceneTypes = keyof typeof DashboardSceneType;

export interface DashboardSceneProps {
  onSceneChange: (scene: DashboardSceneType) => void;
}

const DashboardScene: Record<DashboardSceneTypes, FC<DashboardSceneProps>> = {
  Options: DashboardOptions,
  Rooms: DashboardOptions,
  CreateRoom: DashboardCreateRoom,
  JoinCall: DashboardOptions,
};

export default DashboardScene;
