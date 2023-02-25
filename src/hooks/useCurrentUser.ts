import { useEffect, useState } from 'react';

import { User } from 'next-auth';
import { SessionContextValue, useSession } from 'next-auth/react';
import { UseSessionOptions } from 'next-auth/react/types';

import { useGuestUserInfo } from '@/store/guestUserInfo';

export const useCurrentUser = <R extends boolean>(
  options?: UseSessionOptions<R>,
): {
  user?: User;
  status: SessionContextValue['status'];
  isLoading: boolean;
} => {
  const [user, setUser] = useState<User>();

  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  const guest = useGuestUserInfo.use.guest?.();

  useEffect(() => {
    if (isLoading || user) return;

    const currentUser = session?.user || guest;
    setUser(currentUser);

    if (options?.required && !currentUser) {
      options.onUnauthenticated?.();
    }
  }, [guest, isLoading, options, session?.user, user]);

  return { user, status, isLoading };
};
