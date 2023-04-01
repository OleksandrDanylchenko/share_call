import { FC, useRef } from 'react';

import Grid from '@mui/material/Unstable_Grid2';

import CallPlayerOverlay from '@/components/CallPlayerOverlay';
import { useGridItemDimensions } from '@/components/CallScene/Grid/useGridItemWidth';
import TracksPlayer from '@/components/TracksPlayer';
import { useCurrentUser } from '@/hooks/index';
import { useCallTracks } from '@/store/callTracks';
import { fullParent } from '@/styles/mixins';
import { AgoraTracks } from '@/types/agora';
import { api } from '@/utils/api';

interface Props {
  roomId: string;
}

const GridScene: FC<Props> = (props) => {
  const { roomId } = props;

  const user = useCurrentUser();

  const gridContainerRef = useRef<HTMLDivElement | null>(null);

  const tracks = useCallTracks.use.tracks();

  const { data: targetRoom } = api.rooms.getRoom.useQuery(
    { id: roomId },
    { retry: 1 },
  );
  const { lastSession } = targetRoom!;

  const itemDimensions = useGridItemDimensions({
    containerRef: gridContainerRef,
    itemsCount: lastSession!.participants.length,
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
      {lastSession!.participants.map((participant) => {
        const {
          user: { id: userId },
        } = participant;
        const userTracks = tracks[userId];

        return (
          <Grid key={userId} {...itemDimensions}>
            <CallPlayerOverlay userId={userId}>
              <TracksPlayer
                tracks={
                  {
                    audioTrack: userTracks?.microphone?.track,
                    videoTrack: userTracks?.camera?.track,
                  } as Partial<AgoraTracks>
                }
                playAudio={userId !== user?.id}
              />
            </CallPlayerOverlay>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default GridScene;
