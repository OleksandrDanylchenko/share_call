import { FC, useRef } from 'react';

import { Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { styled } from '@mui/system';

import { useGridItemDimensions } from '@/components/CallScene/Grid/useGridItemWidth';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useCallTracks } from '@/store/callTracks';
import { fullParent } from '@/styles/mixins';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
}));

const items = [
  0, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
];

const GridScene: FC = () => {
  const { user } = useCurrentUser();

  const gridContainerRef = useRef<HTMLDivElement | null>(null);

  const usersTracks = useCallTracks.use.usersTracks();
  const usersNumber = Object.keys(usersTracks).length;

  const itemDimensions = useGridItemDimensions({
    containerRef: gridContainerRef,
    // itemsCount: usersNumber,
    itemsCount: items.length,
    spacing: 16,
  });

  return (
    <Grid
      ref={gridContainerRef}
      css={fullParent}
      container
      spacing={2}
      alignItems="center"
      alignContent="center"
      justifyContent="center"
    >
      {items.map((item) => (
        <Grid key={item} {...itemDimensions}>
          <Item css={fullParent}>
            <Typography variant="h5">{item}</Typography>
          </Item>
        </Grid>
      ))}
      {/*{Object.entries(usersTracks).map(([userId, tracks]) => (*/}
      {/*  <Grid key={userId} xs={1} sx={{ aspectRatio: '16 / 9' }}>*/}
      {/*    <TracksPlayer*/}
      {/*      userId={userId}*/}
      {/*      tracks={tracks}*/}
      {/*      playAudio={userId !== user?.id}*/}
      {/*    />*/}
      {/*  </Grid>*/}
      {/*))}*/}
    </Grid>
  );
};

export default GridScene;
