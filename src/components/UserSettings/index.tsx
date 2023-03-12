import React, { FC } from 'react';

import { Stack } from '@mui/material';

import { UserAvatarSetting } from '@/components/UserSettings/UserAvatar';
import UserEmailSetting from '@/components/UserSettings/UserEmail';
import UserNameSetting from '@/components/UserSettings/UserName';
import { fullWidth } from '@/styles/mixins';

export const AVATAR_SIZE = 212;

const UserSettings: FC = () => (
  <Stack css={fullWidth} alignItems="center" gap={4}>
    <UserAvatarSetting />
    <UserNameSetting />
    <UserEmailSetting />
  </Stack>
);

export default UserSettings;
