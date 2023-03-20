import React, { FC } from 'react';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Button, Stack } from '@mui/material';
import { useRouter } from 'next/router';

import { DashboardSceneProps } from '@/components/DashboardScene';
import { RoomsList } from '@/components/DashboardScene/Rooms/RoomsList';
import { fullHeight, fullParent } from '@/styles/mixins';

const DashboardRooms: FC<DashboardSceneProps> = (props) => {
  const { onSceneChange } = props;

  const router = useRouter();
  const activeRoomId = router.query.room_id as string | undefined;

  return (
    <Stack css={fullParent} px={5} pt={3} gap={3}>
      <Button
        color="inherit"
        sx={{ width: 'fit-content', marginLeft: -2 }}
        startIcon={<ArrowBackIosIcon />}
        onClick={() => onSceneChange('/')}
      >
        Back to dashboard
      </Button>
      <Stack css={fullHeight} direction="row" width="30%">
        <RoomsList activeRoomId={activeRoomId} />
      </Stack>
    </Stack>
  );
};

export default DashboardRooms;
