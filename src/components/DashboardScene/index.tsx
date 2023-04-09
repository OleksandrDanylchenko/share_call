import { FC, useMemo } from 'react';

import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';

import DashboardCreateRoom from '@/components/DashboardScene/CreateRoom';
import DashboardJoinCall from '@/components/DashboardScene/JoinCall';
import DashboardOptions from '@/components/DashboardScene/Options';
import DashboardRooms from '@/components/DashboardScene/Rooms';
import { fullParent } from '@/styles/mixins';

export enum DashboardSceneType {
  Rooms = 'rooms',
  Notes = 'notes',
  CreateRoom = 'create-room',
  JoinCall = 'join-call',
}

const DashboardScene: FC = () => {
  const router = useRouter();
  const sceneQuery = router.query.scene as string | undefined;

  const sceneView = useMemo(() => {
    switch (sceneQuery) {
      case DashboardSceneType.Rooms:
        return <DashboardRooms />;
      case DashboardSceneType.CreateRoom:
        return <DashboardCreateRoom />;
      case DashboardSceneType.JoinCall:
        return <DashboardJoinCall />;
      default:
        return <DashboardOptions />;
    }
  }, [sceneQuery]);

  const [animateParent] = useAutoAnimate();
  return (
    <Box ref={animateParent} css={fullParent}>
      {sceneView}
    </Box>
  );
};

export default DashboardScene;
