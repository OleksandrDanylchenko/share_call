import React, { FC, useEffect, useRef } from 'react';

import { css, SerializedStyles } from '@emotion/react';
import MicIcon from '@mui/icons-material/Mic';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import ReportIcon from '@mui/icons-material/Report';
import {
  Box,
  Button,
  Container,
  Skeleton,
  Stack,
  Theme,
  Typography,
} from '@mui/material';
import Link from 'next/link';

import DeviceSelector from '@/components/DeviceSelector';
import SwitchWithPopover from '@/components/SwitchWithPopover';
import { useCompliment, useLocalTracks } from '@/hooks/index';
import {
  blurBackgroundContainer,
  doubleColorGradient,
  fullHeight,
  viewportHeight,
} from '@/styles/mixins';

import { useCallMediaPermissions } from '@/store/index';

const Preview: FC = () => {
  const previewCameraContainerRef = useRef<HTMLDivElement>(null);

  const {
    isLoading: isLoadingTracks,
    localTracks,
    errorCode: tracksErrorCode,
  } = useLocalTracks();
  const [audioTrack, cameraTrack] = localTracks || [null, null];

  useEffect(() => {
    const { current: previewCameraContainer } = previewCameraContainerRef;
    if (!cameraTrack || !previewCameraContainer) return;

    cameraTrack.play(previewCameraContainer);
    return () => cameraTrack.stop();
  }, [cameraTrack]);

  const handleDeviceChange =
    (deviceType: 'microphone' | 'camera') =>
    (device: MediaDeviceInfo): void => {
      const track = deviceType === 'microphone' ? audioTrack : cameraTrack;
      track?.setDevice(device.deviceId);
    };

  const microphoneAllowed = useCallMediaPermissions.use.microphone();
  const cameraAllowed = useCallMediaPermissions.use.camera();
  const handleCallPermissionChange =
    (deviceType: 'microphone' | 'camera') =>
    (enabled: boolean): void =>
      useCallMediaPermissions.setState({ [deviceType]: enabled });

  const compliment = useCompliment();

  return (
    <main css={[viewportHeight, doubleColorGradient]}>
      <Container css={fullHeight}>
        <Stack css={fullHeight} alignItems="center" justifyContent="center">
          <Stack css={previewWrapper} alignItems="center" gap={2}>
            <Typography
              variant="h4"
              css={(theme) => previewTitle(theme, { error: !!tracksErrorCode })}
              mb={3}
            >
              {isLoadingTracks && 'Loading media devices...'}
              {tracksErrorCode && 'Cannot obtain devices'}
              {localTracks && `You look ${compliment} ✨`}
            </Typography>
            <Box
              ref={previewCameraContainerRef}
              sx={{
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
              }}
              width="90%"
              height={300}
            >
              <Skeleton
                sx={{ position: 'absolute' }}
                variant="rounded"
                width="100%"
                height="100%"
                animation={tracksErrorCode ? false : 'pulse'}
              />
              {tracksErrorCode && (
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  gap={3}
                  width="100%"
                  height="100%"
                >
                  <ReportIcon fontSize="large" color="error" />
                  <Typography variant="body1" color="error" textAlign="center">
                    We couldn&apos;t obtain your media devices. <br />
                    Please check your browser&apos;s permissions and try again.
                  </Typography>
                  <Typography variant="body2" color="error">
                    Error code: {tracksErrorCode}
                  </Typography>
                </Stack>
              )}
            </Box>
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
                          cameraAllowed ? 'Disable' : 'Enable'
                        } camera for the call`}
                        checked={cameraAllowed}
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
                  {audioTrack && (
                    <>
                      <DeviceSelector
                        deviceType="microphone"
                        initialDeviceLabel={audioTrack.getTrackLabel()}
                        onChange={handleDeviceChange('microphone')}
                      />
                      <SwitchWithPopover
                        helperText={`${
                          microphoneAllowed ? 'Disable' : 'Enable'
                        } microphone for the call`}
                        checked={microphoneAllowed}
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
                    height={44}
                    sx={{ borderRadius: 30, flex: 0.5 }}
                  />
                  <Skeleton
                    variant="rounded"
                    height={44}
                    sx={{ borderRadius: 30, flex: 1 }}
                  />
                </>
              ) : (
                <>
                  <Link href="/" css={cancelLink}>
                    <Button variant="outlined" color="inherit" fullWidth>
                      Cancel
                    </Button>
                  </Link>
                  {!tracksErrorCode && (
                    <Link href="/conference" css={joinLink}>
                      <Button variant="contained" fullWidth>
                        Join
                      </Button>
                    </Link>
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

const previewWrapper = (theme: Theme): SerializedStyles => css`
  width: 90%;
  max-width: 777px;
  ${blurBackgroundContainer(theme)};
`;

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

const cancelLink = css`
  flex: 0.5;
`;

const joinLink = css`
  flex: 1;
`;

export default Preview;
