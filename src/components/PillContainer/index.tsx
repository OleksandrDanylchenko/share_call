import React, { FC, PropsWithChildren } from 'react';

import { Stack } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

import { fullWidth, lightBackgroundContainer } from '@/styles/mixins';

interface Props extends PropsWithChildren {
  active?: boolean;
  sx?: SxProps<Theme>;
}

const PillContainer: FC<Props> = (props) => {
  const { sx, active = false, children } = props;

  return (
    <Stack
      css={(theme) => [fullWidth, lightBackgroundContainer(theme, { active })]}
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      px={3}
      py={1.2}
      borderRadius={6}
      sx={[...(Array.isArray(sx) ? sx : [sx])]}
    >
      {children}
    </Stack>
  );
};

export default PillContainer;
