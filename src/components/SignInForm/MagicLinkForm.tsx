import React, { FC, useState } from 'react';
import { FormContainer, TextFieldElement, useForm } from 'react-hook-form-mui';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import EmailIcon from '@mui/icons-material/Email';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import UnsubscribeIcon from '@mui/icons-material/Unsubscribe';
import { LoadingButton } from '@mui/lab';
import { Button, Stack, Typography } from '@mui/material';

import { fullWidth, shadowBorder } from '@/styles/mixins';
import { AsyncActionState } from '@/types/index';

interface EmailMagicLinkFormProps {
  onEmailSignIn: (email: string) => Promise<void>;
  onMagicLinkCancel: () => void;
}

interface EmailForm {
  email: string;
}

const MagicLinkForm: FC<EmailMagicLinkFormProps> = (props) => {
  const { onEmailSignIn, onMagicLinkCancel } = props;

  const [linkGenerationState, setLinkGenerationState] =
    useState<AsyncActionState>('idle');

  const formContext = useForm<EmailForm>({
    defaultValues: { email: '' },
  });
  const { watch } = formContext;

  const handleEmailSubmit = async (data: { email: string }): Promise<void> => {
    try {
      setLinkGenerationState('pending');
      await onEmailSignIn(data.email);
      setLinkGenerationState('fulfilled');
    } catch (_error: unknown) {
      setLinkGenerationState('rejected');
    }
  };

  return (
    <Stack css={fullWidth} gap={2}>
      <Typography variant="h4" component="label" htmlFor="email-field">
        Could you provide your email?
      </Typography>
      <FormContainer formContext={formContext} onSuccess={handleEmailSubmit}>
        <Stack gap={3}>
          <TextFieldElement
            id="email-field"
            name="email"
            type="email"
            variant="filled"
            fullWidth
            required
            hiddenLabel
            disabled={linkGenerationState !== 'idle'}
          />
          <Stack gap={2} direction="row">
            <Button
              color="inherit"
              sx={{ width: '30%' }}
              startIcon={<ArrowBackIosIcon />}
              disabled={linkGenerationState === 'pending'}
              onClick={onMagicLinkCancel}
            >
              Back
            </Button>
            {linkGenerationState === 'idle' ||
            linkGenerationState === 'pending' ? (
              <LoadingButton
                type="submit"
                css={(theme) =>
                  shadowBorder(theme, { color: theme.palette.common.white })
                }
                variant="outlined"
                color="inherit"
                startIcon={<EmailIcon />}
                loading={linkGenerationState === 'pending'}
                disabled={!watch('email').length}
                fullWidth
              >
                <span>Send the link</span>
              </LoadingButton>
            ) : (
              <Button
                css={(theme) =>
                  shadowBorder(theme, {
                    color:
                      linkGenerationState === 'fulfilled'
                        ? theme.palette.success.main
                        : theme.palette.error.main,
                  })
                }
                color={
                  linkGenerationState === 'fulfilled' ? 'success' : 'error'
                }
                startIcon={
                  linkGenerationState === 'fulfilled' ? (
                    <MarkEmailUnreadIcon />
                  ) : (
                    <UnsubscribeIcon />
                  )
                }
                fullWidth
              >
                {linkGenerationState === 'fulfilled'
                  ? 'The link is sent'
                  : 'The link failed sending'}
              </Button>
            )}
          </Stack>
        </Stack>
      </FormContainer>
    </Stack>
  );
};

export default MagicLinkForm;
