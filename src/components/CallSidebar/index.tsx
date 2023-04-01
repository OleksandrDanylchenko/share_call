import React, { FC } from 'react';

import InfoIcon from '@mui/icons-material/Info';
import { IconButton, Stack } from '@mui/material';

import { blurBackgroundContainer, shadowBorder } from '@/styles/mixins';

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
      <IconButton
        css={(theme) =>
          shadowBorder(theme, {
            blurRadius: '16px',
            color: theme.palette.warning.main,
          })
        }
        size="medium"
      >
        <InfoIcon />
      </IconButton>
    </Stack>
  );
};

export default CallSidebar;
