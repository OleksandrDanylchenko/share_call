import React, { FC } from 'react';
import { useForm } from 'react-hook-form-mui';

import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { Avatar, Skeleton, Box, Stack, Tooltip, css } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useToggle } from 'usehooks-ts';

import Dimmer from '@/components/Dimmer';
import SingleFieldForm from '@/components/SingleFieldForm';
import { fullWidth } from '@/styles/mixins';
import { api } from '@/utils/api';

const AVATAR_SIZE = 212;

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

const UserAvatarSetting: FC = () => {
  const { status, data: session } = useSession();

  const [showEditOverlay, toggleShowOverlay] = useToggle(false);

  return (
    <>
      {status === 'loading' ? (
        <Skeleton variant="circular" width={AVATAR_SIZE} height={AVATAR_SIZE} />
      ) : (
        <Box position="relative">
          <Tooltip
            open={showEditOverlay}
            title="Edit image"
            placement="top"
            onOpen={toggleShowOverlay}
            onClose={toggleShowOverlay}
          >
            <Dimmer
              open={showEditOverlay}
              variant="circular"
              content={<AddAPhotoIcon />}
              css={css`
                cursor: pointer;
              `}
            >
              <Avatar
                variant="circular"
                src={session!.user!.image || ''}
                alt={session!.user!.name!}
                sx={{
                  width: AVATAR_SIZE,
                  height: AVATAR_SIZE,
                }}
              />
            </Dimmer>
          </Tooltip>
        </Box>
      )}
    </>
  );
};

const UserNameSetting: FC = () => {
  const { status, data: session } = useSession();
  const sessionUsername = session?.user?.name || '';

  const nameFormContext = useForm({ values: { name: sessionUsername } });
  const {
    mutate: updateUsername,
    isLoading,
    error,
  } = api.userSettings.updateName.useMutation();

  return (
    <>
      {status === 'loading' ? (
        <Skeleton css={fullWidth} variant="text" />
      ) : (
        <SingleFieldForm
          formProps={{
            formContext: nameFormContext,
            onSuccess: ({ name }) =>
              name !== sessionUsername && updateUsername({ name }),
          }}
          textFieldProps={{ label: 'Name', name: 'name' }}
          loading={isLoading}
          error={error?.data?.zodError?.fieldErrors}
        />
      )}
    </>
  );
};

const UserEmailSetting: FC = () => {
  const { status, data: session } = useSession();
  const sessionEmail = session?.user?.email || '';

  const emailFormContext = useForm({ values: { email: sessionEmail } });
  const {
    mutate: updateEmail,
    isLoading,
    error,
  } = api.userSettings.updateEmail.useMutation();

  return (
    <>
      {status === 'loading' ? (
        <Skeleton css={fullWidth} variant="text" />
      ) : (
        <SingleFieldForm
          formProps={{
            formContext: emailFormContext,
            onSuccess: ({ email }) =>
              email !== sessionEmail && updateEmail({ email }),
          }}
          textFieldProps={{ label: 'Email', name: 'email' }}
          loading={isLoading}
          error={error?.data?.zodError?.fieldErrors}
        />
      )}
    </>
  );
};

export default UserSettings;
