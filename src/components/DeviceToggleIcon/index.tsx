import { FC } from 'react';

import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { SvgIconTypeMap } from '@mui/material/SvgIcon/SvgIcon';

import { DeviceType } from '@/types/agora';

type SvgIconProps = SvgIconTypeMap['props'];

interface Props extends SvgIconProps {
  deviceType: DeviceType;
  enabled: boolean | undefined;
}

const DeviceToggleIcon: FC<Props> = (props) => {
  const { deviceType, enabled, ...iconProps } = props;

  switch (deviceType) {
    case 'microphone':
      return enabled ? (
        <MicIcon {...iconProps} />
      ) : (
        <MicOffIcon {...iconProps} />
      );
    case 'camera':
      return enabled ? (
        <PhotoCameraIcon {...iconProps} />
      ) : (
        <NoPhotographyIcon {...iconProps} />
      );
  }
};

export default DeviceToggleIcon;
