import {
  CameraVideoTrackInitConfig,
  MicrophoneAudioTrackInitConfig,
} from 'agora-rtc-sdk-ng';
import {
  createSelectorFunctions,
  ZustandFuncSelectors,
} from 'auto-zustand-selectors-hook';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { DeviceType } from '@/types/agora';

interface State {
  microphone: MicrophoneAudioTrackInitConfig & { enabled: boolean };
  camera: CameraVideoTrackInitConfig & { enabled: boolean };
}

interface Actions {
  setEnabled(deviceType: DeviceType, enabled: boolean): void;
  setDeviceId(deviceType: DeviceType, id: string): void;
}

type Store = State & Actions;

// Create zustand store for call media permissions including microphone and camera. Persist to local storage.
const useMediaSettingsBase = create<Store>()(
  persist(
    immer((set) => ({
      microphone: { enabled: true },
      camera: {
        enabled: true,
        encoderConfig: {
          width: { min: 640, ideal: 1920, max: 1920 },
          height: { min: 480, ideal: 1080, max: 1080 },
        },
      },
      setEnabled: (deviceType, enabled) =>
        set((state) => {
          console.log('SEting here', enabled);
          state[deviceType].enabled = enabled;
        }),
      setDeviceId(deviceType, id) {
        set((state) => {
          switch (deviceType) {
            case 'microphone':
              state.microphone.microphoneId = id;
              break;
            case 'camera':
              state.camera.cameraId = id;
              break;
          }
        });
      },
    })),
    {
      name: 'media-settings-storage',
    },
  ),
);

export const useMediaSettings = createSelectorFunctions(
  useMediaSettingsBase,
) as typeof useMediaSettingsBase & ZustandFuncSelectors<Store>;
