import React, { FC, FormEventHandler } from 'react';

import { LoadingButton } from '@mui/lab';
import { Stack, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';

import {
  joinFormContainer,
  nameForm,
} from '@/components/ConferenceJoinForm/styles';
import { useLocalStorage } from '@/hooks/index';

const nameStoreKey = 'user-name';

const ConferenceJoinForm: FC = () => {
  // TODO Store name in the indexed store with all the other users

  const router = useRouter();

  const [name, setName] = useLocalStorage(nameStoreKey, '');
  const handleNameSubmit: FormEventHandler<HTMLFormElement> = (event): void => {
    event.preventDefault();
    router.push('/preview');
  };

  return (
    <Stack css={joinFormContainer} alignItems="center" justifyContent="center">
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
          onChange={(e) => setName(e.target.value)}
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
