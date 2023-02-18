import { FC } from 'react';

import { Switch, SwitchProps, Typography } from '@mui/material';
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
      <Switch {...props} {...bindHover(popoverState)} />
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
