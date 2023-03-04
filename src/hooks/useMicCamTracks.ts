import { useRef, useState } from 'react';

import useAsyncEffect from 'use-async-effect';

import { audioConfig, videoConfig } from '@/constants/index';
import { AgoraRTCErrorCode, DeviceTracks } from '@/types/agora';

type MicCamTracks = Pick<DeviceTracks, 'microphone' | 'camera'>;

export const useMicCamTracks = (): {
  isLoading: boolean;
  tracks?: MicCamTracks;
  errorCode?: AgoraRTCErrorCode;
} => {
  const localTracksRequested = useRef(false);

  const [isLoading, setLoading] = useState(true);
  const [localTracks, setLocalTracks] = useState<MicCamTracks>();
  const [errorCode, setErrorCode] = useState<AgoraRTCErrorCode>();

  useAsyncEffect(async () => {
    /**
     * Prevents the tracks from being requested multiple times
     * and having unreachable zombie tracks
     */
    if (localTracksRequested.current) return;
    localTracksRequested.current = true;

    try {
      const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
      const [microphoneTrack, cameraTrack] =
        await AgoraRTC.createMicrophoneAndCameraTracks(
          audioConfig,
          videoConfig,
        );

      setLocalTracks({ microphone: microphoneTrack, camera: cameraTrack });
    } catch (error: any) {
      if (error.name === 'AgoraRTCException') {
        setErrorCode(error.code);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { isLoading, tracks: localTracks, errorCode };
};
