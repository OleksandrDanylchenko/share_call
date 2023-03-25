import React, { FC, useEffect, useState } from 'react';

import { Container, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import { NextAuthComponentType } from '@/components/AuthWrapper';
import CallMediaPreview from '@/components/CallMediaPreview';
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
          <Stack
            css={blurBackgroundContainer}
            position="relative"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
            width={420}
            height="80%"
            gap={6}
            px={6}
            py={2}
          >
            <Typography variant="h4" position="absolute" top={20}>
              You&apos;re about to join a call in room:
            </Typography>
          </Stack>
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

//  <Stack
//               direction="row"
//               alignItems="center"
//               justifyContent="space-around"
//               gap={5}
//               width="90%"
//               mt={2}
//             >
//               {tracksStatus === 'loading' ? (
//                 <>
//                   <Skeleton
//                     variant="rounded"
//                     width="50%"
//                     height={44}
//                     sx={{ borderRadius: 30 }}
//                   />
//                   <Skeleton
//                     variant="rounded"
//                     width="100%"
//                     height={44}
//                     sx={{ borderRadius: 30 }}
//                   />
//                 </>
//               ) : (
//                 <>
//                   <Button
//                     size="large"
//                     variant="outlined"
//                     color="warning"
//                     onClick={() => router.push('/')}
//                     sx={{ width: '50%', color: 'white' }}
//                     css={(theme) =>
//                       shadowBorder(theme, { color: theme.palette.warning.main })
//                     }
//                   >
//                     Cancel
//                   </Button>
//                   {tracksStatus === 'ready' && (
//                     <Button
//                       fullWidth
//                       onClick={() => router.push('/call')}
//                       sx={{ color: 'white' }}
//                       css={shadowBorder}
//                     >
//                       Join
//                     </Button>
//                   )}
//                 </>
//               )}
//             </Stack>
