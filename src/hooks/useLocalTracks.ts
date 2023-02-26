import { useCallback, useEffect, useRef, useState } from 'react';

import useAsyncEffect from 'use-async-effect';

import { useMediaSettings } from '@/store/mediaSettings';
import { AgoraRTCErrorCode, AgoraLocalTracks } from '@/types/agora';

interface Props {
  skip?: boolean;
}

export const useLocalTracks = (
  props: Props,
): {
  isLoading: boolean;
  localTracks?: AgoraLocalTracks;
  errorCode?: AgoraRTCErrorCode;
  stopTracks: () => void;
} => {
  const { skip = false } = props;

  const localTracksRequested = useRef(false);

  const [isLoading, setLoading] = useState(true);

  const [localTracks, setLocalTracks] = useState<AgoraLocalTracks>();
  const { audioTrack, videoTrack } = localTracks || {
    audioTrack: null,
    videoTrack: null,
  };

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
      const [audioTrack, videoTrack] =
        await AgoraRTC.createMicrophoneAndCameraTracks(
          microphoneSettings,
          cameraSettings,
        );

      setLocalTracks({ audioTrack: audioTrack, videoTrack: videoTrack });
    } catch (error: any) {
      if (error.name === 'AgoraRTCException') {
        setErrorCode(error.code);
      }
    } finally {
      setLoading(false);
    }
  }, [microphoneSettings, cameraSettings, skip]);

  const stopTracks = useCallback(() => {
    Object.values(localTracks || {}).forEach((track) => {
      track.stop();
      track.close();
    });
  }, [localTracks]);

  const cameraEnabled = useMediaSettings.use.camera().enabled;
  useAsyncEffect(
    () => videoTrack?.setEnabled(cameraEnabled),
    [cameraEnabled, videoTrack],
  );

  const cameraId = useMediaSettings.use.camera().cameraId;
  useEffect(() => {
    if (cameraId) {
      videoTrack?.setDevice(cameraId);
    }
  }, [cameraId, videoTrack]);

  const microphoneEnabled = useMediaSettings.use.microphone().enabled;
  useAsyncEffect(
    () => audioTrack?.setEnabled(microphoneEnabled),
    [microphoneEnabled, audioTrack],
  );

  const microphoneId = useMediaSettings.use.microphone().microphoneId;
  useEffect(() => {
    if (microphoneId) {
      audioTrack?.setDevice(microphoneId);
    }
  }, [microphoneId, audioTrack]);

  return { isLoading, localTracks, errorCode, stopTracks };
};
