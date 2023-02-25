import { FC } from 'react';

import SpotlightScene from '@/components/CallScene/Spotlight';

import GridScene from './Grid';

export enum CallSceneType {
  Grid = 'grid',
  Spotlight = 'spotlight',
}

const CallScene: Record<keyof typeof CallSceneType, FC> = {
  Grid: GridScene,
  Spotlight: SpotlightScene,
};

export default CallScene;
