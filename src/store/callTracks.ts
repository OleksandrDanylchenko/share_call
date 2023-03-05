import {
  createSelectorFunctions,
  ZustandFuncSelectors,
} from 'auto-zustand-selectors-hook';
import { isEmpty } from 'lodash';
import { ObjectTyped } from 'object-typed';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import {
  DeviceLocalTracksState,
  DeviceTracksState,
  DeviceType,
  isLocalTrack,
} from '@/types/agora';

interface State {
  tracks: Record<string, Partial<DeviceTracksState>>; // user -> deviceType -> track
}

interface Actions {
  addTracks: (userId: string, tracks: DeviceTracksState) => void;
  addTrack: <TDeviceType extends DeviceType>(
    userId: string,
    deviceType: TDeviceType,
    track: DeviceTracksState[TDeviceType],
  ) => void;
  removeTracks: (userId: string) => void;
  removeTrack: (userId: string, deviceType: DeviceType) => void;
  setTrackEnabled: (
    userId: string,
    deviceType: DeviceType,
    enabled: boolean,
  ) => void;
  setTrackDevice: (
    userId: string,
    deviceType: DeviceType,
    deviceId: string,
  ) => void;
}

type Store = State & Actions;

const useCallStateBase = create<Store>()(
  immer((set, get) => ({
    tracks: {},
    addTracks: (userId, tracks) =>
      set((state) => {
        state.tracks[userId] = tracks;
      }),
    addTrack: (userId, deviceType, track) =>
      set((state) => {
        state.tracks[userId] ||= {};
        state.tracks[userId]![deviceType] = track;
      }),
    removeTracks: (userId) =>
      set((state) => {
        const userTracks = state.tracks[userId];
        if (isEmpty(userTracks)) return;

        ObjectTyped.keys(userTracks).forEach((deviceType) =>
          get().removeTrack(userId, deviceType),
        );
        delete state.tracks[userId];
      }),
    removeTrack: (userId, deviceType) =>
      set((state) => {
        const trackState = state.tracks[userId]?.[deviceType];
        if (!trackState) return;

        const { track } = trackState;
        track.stop();
        isLocalTrack(track) && track.close();
        delete state.tracks[userId]![deviceType];
      }),
    setTrackEnabled: (userId, deviceType, enabled) =>
      set((state) => {
        const trackState = state.tracks[userId]?.[deviceType];
        if (!trackState) return;

        const { track } = trackState;
        if (isLocalTrack(track)) {
          track.setEnabled(enabled);
          trackState.enabled = enabled;
        }
      }),
    setTrackDevice: (userId, deviceType, deviceId) =>
      set((state) => {
        const trackState = state.tracks[userId]?.[deviceType];
        if (!trackState) return;

        const { track } = trackState;
        if (isLocalTrack(track)) {
          track.setDevice(deviceId);
          trackState.deviceId = deviceId;
        }
      }),
  })),
);

export const selectTracks = <TTracks extends DeviceTracksState>(
  state: State,
  userId: string,
): Partial<TTracks> | undefined => state.tracks[userId] as TTracks;

export const selectLocalTracks = (
  ...args: Parameters<typeof selectTracks>
): Partial<DeviceLocalTracksState> | undefined =>
  selectTracks<DeviceLocalTracksState>(...args);

export const selectTrackState = <
  TTracks extends DeviceTracksState,
  TDevice extends DeviceType,
>(
  state: State,
  userId: string,
  deviceType: TDevice,
): TTracks[TDevice] | undefined => {
  const userTracks = selectTracks<TTracks>(state, userId);
  return userTracks?.[deviceType];
};

export const selectLocalTrackState = <TDevice extends DeviceType>(
  state: State,
  userId: string,
  deviceType: TDevice,
): DeviceLocalTracksState[TDevice] | undefined =>
  selectTrackState<DeviceLocalTracksState, TDevice>(state, userId, deviceType);

export const useCallTracks = createSelectorFunctions(
  useCallStateBase as any, // Fixes immer inferring
) as typeof useCallStateBase & ZustandFuncSelectors<Store>;
