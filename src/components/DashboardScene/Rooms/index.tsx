import React, { FC, useMemo } from 'react';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { Button, Divider, IconButton, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';

import { DashboardSceneType } from '@/components/DashboardScene';
import RoomDetails from '@/components/DashboardScene/Rooms/RoomDetails';
import {
  RoomsList,
  RoomsListPlaceholder,
} from '@/components/DashboardScene/Rooms/RoomsList';
import { goToOptions, goToScene } from '@/components/DashboardScene/routing';
import { fullHeight, fullParent, fullWidth } from '@/styles/mixins';
import { api } from '@/utils/api';

const DashboardRooms: FC = () => {
  const router = useRouter();
  const activeRoomId = router.query.room_id as string | undefined;

  const { data: rooms, isLoading } = api.rooms.getRooms.useQuery(undefined, {
    trpc: { abortOnUnmount: true },
  });

  const roomListElement = useMemo(() => {
    if (!rooms || isLoading) {
      return <RoomsListPlaceholder />;
    }

    return rooms.length > 0 ? (
      <RoomsList rooms={rooms} activeRoomId={activeRoomId} />
    ) : null;
  }, [activeRoomId, isLoading, rooms]);

  const roomDetailsElement = useMemo(() => {
    if (!rooms || isLoading) {
      return <ChooseRoom />;
    }

    if (activeRoomId) {
      return <RoomDetails activeRoomId={activeRoomId} />;
    }

    return rooms.length > 0 ? <ChooseRoom /> : <CreateRoom />;
  }, [activeRoomId, isLoading, rooms]);

  return (
    <Stack css={fullParent} px={5} pt={1} gap={3}>
      <Button
        color="inherit"
        sx={{ width: 'fit-content', marginLeft: -2 }}
        startIcon={<ArrowBackIosIcon />}
        onClick={() => goToOptions(router)}
      >
        Back to dashboard
      </Button>
      <Stack css={[fullWidth, fullHeight]} direction="row" gap={3}>
        {roomListElement}
        {activeRoomId && (
          <Divider
            orientation="vertical"
            sx={{ height: '95%', alignSelf: 'center' }}
          />
        )}
        {roomDetailsElement}
      </Stack>
    </Stack>
  );
};

const ChooseRoom: FC = () => (
  <Stack css={fullHeight} justifyContent="center" pl={8}>
    <Stack alignItems="center" justifyContent="center">
      <Typography variant="h2" fontSize="6rem">
        Choose <br /> a room
      </Typography>
      <ArrowCircleLeftIcon sx={{ fontSize: '5rem' }} />
    </Stack>
  </Stack>
);

export const CreateRoom: FC = () => {
  const router = useRouter();
  return (
    <Stack css={[fullWidth, fullHeight]} justifyContent="center" pl={8}>
      <Stack alignItems="center" justifyContent="center">
        <Typography variant="h2" fontSize="6rem">
          Create <br /> a room
        </Typography>
        <IconButton
          aria-label="Create a room"
          onClick={() => goToScene(router, DashboardSceneType.CreateRoom)}
        >
          <ArrowCircleLeftIcon sx={{ fontSize: '5rem' }} />
        </IconButton>
      </Stack>
    </Stack>
  );
};

export default DashboardRooms;
