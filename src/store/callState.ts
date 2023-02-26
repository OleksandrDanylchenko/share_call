import {
  createSelectorFunctions,
  ZustandFuncSelectors,
} from 'auto-zustand-selectors-hook';
import { merge } from 'lodash';
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

        const { microphoneTrack, cameraTrack } = tracks;
        if (microphoneTrack !== undefined) {
          state.usersTracks[userId]!.microphoneTrack = microphoneTrack;
        }
        if (cameraTrack !== undefined) {
          state.usersTracks[userId]!.cameraTrack = cameraTrack;
        }
      }),
  })),
);

export const useCallState = createSelectorFunctions(
  useCallStateBase as any, // Fixes immer inferring
) as typeof useCallStateBase & ZustandFuncSelectors<Store>;
