import React, { FC } from 'react';
import { useForm } from 'react-hook-form-mui';

import { Avatar, Skeleton, Stack } from '@mui/material';
import { useSession } from 'next-auth/react';

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

interface NameForm extends Record<string, string> {
  name: string;
}

const UserNameSetting: FC = () => {
  const { status, data: session } = useSession();
  const sessionUsername = session?.user?.name || '';

  const nameFormContext = useForm<NameForm>({
    values: { name: sessionUsername }, // Reacts on loaded value
  });

  const {
    mutate: updateUsername,
    isLoading,
    error,
  } = api.userSettings.updateName.useMutation();

  const handleNameSubmit = ({ name }: NameForm): void => {
    if (session?.user?.id) {
      updateUsername({ name });
    }
  };

  return (
    <>
      {status === 'loading' ? (
        <Skeleton css={fullWidth} variant="text" />
      ) : (
        <SingleFieldForm
          formProps={{
            formContext: nameFormContext,
            onSuccess: handleNameSubmit,
          }}
          textFieldProps={{ label: 'Name', name: 'name' }}
          loading={isLoading}
          error={error?.data?.zodError?.fieldErrors}
        />
      )}
    </>
  );
};

export default UserSettings;

// <Box css={fullWidth}>
//   <FormContainer
//     formContext={nameFormContext}
//     onSuccess={handleNameSubmit}
//   >
//     <TextFieldElement
//       css={textFieldEllipsis}
//       label="Name"
//       name="name"
//       variant="standard"
//       fullWidth
//       required={editing}
//       InputProps={{
//         readOnly: !editing,
//         endAdornment: (
//           <InputAdornment position="end">
//             {editing && !isLoading && (
//               <IconButton
//                 aria-label="Cancel editing name"
//                 size="small"
//                 type="button"
//                 onClick={handleCancelEditing}
//               >
//                 <CloseIcon fontSize="small" />
//               </IconButton>
//             )}
//             <IconButton
//               aria-label="Edit name"
//               onMouseDown={!editing ? toggleEditing : undefined}
//               size="small"
//               type={editing ? 'submit' : 'button'}
//             >
//               {editing ? (
//                 <CheckIcon fontSize="small" color="primary" />
//               ) : (
//                 <CreateIcon fontSize="small" />
//               )}
//             </IconButton>
//           </InputAdornment>
//         ),
//       }}
//     />
//   </FormContainer>
// </Box>
