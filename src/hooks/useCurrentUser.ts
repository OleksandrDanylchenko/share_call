import { startTransition, useEffect, useState } from 'react';

import { User } from 'next-auth';
import { SessionContextValue, useSession } from 'next-auth/react';

import { useGuestUserInfo } from '@/store/guestUserInfo';

interface Props {
  redirectOnUnauthenticated?: () => void;
}

export const useCurrentUser = (
  props: Props,
): {
  user?: User;
  status: SessionContextValue['status'];
  isLoading: boolean;
} => {
  const { redirectOnUnauthenticated } = props;

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
      if (!currentUser?.name) {
        setUser(currentUser);
        setLoading(false);
      }

      redirectOnUnauthenticated?.();
    });
  }, [guest, redirectOnUnauthenticated, session?.user, status, user]);

  return { user, status, isLoading };
};
