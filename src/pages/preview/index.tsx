import { FC, useState } from 'react';

import { css, SerializedStyles } from '@emotion/react';
import { Container, Stack, Theme } from '@mui/material';
import { ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';
import useAsyncEffect from 'use-async-effect';

import {
  blurBackgroundContainer,
  doubleColorGradient,
  fullHeight,
  viewportHeight,
} from '@/styles/mixins';
import { AgoraRTCErrorCode } from '@/types/agora';

import { audioConfig, videoConfig } from '@/constants/index';

const Preview: FC = () => {
  const [localTracks, setLocalTracks] = useState<
    [IMicrophoneAudioTrack, ICameraVideoTrack] | null
  >(null);

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
    }
  }, []);

  return (
    <main css={[viewportHeight, doubleColorGradient]}>
      <Container css={fullHeight}>
        <Stack css={fullHeight} alignItems="center" justifyContent="center">
          <Stack
            css={previewWrapper}
            alignItems="center"
            justifyContent="center"
          ></Stack>
        </Stack>
      </Container>
    </main>
  );
};

const previewWrapper = (theme: Theme): SerializedStyles => css`
  width: 90%;
  max-width: 777px;
  height: 500px;
  ${blurBackgroundContainer(theme)};
`;

export default Preview;
