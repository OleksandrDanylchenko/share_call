import { FC, ReactElement } from 'react';

import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { IconButton, Stack } from '@mui/material';

import { useClientValue } from '@/hooks/useClientValue';
import { useMediaSettings } from '@/store/mediaSettings';
import { shadowInset } from '@/styles/mixins';
import { DeviceType } from '@/types/agora';

const CallControls: FC = () => {
  const cameraEnabled = useClientValue(
    useMediaSettings.use.camera().enabled,
    true,
  );
  const microphoneEnabled = useClientValue(
    useMediaSettings.use.microphone().enabled,
    true,
  );

  const setEnabled = useMediaSettings.use.setEnabled();
  const handleToggleCallPermission = (deviceType: DeviceType) => (): void => {
    const enabled =
      deviceType === 'microphone' ? microphoneEnabled : cameraEnabled;
    setEnabled(deviceType, !enabled);
  };

  const getControlIcon = (deviceType: DeviceType): ReactElement => {
    let enabled: boolean;
    let ariaLabel: string;
    let icon: ReactElement;

    switch (deviceType) {
      case 'microphone':
        enabled = microphoneEnabled;
        ariaLabel = `${enabled ? 'Unmute' : 'Mute'} microphone`;
        icon = enabled ? (
          <MicIcon fontSize="large" />
        ) : (
          <MicOffIcon fontSize="large" />
        );
        break;
      case 'camera':
        enabled = cameraEnabled;
        ariaLabel = `${enabled ? 'Disable' : 'Enable'} camera`;
        icon = enabled ? (
          <PhotoCameraIcon fontSize="large" />
        ) : (
          <NoPhotographyIcon fontSize="large" />
        );
    }

    return (
      <IconButton
        css={(theme) => {
          const { warning, error } = theme.palette;
          return shadowInset(theme, {
            blurRadius: '40px',
            color: enabled ? warning.main : error.main,
          });
        }}
        size="large"
        aria-label={ariaLabel}
        onClick={handleToggleCallPermission(deviceType)}
      >
        {icon}
      </IconButton>
    );
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      p={2}
      gap={4}
    >
      {getControlIcon('microphone')}
      {getControlIcon('camera')}
    </Stack>
  );
};

export default CallControls;
