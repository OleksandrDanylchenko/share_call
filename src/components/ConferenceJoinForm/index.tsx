import React, { FC, FormEventHandler } from 'react';

import { LoadingButton } from '@mui/lab';
import { Stack, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';

import {
  joinFormWrapper,
  nameForm,
} from '@/components/ConferenceJoinForm/styles';
import { useClientValue } from '@/hooks/index';
import { useGuestUserInfo } from '@/store/guestUserInfo';

const ConferenceJoinForm: FC = () => {
  const router = useRouter();

  const guestName = useGuestUserInfo.use.guest?.()?.name;
  const updateGuestName = useGuestUserInfo.use.updateGuestName();

  const name = useClientValue(guestName, '');

  const handleNameSubmit: FormEventHandler<HTMLFormElement> = (event): void => {
    event.preventDefault();
    router.push('/preview');
  };

  return (
    <Stack css={joinFormWrapper} alignItems="center" justifyContent="center">
      <form css={nameForm} onSubmit={handleNameSubmit}>
        <Typography variant="h4" component="label" htmlFor="name-field">
          How may we address you?
        </Typography>
        <TextField
          id="name-field"
          variant="filled"
          name="name"
          size="medium"
          fullWidth
          required
          hiddenLabel
          value={name}
          onChange={(e) => updateGuestName(e.target.value)}
        />
        <LoadingButton
          type="submit"
          variant="outlined"
          color="inherit"
          fullWidth
          disabled={!name}
        >
          <span>Confirm</span>
        </LoadingButton>
      </form>
    </Stack>
  );
};

export default ConferenceJoinForm;
