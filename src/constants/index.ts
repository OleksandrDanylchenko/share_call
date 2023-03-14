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
export const BORINGAVATARS_SERVICE_URL = 'https://source.boringavatars.com';
export const BORINGAVATARS_COLORS = ['775a2d', '252017', '162631', '225072'];
export const AVATAR_SIZE = 212;

export const UPLOADCARE_CDN_URL = 'https://ucarecdn.com';
