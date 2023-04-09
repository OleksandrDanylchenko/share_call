import { AgoraTrack } from '@/types/agora';

export const getAgoraTrackReadyState = (
  agoraTrack: AgoraTrack | undefined,
): MediaStreamTrackState | undefined =>
  agoraTrack?.getMediaStreamTrack()?.readyState;

export const getSomeAgoraTracksLive = (
  ...agoraTracks: Array<AgoraTrack | undefined>
): boolean =>
  agoraTracks.some(
    (agoraTrack) => getAgoraTrackReadyState(agoraTrack) === 'live',
  );
