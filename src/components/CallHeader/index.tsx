import React, { FC } from 'react';

import { Stack, Typography } from '@mui/material';

import { fullWidth, lineClamp } from '@/styles/mixins';
import { api } from '@/utils/api';

interface Props {
  roomId: string;
}

const CallFooter: FC<Props> = (props) => {
  const { roomId } = props;

  const { data: targetRoom } = api.rooms.getRoom.useQuery(
    { id: roomId },
    { retry: 1 },
  );
  const { name } = targetRoom!;

  return (
    <Stack
      css={[fullWidth]}
      direction="row"
      py={1}
      justifyContent="space-between"
    >
      <Typography css={lineClamp(1)} variant="h5" color="warning.main">
        {name}
      </Typography>
    </Stack>
  );
};

export default CallFooter;
