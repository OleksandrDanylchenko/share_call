import {
  createSelectorFunctions,
  ZustandFuncSelectors,
} from 'auto-zustand-selectors-hook';
import { create } from 'zustand';

import { AgoraTracks } from '@/types/agora';

interface State {
  tracks: Record<string, AgoraTracks>; // Tracks indexed by users
}

interface Actions {
  updateUserTracks: (userId: string, tracks: AgoraTracks) => void;
}

type Store = State & Actions;

const useCallTracksBase = create<Store>()((set) => ({
  tracks: {},
  updateUserTracks: (userId, tracks) =>
    // Immer cannot be used on agora tracks as they are complex objects
    set((state) => ({
      ...state,
      tracks: {
        ...state.tracks,
        [userId]: tracks,
      },
    })),
}));

export const useCallTracks = createSelectorFunctions(
  useCallTracksBase,
) as typeof useCallTracksBase & ZustandFuncSelectors<Store>;
