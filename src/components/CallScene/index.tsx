import { FC, useMemo } from 'react';

import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Box } from '@mui/material';

import SpotlightScene from '@/components/CallScene/Spotlight';
import { fullParent } from '@/styles/mixins';

import GridScene from './Grid';

interface Props {
  roomId: string;
}

export enum CallSceneType {
  Grid = 'grid',
  Spotlight = 'spotlight',
}

const CallScene: FC<Props> = (props) => {
  const { roomId } = props;

  const scene = CallSceneType.Grid as CallSceneType;

  const sceneView = useMemo(() => {
    switch (scene) {
      case CallSceneType.Grid:
        return <GridScene roomId={roomId} />;
      case CallSceneType.Spotlight:
        return <SpotlightScene />;
    }
  }, [roomId, scene]);

  const [animateParent] = useAutoAnimate();
  return (
    <Box ref={animateParent} css={fullParent}>
      {sceneView}
    </Box>
  );
};

export default CallScene;
