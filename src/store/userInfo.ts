import {
  createSelectorFunctions,
  ZustandFuncSelectors,
} from 'auto-zustand-selectors-hook';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserInfoState {
  name: string;
}

// Create zustand store for call media permissions including microphone and camera. Persist to local storage.
const useUserInfoBase = create<UserInfoState>()(
  persist((_set) => ({ name: '' }), {
    name: 'user-info-storage',
  }),
);

export const useUserInfo = createSelectorFunctions(
  useUserInfoBase,
) as typeof useUserInfoBase & ZustandFuncSelectors<UserInfoState>;
