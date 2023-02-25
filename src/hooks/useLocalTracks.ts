import { useCallback, useEffect, useRef, useState } from 'react';

import useAsyncEffect from 'use-async-effect';

import { useMediaSettings } from '@/store/mediaSettings';
import { AgoraRTCErrorCode, AgoraTracks } from '@/types/agora';

interface Props {
  skip?: boolean;
}

export const useLocalTracks = (
  props: Props,
): {
  isLoading: boolean;
  localTracks?: AgoraTracks;
  errorCode?: AgoraRTCErrorCode;
  stopTracks: () => void;
} => {
  const { skip = false } = props;

  const localTracksRequested = useRef(false);

  const [isLoading, setLoading] = useState(true);

  const [localTracks, setLocalTracks] = useState<AgoraTracks>();
  const [microphoneTrack, cameraTrack] = localTracks || [null, null];

  const [errorCode, setErrorCode] = useState<AgoraRTCErrorCode>();

  const microphoneSettings = useMediaSettings.use.microphone();
  const cameraSettings = useMediaSettings.use.camera();

  useAsyncEffect(async () => {
    if (skip) return;

    /**
     * Prevents the tracks from being requested multiple times
     * and having unreached zombie tracks
     */
    if (localTracksRequested.current) return;
    localTracksRequested.current = true;

    try {
      const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
      const tracks = await AgoraRTC.createMicrophoneAndCameraTracks(
        microphoneSettings,
        cameraSettings,
      );

      setLocalTracks(tracks);
    } catch (error: any) {
      if (error.name === 'AgoraRTCException') {
        setErrorCode(error.code);
      }
    } finally {
      setLoading(false);
    }
  }, [microphoneSettings, cameraSettings, skip]);

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

  const cameraId = useMediaSettings.use.camera().cameraId;
  useEffect(() => {
    if (cameraId) {
      cameraTrack?.setDevice(cameraId);
    }
  }, [cameraId, cameraTrack]);

  const microphoneEnabled = useMediaSettings.use.microphone().enabled;
  useAsyncEffect(
    () => microphoneTrack?.setEnabled(microphoneEnabled),
    [microphoneEnabled, microphoneTrack],
  );

  const microphoneId = useMediaSettings.use.microphone().microphoneId;
  useEffect(() => {
    if (microphoneId) {
      microphoneTrack?.setDevice(microphoneId);
    }
  }, [microphoneId, microphoneTrack]);

  return { isLoading, localTracks, errorCode, stopTracks };
};
