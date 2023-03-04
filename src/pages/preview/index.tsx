import React, { FC, useEffect, useRef } from 'react';

import MicIcon from '@mui/icons-material/Mic';
import ReportIcon from '@mui/icons-material/Report';
import { Container, Skeleton, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';

import { NextAuthComponentType } from '@/components/AuthWrapper';
import DeviceSelector from '@/components/DeviceSelector';
import DeviceToggleButton from '@/components/DeviceToggleButton';
import { useCompliment, useCurrentUser, useMicCamTracks } from '@/hooks/index';
import { useDevices } from '@/hooks/useDevices';
import { selectTrackState, useCallTracks } from '@/store/callTracks';
import {
  blurBackgroundContainer,
  doubleColorGradient,
  fullHeight,
  fullViewport,
} from '@/styles/mixins';
import { DeviceType } from '@/types/agora';

const Preview: FC = () => {
  const router = useRouter();

  const previewCameraContainerRef = useRef<HTMLDivElement>(null);

  const user = useCurrentUser();

  const microphoneState = useCallTracks((state) =>
    selectTrackState(state, user!.id, 'microphone'),
  );
  const cameraState = useCallTracks((state) =>
    selectTrackState(state, user!.id, 'camera'),
  );

  const addTracks = useCallTracks.use.addTracks();
  const setTrackEnabled = useCallTracks.use.setTrackEnabled();
  const setTrackDevice = useCallTracks.use.setTrackDevice();
  const removeTracks = useCallTracks.use.removeTracks();

  const {
    isLoading: isLoadingTracks,
    tracks,
    errorCode: tracksErrorCode,
  } = useMicCamTracks();
  const { devices } = useDevices();

  useEffect(() => {
    if (tracks) {
      addTracks(user!.id, tracks);
    }
  }, [addTracks, tracks, user]);

  const handleDeviceChange =
    (deviceType: DeviceType) =>
    ({ deviceId }: MediaDeviceInfo): void =>
      setTrackDevice(user!.id, deviceType, deviceId);

  const toggleEnabledChange = (deviceType: DeviceType) => (): void => {
    const enabled =
      deviceType === 'microphone'
        ? microphoneState?.enabled
        : cameraState?.enabled;
    setTrackEnabled(user!.id, deviceType, !enabled);
  };

  useEffect(() => {
    if (!cameraState?.track) return;

    const { current: previewCameraContainer } = previewCameraContainerRef;
    if (!previewCameraContainer) return;

    const { track, enabled } = cameraState;
    if (enabled) {
      track.play(previewCameraContainer);
    } else {
      track.stop();
    }
  }, [cameraState]);

  const compliment = useCompliment();

  const handleCancelClick = (): void => {
    router.push('/').finally(() => removeTracks(user!.id));
  };
  const handleJoinClick = (): void => {
    router.push('/call');
  };

  return (
    <main css={[fullViewport, doubleColorGradient]}>
      <Container css={fullHeight}>
        <Stack css={fullHeight} alignItems="center" justifyContent="center">
          <Stack
            css={blurBackgroundContainer}
            alignItems="center"
            gap={2}
            width="90%"
            maxWidth={777}
          >
            <Typography variant="h4" color={tracksErrorCode && 'error'} mb={3}>
              {isLoadingTracks && 'Loading media devices...'}
              {tracksErrorCode && 'Cannot obtain devices'}
              {tracks && `You look ${compliment} ✨`}
            </Typography>
            <Stack
              ref={previewCameraContainerRef}
              alignItems="center"
              justifyContent="center"
              gap={3}
              width="90%"
              height={300}
              position="relative"
              borderRadius={8}
              overflow="hidden"
            >
              <Skeleton
                variant="rounded"
                width="100%"
                height="100%"
                animation={
                  tracksErrorCode || !cameraState?.enabled ? false : 'pulse'
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
                <Stack direction="row" alignItems="center" gap={2} width="90%">
                  {!cameraState || !devices?.camera ? (
                    <Skeleton variant="rounded" width="100%" height={40} />
                  ) : (
                    <Stack direction="row" alignItems="center" gap={3}>
                      <DeviceToggleButton
                        label={`${
                          cameraState.enabled ? 'Disable' : 'Enable'
                        } camera for the call`}
                        showTooltip
                        deviceType={'camera'}
                        enabled={cameraState.enabled}
                        onClick={toggleEnabledChange('camera')}
                      />
                      <DeviceSelector
                        deviceType="camera"
                        deviceId={cameraState.deviceId}
                        devices={devices.camera}
                        onChange={handleDeviceChange('camera')}
                      />
                    </Stack>
                  )}
                </Stack>
                <Stack direction="row" alignItems="center" gap={2} width="90%">
                  <MicIcon />
                  {isLoadingTracks && (
                    <Skeleton variant="rounded" width="100%" height={40} />
                  )}
                  {/*{audioTrack && (*/}
                  {/*  <>*/}
                  {/*    <DeviceSelector*/}
                  {/*      deviceType="microphone"*/}
                  {/*      initialDeviceLabel={audioTrack.getTrackLabel()}*/}
                  {/*      onChange={handleDeviceChange('microphone')}*/}
                  {/*    />*/}
                  {/*    <SwitchWithPopover*/}
                  {/*      helperText={`${*/}
                  {/*        microphoneEnabled ? 'Disable' : 'Enable'*/}
                  {/*      } microphone for the call`}*/}
                  {/*      checked={microphoneEnabled}*/}
                  {/*      onChange={handleCallPermissionChange('microphone')}*/}
                  {/*    />*/}
                  {/*  </>*/}
                  {/*)}*/}
                </Stack>
              </>
            )}
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-around"
              gap={5}
              width="90%"
              mt={3}
            >
              {/*{isLoadingTracks ? (*/}
              {/*  <>*/}
              {/*    <Skeleton*/}
              {/*      variant="rounded"*/}
              {/*      width="50%"*/}
              {/*      height={44}*/}
              {/*      sx={{ borderRadius: 30 }}*/}
              {/*    />*/}
              {/*    <Skeleton*/}
              {/*      variant="rounded"*/}
              {/*      width="100%"*/}
              {/*      height={44}*/}
              {/*      sx={{ borderRadius: 30 }}*/}
              {/*    />*/}
              {/*  </>*/}
              {/*) : (*/}
              {/*  <>*/}
              {/*    <Button*/}
              {/*      variant="outlined"*/}
              {/*      color="inherit"*/}
              {/*      onClick={handleCancelClick}*/}
              {/*      sx={{ width: '50%' }}*/}
              {/*    >*/}
              {/*      Cancel*/}
              {/*    </Button>*/}
              {/*    {!tracksErrorCode && (*/}
              {/*      <Button*/}
              {/*        variant="contained"*/}
              {/*        fullWidth*/}
              {/*        onClick={handleJoinClick}*/}
              {/*      >*/}
              {/*        Join*/}
              {/*      </Button>*/}
              {/*    )}*/}
              {/*  </>*/}
              {/*)}*/}
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </main>
  );
};

const AuthPreview: NextAuthComponentType = Preview;
AuthPreview.auth = {
  required: true,
  unauthenticatedUrl: '/',
};

export default AuthPreview;
