import React, { FC } from 'react';
import { useForm } from 'react-hook-form-mui';

import { Skeleton } from '@mui/material';
import { useSession } from 'next-auth/react';

import SingleFieldForm from '@/components/SingleFieldForm';
import { fullWidth } from '@/styles/mixins';
import { api } from '@/utils/api';
import { reloadAuthSession } from '@/utils/auth';

const UserNameSetting: FC = () => {
  const { status, data: session } = useSession();
  const sessionUsername = session?.user?.name || '';

  const nameFormContext = useForm({ values: { name: sessionUsername } });
  const {
    mutate: updateUsername,
    isLoading,
    error,
  } = api.userSettings.updateName.useMutation({
    onSuccess: reloadAuthSession,
  });

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

export default UserNameSetting;
