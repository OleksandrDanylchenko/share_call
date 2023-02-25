import { FC, useEffect } from 'react';

import { useRouter } from 'next/router';

import { useAgoraRtcClient } from '@/hooks/useAgoraRtcClient';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useCallTracks } from '@/store/callTracks';
import { doubleColorGradient, fullViewport } from '@/styles/mixins';

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
    <main css={[fullViewport, doubleColorGradient]}>
      {isLoadingUser ? 'Loading user' : 'User'}
    </main>
  );
};

export default Call;
