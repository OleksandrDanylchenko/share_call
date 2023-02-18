import { FC, useEffect, useState } from 'react';

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { Dictionary, keyBy } from 'lodash';
import useAsyncEffect from 'use-async-effect';

interface Props {
  // The device id cannot be obtained from the video track
  initialDeviceLabel?: string;
  onChange: (device: MediaDeviceInfo) => void;
}

const CameraSelector: FC<Props> = (props) => {
  const { initialDeviceLabel, onChange } = props;

  const [devices, setDevices] = useState<Dictionary<MediaDeviceInfo>>();
  useAsyncEffect(async () => {
    const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
    const agoraDevices = await AgoraRTC.getCameras();

    const devicesDictionary = keyBy(agoraDevices, (device) => device.label);
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
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="camera-select">Camera</InputLabel>
      <Select
        labelId="camera-select"
        id="camera-select"
        value={device?.label || ''}
        label=""
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

export default CameraSelector;
