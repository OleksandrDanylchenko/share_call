import { useRef, useState } from 'react';

import useAsyncEffect from 'use-async-effect';

import { audioConfig, videoConfig } from '@/constants/index';
import { useDevices } from '@/hooks/useDevices';
import { AgoraRTCErrorCode, DeviceLocalTracksState } from '@/types/agora';

export const useMicCamTracks = (): {
  isLoading: boolean;
  tracks?: DeviceLocalTracksState;
  errorCode?: AgoraRTCErrorCode;
} => {
  const localTracksRequested = useRef(false);

  const [isLoading, setLoading] = useState(true);

  const [localTracks, setLocalTracks] = useState<DeviceLocalTracksState>();
  const [errorCode, setErrorCode] = useState<AgoraRTCErrorCode>();

  const { devices } = useDevices();

  useAsyncEffect(async () => {
    /**
     * Prevents the tracks from being requested multiple times
     * and having unreachable zombie tracks
     */
    if (localTracksRequested.current || !devices) return;
    localTracksRequested.current = true;

    try {
      const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
      const [microphoneTrack, cameraTrack] =
        await AgoraRTC.createMicrophoneAndCameraTracks(
          audioConfig,
          videoConfig,
        );

      const [microphoneLabel, cameraLabel] = [
        microphoneTrack.getTrackLabel(),
        cameraTrack.getTrackLabel(),
      ];

      // TODO Add handling for missing devices
      const { deviceId: micDeviceId } = devices.microphone.find(
        ({ label }) => label === microphoneLabel,
      )!;
      const { deviceId: camDeviceId } = devices.camera.find(
        ({ label }) => label === cameraLabel,
      )!;

      setLocalTracks({
        microphone: {
          track: microphoneTrack,
          enabled: true,
          deviceId: micDeviceId,
        },
        camera: {
          track: cameraTrack,
          enabled: true,
          deviceId: camDeviceId,
        },
      });
    } catch (error: any) {
      if (error.name === 'AgoraRTCException') {
        setErrorCode(error.code);
      }
    } finally {
      setLoading(false);
    }
  }, [devices]);

  return { isLoading, tracks: localTracks, errorCode };
};
