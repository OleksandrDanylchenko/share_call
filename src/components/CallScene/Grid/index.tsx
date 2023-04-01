import { FC, useRef } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import { useSession } from 'next-auth/react';

import CallPlayerOverlay from '@/components/CallPlayerOverlay';
import { useGridItemDimensions } from '@/components/CallScene/Grid/useGridItemWidth';
import TracksPlayer from '@/components/TracksPlayer';
import { useCallTracks } from '@/store/callTracks';
import { fullParent } from '@/styles/mixins';
import { AgoraTracks } from '@/types/agora';
import { api } from '@/utils/api';

interface Props {
  roomId: string;
}

const GridScene: FC<Props> = (props) => {
  const { roomId } = props;

  const { data: session } = useSession();

  const gridContainerRef = useRef<HTMLDivElement | null>(null);

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

  const tracks = useCallTracks.use.tracks();

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
          user: { id: userId, name },
        } = participant;
        const userTracks = tracks[userId];

        return (
          <Grid key={userId} {...itemDimensions}>
            <CallPlayerOverlay userId={userId} name={name}>
              <TracksPlayer
                tracks={
                  {
                    audioTrack: userTracks?.microphone?.track,
                    videoTrack: userTracks?.camera?.track,
                  } as Partial<AgoraTracks>
                }
                playAudio={userId !== session!.user!.id}
              />
            </CallPlayerOverlay>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default GridScene;
