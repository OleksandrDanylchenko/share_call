import React, { FC, ReactElement } from 'react';

import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { IconButton, Tooltip } from '@mui/material';

import DeviceIcon from '@/components/DeviceIcon';
import { shadowBorder } from '@/styles/mixins';
import { DeviceType } from '@/types/agora';

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
          blurRadius: '40px',
          color: enabled ? warning.main : error.main,
        });
      }}
      className={className}
      size="large"
      aria-label={label}
      onClick={onClick}
    >
      <DeviceIcon deviceType={deviceType} enabled={enabled} fontSize="large" />
    </IconButton>
  );

  return showTooltip ? (
    <Tooltip title={label}>{iconButton}</Tooltip>
  ) : (
    iconButton
  );
};

export default DeviceToggleButton;
