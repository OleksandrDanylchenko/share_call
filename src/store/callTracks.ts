import {
  createSelectorFunctions,
  ZustandFuncSelectors,
} from 'auto-zustand-selectors-hook';
import { create } from 'zustand';

import { AgoraTracks } from '@/types/agora';

interface State {
  usersTracks: Record<string, AgoraTracks>; // Tracks indexed by users
}

interface Actions {
  updateUserTracks: (userId: string, tracks: AgoraTracks) => void;
}

type Store = State & Actions;

const useCallTracksBase = create<Store>()((set) => ({
  usersTracks: {},
  updateUserTracks: (userId, tracks) =>
    // Immer cannot be used on agora tracks as they are complex objects
    set((state) => ({
      ...state,
      usersTracks: {
        ...state.usersTracks,
        [userId]: tracks,
      },
    })),
}));

export const useCallTracks = createSelectorFunctions(
  useCallTracksBase,
) as typeof useCallTracksBase & ZustandFuncSelectors<Store>;
