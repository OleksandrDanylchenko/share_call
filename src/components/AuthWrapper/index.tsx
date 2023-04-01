import { FC, PropsWithChildren, ReactElement } from 'react';

import { LinearProgress, Stack, Typography } from '@mui/material';
import { AppPropsType } from 'next/dist/shared/lib/utils';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { UseSessionOptions } from 'next-auth/react/types';

import { useGuestUserInfo } from '@/store/guestUserInfo';
import { doubleColorGradient, fullViewport } from '@/styles/mixins';

export interface AuthProps extends UseSessionOptions<boolean> {
  unauthenticatedUrl?: string;
  loadingScreen?: ReactElement;
}

export type NextAuthComponentType = AppPropsType['Component'] & {
  auth?: AuthProps;
};

type Props = AuthProps & PropsWithChildren;

/**
 * Handling session in the client and showing a global loader for the first time
 * @see {@link https://next-auth.js.org/getting-started/client#custom-client-session-handling}
 */
const Auth: FC<Props> = (props) => {
  const {
    children,
    required,
    onUnauthenticated,
    unauthenticatedUrl = '/',
    loadingScreen,
  } = props;

  const router = useRouter();

  const { status, data: session } = useSession();
  if (status === 'loading') {
    return <div>{loadingScreen || <DefaultLoadingScreen />}</div>;
  }

  if (required && !session) {
    if (onUnauthenticated) {
      onUnauthenticated();
    } else if (unauthenticatedUrl) {
      router.replace(unauthenticatedUrl);
    }

    return null;
  }

  return <>{children}</>;
};

const DefaultLoadingScreen: FC = () => (
  <Stack
    css={[fullViewport, doubleColorGradient]}
    alignItems="center"
    justifyContent="center"
  >
    <Stack gap={5} padding={10} borderRadius={5}>
      <Typography variant="h2" textAlign="center">
        Loading account...
      </Typography>
      <LinearProgress color="inherit" />
    </Stack>
  </Stack>
);

export default Auth;
