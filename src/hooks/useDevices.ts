import { useRef, useState } from 'react';

import useAsyncEffect from 'use-async-effect';

import { DeviceType } from '@/types/agora';

type DevicesInfo = Record<DeviceType, MediaDeviceInfo[]>;

export const useDevices = (): {
  isLoading: boolean;
  devices?: DevicesInfo;
} => {
  // TODO Handle devices list change
  const devicesRequested = useRef(false);

  const [isLoading, setLoading] = useState(true);
  const [devices, setDevices] = useState<DevicesInfo>();

  useAsyncEffect(async () => {
    /**
     * Prevents the tracks from being requested multiple times
     * and having unreachable zombie tracks
     */
    if (devicesRequested.current) return;
    devicesRequested.current = true;

    const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
    const [microphoneDevices, cameraDevices] = await Promise.all([
      AgoraRTC.getMicrophones(),
      AgoraRTC.getCameras(),
    ]);
    setDevices({ microphone: microphoneDevices, camera: cameraDevices });
    setLoading(false);
  }, []);

  return { isLoading, devices };
};
