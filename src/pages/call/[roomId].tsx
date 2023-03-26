import { FC, useEffect, useMemo, useRef } from 'react';

import {
  Box,
  Container,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import useAsyncEffect from 'use-async-effect';
import { useEventListener } from 'usehooks-ts';

import { NextAuthComponentType } from '@/components/AuthWrapper';
import CallControls from '@/components/CallControls';
import CallScene, { CallSceneType } from '@/components/CallScene';
import { clientEnv } from '@/env/schema.mjs';
import { useCurrentUser } from '@/hooks/index';
import { useAgoraRtcClient } from '@/hooks/useAgoraRtcClient';
import {
  selectLocalTracks,
  selectTracks,
  useCallTracks,
} from '@/store/callTracks';
import { doubleColorGradient, fullHeight, fullViewport } from '@/styles/mixins';

const viewGradientOffset = 26;

const Call: FC = () => {
  const router = useRouter();

  const user = useCurrentUser();

  const userTracks = useCallTracks((state) =>
    selectLocalTracks(state, user.id),
  )!;
  const addTrack = useCallTracks.use.addTrack();
  const removeTrack = useCallTracks.use.removeTrack();
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
    await Promise.all([
      microphone?.enabled
        ? rtc.publish([microphone!.track])
        : Promise.resolve(),
      camera?.enabled ? rtc.publish([camera!.track]) : Promise.resolve(),
    ]);

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

    rtc.on('user-unpublished', (user, mediaType) =>
      removeTrack(
        String(user.uid),
        mediaType === 'audio' ? 'microphone' : 'camera',
      ),
    );

    rtc.on('user-left', (user) => removeTracks(String(user.uid)));
  }, [addTrack, removeTrack, removeTracks, rtc, user.id, userTracks]);

  useEffect(() => {
    const handleRouteChange = (): void => {
      rtc.leave();
      removeTracks(user.id);
    };
    router.events.on('routeChangeStart', handleRouteChange);
    return () => router.events.off('routeChangeStart', handleRouteChange);
  }, [removeTracks, router.events, rtc, user.id]);

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
        doubleColorGradient(theme, { centerOffset: viewGradientOffset }),
      ]}
    >
      <Box flex={1} overflow="hidden">
        <Container css={fullHeight}>
          <Stack css={fullHeight} alignItems="center" justifyContent="center">
            {isLoadingRtcClient ? (
              <Stack gap={5} padding={10} borderRadius={5}>
                <Typography variant="h2">Joining the call...</Typography>
                <LinearProgress color="inherit" />
              </Stack>
            ) : (
              <CallScene />
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
  const roomId = router.query.roomId as string;

  const { data: session } = useSession();

  const userTracks = useCallTracks((state) =>
    selectTracks(state, session!.user!.id),
  );
  if (!userTracks) {
    router.replace(`/preview/${roomId}`); // Tracks need to be populated before entering the call
    return (
      <Stack
        css={(theme) => [
          fullViewport,
          doubleColorGradient(theme, { centerOffset: viewGradientOffset }),
        ]}
      >
        <Box flex={1} overflow="hidden">
          <Container css={fullHeight}>
            <Stack css={fullHeight} alignItems="center" justifyContent="center">
              <Stack gap={5} padding={10} borderRadius={5}>
                <Typography variant="h2">Getting your media data...</Typography>
                <LinearProgress color="inherit" />
              </Stack>
            </Stack>
          </Container>
        </Box>
      </Stack>
    );
  }
  return <Call />;
};

const AuthCall: NextAuthComponentType = CallContainer;
AuthCall.auth = { required: true };

export default AuthCall;
