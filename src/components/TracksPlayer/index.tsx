import { FC, useEffect, useRef } from 'react';

import { Box } from '@mui/material';

import { fullParent } from '@/styles/mixins';
import { AgoraTracks } from '@/types/agora';

interface Props {
  tracks: Partial<AgoraTracks>;
  playVideo?: boolean;
  playAudio?: boolean;
  className?: string;
}

const TracksPlayer: FC<Props> = (props) => {
  const { tracks, playVideo = true, playAudio = true, className } = props;

  const playerContainerRef = useRef<HTMLDivElement>();

  const { audioTrack, videoTrack } = tracks;

  useEffect(() => {
    const { current: playerContainer } = playerContainerRef;
    if (!playerContainer || !playVideo || !videoTrack) return;

    videoTrack.play(playerContainer);
    return () => videoTrack.stop();
  }, [videoTrack, playVideo]);

  useEffect(() => {
    if (!playAudio || !audioTrack) return;

    audioTrack.play();
    return () => audioTrack.stop();
  }, [audioTrack, playAudio]);

  return (
    <Box
      ref={playerContainerRef}
      css={fullParent}
      className={className}
      borderRadius={8}
      overflow="hidden"
    />
  );
};

export default TracksPlayer;
