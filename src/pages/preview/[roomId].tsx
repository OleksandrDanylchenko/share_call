import React, { FC, useEffect, useState } from 'react';

import { Container, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import { NextAuthComponentType } from '@/components/AuthWrapper';
import CallMediaPreview from '@/components/CallMediaPreview';
import CallRoomPreview from '@/components/CallRoomPreview';
import { useCompliment } from '@/hooks/index';
import { useCallTracks } from '@/store/callTracks';
import {
  blurBackgroundContainer,
  doubleColorGradient,
  fullHeight,
  fullParent,
  fullViewport,
  fullWidth,
} from '@/styles/mixins';

export type TracksStatus = 'loading' | 'error' | 'ready';

const Preview: FC = () => {
  const router = useRouter();
  const roomId = router.query.roomId as string;

  const { data: session } = useSession();
  const user = session!.user!;

  const compliment = useCompliment();

  const [tracksStatus, setTracksStatus] = useState<TracksStatus>('loading');

  const removeTracks = useCallTracks.use.removeTracks();
  useEffect(() => {
    const handleRouteChange = (url: string): void => {
      if (!url.includes('/call')) {
        removeTracks(user.id);
      }
    };
    router.events.on('routeChangeStart', handleRouteChange);
    return () => router.events.off('routeChangeStart', handleRouteChange);
  }, [removeTracks, router.events, user.id]);

  return (
    <main css={[fullViewport, doubleColorGradient]}>
      <Container css={fullHeight}>
        <Stack css={fullParent} alignItems="center" justifyContent="center">
          <Stack css={fullWidth} direction="row" gap={4} height="70%">
            <Stack
              css={[fullParent, blurBackgroundContainer]}
              alignItems="center"
              justifyContent="center"
              gap={2}
              flex={1}
              height="80%"
              py={5}
              px={4}
            >
              <Typography
                variant="h4"
                color={tracksStatus === 'error' ? 'error' : undefined}
              >
                {tracksStatus === 'loading' && 'Loading media devices...'}
                {tracksStatus === 'error' && 'Cannot obtain devices'}
                {tracksStatus === 'ready' && `You look ${compliment} ✨`}
              </Typography>
              <CallMediaPreview
                user={user}
                onTracksReady={() => setTracksStatus('ready')}
                onTracksError={() => setTracksStatus('error')}
              />
            </Stack>
            <CallRoomPreview roomId={roomId} tracksStatus={tracksStatus} />
          </Stack>
        </Stack>
      </Container>
    </main>
  );
};

const AuthPreview: NextAuthComponentType = Preview;
AuthPreview.auth = { required: true };

export default AuthPreview;
