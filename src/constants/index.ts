import {
  CameraVideoTrackInitConfig,
  MicrophoneAudioTrackInitConfig,
} from 'agora-rtc-sdk-ng';

export const audioConfig: MicrophoneAudioTrackInitConfig = {};
export const videoConfig: CameraVideoTrackInitConfig = {
  encoderConfig: {
    width: { min: 640, ideal: 1920, max: 1920 },
    height: { min: 480, ideal: 1080, max: 1080 },
  },
};
