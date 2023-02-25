import { FC, useEffect, useRef } from 'react';

import { Box } from '@mui/material';

import { fullParent } from '@/styles/mixins';
import { AgoraTracks } from '@/types/agora';

interface Props {
  userId: string;
  tracks: AgoraTracks;
  showName?: boolean;
}

const TracksPlayer: FC<Props> = (props) => {
  const { userId, tracks, showName } = props;

  const playerContainerRef = useRef<HTMLDivElement>();

  useEffect(() => {
    const { current: playerContainer } = playerContainerRef;
    if (!playerContainer) return;

    const [microphoneTrack, cameraTrack] = tracks;
    microphoneTrack.play();
    cameraTrack.play(playerContainer);
  }, [tracks]);

  return <Box ref={playerContainerRef} css={fullParent}></Box>;
};

export default TracksPlayer;
