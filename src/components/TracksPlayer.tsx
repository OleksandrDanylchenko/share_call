import { FC, useEffect, useRef } from 'react';

import { css } from '@emotion/react';
import { Box, Typography } from '@mui/material';

import { shadowInset, fullParent } from '@/styles/mixins';
import { AgoraTracks } from '@/types/agora';

interface Props {
  userId: string;
  tracks: Partial<AgoraTracks>;
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

  const { microphoneTrack, cameraTrack } = tracks;

  useEffect(() => {
    const { current: playerContainer } = playerContainerRef;
    if (!playerContainer || !playVideo || !cameraTrack) return;

    cameraTrack.play(playerContainer);
    return () => cameraTrack.stop();
  }, [cameraTrack, playVideo]);

  useEffect(() => {
    if (!playAudio || !microphoneTrack) return;

    microphoneTrack.play();
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
      sx={{ containerType: 'inline-size' }}
    >
      {showName && (
        <Typography
          css={(theme) => [
            shadowInset(theme, {
              color: theme.palette.warning.main,
              blurRadius: '60px',
            }),
            nameLabel,
          ]}
          variant="subtitle1"
          p={0.6}
          pl={3}
          pr={1}
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

const nameLabel = css`
  @container (max-width: 400px) {
    font-size: 0.7em;
    padding: 4px 8px 4px 20px;
  }
`;

export default TracksPlayer;
