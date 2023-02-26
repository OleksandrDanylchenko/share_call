import { FC, useEffect, useLayoutEffect, useMemo } from 'react';

import { Container, LinearProgress, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';

import CallScene, { CallSceneType } from '@/components/CallScene';
import { clientEnv } from '@/env/schema.mjs';
import { useAgoraRtcClient } from '@/hooks/useAgoraRtcClient';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useCallState } from '@/store/callState';
import { doubleColorGradient, fullHeight, fullViewport } from '@/styles/mixins';

const Call: FC = () => {
  const router = useRouter();

  const { isLoading: isLoadingUser, user } = useCurrentUser({
    redirectOnUnauthenticated: () => router.replace('/'), // TODO Add toast
  });
  const { isLoading: isLoadingRtcClient, client: rtc } = useAgoraRtcClient();

  const isLoading = isLoadingRtcClient || isLoadingUser;

  const currentUserTracks = useCallState.use.usersTracks()[user?.id || ''];
  useLayoutEffect(() => {
    if (!isLoadingUser && !currentUserTracks) {
      router.replace('/preview');
    }
  }, [currentUserTracks, isLoadingUser, router]);

  // const updateUserTracks = useCallTracks.use.updateUserTracks();
  useEffect(() => {
    const appId = clientEnv.NEXT_PUBLIC_AGORA_APP_ID;
    if (!rtc || !user?.id || !appId) return;

    // rtc.join(appId, 'test-channel', null, user.id).then(() => {
    //   rtc.on('user-published', (user, mediaType) => {
    //     rtc.subscribe(user, mediaType).then(() => {
    //       // switch ()
    //     });
    //   });
    // });
  }, [rtc, user?.id]);

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
    <main
      css={(theme) => [
        fullViewport,
        doubleColorGradient(theme, { centerOffset: 26 }),
      ]}
    >
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
    </main>
  );
};

export default Call;
