import { FC } from 'react';

import { Box, Switch, SwitchProps, Typography } from '@mui/material';
import {
  bindHover,
  bindPopover,
  usePopupState,
} from 'material-ui-popup-state/hooks';
import HoverPopover from 'material-ui-popup-state/HoverPopover';

interface Props extends SwitchProps {
  helperText: string;
}

const SwitchWithPopover: FC<Props> = ({ helperText, ...props }) => {
  const popoverState = usePopupState({ variant: 'popover' });

  return (
    <>
      <Box {...bindHover(popoverState)}>
        <Switch {...props} />
      </Box>
      <HoverPopover
        {...bindPopover(popoverState)}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
      >
        <Typography style={{ padding: '8px' }}>{helperText}</Typography>
      </HoverPopover>
    </>
  );
};

export default SwitchWithPopover;
