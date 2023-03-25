import React, { FC, ReactElement } from 'react';

import { ClassNames } from '@emotion/react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import LoginIcon from '@mui/icons-material/Login';
import { LoadingButton } from '@mui/lab';
import {
  Avatar,
  AvatarGroup,
  Button,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { range } from 'lodash';
import { useRouter } from 'next/router';

import BlinkingCircle from '@/components/BlinkingCircle';
import {
  blurBackgroundContainer,
  fullHeight,
  fullWidth,
  lightBackgroundContainer,
  lineClamp,
  shadowBorder,
} from '@/styles/mixins';
import { api } from '@/utils/api';

const CallRoomPreview: FC = () => {
  const router = useRouter();
  const targetRoomId = router.query.room_id as string;

  const {
    data: targetRoom,
    isLoading: isTargetRoomLoading,
    error: targetRoomError,
  } = api.rooms.getRoom.useQuery({ id: targetRoomId }, { retry: 1 });

  return (
    <Stack
      css={[fullHeight, blurBackgroundContainer]}
      position="relative"
      alignItems="center"
      justifyContent={targetRoomError ? 'center' : 'flex-start'}
      flexShrink={0}
      width={400}
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
                <Typography
                  css={lineClamp(2)}
                  variant="h3"
                  color="warning.main"
                >
                  {targetRoom?.name}
                </Typography>
                <Typography css={lineClamp(7)} variant="subtitle1">
                  {targetRoom?.description}
                </Typography>
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
        <>{!targetRoomError && <CallStatus active={true} />}</>
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
            {!targetRoomError && (
              <LoadingButton
                type="submit"
                css={(theme) =>
                  shadowBorder(theme, { color: theme.palette.warning.light })
                }
                color="inherit"
                startIcon={<LoginIcon />}
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

const CallStatus: FC<{ active: boolean }> = (props) => {
  const { active } = props;

  const renderInactiveStatus = (): ReactElement => (
    <Stack direction="row" alignItems="center" gap={1}>
      <ClassNames>
        {({ theme }) => (
          <BlinkingCircle
            mainColor={theme.palette.success.main}
            animate={false}
          />
        )}
      </ClassNames>

      <Typography variant="subtitle1">
        The call hasn&apos;t started yet
      </Typography>
    </Stack>
  );

  const renderActiveStatus = (): ReactElement => (
    <>
      <Stack direction="row" alignItems="center" gap={1}>
        <BlinkingCircle />
        <Typography variant="subtitle1">
          The call is already in progress
        </Typography>
      </Stack>
      <AvatarGroup max={7}>
        {range(20).map((i) => (
          <Avatar key={i} src="https://cataas.com/cat" />
        ))}
      </AvatarGroup>
    </>
  );

  return (
    <Stack
      css={(theme) => [lightBackgroundContainer(theme, { active })]}
      alignItems="center"
      width="80%"
      gap={1}
      p={2}
      borderRadius={6}
      position="absolute"
      bottom={100}
    >
      {active ? renderActiveStatus() : renderInactiveStatus()}
    </Stack>
  );
};

export default CallRoomPreview;
