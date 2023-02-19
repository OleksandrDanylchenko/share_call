import { User } from 'next-auth';
import { SessionContextValue, useSession } from 'next-auth/react';

import { useGuestUserInfo } from '@/store/guestUserInfo';

export const useCurrentUser = (): {
  user?: User;
  status: SessionContextValue['status'];
} => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return { status };
  }

  if (status === 'authenticated') {
    return { user: session?.user, status };
  }

  const guest = useGuestUserInfo.use.guest?.();
  return { user: guest, status };
};
