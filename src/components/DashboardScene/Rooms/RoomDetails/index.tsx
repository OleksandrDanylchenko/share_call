import React, { FC } from 'react';

import { Stack } from '@mui/material';

import RoomUpdateForm from '@/components/DashboardScene/Rooms/RoomUpdateForm';
import { api } from '@/utils/api';

interface Props {
  activeRoomId?: string;
}

const RoomDetails: FC<Required<Props>> = (props) => {
  const { activeRoomId } = props;

  const { data: rooms } = api.rooms.getRooms.useQuery(undefined, {
    trpc: { abortOnUnmount: true },
  });
  const activeRoom = rooms?.find((room) => room.id === activeRoomId);

  return (
    <Stack flex={1} gap={2}>
      {activeRoom && (
        <>
          <RoomUpdateForm activeRoom={activeRoom} />
          <RoomInvite />
        </>
      )}
    </Stack>
  );
};

const RoomInvite: FC = () => {
  return <div>Invite</div>;
};

export default RoomDetails;
