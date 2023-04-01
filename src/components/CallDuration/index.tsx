import React, { FC } from 'react';

import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import { Stack, Typography } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

import PillContainer from '@/components/PillContainer';
import { useDuration } from '@/hooks/useDuration';

interface Props {
  startedAt?: Date;
  sx?: SxProps<Theme>;
}

const CallDuration: FC<Props> = (props) => {
  const { startedAt, sx } = props;

  const duration = useDuration(startedAt || new Date());
  return (
    <PillContainer active sx={sx}>
      <Stack direction="row" alignItems="baseline" gap={2}>
        <Typography variant="subtitle1">
          <AccessTimeFilledIcon fontSize="small" sx={{ mr: 1, mb: -0.5 }} />
          Duration:
        </Typography>
        <Typography variant="subtitle1">{duration}</Typography>
      </Stack>
    </PillContainer>
  );
};

export default CallDuration;
