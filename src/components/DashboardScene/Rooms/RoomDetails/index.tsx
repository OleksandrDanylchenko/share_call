import React, { FC } from 'react';

import LinkIcon from '@mui/icons-material/Link';
import { IconButton, Stack, Tooltip, Typography } from '@mui/material';

import RoomUpdateForm from '@/components/DashboardScene/Rooms/RoomUpdateForm';
import { fullWidth, lightBackgroundContainer } from '@/styles/mixins';
import { api, RouterOutputs } from '@/utils/api';

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

const RoomInvite: FC<{
  activeRoom: RouterOutputs['rooms']['getRooms'][number];
}> = (props) => {
  const { activeRoom } = props;
  return (
    <Stack
      css={[fullWidth, lightBackgroundContainer]}
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      px={3}
      py={1.5}
      borderRadius={6}
    >
      <Stack direction="row" alignItems="baseline" gap={2}>
        <Typography variant="h5">Invitation code:</Typography>
        <Typography variant="monospace">{activeRoom.inviteCode}</Typography>
      </Stack>
      <Tooltip title="Copy invitation link">
        <IconButton size="large">
          <LinkIcon fontSize="large" />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};

export default RoomDetails;
