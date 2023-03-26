import React, { FC } from 'react';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import LoginIcon from '@mui/icons-material/Login';
import { LoadingButton } from '@mui/lab';
import { Button, Skeleton, Stack, Tooltip, Typography } from '@mui/material';
import { range } from 'lodash';
import { useRouter } from 'next/router';

import CallStatus from '@/components/CallRoomPreview/CallStatus';
import {
  blurBackgroundContainer,
  fullHeight,
  fullWidth,
  lineClamp,
  shadowBorder,
} from '@/styles/mixins';
import { api } from '@/utils/api';

import type { TracksStatus } from '@/pages/preview/[roomId]';

interface Props {
  roomId: string;
  tracksStatus: TracksStatus;
}

const CallRoomPreview: FC<Props> = (props) => {
  const router = useRouter();

  const { roomId, tracksStatus } = props;

  const {
    data: targetRoom,
    isLoading: isTargetRoomLoading,
    error: targetRoomError,
  } = api.rooms.getRoom.useQuery({ id: roomId }, { retry: 1 });

  const { mutateAsync: connectParticipant } =
    api.rooms.connectParticipant.useMutation();

  const handleJoinRoomClick = async (): Promise<boolean> => {
    await connectParticipant({ roomId });
    return router.push(`/call/${roomId}`);
  };

  return (
    <Stack
      css={[fullHeight, blurBackgroundContainer]}
      position="relative"
      alignItems="center"
      justifyContent={targetRoomError ? 'center' : 'flex-start'}
      flexShrink={0}
      width={420}
      p={4}
    >
      <Stack css={fullWidth} gap={1}>
        {isTargetRoomLoading ? (
          <>
            <Skeleton variant="text" height={116} sx={{ transform: 'none' }} />
            {range(7).map((i) => (
              <Skeleton key={i} />
            ))}
          </>
        ) : (
          <>
            {targetRoomError ? (
              <>
                <Typography variant="h3" color="error">
                  The room cannot be found!
                </Typography>
                <Typography variant="h6" color="error">
                  Please try again later or try contacting the call owner
                </Typography>
              </>
            ) : (
              <>
                <Tooltip title={targetRoom?.name} placement="top">
                  <Typography
                    css={lineClamp(2)}
                    variant="h3"
                    color="warning.main"
                  >
                    {targetRoom?.name}
                  </Typography>
                </Tooltip>
                <Tooltip title={targetRoom?.description}>
                  <Typography css={lineClamp(7)} variant="subtitle1">
                    {targetRoom?.description}
                  </Typography>
                </Tooltip>
              </>
            )}
          </>
        )}
      </Stack>
      {isTargetRoomLoading ? (
        <Skeleton
          variant="text"
          width="80%"
          height={116}
          sx={{
            transform: 'none',
            borderRadius: 6,
            position: 'absolute',
            bottom: 100,
          }}
        />
      ) : (
        <>
          {targetRoom && !targetRoomError && (
            <CallStatus targetRoom={targetRoom} />
          )}
        </>
      )}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        gap={5}
        width="90%"
        mt={2}
        position="absolute"
        bottom={20}
      >
        <Button
          color="inherit"
          sx={{ width: '30%' }}
          startIcon={<ArrowBackIosIcon />}
          onClick={() => router.back()}
        >
          Back
        </Button>
        {isTargetRoomLoading ? (
          <Skeleton
            variant="text"
            width={186}
            height={44}
            sx={{ transform: 'none' }}
          />
        ) : (
          <>
            {!targetRoomError && tracksStatus !== 'error' && (
              <LoadingButton
                css={(theme) =>
                  shadowBorder(theme, { color: theme.palette.warning.light })
                }
                color="inherit"
                startIcon={<LoginIcon />}
                loading={tracksStatus === 'loading'}
                onClick={handleJoinRoomClick}
              >
                <span>Join the call</span>
              </LoadingButton>
            )}
          </>
        )}
      </Stack>
    </Stack>
  );
};

export default CallRoomPreview;
