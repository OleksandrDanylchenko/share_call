import React, { FC, useEffect } from 'react';
import { FormContainer, TextFieldElement, useForm } from 'react-hook-form-mui';

import { ClassNames } from '@emotion/react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import LoginIcon from '@mui/icons-material/Login';
import { LoadingButton } from '@mui/lab';
import { Button, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';

import { goToOptions } from '@/components/DashboardScene/routing';
import { fullParent, shadowBorder, textFieldEllipsis } from '@/styles/mixins';
import { api } from '@/utils/api';

interface JoinCallForm {
  inviteCode: string;
}

const DashboardJoinCall: FC = () => {
  const router = useRouter();

  const formContext = useForm<JoinCallForm>({
    defaultValues: { inviteCode: '' },
  });
  const { watch, setError, clearErrors } = formContext;

  const {
    data: isExistData,
    isFetching,
    refetch: checkInviteCode,
  } = api.rooms.checkRoomInviteCode.useQuery(
    { inviteCode: watch('inviteCode') },
    { enabled: false },
  );

  useEffect(() => {
    if (!isExistData) return;

    const { roomExist } = isExistData;
    if (roomExist) {
      clearErrors('inviteCode');
    } else {
      setError('inviteCode', {
        type: 'manual',
        message: 'The room for the provided code does not exist',
      });
    }
  }, [clearErrors, isExistData, setError]);

  const handleJoinCall = async (): Promise<void> => {
    await checkInviteCode();
  };

  return (
    <Stack css={fullParent} px={5} py={7}>
      <Button
        color="inherit"
        sx={{ width: 'fit-content' }}
        startIcon={<ArrowBackIosIcon />}
        onClick={() => goToOptions(router)}
      >
        Back to dashboard
      </Button>
      <ClassNames>
        {({ css }) => (
          <FormContainer
            formContext={formContext}
            onSuccess={handleJoinCall}
            FormProps={{
              className: css`
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                flex: 1;
              `,
            }}
          >
            <Stack flex={1} gap={5} justifyContent="center">
              <Stack gap={2}>
                <Typography
                  variant="h5"
                  component="label"
                  htmlFor="call-invite-code-field"
                >
                  What&apos;s the invitation code?
                </Typography>
                <TextFieldElement
                  id="call-invite-code-field"
                  css={textFieldEllipsis}
                  name="inviteCode"
                  variant="filled"
                  fullWidth
                  hiddenLabel
                />
              </Stack>
            </Stack>
            <Stack gap={2} direction="row">
              <LoadingButton
                type="submit"
                css={(theme) =>
                  shadowBorder(theme, { color: theme.palette.warning.light })
                }
                color="inherit"
                loading={isFetching}
                startIcon={<LoginIcon />}
                disabled={!watch('inviteCode').length}
                fullWidth
              >
                <span>Join the call</span>
              </LoadingButton>
            </Stack>
          </FormContainer>
        )}
      </ClassNames>
    </Stack>
  );
};

export default DashboardJoinCall;
