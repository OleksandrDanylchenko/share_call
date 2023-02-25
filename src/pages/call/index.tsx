import { FC } from 'react';

import { useRouter } from 'next/router';

import { useAgoraRtcClient } from '@/hooks/useAgoraRtcClient';
import { doubleColorGradient, fullViewport } from '@/styles/mixins';

const Call: FC = () => {
  const router = useRouter();

  const client = useAgoraRtcClient();

  console.log({ client });

  return <main css={[fullViewport, doubleColorGradient]}>hell</main>;
};

export default Call;
