import { FC, useEffect } from 'react';

import { Container, LinearProgress, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';

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
    /**
     * User w/o tracks cannot join the call
     * Tracks are getting initialized on the preview page
     */
    if (!isLoadingUser && !currentUserTracks) {
      router.replace('/preview');
    }
  }, [currentUserTracks, isLoadingUser, router]);

  return (
    <main
      css={(theme) => [
        fullViewport,
        doubleColorGradient(theme, { centerOffset: 25 }),
      ]}
    >
      <Container css={fullHeight}>
        <Stack css={fullHeight} alignItems="center" justifyContent="center">
          <Stack gap={5} padding={10} borderRadius={5}>
            <Typography variant="h2">Joining the call...</Typography>
            <LinearProgress color="inherit" />
          </Stack>
        </Stack>
      </Container>
    </main>
  );
};

export default Call;
