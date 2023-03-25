import { FC } from 'react';

import { Stack } from '@mui/material';

import RoomInvite from '@/components/DashboardScene/Rooms/RoomInvite';
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
    <Stack flex={1} gap={4}>
      {activeRoom && (
        <>
          <RoomUpdateForm activeRoom={activeRoom} />
          <RoomInvite activeRoom={activeRoom} />
        </>
      )}
    </Stack>
  );
};

export default RoomDetails;