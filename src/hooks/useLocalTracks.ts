import { useCallback, useRef, useState } from 'react';

import useAsyncEffect from 'use-async-effect';

import { audioConfig, videoConfig } from '@/constants/index';
import { AgoraRTCErrorCode, AgoraTracks } from '@/types/agora';

import { useCallMediaPermissions } from '@/store/callMediaPermissions';

export const useLocalTracks = (): {
  isLoading: boolean;
  localTracks?: AgoraTracks;
  errorCode?: AgoraRTCErrorCode;
  stopTracks: () => void;
} => {
  const localTracksRequested = useRef(false);

  const [isLoading, setLoading] = useState(true);

  const [localTracks, setLocalTracks] = useState<AgoraTracks>();
  const [microphoneTrack, cameraTrack] = localTracks || [null, null];

  const [errorCode, setErrorCode] = useState<AgoraRTCErrorCode>();

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

  const cameraAllowed = useCallMediaPermissions.use.camera();
  useAsyncEffect(
    () => cameraTrack?.setEnabled(cameraAllowed),
    [cameraAllowed, cameraTrack],
  );

  const microphoneAllowed = useCallMediaPermissions.use.microphone();
  useAsyncEffect(
    () => microphoneTrack?.setEnabled(microphoneAllowed),
    [microphoneAllowed, microphoneTrack],
  );

  return { isLoading, localTracks, errorCode, stopTracks };
};
