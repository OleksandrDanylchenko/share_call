import React, { FC } from 'react';

import { Stack } from '@mui/material';
import { useSession } from 'next-auth/react';

import { UserAvatarSetting } from '@/components/UserSettings/UserAvatar';
import UserEmailSetting from '@/components/UserSettings/UserEmail';
import UserNameSetting from '@/components/UserSettings/UserName';
import { fullWidth } from '@/styles/mixins';

export const AVATAR_SIZE = 212;

const UserSettings: FC = () => {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <Stack css={fullWidth} alignItems="center" gap={4}>
      <UserAvatarSetting />
      <UserNameSetting />
      <UserEmailSetting />
    </Stack>
  );
};

export default UserSettings;
