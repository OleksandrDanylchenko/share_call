import {
  createSelectorFunctions,
  ZustandFuncSelectors,
} from 'auto-zustand-selectors-hook';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CallMediaPermissionsState {
  microphone: boolean;
  camera: boolean;
  setPermissions: (permissions: Partial<CallMediaPermissionsState>) => void;
}

// Create zustand store for call media permissions including microphone and camera. Persist to local storage.
const useCallMediaPermissionsBase = create<CallMediaPermissionsState>()(
  persist(
    (set) => ({
      microphone: false,
      camera: false,
      setPermissions: (permissions) => set(permissions),
    }),
    {
      name: 'call-media-permissions-storage',
    },
  ),
);

export const useCallMediaPermissions = createSelectorFunctions(
  useCallMediaPermissionsBase,
) as typeof useCallMediaPermissionsBase &
  ZustandFuncSelectors<CallMediaPermissionsState>;
