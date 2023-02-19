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

interface State {
  microphone: MicrophoneAudioTrackInitConfig & { enabled: boolean };
  camera: CameraVideoTrackInitConfig & { enabled: boolean };
}

// Create zustand store for call media permissions including microphone and camera. Persist to local storage.
const useMediaSettingsBase = create<State>()(
  persist(
    (_set) => ({
      microphone: { enabled: true },
      camera: {
        enabled: true,
        encoderConfig: {
          width: { min: 640, ideal: 1920, max: 1920 },
          height: { min: 480, ideal: 1080, max: 1080 },
        },
      },
    }),
    {
      name: 'media-settings-storage',
      partialize: (state) => {
        const { microphone, camera } = state;

        // Don't store devices ids as the likely to change
        const { microphoneId: _mid, ...microphoneSettings } = microphone;
        const { cameraId: _cid, facingMode: _fm, ...cameraSettings } = camera;

        return { microphone: microphoneSettings, camera: cameraSettings };
      },
    },
  ),
);

export const useMediaSettings = createSelectorFunctions(
  useMediaSettingsBase,
) as typeof useMediaSettingsBase & ZustandFuncSelectors<State>;
