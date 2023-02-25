import { useState } from 'react';

import { ClientConfig, IAgoraRTCClient } from 'agora-rtc-sdk-ng';
import useAsyncEffect from 'use-async-effect';

/**
 * Creates a singleton instance of the AgoraRTC client
 * that can be used throughout the app w/ the same hook
 */
let singletonClient: IAgoraRTCClient;

export const useAgoraRtcClient = (
  config: ClientConfig = { mode: 'rtc', codec: 'vp9' },
): { isLoading: boolean; client: IAgoraRTCClient } => {
  const [isLoading, setLoading] = useState(!singletonClient); // Load when missing client
  const [client, setClient] = useState(singletonClient);

  useAsyncEffect(async () => {
    if (client) return;

    const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
    const newClient = AgoraRTC.createClient(config);
    singletonClient = newClient;

    setClient(newClient);
    setLoading(false);
  }, [client]);

  return {
    isLoading,
    client,
  };
};
