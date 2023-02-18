import { FC, useEffect, useId, useState } from 'react';

import {
  capitalize,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { Dictionary, keyBy } from 'lodash';
import useAsyncEffect from 'use-async-effect';

interface Props {
  deviceType: 'microphone' | 'camera';
  initialDeviceLabel?: string; // The device id cannot be obtained from the video track
  onChange: (device: MediaDeviceInfo) => void;
}

const DeviceSelector: FC<Props> = (props) => {
  const { deviceType, initialDeviceLabel, onChange } = props;

  const selectorId = useId();

  console.log({ selectorId });

  const [devices, setDevices] = useState<Dictionary<MediaDeviceInfo>>();
  useAsyncEffect(async () => {
    const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
    const agoraDevices = await (deviceType === 'microphone'
      ? AgoraRTC.getMicrophones()
      : AgoraRTC.getCameras());

    const devicesDictionary = keyBy(agoraDevices, ({ label }) => label);
    setDevices(devicesDictionary);
  }, []);

  const [device, setDevice] = useState<MediaDeviceInfo>();
  useEffect(() => {
    if (initialDeviceLabel && devices) {
      setDevice(devices[initialDeviceLabel]);
    }
  }, [devices, initialDeviceLabel]);

  const handleDeviceChange = (event: SelectChangeEvent): void => {
    if (!devices) return;

    const deviceLabel = event.target.value;
    const selectedDevice = devices[deviceLabel];
    if (!selectedDevice) return;

    setDevice(selectedDevice);
    onChange(selectedDevice);
  };

  return (
    <FormControl size="small" fullWidth>
      <InputLabel id={selectorId} style={visuallyHidden}>
        {capitalize(deviceType)}
      </InputLabel>
      <Select
        id={selectorId}
        labelId={selectorId}
        value={device?.label || ''}
        onChange={handleDeviceChange}
      >
        {Object.values(devices || {})?.map(({ deviceId, label }) => (
          <MenuItem key={deviceId} value={label}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default DeviceSelector;
