import { FC } from 'react';

import Grid from '@mui/material/Unstable_Grid2';

import TracksPlayer from '@/components/TracksPlayer';
import { useCallTracks } from '@/store/callTracks';
import { fullParent } from '@/styles/mixins';

const GridScene: FC = () => {
  const usersTracks = useCallTracks.use.usersTracks();

  return (
    <Grid css={fullParent} container spacing={2} justifyContent="center">
      {Object.entries(usersTracks).map(([userId, tracks]) => (
        <TracksPlayer key={userId} userId={userId} tracks={tracks} />
      ))}
    </Grid>
  );
};

export default GridScene;
