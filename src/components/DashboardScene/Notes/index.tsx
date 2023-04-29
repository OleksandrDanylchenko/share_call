import React, { FC, useMemo } from 'react';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Button, Divider, Stack } from '@mui/material';
import { useRouter } from 'next/router';

import { ChooseRoom, CreateRoom } from '@/components/DashboardScene/Rooms';
import {
  RoomsList,
  RoomsListPlaceholder,
} from '@/components/DashboardScene/Rooms/RoomsList';
import { fullHeight, fullParent, fullWidth } from '@/styles/mixins';
import { api } from '@/utils/api';

import { goToDashboard } from '@/routing/index';

const DashboardNotes: FC = () => {
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

  const roomNotesElement = useMemo(() => {
    if (!rooms || isLoading) {
      return null; // TODO Create placeholder or let the underlying components handle it?
    }

    if (activeRoomId) {
      return <h2>Here will be notes</h2>;
    }

    return rooms.length > 0 ? <ChooseRoom /> : <CreateRoom />;
  }, [activeRoomId, isLoading, rooms]);

  return (
    <Stack css={fullParent} px={5} pt={1} gap={3}>
      <Button
        color="inherit"
        sx={{ width: 'fit-content', marginLeft: -2 }}
        startIcon={<ArrowBackIosIcon />}
        onClick={() => goToDashboard()}
      >
        Back to dashboard
      </Button>
      <Stack
        css={[fullWidth, fullHeight]}
        direction="row"
        gap={3}
        overflow="hidden"
      >
        {roomListElement}
        {activeRoomId && (
          <Divider
            orientation="vertical"
            sx={{ height: '95%', alignSelf: 'center' }}
          />
        )}
        {roomNotesElement}
      </Stack>
    </Stack>
  );
};

export default DashboardNotes;
