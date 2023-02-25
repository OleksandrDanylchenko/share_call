import {
  createSelectorFunctions,
  ZustandFuncSelectors,
} from 'auto-zustand-selectors-hook';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface State {
  guest: {
    id: string;
    name: string;
  };
}

interface Actions {
  updateGuestName: (name: string) => void;
}

type Store = State & Actions;

const useGuestUserInfoBase = create<Store>()(
  persist(
    immer((set) => ({
      guest: {
        id: uuidv4(),
        name: '',
      },
      updateGuestName: (name) =>
        set((state) => {
          state.guest.name = name;
        }),
    })),
    {
      name: 'guest-user-info-storage',
    },
  ),
);

export const useGuestUserInfo = createSelectorFunctions(
  useGuestUserInfoBase,
) as typeof useGuestUserInfoBase & ZustandFuncSelectors<Store>;
