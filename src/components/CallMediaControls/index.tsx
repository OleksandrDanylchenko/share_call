import { FC } from 'react';

import { Stack } from '@mui/material';
import { useSession } from 'next-auth/react';

import DeviceToggleButton from '@/components/DeviceToggleButton';
import { selectLocalTrackState, useCallTracks } from '@/store/callTracks';
import { DeviceType } from '@/types/agora';

const CallMediaControls: FC = () => {
  const { data: session } = useSession();

  const microphoneState = useCallTracks((state) =>
    selectLocalTrackState(state, session!.user!.id, 'microphone'),
  )!;
  const cameraState = useCallTracks((state) =>
    selectLocalTrackState(state, session!.user!.id, 'camera'),
  )!;

  const setTrackEnabled = useCallTracks.use.setTrackEnabled();
  const toggleEnabledChange = (deviceType: DeviceType) => (): void => {
    const enabled =
      deviceType === 'microphone'
        ? microphoneState?.enabled
        : cameraState?.enabled;
    setTrackEnabled(session!.user!.id, deviceType, !enabled);
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      p={2}
      gap={4}
    >
      <DeviceToggleButton
        label={`${
          cameraState.enabled ? 'Disable' : 'Enable'
        } camera for the call`}
        deviceType="camera"
        enabled={cameraState.enabled}
        onClick={toggleEnabledChange('camera')}
      />
      <DeviceToggleButton
        label={`${
          microphoneState.enabled ? 'Unmute' : 'Mute'
        } microphone for the call`}
        deviceType="microphone"
        enabled={microphoneState.enabled}
        onClick={toggleEnabledChange('microphone')}
      />
    </Stack>
  );
};

export default CallMediaControls;
