import { FC, useEffect, useMemo } from 'react';

import { Container, LinearProgress, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';

import CallScene, { CallSceneType } from '@/components/CallScene';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useCallTracks } from '@/store/callTracks';
import { doubleColorGradient, fullHeight, fullViewport } from '@/styles/mixins';

const Call: FC = () => {
  const router = useRouter();

  const { isLoading: isLoadingUser, user } = useCurrentUser({
    redirectOnUnauthenticated: () => router.replace('/'), // TODO Add toast
  });

  const currentUserTracks = useCallTracks.use.tracks()[user?.id || ''];
  useEffect(() => {
    if (!isLoadingUser && !currentUserTracks) {
      router.replace('/preview');
    }
  }, [currentUserTracks, isLoadingUser, router]);

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
          {isLoadingUser ? (
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
