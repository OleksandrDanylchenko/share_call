import React, { FC } from 'react';

import LoginIcon from '@mui/icons-material/Login';
import { IconButton, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';

import RoomUpdateForm from '@/components/DashboardScene/Rooms/RoomUpdateForm';
import PillContainer from '@/components/PillContainer';
import { api } from '@/utils/api';
import RoomInvite from 'components/RoomInvite';

interface Props {
  activeRoomId?: string;
}

const RoomDetails: FC<Required<Props>> = (props) => {
  const { activeRoomId } = props;

  const { data: activeRoom } = api.rooms.getRoom.useQuery(
    { id: activeRoomId },
    { trpc: { abortOnUnmount: true } },
  );

  return (
    <Stack flex={1} gap={4}>
      {activeRoom && (
        <>
          <RoomUpdateForm activeRoom={activeRoom} />
          <RoomInvite inviteCode={activeRoom.inviteCode} />
          <RoomJoin activeRoomId={activeRoom.id} />
        </>
      )}
    </Stack>
  );
};

const RoomJoin: FC<{ activeRoomId: string }> = (props) => {
  const { activeRoomId } = props;

  const router = useRouter();
  const handleJoinClick = async (): Promise<boolean> =>
    router.push(`/preview/${activeRoomId}`);

  return (
    <PillContainer active>
      <Typography variant="h5">Join the room</Typography>
      <IconButton size="large" onClick={handleJoinClick}>
        <LoginIcon fontSize="large" />
      </IconButton>
    </PillContainer>
  );
};

export default RoomDetails;
