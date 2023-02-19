import { useCallback, useRef, useState } from 'react';

import useAsyncEffect from 'use-async-effect';

import { AgoraRTCErrorCode, AgoraTracks } from '@/types/agora';

import { useMediaSettings } from '@/store/mediaSettings';

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

  const microphoneSettings = useMediaSettings.use.microphone();
  const cameraSettings = useMediaSettings.use.camera();

  useAsyncEffect(async () => {
    /**
     * Prevents the tracks from being requested multiple times
     * and having unreached zombie tracks
     */
    if (localTracksRequested.current) return;
    localTracksRequested.current = true;

    const { enabled: _eMic, ...microphoneConfig } = microphoneSettings;
    const { enabled: _eCam, ...cameraConfig } = cameraSettings;

    try {
      const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
      const tracks = await AgoraRTC.createMicrophoneAndCameraTracks(
        microphoneConfig,
        cameraConfig,
      );

      setLocalTracks(tracks);
    } catch (error: any) {
      if (error.name === 'AgoraRTCException') {
        setErrorCode(error.code);
      }
    } finally {
      setLoading(false);
    }
  }, [microphoneSettings, cameraSettings]);

  const stopTracks = useCallback(() => {
    localTracks?.forEach((track) => {
      track.stop();
      track.close();
    });
  }, [localTracks]);

  const cameraEnabled = useMediaSettings.use.camera().enabled;
  useAsyncEffect(
    () => cameraTrack?.setEnabled(cameraEnabled),
    [cameraEnabled, cameraTrack],
  );

  const microphoneEnabled = useMediaSettings.use.microphone().enabled;
  useAsyncEffect(
    () => microphoneTrack?.setEnabled(microphoneEnabled),
    [microphoneEnabled, microphoneTrack],
  );

  return { isLoading, localTracks, errorCode, stopTracks };
};
