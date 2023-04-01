import React, { FC } from 'react';

import { Stack, Typography } from '@mui/material';

import CallDuration from '@/components/CallDuration';
import PillContainer from '@/components/PillContainer';
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

  return (
    <Stack
      css={[fullWidth]}
      direction="row"
      pt={1.5}
      pr={8}
      pb={2}
      justifyContent="space-between"
    >
      <PillContainer sx={{ width: 'fit-content !important', maxWidth: 600 }}>
        <Typography css={lineClamp(1)} fontSize={30} color="warning.main">
          {targetRoom?.name}
        </Typography>
      </PillContainer>
      <CallDuration
        startedAt={targetRoom?.lastSession?.startedAt}
        sx={{ width: 'fit-content !important' }}
      />
    </Stack>
  );
};

export default CallFooter;
