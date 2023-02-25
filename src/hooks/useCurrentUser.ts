import { startTransition, useEffect, useState } from 'react';

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
  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState<User>();

  const { data: session, status } = useSession();
  const guest = useGuestUserInfo.use.guest?.();

  useEffect(() => {
    if (status === 'loading' || user) return;

    /**
     * Setting values on the same render cycle
     * Ensures that when isLoading === false -> user is set
     */
    const currentUser = session?.user || guest;
    startTransition(() => {
      if (currentUser?.name) {
        setUser(currentUser);
        setLoading(false);
      }

      if (options?.required) {
        options.onUnauthenticated?.();
      }
    });
  }, [guest, options, session?.user, status, user]);

  return { user, status, isLoading };
};
