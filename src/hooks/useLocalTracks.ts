import { useCallback, useState } from 'react';

import useAsyncEffect from 'use-async-effect';

import { audioConfig, videoConfig } from '@/constants/index';
import { AgoraRTCErrorCode, AgoraTracks } from '@/types/agora';

export const useLocalTracks = (): {
  isLoading: boolean;
  localTracks?: AgoraTracks;
  errorCode?: AgoraRTCErrorCode;
  stopTracks: () => void;
} => {
  const [isLoading, setLoading] = useState(true);
  const [localTracks, setLocalTracks] = useState<AgoraTracks>();
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
    } catch (error: any) {
      if (error.name === 'AgoraRTCException') {
        setErrorCode(error.code);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const stopTracks = useCallback(() => {
    localTracks?.forEach((track) => {
      track.stop();
      track.close();
    });
  }, [localTracks]);

  return { isLoading, localTracks, errorCode, stopTracks };
};
