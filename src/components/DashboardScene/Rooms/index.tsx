import React, { FC } from 'react';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Button, Divider, Stack } from '@mui/material';
import { useRouter } from 'next/router';

import { DashboardSceneProps } from '@/components/DashboardScene';
import RoomDetails from '@/components/DashboardScene/Rooms/RoomDetails';
import { RoomsList } from '@/components/DashboardScene/Rooms/RoomsList';
import { fullHeight, fullParent, fullWidth } from '@/styles/mixins';

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
      <Stack css={[fullWidth, fullHeight]} direction="row" gap={3}>
        <RoomsList activeRoomId={activeRoomId} />
        <Divider
          orientation="vertical"
          sx={{ height: '95%', alignSelf: 'center' }}
        />
        <RoomDetails activeRoomId={activeRoomId} />
      </Stack>
    </Stack>
  );
};

export default DashboardRooms;
