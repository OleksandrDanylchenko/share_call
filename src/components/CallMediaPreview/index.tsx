import React, { FC, useEffect } from 'react';

import { css } from '@emotion/react';
import ReportIcon from '@mui/icons-material/Report';
import { Box, Skeleton, Stack, Typography } from '@mui/material';
import { User } from 'next-auth';

import DeviceSelector from '@/components/DeviceSelector';
import DeviceToggleButton from '@/components/DeviceToggleButton';
import TracksPlayer from '@/components/TracksPlayer';
import { useDevices } from '@/hooks/useDevices';
import { useMicCamTracks } from '@/hooks/useMicCamTracks';
import {
  selectLocalTrackState,
  selectTracks,
  useCallTracks,
} from '@/store/callTracks';
import { fullParent, fullWidth } from '@/styles/mixins';
import { AgoraRTCErrorCode, DeviceType } from '@/types/agora';
import { getSomeAgoraTracksLive } from '@/utils/tracks';

interface Props {
  user: User;
  onTracksReady: () => void;
  onTracksError: (errorCode: AgoraRTCErrorCode) => void;
}

const CallMediaPreview: FC<Props> = (props) => {
  const { user, onTracksReady, onTracksError } = props;

  const microphoneState = useCallTracks((state) =>
    selectLocalTrackState(state, user.id, 'microphone'),
  );
  const cameraState = useCallTracks((state) =>
    selectLocalTrackState(state, user.id, 'camera'),
  );

  const addTracks = useCallTracks.use.addTracks();
  const setTrackEnabled = useCallTracks.use.setTrackEnabled();
  const setTrackDevice = useCallTracks.use.setTrackDevice();

  const userTracks = useCallTracks((state) => selectTracks(state, user!.id));

  const { tracks, errorCode: tracksErrorCode } = useMicCamTracks({
    skip: !!userTracks,
  });
  const { devices } = useDevices();

  useEffect(() => {
    const isTracksLive = getSomeAgoraTracksLive(
      tracks?.camera?.track,
      tracks?.microphone?.track,
    );
    if (tracks && isTracksLive && !userTracks) {
      addTracks(user.id, tracks);
    }
  }, [addTracks, tracks, userTracks, user]);

  useEffect(() => {
    if (tracks || userTracks) {
      onTracksReady();
    } else if (tracksErrorCode) {
      onTracksError(tracksErrorCode);
    }
  }, [onTracksError, onTracksReady, tracks, tracksErrorCode, userTracks]);

  const handleDeviceChange =
    (deviceType: DeviceType) =>
    ({ deviceId }: MediaDeviceInfo): void =>
      setTrackDevice(user.id, deviceType, deviceId);

  const toggleEnabledChange = (deviceType: DeviceType) => (): void => {
    const enabled =
      deviceType === 'microphone'
        ? microphoneState?.enabled
        : cameraState?.enabled;
    setTrackEnabled(user.id, deviceType, !enabled);
  };

  return (
    <Stack css={fullWidth} alignItems="center" gap={2}>
      <Stack
        alignItems="center"
        justifyContent="center"
        gap={3}
        width="90%"
        height={300}
        position="relative"
        borderRadius={8}
        overflow="hidden"
      >
        {cameraState?.enabled && (
          <TracksPlayer
            css={css`
              z-index: 1;
            `}
            tracks={{ videoTrack: cameraState.track }}
          />
        )}
        <Skeleton
          css={fullParent}
          variant="rounded"
          animation={
            tracksErrorCode || (cameraState && !cameraState.enabled)
              ? false
              : 'pulse'
          }
          sx={{ position: 'absolute' }}
        />
        {cameraState && !cameraState.enabled && (
          <Typography variant="h5">Camera is disabled</Typography>
        )}
        {tracksErrorCode && (
          <>
            <ReportIcon fontSize="large" color="error" />
            <Typography variant="body1" color="error" textAlign="center">
              We couldn&apos;t obtain your media devices. <br />
              Please check your browser&apos;s permissions and try again.
            </Typography>
            <Typography variant="body2" color="error">
              Error code: {tracksErrorCode}
            </Typography>
          </>
        )}
      </Stack>
      {!tracksErrorCode && (
        <>
          <Box width="90%">
            {!cameraState || !devices?.camera ? (
              <Skeleton variant="rounded" width="100%" height={60} />
            ) : (
              <Stack
                css={fullWidth}
                direction="row"
                alignItems="center"
                gap={3}
              >
                <DeviceToggleButton
                  label={`${
                    cameraState.enabled ? 'Disable' : 'Enable'
                  } camera for the call`}
                  showTooltip
                  deviceType="camera"
                  enabled={cameraState.enabled}
                  onClick={toggleEnabledChange('camera')}
                />
                <DeviceSelector
                  deviceType="camera"
                  deviceId={cameraState.deviceId}
                  devices={devices.camera}
                  disabled={!cameraState.enabled}
                  onChange={handleDeviceChange('camera')}
                />
              </Stack>
            )}
          </Box>
          <Box width="90%">
            {!microphoneState || !devices?.microphone ? (
              <Skeleton variant="rounded" width="100%" height={60} />
            ) : (
              <Stack
                css={fullWidth}
                direction="row"
                alignItems="center"
                gap={3}
              >
                <DeviceToggleButton
                  label={`${
                    microphoneState.enabled ? 'Unmute' : 'Mute'
                  } microphone for the call`}
                  showTooltip
                  deviceType="microphone"
                  enabled={microphoneState.enabled}
                  onClick={toggleEnabledChange('microphone')}
                />
                <DeviceSelector
                  deviceType="camera"
                  deviceId={microphoneState.deviceId}
                  devices={devices.microphone}
                  disabled={!microphoneState.enabled}
                  onChange={handleDeviceChange('microphone')}
                />
              </Stack>
            )}
          </Box>
        </>
      )}
    </Stack>
  );
};

export default CallMediaPreview;
