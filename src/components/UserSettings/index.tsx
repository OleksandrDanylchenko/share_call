import React, { FC, useEffect, useState } from 'react';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CheckIcon from '@mui/icons-material/Check';
import CreateIcon from '@mui/icons-material/Create';
import EmailIcon from '@mui/icons-material/Email';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import { LoadingButton } from '@mui/lab';
import {
  Skeleton,
  Stack,
  Avatar,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Box,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { useToggle } from 'usehooks-ts';

import MagicLinkForm from '@/components/SignInForm/MagicLinkForm';
import { fullWidth, shadowBorder, textFieldEllipsis } from '@/styles/mixins';

const AVATAR_SIZE = 212;

const UserSettings: FC = () => {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <Stack css={fullWidth} alignItems="center" gap={4}>
      <UserAvatarSetting />
      <UserNameSetting />
      <MagicLinkForm />
    </Stack>
  );
};

const UserAvatarSetting: FC = () => {
  const { status, data: session } = useSession();
  return (
    <>
      {status === 'loading' ? (
        <Skeleton variant="circular" width={AVATAR_SIZE} height={AVATAR_SIZE} />
      ) : (
        <Avatar
          src={session!.user!.image || ''}
          alt={session!.user!.name!}
          sx={{
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
          }}
        />
      )}
    </>
  );
};

type UserNameState = 'idle' | 'sending' | 'sent';

const UserNameSetting: FC = () => {
  const { status, data: session } = useSession();

  const sessionUsername = session?.user?.name || '';
  const [username, setUsername] = useState(sessionUsername);
  useEffect(() => {
    if (status !== 'loading') setUsername(sessionUsername);
  }, [sessionUsername, status]);

  const [editing, toggleEditing] = useToggle(false);
  const handleNameSubmit = ({ name }: { name: string }): void => {};

  return (
    <>
      {status === 'loading' ? (
        <Skeleton css={fullWidth} variant="text" />
      ) : (
        <Box css={fullWidth}>
          <FormContainer
            defaultValues={{ name: sessionUsername }}
            values={{ name: username }} // Reacts on loaded value
            resetOptions={{ keepDirtyValues: true }}
            onSuccess={handleNameSubmit}
          >
            <TextFieldElement
              css={textFieldEllipsis}
              label="Name"
              name="name"
              variant="standard"
              value={username}
              fullWidth
              required
              InputProps={{
                readOnly: !editing,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Edit name"
                      onClick={toggleEditing}
                      size="small"
                      type={editing ? 'submit' : 'button'}
                    >
                      {editing ? (
                        <CheckIcon fontSize="small" />
                      ) : (
                        <CreateIcon fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormContainer>
        </Box>
      )}
    </>
  );
};

export default UserSettings;
