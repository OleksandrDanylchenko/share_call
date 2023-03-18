import { FC, useRef } from 'react';

import Grid from '@mui/material/Unstable_Grid2';

import CallPlayerOverlay from '@/components/CallPlayerOverlay';
import { useGridItemDimensions } from '@/components/CallScene/Grid/useGridItemWidth';
import TracksPlayer from '@/components/TracksPlayer';
import { useCurrentUser } from '@/hooks/index';
import { useCallTracks } from '@/store/callTracks';
import { fullParent } from '@/styles/mixins';
import { AgoraTracks } from '@/types/agora';

const GridScene: FC = () => {
  const user = useCurrentUser();

  const gridContainerRef = useRef<HTMLDivElement | null>(null);

  const tracks = useCallTracks.use.tracks();
  const usersNumber = Object.keys(tracks).length;

  const itemDimensions = useGridItemDimensions({
    containerRef: gridContainerRef,
    itemsCount: usersNumber,
    spacing: 8,
  });

  return (
    <Grid
      ref={gridContainerRef}
      css={fullParent}
      container
      spacing={1}
      alignItems="center"
      alignContent="center"
      justifyContent="center"
    >
      {Object.entries(tracks).map(([userId, { microphone, camera }]) => (
        <Grid key={userId} {...itemDimensions}>
          <CallPlayerOverlay userId={userId}>
            <TracksPlayer
              tracks={
                {
                  audioTrack: microphone?.track,
                  videoTrack: camera?.track,
                } as Partial<AgoraTracks>
              }
              playAudio={userId !== user?.id}
            />
          </CallPlayerOverlay>
        </Grid>
      ))}
    </Grid>
  );
};

export default GridScene;
