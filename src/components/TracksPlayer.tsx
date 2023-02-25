import { FC, useEffect, useRef } from 'react';

import { Box } from '@mui/material';

import { fullParent } from '@/styles/mixins';
import { AgoraTracks } from '@/types/agora';

interface Props {
  userId: string;
  tracks: AgoraTracks;
  playVideo?: boolean;
  playAudio?: boolean;
  showName?: boolean;
  className?: string;
}

const TracksPlayer: FC<Props> = (props) => {
  const {
    userId,
    tracks,
    playVideo = true,
    playAudio = true,
    showName,
    className,
  } = props;

  const playerContainerRef = useRef<HTMLDivElement>();

  const [microphoneTrack, cameraTrack] = tracks;

  useEffect(() => {
    const { current: playerContainer } = playerContainerRef;
    if (!playerContainer) return;

    if (playVideo) {
      cameraTrack.play(playerContainer);
    }
  }, [cameraTrack, playVideo]);

  useEffect(() => {
    if (playAudio) {
      microphoneTrack.play();
    }
  }, [microphoneTrack, playAudio]);

  return (
    <Box
      ref={playerContainerRef}
      css={fullParent}
      className={className}
      borderRadius={8}
      overflow="hidden"
    ></Box>
  );
};

export default TracksPlayer;
