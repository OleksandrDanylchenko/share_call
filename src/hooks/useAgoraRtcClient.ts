import { useRef, useState } from 'react';

import { ClientConfig, IAgoraRTCClient } from 'agora-rtc-sdk-ng';
import useAsyncEffect from 'use-async-effect';

/**
 * Creates a singleton instance of the AgoraRTC client
 * that can be used throughout the app w/ the same hook
 */
let cachedClient: IAgoraRTCClient;

export const useAgoraRtcClient = (
  config: ClientConfig = { mode: 'rtc', codec: 'vp8' },
): { isLoading: boolean; client: IAgoraRTCClient } => {
  const clientRequested = useRef(false);

  const [isLoading, setLoading] = useState(!cachedClient); // Load when missing client
  const [client, setClient] = useState(cachedClient);

  useAsyncEffect(async () => {
    if (clientRequested.current) return; // Prevents client creation from being requested multiple times
    clientRequested.current = true;

    const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
    const newClient = AgoraRTC.createClient(config);
    cachedClient = newClient;

    setClient(newClient);
    setLoading(false);
  }, [client, config]);

  return { isLoading, client };
};
