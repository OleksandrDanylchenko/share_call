import {
  createSelectorFunctions,
  ZustandFuncSelectors,
} from 'auto-zustand-selectors-hook';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { AgoraTracks } from '@/types/agora';

interface State {
  usersTracks: Record<string, Partial<AgoraTracks>>; // Tracks indexed by users
}

interface Actions {
  updateUserTracks: (
    userId: string,
    tracks: Partial<AgoraTracks> | undefined,
  ) => void;
}

type Store = State & Actions;

const useCallStateBase = create<Store>()(
  immer((set) => ({
    usersTracks: {},
    updateUserTracks: (userId, tracks) =>
      set((state) => {
        if (!tracks) {
          delete state.usersTracks[userId];
          return;
        }

        state.usersTracks[userId] ||= {};

        const { audioTrack, videoTrack } = tracks;
        if (audioTrack !== undefined) {
          state.usersTracks[userId]!.audioTrack = audioTrack;
        }
        if (videoTrack !== undefined) {
          state.usersTracks[userId]!.videoTrack = videoTrack;
        }
      }),
  })),
);

export const useCallState = createSelectorFunctions(
  useCallStateBase as any, // Fixes immer inferring
) as typeof useCallStateBase & ZustandFuncSelectors<Store>;
