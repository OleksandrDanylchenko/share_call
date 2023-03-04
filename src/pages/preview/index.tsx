import React, { FC, useEffect, useRef } from 'react';

import { css, SerializedStyles } from '@emotion/react';
import MicIcon from '@mui/icons-material/Mic';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import ReportIcon from '@mui/icons-material/Report';
import { Container, Skeleton, Stack, Theme, Typography } from '@mui/material';
import { useRouter } from 'next/router';

import { NextAuthComponentType } from '@/components/AuthWrapper';
import { useCompliment, useCurrentUser, useMicCamTracks } from '@/hooks/index';
import { selectTrackState, useCallTracks } from '@/store/callTracks';
import {
  blurBackgroundContainer,
  doubleColorGradient,
  fullHeight,
  fullViewport,
} from '@/styles/mixins';
import { DeviceType } from '@/types/agora';

const Preview: FC = () => {
  const router = useRouter();

  const previewCameraContainerRef = useRef<HTMLDivElement>(null);

  const user = useCurrentUser();

  const microphoneState = useCallTracks((state) =>
    selectTrackState(state, user!.id, 'microphone'),
  );
  const cameraState = useCallTracks((state) =>
    selectTrackState(state, user!.id, 'camera'),
  );

  const addTracks = useCallTracks.use.addTracks();
  const setTrackEnabled = useCallTracks.use.setTrackEnabled();
  const setTrackDevice = useCallTracks.use.setTrackDevice();
  const removeTracks = useCallTracks.use.removeTracks();

  const {
    isLoading: isLoadingTracks,
    tracks,
    errorCode: tracksErrorCode,
  } = useMicCamTracks();

  useEffect(() => {
    if (tracks) {
      addTracks(user!.id, tracks);
    }
  }, [addTracks, tracks, user]);

  const handleDeviceChange =
    (deviceType: DeviceType) =>
    ({ deviceId }: MediaDeviceInfo): void =>
      setTrackDevice(user!.id, deviceType, deviceId);

  const handleEnabledChange =
    (deviceType: DeviceType) =>
    (enabled: boolean): void =>
      setTrackEnabled(user!.id, deviceType, enabled);

  useEffect(() => {
    if (!cameraState?.track) return;

    const { current: previewCameraContainer } = previewCameraContainerRef;
    if (!previewCameraContainer) return;

    const { track, enabled } = cameraState;
    if (enabled) {
      track.play(previewCameraContainer);
    } else {
      track.stop();
    }
  }, [cameraState]);

  const compliment = useCompliment();

  const handleCancelClick = (): void => {
    router.push('/').finally(() => removeTracks(user!.id));
  };
  const handleJoinClick = (): void => {
    router.push('/call');
  };

  return (
    <main css={[fullViewport, doubleColorGradient]}>
      <Container css={fullHeight}>
        <Stack css={fullHeight} alignItems="center" justifyContent="center">
          <Stack
            css={blurBackgroundContainer}
            alignItems="center"
            gap={2}
            width="90%"
            maxWidth={777}
          >
            <Typography
              variant="h4"
              css={(theme) => previewTitle(theme, { error: !!tracksErrorCode })}
              mb={3}
            >
              {isLoadingTracks && 'Loading media devices...'}
              {tracksErrorCode && 'Cannot obtain devices'}
              {tracks && `You look ${compliment} ✨`}
            </Typography>
            <Stack
              ref={previewCameraContainerRef}
              alignItems="center"
              justifyContent="center"
              gap={3}
              width="90%"
              height={300}
              position="relative"
              borderRadius={8}
              overflow="hidden"
            >
              <Skeleton
                variant="rounded"
                width="100%"
                height="100%"
                animation={
                  tracksErrorCode || !cameraState?.enabled ? false : 'pulse'
                }
                sx={{ position: 'absolute' }}
              />
              {cameraState && !cameraState.enabled && (
                <Typography variant="h5">Camera is disabled</Typography>
              )}
              {tracksErrorCode && (
                <>
                  <ReportIcon fontSize="large" color="error" />
                  <Typography variant="body1" color="error" textAlign="center">
                    We couldn&apos;t obtain your media devices. <br />
                    Please check your browser&apos;s permissions and try again.
                  </Typography>
                  <Typography variant="body2" color="error">
                    Error code: {tracksErrorCode}
                  </Typography>
                </>
              )}
            </Stack>
            {!tracksErrorCode && (
              <>
                <Stack direction="row" alignItems="center" gap={2} width="90%">
                  <PhotoCameraIcon />
                  {isLoadingTracks && (
                    <Skeleton variant="rounded" width="100%" height={40} />
                  )}
                  {/*{videoTrack && (*/}
                  {/*  <>*/}
                  {/*    <DeviceSelector*/}
                  {/*      deviceType="camera"*/}
                  {/*      initialDeviceLabel={videoTrack.getTrackLabel()}*/}
                  {/*      onChange={handleDeviceChange('camera')}*/}
                  {/*    />*/}
                  {/*    <SwitchWithPopover*/}
                  {/*      helperText={`${*/}
                  {/*        cameraEnabled ? 'Disable' : 'Enable'*/}
                  {/*      } camera for the call`}*/}
                  {/*      checked={cameraEnabled}*/}
                  {/*      onChange={handleCallPermissionChange('camera')}*/}
                  {/*    />*/}
                  {/*  </>*/}
                  {/*)}*/}
                </Stack>
                <Stack direction="row" alignItems="center" gap={2} width="90%">
                  <MicIcon />
                  {isLoadingTracks && (
                    <Skeleton variant="rounded" width="100%" height={40} />
                  )}
                  {/*{audioTrack && (*/}
                  {/*  <>*/}
                  {/*    <DeviceSelector*/}
                  {/*      deviceType="microphone"*/}
                  {/*      initialDeviceLabel={audioTrack.getTrackLabel()}*/}
                  {/*      onChange={handleDeviceChange('microphone')}*/}
                  {/*    />*/}
                  {/*    <SwitchWithPopover*/}
                  {/*      helperText={`${*/}
                  {/*        microphoneEnabled ? 'Disable' : 'Enable'*/}
                  {/*      } microphone for the call`}*/}
                  {/*      checked={microphoneEnabled}*/}
                  {/*      onChange={handleCallPermissionChange('microphone')}*/}
                  {/*    />*/}
                  {/*  </>*/}
                  {/*)}*/}
                </Stack>
              </>
            )}
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-around"
              gap={5}
              width="90%"
              mt={3}
            >
              {/*{isLoadingTracks ? (*/}
              {/*  <>*/}
              {/*    <Skeleton*/}
              {/*      variant="rounded"*/}
              {/*      width="50%"*/}
              {/*      height={44}*/}
              {/*      sx={{ borderRadius: 30 }}*/}
              {/*    />*/}
              {/*    <Skeleton*/}
              {/*      variant="rounded"*/}
              {/*      width="100%"*/}
              {/*      height={44}*/}
              {/*      sx={{ borderRadius: 30 }}*/}
              {/*    />*/}
              {/*  </>*/}
              {/*) : (*/}
              {/*  <>*/}
              {/*    <Button*/}
              {/*      variant="outlined"*/}
              {/*      color="inherit"*/}
              {/*      onClick={handleCancelClick}*/}
              {/*      sx={{ width: '50%' }}*/}
              {/*    >*/}
              {/*      Cancel*/}
              {/*    </Button>*/}
              {/*    {!tracksErrorCode && (*/}
              {/*      <Button*/}
              {/*        variant="contained"*/}
              {/*        fullWidth*/}
              {/*        onClick={handleJoinClick}*/}
              {/*      >*/}
              {/*        Join*/}
              {/*      </Button>*/}
              {/*    )}*/}
              {/*  </>*/}
              {/*)}*/}
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </main>
  );
};

const previewTitle = (
  theme: Theme,
  options: { error: boolean },
): SerializedStyles => {
  const { error } = options;

  const {
    palette: {
      error: { main: errorColor },
      common: { white: whiteColor },
    },
  } = theme;

  return css`
    color: ${error ? errorColor : whiteColor};
  `;
};

const AuthPreview: NextAuthComponentType = Preview;
AuthPreview.auth = {
  required: true,
  unauthenticatedUrl: '/',
};

export default AuthPreview;
