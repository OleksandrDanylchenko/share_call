import {
  createSelectorFunctions,
  ZustandFuncSelectors,
} from 'auto-zustand-selectors-hook';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface GuestUserInfoState {
  id: string;
  name: string;
}

const useGuestUserInfoBase = create<GuestUserInfoState>()(
  persist((_set) => ({ id: uuidv4(), name: '' }), {
    name: 'guest-user-info-storage',
  }),
);

export const useGuestUserInfo = createSelectorFunctions(
  useGuestUserInfoBase,
) as typeof useGuestUserInfoBase & ZustandFuncSelectors<GuestUserInfoState>;
