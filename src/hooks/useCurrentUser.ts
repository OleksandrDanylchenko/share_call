import { User } from 'next-auth';
import { useSession } from 'next-auth/react';

import { useGuestUserInfo } from '@/store/guestUserInfo';

export const useCurrentUser = (): User | undefined => {
  const { data: session } = useSession();
  const guest = useGuestUserInfo.use.guest?.();
  return session?.user || guest;
};
