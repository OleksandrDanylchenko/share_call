import React, { FC } from 'react';

import { IconButton, Tooltip } from '@mui/material';

import { shadowBorder } from '@/styles/mixins';
import { DeviceType } from '@/types/agora';
import DeviceToggleIcon from 'components/DeviceToggleIcon';

interface Props {
  deviceType: DeviceType;
  enabled: boolean;
  label: string;
  showTooltip?: boolean;
  onClick: () => void;
  className?: string;
}

const DeviceToggleButton: FC<Props> = (props) => {
  const { deviceType, enabled, label, showTooltip, onClick, className } = props;

  const iconButton = (
    <IconButton
      css={(theme) => {
        const { warning, error } = theme.palette;
        return shadowBorder(theme, {
          blurRadius: '30px',
          color: enabled ? warning.main : error.main,
        });
      }}
      className={className}
      size="medium"
      aria-label={label}
      onClick={onClick}
    >
      <DeviceToggleIcon
        deviceType={deviceType}
        enabled={enabled}
        fontSize="large"
      />
    </IconButton>
  );

  return showTooltip ? (
    <Tooltip title={label}>{iconButton}</Tooltip>
  ) : (
    iconButton
  );
};

export default DeviceToggleButton;
