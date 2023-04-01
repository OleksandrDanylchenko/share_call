import React, { FC } from 'react';

import { Stack } from '@mui/material';

import CallSidebarInfo from '@/components/CallSidebar/Info';
import { blurBackgroundContainer } from '@/styles/mixins';

interface Props {
  roomId: string;
}

const CallSidebar: FC<Props> = (props) => {
  const { roomId } = props;
  return (
    <Stack
      css={blurBackgroundContainer}
      position="absolute"
      top={0}
      right={0}
      bottom={20}
      px={1.5}
      py={2}
      gap={2}
    >
      <CallSidebarInfo roomId={roomId} />
    </Stack>
  );
};

export default CallSidebar;
