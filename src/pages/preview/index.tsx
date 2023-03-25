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
  fullViewport,
  fullWidth,
} from '@/styles/mixins';

const Preview: FC = () => {
  const router = useRouter();

  const { data: session } = useSession();
  const user = session!.user!;

  const compliment = useCompliment();

  const [tracksStatus, setTracksStatus] = useState<
    'loading' | 'error' | 'ready'
  >('loading');

  const removeTracks = useCallTracks.use.removeTracks();
  useEffect(() => {
    const handleRouteChange = (url: string): void => {
      if (url !== '/call') {
        removeTracks(user.id);
      }
    };
    router.events.on('routeChangeStart', handleRouteChange);
    return () => router.events.off('routeChangeStart', handleRouteChange);
  }, [removeTracks, router.events, user.id]);

  return (
    <main css={[fullViewport, doubleColorGradient]}>
      <Container css={fullHeight}>
        <Stack
          css={fullHeight}
          direction="row"
          alignItems="center"
          justifyContent="center"
          gap={4}
        >
          <Stack
            css={[fullWidth, blurBackgroundContainer]}
            alignItems="center"
            justifyContent="center"
            gap={2}
            flex={1}
            height="80%"
            py={5}
            px={6}
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
          <CallRoomPreview />
        </Stack>
      </Container>
    </main>
  );
};

const AuthPreview: NextAuthComponentType = Preview;
AuthPreview.auth = {
  required: true,
};

export default AuthPreview;
