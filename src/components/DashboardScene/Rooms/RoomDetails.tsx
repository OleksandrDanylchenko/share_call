import React, { FC } from 'react';

import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { Stack, Typography } from '@mui/material';

import { fullHeight } from '@/styles/mixins';

interface Props {
  activeRoomId?: string;
}

const RoomDetails: FC<Props> = (props) => {
  const { activeRoomId } = props;

  return !activeRoomId ? <DetailsPlaceholder /> : <h3>Hello</h3>;
};

const DetailsPlaceholder: FC = () => (
  <Stack css={fullHeight} justifyContent="center" pl={8}>
    <Stack alignItems="center" justifyContent="center">
      <Typography variant="h2" fontSize="6rem">
        Choose <br /> a room
      </Typography>
      <ArrowCircleLeftIcon sx={{ fontSize: '5rem' }} />
    </Stack>
  </Stack>
);

export default RoomDetails;
