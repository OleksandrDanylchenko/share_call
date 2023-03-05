import { useState } from 'react';

import { RtmClient } from 'agora-rtm-sdk';
import useAsyncEffect from 'use-async-effect';

import { clientEnv } from '@/env/schema.mjs';

/**
 * Creates a singleton instance of the AgoraRTC client
 * that can be used throughout the app w/ the same hook
 */
let cachedClient: RtmClient;

export const useAgoraRtmClient = (): {
  isLoading: boolean;
  client: RtmClient;
} => {
  const [isLoading, setLoading] = useState(!cachedClient); // Load when missing client
  const [client, setClient] = useState(cachedClient);

  useAsyncEffect(async () => {
    if (client) return;

    const appId = clientEnv.NEXT_PUBLIC_AGORA_APP_ID;
    if (!appId) {
      throw new Error('Missing Agora App ID!');
    }

    const AgoraRTM = (await import('agora-rtm-sdk')).default;
    const newClient = AgoraRTM.createInstance(appId);
    cachedClient = newClient;

    setClient(newClient);
    setLoading(false);
  }, [client]);

  return {
    isLoading,
    client,
  };
};
