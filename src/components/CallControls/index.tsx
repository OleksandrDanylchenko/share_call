import React, { FC } from 'react';

import { Button, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import DeviceToggleButton from '@/components/DeviceToggleButton';
import { selectLocalTrackState, useCallTracks } from '@/store/callTracks';
import { shadowBorder } from '@/styles/mixins';
import { DeviceType } from '@/types/agora';

import { goToPreviewPage } from '@/routing/index';

interface Props {
  roomId: string;
}

const CallControls: FC<Props> = (props) => {
  const { roomId } = props;

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
      gap={2}
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
      <Button
        css={(theme) =>
          shadowBorder(theme, { color: theme.palette.error.main })
        }
        sx={{
          position: 'absolute',
          right: (theme) => theme.spacing(2.5),
        }}
        color="inherit"
        onClick={() => goToPreviewPage(roomId)}
      >
        <span>Leave the call</span>
      </Button>
    </Stack>
  );
};

export default CallControls;
