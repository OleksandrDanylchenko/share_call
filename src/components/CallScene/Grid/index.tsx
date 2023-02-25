import { FC } from 'react';

import Grid from '@mui/material/Unstable_Grid2';

import TracksPlayer from '@/components/TracksPlayer';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useCallTracks } from '@/store/callTracks';
import { fullParent } from '@/styles/mixins';

const GridScene: FC = () => {
  const { user } = useCurrentUser();

  const usersTracks = useCallTracks.use.usersTracks();

  return (
    <Grid
      css={fullParent}
      container
      spacing={2}
      alignItems="center"
      justifyContent="center"
    >
      {Object.entries(usersTracks).map(([userId, tracks]) => (
        <Grid key={userId} xs={6} sx={{ aspectRatio: '16 / 9' }}>
          <TracksPlayer
            userId={userId}
            tracks={tracks}
            playAudio={userId !== user?.id}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default GridScene;
