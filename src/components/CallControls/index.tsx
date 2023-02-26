import { FC } from 'react';

import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
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

  return (
    <Stack direction="row" alignItems="center" justifyContent="center" p={2}>
      <IconButton
        css={(theme) => {
          const { warning, error } = theme.palette;
          return shadowInset(theme, {
            blurRadius: '35px',
            color: microphoneEnabled ? warning.light : error.main,
          });
        }}
        size="large"
        aria-label={`${microphoneEnabled ? 'Unmute' : 'Mute'} microphone`}
        onClick={handleToggleCallPermission('microphone')}
      >
        {microphoneEnabled ? (
          <MicIcon fontSize="large" />
        ) : (
          <MicOffIcon fontSize="large" />
        )}
      </IconButton>
    </Stack>
  );
};

export default CallControls;
