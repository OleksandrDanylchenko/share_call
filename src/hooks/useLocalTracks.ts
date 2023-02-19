import { useState } from 'react';

import useAsyncEffect from 'use-async-effect';

import { audioConfig, videoConfig } from '@/constants/index';
import { AgoraRTCErrorCode, AgoraTracks } from '@/types/agora';

// Local tracks should be obtained only once and then cached as singletons
let localTracksCache: AgoraTracks;

export const useLocalTracks = (): {
  isLoading: boolean;
  localTracks?: AgoraTracks;
  errorCode?: AgoraRTCErrorCode;
} => {
  const [isLoading, setLoading] = useState(!localTracksCache);
  const [localTracks, setLocalTracks] = useState<AgoraTracks>(localTracksCache);
  const [errorCode, setErrorCode] = useState<AgoraRTCErrorCode>();

  useAsyncEffect(async () => {
    try {
      const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
      const tracks = await AgoraRTC.createMicrophoneAndCameraTracks(
        audioConfig,
        videoConfig,
      );
      setLocalTracks(tracks);
      setErrorCode(undefined); // Resets the error when permissions are granted on retry

      localTracksCache = tracks;
    } catch (error: any) {
      if (error.name === 'AgoraRTCException') {
        setErrorCode(error.code);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { isLoading, localTracks, errorCode };
};
