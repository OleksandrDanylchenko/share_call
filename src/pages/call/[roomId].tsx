import { FC, useEffect, useRef } from 'react';

import {
  Box,
  Container,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import useAsyncEffect from 'use-async-effect';
import { useEventListener, useIsFirstRender } from 'usehooks-ts';

import { NextAuthComponentType } from '@/components/AuthWrapper';
import CallScene from '@/components/CallScene';
import CallSidebar from '@/components/CallSidebar';
import { clientEnv } from '@/env/schema.mjs';
import { useAgoraRtcClient } from '@/hooks/useAgoraRtcClient';
import {
  selectLocalTracks,
  selectTracks,
  useCallTracks,
} from '@/store/callTracks';
import {
  doubleColorGradient,
  fullHeight,
  fullViewport,
  fullWidth,
} from '@/styles/mixins';
import { api } from '@/utils/api';
import CallControls from 'components/CallControls';
import CallHeader from 'components/CallHeader';

const viewGradientOffset = 26;

interface Props {
  roomId: string;
  user: User;
}

const Call: FC<Props> = (props) => {
  const { roomId, user } = props;

  const router = useRouter();

  const userTracks = useCallTracks((state) =>
    selectLocalTracks(state, user.id),
  )!;
  const addTrack = useCallTracks.use.addTrack();
  const removeTrack = useCallTracks.use.removeTrack();
  const removeTracks = useCallTracks.use.removeTracks();

  const hasJoinRequested = useRef(false);
  const {
    isLoading: isLoadingRtcClient,
    client: rtc,
    destroy: destroyRtc,
  } = useAgoraRtcClient();

  useAsyncEffect(async () => {
    if (!rtc || hasJoinRequested.current) return;

    const appId = clientEnv.NEXT_PUBLIC_AGORA_APP_ID;
    if (!appId) {
      throw new Error('Missing Agora App ID!');
    }

    hasJoinRequested.current = true;
    await rtc.join(appId, 'test-channel', null, user.id);

    const { microphone, camera } = userTracks;
    // await Promise.all([
    //   microphone?.enabled
    //     ? rtc.publish([microphone!.track])
    //     : Promise.resolve(),
    //   camera?.enabled ? rtc.publish([camera!.track]) : Promise.resolve(),
    // ]);

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

  const apiUtils = api.useContext();
  const { mutateAsync: disconnectParticipant } =
    api.rooms.disconnectParticipant.useMutation({
      async onSuccess({ roomId }) {
        await apiUtils.rooms.getRoom.invalidate({ id: roomId });
      },
    });

  useEffect(() => {
    const handleRouteChange = async (): Promise<void> => {
      await destroyRtc();
      await disconnectParticipant({ roomId });
    };

    router.events.on('routeChangeStart', handleRouteChange);
    return () => router.events.off('routeChangeStart', handleRouteChange);
  }, [destroyRtc, disconnectParticipant, roomId, router.events]);

  useEventListener('beforeunload', () => disconnectParticipant({ roomId }));

  return (
    <Stack
      css={(theme) => [
        fullViewport,
        doubleColorGradient(theme, { centerOffset: viewGradientOffset }),
      ]}
    >
      <Box flex={1} overflow="hidden" px={5}>
        <Stack css={fullHeight} alignItems="center" justifyContent="center">
          {isLoadingRtcClient ? (
            <Stack gap={5} padding={10} borderRadius={5}>
              <Typography variant="h2">Joining the call...</Typography>
              <LinearProgress color="inherit" />
            </Stack>
          ) : (
            <>
              <CallHeader roomId={roomId} />
              <CallScene roomId={roomId} />
              <CallSidebar roomId={roomId} />
              <CallControls roomId={roomId} />
            </>
          )}
        </Stack>
      </Box>
    </Stack>
  );
};

const CallContainer: FC = () => {
  const router = useRouter();
  const roomId = router.query.roomId as string;

  const { data: session } = useSession();

  const isFirstRender = useIsFirstRender();

  const userTracks = useCallTracks((state) =>
    selectTracks(state, session!.user!.id),
  );

  useEffect(() => {
    if (!userTracks && isFirstRender) {
      router.replace(`/preview/${roomId}`); // Tracks need to be populated before entering the call
    }
  }, [isFirstRender, roomId, router, userTracks]);

  return (
    <>
      {!userTracks && (
        <Stack
          css={(theme) => [
            fullViewport,
            doubleColorGradient(theme, { centerOffset: viewGradientOffset }),
          ]}
        >
          <Box flex={1} overflow="hidden">
            <Container css={fullHeight}>
              <Stack
                css={fullHeight}
                alignItems="center"
                justifyContent="center"
              >
                <Stack gap={5} padding={10} borderRadius={5}>
                  <Typography variant="h2">
                    {isFirstRender
                      ? 'Getting your media data...'
                      : 'Leaving the call'}
                  </Typography>
                  <LinearProgress color="inherit" />
                </Stack>
              </Stack>
            </Container>
          </Box>
        </Stack>
      )}
      {userTracks && <Call user={session!.user!} roomId={roomId} />}
    </>
  );
};

const AuthCall: NextAuthComponentType = CallContainer;
AuthCall.auth = { required: true };

export default AuthCall;
