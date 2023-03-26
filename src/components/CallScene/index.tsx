import { FC, useMemo } from 'react';

import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Box } from '@mui/material';

import SpotlightScene from '@/components/CallScene/Spotlight';
import { fullParent } from '@/styles/mixins';

import GridScene from './Grid';

export enum CallSceneType {
  Grid = 'grid',
  Spotlight = 'spotlight',
}

const CallScene: FC = () => {
  const scene = CallSceneType.Grid as CallSceneType;

  const sceneView = useMemo(() => {
    switch (scene) {
      case CallSceneType.Grid:
        return <GridScene />;
      case CallSceneType.Spotlight:
        return <SpotlightScene />;
    }
  }, [scene]);

  const [animateParent] = useAutoAnimate();
  return (
    <Box ref={animateParent} css={fullParent}>
      {sceneView}
    </Box>
  );
};

export default CallScene;
