import { startTransition, useEffect, useState } from 'react';

import { User } from 'next-auth';
import { SessionContextValue, useSession } from 'next-auth/react';

import { useGuestUserInfo } from '@/store/guestUserInfo';

/**
 * Reuse the same user object across the components and pages
 * TODO Use persisted storage to keep the user object.
 * Update it on the first load of the page and log out if previously was logged
 */
let cachedUser: User;

interface Props {
  redirectOnUnauthenticated?: () => void;
}

export const useCurrentUser = (
  props?: Props,
): {
  user?: User;
  status: SessionContextValue['status'];
  isLoading: boolean;
} => {
  const { redirectOnUnauthenticated } = {
    redirectOnUnauthenticated: () => undefined,
    ...props,
  };

  const [isLoading, setLoading] = useState(!cachedUser);
  const [user, setUser] = useState<User>(cachedUser);

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
        cachedUser = currentUser;
        setUser(currentUser);
        setLoading(false);
      } else {
        redirectOnUnauthenticated?.();
      }
    });
  }, [guest, redirectOnUnauthenticated, session?.user, status, user]);

  return { user, status, isLoading };
};
