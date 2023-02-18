import { FC } from 'react';

import {
  Box,
  Switch,
  SwitchProps,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  bindHover,
  bindPopover,
  usePopupState,
} from 'material-ui-popup-state/hooks';
import HoverPopover from 'material-ui-popup-state/HoverPopover';

interface Props extends Omit<SwitchProps, 'onChange'> {
  helperText: string;
  onChange: (enabled: boolean) => void;
}

const SwitchWithPopover: FC<Props> = (props) => {
  const { helperText, onChange, ...switchProps } = props;

  const popoverState = usePopupState({ variant: 'popover' });

  const { breakpoints } = useTheme();
  const isLg = useMediaQuery(breakpoints.down('lg'));

  return (
    <>
      <Box {...bindHover(popoverState)}>
        <Switch {...switchProps} onChange={(e) => onChange(e.target.checked)} />
      </Box>
      <HoverPopover
        {...bindPopover(popoverState)}
        sx={{ pointerEvents: 'none' }}
        anchorOrigin={{
          vertical: isLg ? 'bottom' : 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: isLg ? 'top' : 'center',
          horizontal: isLg ? 'right' : 'left',
        }}
      >
        <Typography style={{ padding: '8px' }}>{helperText}</Typography>
      </HoverPopover>
    </>
  );
};

export default SwitchWithPopover;
