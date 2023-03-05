import { FC, useMemo, useRef } from 'react';

import {
  Box,
  Container,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import useAsyncEffect from 'use-async-effect';
import { useEventListener } from 'usehooks-ts';

import { NextAuthComponentType } from '@/components/AuthWrapper';
import CallControls from '@/components/CallControls';
import CallScene, { CallSceneType } from '@/components/CallScene';
import { clientEnv } from '@/env/schema.mjs';
import { useAgoraRtcClient } from '@/hooks/useAgoraRtcClient';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import {
  selectLocalTracks,
  selectTracks,
  useCallTracks,
} from '@/store/callTracks';
import { doubleColorGradient, fullHeight, fullViewport } from '@/styles/mixins';

const Call: FC = () => {
  const user = useCurrentUser();

  const userTracks = useCallTracks((state) =>
    selectLocalTracks(state, user.id),
  )!;
  const addTrack = useCallTracks.use.addTrack();
  const removeTracks = useCallTracks.use.removeTracks();

  const hasJoinRequested = useRef(false);
  const { isLoading: isLoadingRtcClient, client: rtc } = useAgoraRtcClient();

  useAsyncEffect(async () => {
    if (!rtc || hasJoinRequested.current) return;

    const appId = clientEnv.NEXT_PUBLIC_AGORA_APP_ID;
    if (!appId) {
      throw new Error('Missing Agora App ID!');
    }

    hasJoinRequested.current = true;
    await rtc.join(appId, 'test-channel', null, user.id);

    const { microphone, camera } = userTracks;
    // await rtc.publish([microphone!.track, camera!.track]);

    rtc.on('user-published', async (user, mediaType) => {
      await rtc.subscribe(user, mediaType);

      const { uid, videoTrack, audioTrack } = user;
      const userId = String(uid);
      switch (mediaType) {
        case 'video':
          return addTrack(userId, 'camera', {
            track: videoTrack!,
            enabled: true,
          });
        case 'audio':
          return addTrack(userId, 'microphone', {
            track: audioTrack!,
            enabled: true,
          });
      }
    });

    rtc.on('user-unpublished', (user) => removeTracks(String(user.uid)));
  }, [addTrack, removeTracks, rtc, user.id, userTracks]);

  useEventListener('beforeunload', async () => {
    const { microphone, camera } = userTracks;
    await rtc.unpublish([microphone!.track, camera!.track]);
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
            {isLoadingRtcClient ? (
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
      <CallControls />
    </Stack>
  );
};

const CallContainer: FC = () => {
  const router = useRouter();

  const user = useCurrentUser();

  const userTracks = useCallTracks((state) => selectTracks(state, user.id));
  if (!userTracks) {
    // Tracks need to be populated before entering the call
    router.replace('/preview');
    return null;
  }

  return <Call />;
};

const AuthCall: NextAuthComponentType = CallContainer;
AuthCall.auth = {
  required: true,
};

export default AuthCall;
