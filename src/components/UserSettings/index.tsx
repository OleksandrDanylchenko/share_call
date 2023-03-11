import React, { FC } from 'react';
import { FormContainer, TextFieldElement, useForm } from 'react-hook-form-mui';

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import CreateIcon from '@mui/icons-material/Create';
import {
  Avatar,
  Box,
  IconButton,
  InputAdornment,
  Skeleton,
  Stack,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { useToggle } from 'usehooks-ts';

import { fullWidth, textFieldEllipsis } from '@/styles/mixins';
import { api } from '@/utils/api';

const AVATAR_SIZE = 212;

const UserSettings: FC = () => {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <Stack css={fullWidth} alignItems="center" gap={4}>
      <UserAvatarSetting />
      <UserNameSetting />
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

interface UserNameForm {
  name: string;
}

const UserNameSetting: FC = () => {
  const { status, data: session } = useSession();
  const sessionUsername = session?.user?.name || '';

  const nameFormContext = useForm<UserNameForm>({
    defaultValues: { name: sessionUsername },
    values: { name: sessionUsername }, // Reacts on loaded value
  });
  const { reset } = nameFormContext;

  const [editing, toggleEditing] = useToggle(false);
  const handleCancelEditing = (): void => {
    reset({ name: sessionUsername });
    toggleEditing();
  };

  const { mutate: updateUsername, isLoading } =
    api.userSettings.updateName.useMutation({ onError: handleCancelEditing });

  const handleNameSubmit = ({ name }: UserNameForm): void => {
    toggleEditing();
    if (session?.user?.id) {
      updateUsername({ name });
    }
  };

  return (
    <>
      {status === 'loading' ? (
        <Skeleton css={fullWidth} variant="text" />
      ) : (
        <Box css={fullWidth}>
          <FormContainer
            formContext={nameFormContext}
            onSuccess={handleNameSubmit}
          >
            <TextFieldElement
              css={textFieldEllipsis}
              label="Name"
              name="name"
              variant="standard"
              fullWidth
              required={editing}
              InputProps={{
                readOnly: !editing,
                endAdornment: (
                  <InputAdornment position="end">
                    {editing && !isLoading && (
                      <IconButton
                        aria-label="Cancel editing name"
                        size="small"
                        type="button"
                        onClick={handleCancelEditing}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton
                      aria-label="Edit name"
                      onMouseDown={!editing ? toggleEditing : undefined}
                      size="small"
                      type={editing ? 'submit' : 'button'}
                    >
                      {editing ? (
                        <CheckIcon fontSize="small" color="primary" />
                      ) : (
                        <CreateIcon fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FormContainer>
        </Box>
      )}
    </>
  );
};

export default UserSettings;
