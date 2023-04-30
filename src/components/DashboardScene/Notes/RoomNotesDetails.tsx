import React, { FC, MouseEvent } from 'react';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Button, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';

import { DashboardSceneType } from '@/components/DashboardScene';
import { lightBackgroundContainer } from '@/styles/mixins';
import { api } from '@/utils/api';

import { goToDashboardScene } from '@/routing/index';

interface Props {
  activeRoomId?: string;
}

const RoomNotesDetails: FC<Required<Props>> = (props) => {
  const { activeRoomId } = props;

  return (
    <Stack flex={1} gap={4} overflow="auto">
      <RoomInfo activeRoomId={activeRoomId} />
    </Stack>
  );
};

const RoomInfo: FC<{ activeRoomId: string }> = (props) => {
  const { activeRoomId } = props;

  const router = useRouter();

  const { data: activeRoom } = api.rooms.getRoom.useQuery({ id: activeRoomId });

  const handleGoToNotesClick = async (): Promise<boolean> =>
    goToDashboardScene(DashboardSceneType.Rooms, {
      ...router.query,
      room_id: activeRoomId,
      session_id: undefined,
    });

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Stack gap={1}>
        <Typography variant="h4">{activeRoom?.name}</Typography>
        <Typography variant="body2">{activeRoom?.description}</Typography>
      </Stack>
      <Button
        color="inherit"
        endIcon={<ArrowForwardIosIcon fontSize="small" />}
        sx={{ px: 2, py: 0.5 }}
        css={lightBackgroundContainer}
        onClick={handleGoToNotesClick}
      >
        details
      </Button>
    </Stack>
  );
};

export default RoomNotesDetails;
