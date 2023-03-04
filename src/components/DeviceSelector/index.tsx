import { FC, useId, useMemo, useState } from 'react';

import {
  capitalize,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { keyBy } from 'lodash';

interface Props {
  deviceType: 'microphone' | 'camera';
  deviceId: string;
  devices: Array<MediaDeviceInfo>;
  onChange: (device: MediaDeviceInfo) => void;
}

const DeviceSelector: FC<Props> = (props) => {
  const { deviceType, deviceId, devices, onChange } = props;

  const indexedDevices = useMemo(() => keyBy(devices, 'deviceId'), [devices]);
  const [device, setDevice] = useState(indexedDevices[deviceId]!);

  const handleDeviceChange = (event: SelectChangeEvent): void => {
    const newDeviceId = event.target.value;
    const selectedDevice = indexedDevices[newDeviceId]!;

    setDevice(selectedDevice);
    onChange(selectedDevice);
  };

  const selectorId = useId();
  return (
    <FormControl size="small" fullWidth>
      <InputLabel id={selectorId} style={visuallyHidden}>
        {capitalize(deviceType)}
      </InputLabel>
      <Select
        id={selectorId}
        labelId={selectorId}
        value={device?.deviceId || ''}
        onChange={handleDeviceChange}
      >
        {devices.map(({ deviceId, label }) => (
          <MenuItem key={deviceId} value={deviceId}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default DeviceSelector;
