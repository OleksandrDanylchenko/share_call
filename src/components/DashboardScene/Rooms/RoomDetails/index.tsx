import React, { FC } from 'react';

import { Stack } from '@mui/material';

import RoomUpdateForm from '@/components/DashboardScene/Rooms/RoomUpdateForm';

interface Props {
  activeRoomId?: string;
}

const RoomDetails: FC<Required<Props>> = (props) => {
  const { activeRoomId } = props;

  // const { data: rooms, isLoading } = api.rooms.getRooms.useQuery(undefined, {
  //   trpc: { abortOnUnmount: true },
  // });
  // const activeRoom = rooms?.find((room) => room.id === activeRoomId);

  return (
    <Stack flex={1} gap={2}>
      <RoomUpdateForm activeRoomId={activeRoomId} />
    </Stack>
  );
};

export default RoomDetails;
