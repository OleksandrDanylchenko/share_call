import { FC, useState } from 'react';

import { css, SerializedStyles } from '@emotion/react';
import MicIcon from '@mui/icons-material/Mic';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import ReportIcon from '@mui/icons-material/Report';
import {
  Box,
  Container,
  Skeleton,
  Stack,
  Theme,
  Typography,
} from '@mui/material';
import { ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';
import useAsyncEffect from 'use-async-effect';

import CameraSelector from '@/components/CameraSelector';
import { audioConfig, videoConfig } from '@/constants/index';
import {
  blurBackgroundContainer,
  doubleColorGradient,
  fullHeight,
  viewportHeight,
} from '@/styles/mixins';
import { AgoraRTCErrorCode } from '@/types/agora';

const Preview: FC = () => {
  const [isLoading, setLoading] = useState(true);

  const [localTracks, setLocalTracks] = useState<
    [IMicrophoneAudioTrack, ICameraVideoTrack] | null
  >(null);
  const [audioTrack, cameraTrack] = localTracks ? localTracks : [null, null];

  const [tracksErrorCode, setTracksErrorCode] =
    useState<AgoraRTCErrorCode | null>(null);

  useAsyncEffect(async () => {
    try {
      const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
      const tracks = await AgoraRTC.createMicrophoneAndCameraTracks(
        audioConfig,
        videoConfig,
      );
      setLocalTracks(tracks);
    } catch (error: any) {
      // Check if the user has denied access to the camera and mic.
      if (error.name === 'AgoraRTCException') {
        setTracksErrorCode(error.code);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCameraChange = (device: MediaDeviceInfo): void => {
    cameraTrack?.setDevice(device.deviceId);
  };

  return (
    <main css={[viewportHeight, doubleColorGradient]}>
      <Container css={fullHeight}>
        <Stack css={fullHeight} alignItems="center" justifyContent="center">
          <Stack css={previewWrapper} alignItems="center" gap="1em">
            <Typography
              variant="h4"
              css={(theme) => previewTitle(theme, { error: !!tracksErrorCode })}
            >
              {isLoading && 'Loading media devices'}
              {tracksErrorCode && 'Cannot obtain devices'}
              {localTracks && 'Preview'}
            </Typography>
            <Box sx={{ position: 'relative' }} width="90%" height="300px">
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
                  gap="12px"
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
                <Stack
                  direction="row"
                  alignItems="center"
                  gap="10px"
                  width="90%"
                >
                  <PhotoCameraIcon />
                  {isLoading && (
                    <Skeleton
                      variant="text"
                      width="100%"
                      sx={{ fontSize: '2.2rem' }}
                    />
                  )}
                  {cameraTrack && (
                    <CameraSelector
                      initialDeviceLabel={cameraTrack.getTrackLabel()}
                      onChange={handleCameraChange}
                    />
                  )}
                </Stack>
                <Stack
                  direction="row"
                  alignItems="center"
                  gap="10px"
                  width="90%"
                >
                  <MicIcon />
                  <Skeleton
                    variant="text"
                    width="100%"
                    sx={{ fontSize: '2.2rem' }}
                  />
                </Stack>
              </>
            )}
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

export default Preview;
