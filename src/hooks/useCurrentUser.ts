import { User } from 'next-auth';
import { useSession } from 'next-auth/react';

import { useGuestUserInfo } from '@/store/guestUserInfo';

/**
 * Returns the current user on the **protected pages**
 */
export const useCurrentUser = (): User => {
  const { data: session } = useSession();
  const guest = useGuestUserInfo.use.guest?.();
  return session?.user || guest;
};
