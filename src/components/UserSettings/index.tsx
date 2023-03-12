import React, { FC } from 'react';

import { Stack } from '@mui/material';

import { UserAvatarSetting } from '@/components/UserSettings/UserAvatar';
import UserEmailSetting from '@/components/UserSettings/UserEmail';
import UserNameSetting from '@/components/UserSettings/UserName';
import { fullWidth } from '@/styles/mixins';

const UserSettings: FC = () => (
  <Stack css={fullWidth} alignItems="center" gap={4}>
    <UserAvatarSetting />
    <UserNameSetting />
    <UserEmailSetting />
  </Stack>
);

export default UserSettings;
