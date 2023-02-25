import { FC, useEffect, useRef } from 'react';

import { Box, Typography } from '@mui/material';

import { shadowInset, fullParent } from '@/styles/mixins';
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
    showName = true,
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

    return () => cameraTrack.stop();
  }, [cameraTrack, playVideo]);

  useEffect(() => {
    if (playAudio) {
      microphoneTrack.play();
    }
    return () => microphoneTrack.stop();
  }, [microphoneTrack, playAudio]);

  return (
    <Box
      ref={playerContainerRef}
      css={fullParent}
      className={className}
      position="relative"
      borderRadius={8}
      overflow="hidden"
    >
      {showName && (
        <Typography
          css={(theme) =>
            shadowInset(theme, {
              color: theme.palette.warning.main,
              blurRadius: '60px',
            })
          }
          variant="subtitle1"
          p={1}
          pl={3}
          pr={2}
          lineHeight={1}
          position="absolute"
          bottom={0}
          left={0}
          zIndex={1}
          color="black"
          sx={{ borderTopRightRadius: '10px' }}
        >
          Oleksandr Danylchenko
        </Typography>
      )}
    </Box>
  );
};

export default TracksPlayer;
