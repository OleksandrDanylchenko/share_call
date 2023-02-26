import { FC, useEffect, useMemo, useRef } from 'react';

import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import {
  Box,
  Container,
  IconButton,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import useAsyncEffect from 'use-async-effect';
import { useEventListener } from 'usehooks-ts';

import CallScene, { CallSceneType } from '@/components/CallScene';
import { clientEnv } from '@/env/schema.mjs';
import { useAgoraRtcClient } from '@/hooks/useAgoraRtcClient';
import { useClientValue } from '@/hooks/useClientValue';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useCallState } from '@/store/callState';
import { useMediaSettings } from '@/store/mediaSettings';
import {
  doubleColorGradient,
  fullHeight,
  fullViewport,
  shadowInset,
} from '@/styles/mixins';
import { AgoraLocalTracks, DeviceType } from '@/types/agora';

const Call: FC = () => {
  const router = useRouter();

  const { isLoading: isLoadingUser, user } = useCurrentUser({
    redirectOnUnauthenticated: () => router.replace('/'), // TODO Add toast
  });
  const { isLoading: isLoadingRtcClient, client: rtc } = useAgoraRtcClient();
  const isLoading = isLoadingRtcClient || isLoadingUser;

  const currentUserTracks = useCallState.use.usersTracks()[
    user?.id || ''
  ] as AgoraLocalTracks;
  useEffect(() => {
    if (!isLoadingUser && !currentUserTracks) {
      router.replace('/preview');
    }
  }, [currentUserTracks, isLoadingUser, router]);

  const hasJoinRequested = useRef(false);

  const updateUserTracks = useCallState.use.updateUserTracks();
  useAsyncEffect(async () => {
    if (!rtc || hasJoinRequested.current) return;

    if (!user?.id || !currentUserTracks) return;

    const appId = clientEnv.NEXT_PUBLIC_AGORA_APP_ID;
    if (!appId) return;

    hasJoinRequested.current = true;

    await rtc.join(appId, 'test-channel', null, user.id);

    const { audioTrack, videoTrack } = currentUserTracks;
    await rtc.publish([audioTrack, videoTrack]);

    rtc.on('user-published', async (user, mediaType) => {
      await rtc.subscribe(user, mediaType);

      const { uid, videoTrack, audioTrack } = user;
      const userId = String(uid);
      switch (mediaType) {
        case 'video':
          return updateUserTracks(userId, { videoTrack });
        case 'audio':
          return updateUserTracks(userId, { audioTrack });
      }
    });

    rtc.on('user-unpublished', (user) => {
      updateUserTracks(String(user.uid), undefined);
    });
  }, [hasJoinRequested, rtc, updateUserTracks, user?.id, currentUserTracks]);

  useEventListener('beforeunload', async () => {
    if (!user?.id || !currentUserTracks) return;

    const { audioTrack, videoTrack } = currentUserTracks;
    await rtc.unpublish([audioTrack, videoTrack]);
  });

  const sceneView = useMemo(() => {
    const scene = CallSceneType.Grid as CallSceneType; // TODO Replace w/ query

    switch (scene) {
      case CallSceneType.Grid:
        return <CallScene.Grid />;
      case CallSceneType.Spotlight:
        return <CallScene.Spotlight />;
    }
  }, []);

  const cameraEnabled = useClientValue(
    useMediaSettings.use.camera().enabled,
    true,
  );
  const microphoneEnabled = useClientValue(
    useMediaSettings.use.microphone().enabled,
    true,
  );

  const setEnabled = useMediaSettings.use.setEnabled();
  const handleToggleCallPermission = (deviceType: DeviceType) => (): void => {
    const enabled =
      deviceType === 'microphone' ? microphoneEnabled : cameraEnabled;
    setEnabled(deviceType, !enabled);
  };

  return (
    <Stack
      css={(theme) => [
        fullViewport,
        doubleColorGradient(theme, { centerOffset: 26 }),
      ]}
    >
      <Box flex={1}>
        <Container css={fullHeight}>
          <Stack css={fullHeight} alignItems="center" justifyContent="center">
            {isLoading ? (
              <Stack gap={5} padding={10} borderRadius={5}>
                <Typography variant="h2">Joining the call...</Typography>
                <LinearProgress color="inherit" />
              </Stack>
            ) : (
              sceneView
            )}
          </Stack>
        </Container>
      </Box>
      <Stack direction="row" alignItems="center" justifyContent="center" p={2}>
        <IconButton
          css={(theme) => {
            const { warning, error } = theme.palette;
            return shadowInset(theme, {
              blurRadius: '35px',
              color: microphoneEnabled ? warning.light : error.main,
            });
          }}
          size="large"
          aria-label={`${microphoneEnabled ? 'Unmute' : 'Mute'} microphone`}
          onClick={handleToggleCallPermission('microphone')}
        >
          {microphoneEnabled ? (
            <MicIcon fontSize="large" />
          ) : (
            <MicOffIcon fontSize="large" />
          )}
        </IconButton>
      </Stack>
    </Stack>
  );
};

export default Call;
