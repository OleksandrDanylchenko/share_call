import { useCallback, useRef, useState } from 'react';

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

  const localTracksRequested = useRef(false);

  useAsyncEffect(async () => {
    /**
     * Prevents the tracks from being requested multiple times
     * and having unreached zombie tracks
     */
    if (localTracksRequested.current) return;
    localTracksRequested.current = true;

    try {
      const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
      const tracks = await AgoraRTC.createMicrophoneAndCameraTracks(
        audioConfig,
        videoConfig,
      );

      setLocalTracks(tracks);
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
