import React, { FC, useEffect, useRef } from 'react';

import { css, SerializedStyles } from '@emotion/react';
import MicIcon from '@mui/icons-material/Mic';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import ReportIcon from '@mui/icons-material/Report';
import {
  Button,
  Container,
  Skeleton,
  Stack,
  Theme,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';

import DeviceSelector from '@/components/DeviceSelector';
import SwitchWithPopover from '@/components/SwitchWithPopover';
import {
  useClientValue,
  useCompliment,
  useCurrentUser,
  useLocalTracks,
} from '@/hooks/index';
import { useCallTracks } from '@/store/callTracks';
import { useMediaSettings } from '@/store/index';
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

  const { isLoading: isLoadingUser } = useCurrentUser({
    required: true,
    onUnauthenticated: () => router.replace('/'),
  });

  const {
    isLoading: isLoadingTracks,
    localTracks,
    errorCode: tracksErrorCode,
    stopTracks,
  } = useLocalTracks({ skip: isLoadingUser });
  const [microphoneTrack, cameraTrack] = localTracks || [null, null];

  const cameraEnabled = useClientValue(
    useMediaSettings.use.camera().enabled,
    true,
  );
  const microphoneEnabled = useClientValue(
    useMediaSettings.use.microphone().enabled,
    true,
  );
  const setEnabled = useMediaSettings.use.setEnabled();
  const setDeviceId = useMediaSettings.use.setDeviceId();

  const handleDeviceChange =
    (deviceType: DeviceType) =>
    (device: MediaDeviceInfo): void =>
      setDeviceId(deviceType, device.deviceId);

  const handleCallPermissionChange =
    (deviceType: DeviceType) =>
    (enabled: boolean): void =>
      setEnabled(deviceType, enabled);

  useEffect(() => {
    const { current: previewCameraContainer } = previewCameraContainerRef;
    if (!cameraTrack || !previewCameraContainer) return;

    if (cameraEnabled) {
      cameraTrack.play(previewCameraContainer);
    } else {
      cameraTrack.stop();
    }
  }, [cameraEnabled, cameraTrack]);

  const compliment = useCompliment();

  const handleCancelClick = (): void => {
    router.push('/').finally(stopTracks);
  };

  // const updateUserTracks = useCallTracks.use.updateUserTracks();
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
              {localTracks && `You look ${compliment} ✨`}
            </Typography>
            <Stack
              ref={previewCameraContainerRef}
              alignItems="center"
              justifyContent="center"
              gap={3}
              width="90%"
              height={300}
              sx={{
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <Skeleton
                variant="rounded"
                width="100%"
                height="100%"
                animation={tracksErrorCode || !cameraEnabled ? false : 'pulse'}
                sx={{ position: 'absolute' }}
              />
              {!cameraEnabled && (
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
                  {cameraTrack && (
                    <>
                      <DeviceSelector
                        deviceType="camera"
                        initialDeviceLabel={cameraTrack.getTrackLabel()}
                        onChange={handleDeviceChange('camera')}
                      />
                      <SwitchWithPopover
                        helperText={`${
                          cameraEnabled ? 'Disable' : 'Enable'
                        } camera for the call`}
                        checked={cameraEnabled}
                        onChange={handleCallPermissionChange('camera')}
                      />
                    </>
                  )}
                </Stack>
                <Stack direction="row" alignItems="center" gap={2} width="90%">
                  <MicIcon />
                  {isLoadingTracks && (
                    <Skeleton variant="rounded" width="100%" height={40} />
                  )}
                  {microphoneTrack && (
                    <>
                      <DeviceSelector
                        deviceType="microphone"
                        initialDeviceLabel={microphoneTrack.getTrackLabel()}
                        onChange={handleDeviceChange('microphone')}
                      />
                      <SwitchWithPopover
                        helperText={`${
                          microphoneEnabled ? 'Disable' : 'Enable'
                        } microphone for the call`}
                        checked={microphoneEnabled}
                        onChange={handleCallPermissionChange('microphone')}
                      />
                    </>
                  )}
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
              {isLoadingTracks ? (
                <>
                  <Skeleton
                    variant="rounded"
                    width="50%"
                    height={44}
                    sx={{ borderRadius: 30 }}
                  />
                  <Skeleton
                    variant="rounded"
                    width="100%"
                    height={44}
                    sx={{ borderRadius: 30 }}
                  />
                </>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={handleCancelClick}
                    sx={{ width: '50%' }}
                  >
                    Cancel
                  </Button>
                  {!tracksErrorCode && (
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleJoinClick}
                    >
                      Join
                    </Button>
                  )}
                </>
              )}
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

export default Preview;
