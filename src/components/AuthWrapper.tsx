import { FC, PropsWithChildren, ReactElement } from 'react';

import { AppPropsType } from 'next/dist/shared/lib/utils';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { UseSessionOptions } from 'next-auth/react/types';

import { useGuestUserInfo } from '@/store/guestUserInfo';

export interface AuthProps extends UseSessionOptions<boolean> {
  unauthenticatedUrl?: string;
  loadingScreen?: ReactElement;
}

export type NextAuthComponentType = AppPropsType['Component'] & {
  auth?: AuthProps;
};

/**
 * Handling session in the client and showing a global loader for the first time
 * @see {@link https://next-auth.js.org/getting-started/client#custom-client-session-handling}
 */
const Auth: FC<AuthProps & PropsWithChildren> = (props) => {
  const {
    children,
    required,
    onUnauthenticated,
    unauthenticatedUrl,
    loadingScreen,
  } = props;

  const router = useRouter();

  const { status, data: session } = useSession();
  const guest = useGuestUserInfo.use.guest?.();

  if (status === 'loading') {
    return <div>{loadingScreen || 'Loading...'}</div>;
  }

  if (required && !session && !guest?.name) {
    if (onUnauthenticated) {
      onUnauthenticated();
    } else if (unauthenticatedUrl) {
      router.replace(unauthenticatedUrl);
    }

    return null;
  }

  return <>{children}</>;
};

export default Auth;
