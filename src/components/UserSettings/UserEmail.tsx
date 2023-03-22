import React, { FC } from 'react';
import { useForm } from 'react-hook-form-mui';

import { Skeleton } from '@mui/material';
import { useSession } from 'next-auth/react';

import SingleFieldForm from '@/components/SingleFieldForm';
import { fullWidth } from '@/styles/mixins';
import { api } from '@/utils/api';
import { reloadAuthSession } from '@/utils/auth';

const UserEmailSetting: FC = () => {
  const { status, data: session } = useSession();
  const sessionEmail = session?.user?.email || '';

  const emailFormContext = useForm({ values: { email: sessionEmail } });
  const {
    mutate: updateEmail,
    isLoading,
    error,
  } = api.userSettings.updateEmail.useMutation({
    onSuccess: reloadAuthSession,
  });

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
          ellipsis
          loading={isLoading}
          error={error?.data?.zodError?.fieldErrors}
        />
      )}
    </>
  );
};

export default UserEmailSetting;
