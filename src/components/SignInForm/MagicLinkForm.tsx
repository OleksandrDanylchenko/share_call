import React, { FC, useState } from 'react';
import { FormContainer, TextFieldElement, useForm } from 'react-hook-form-mui';

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import EmailIcon from '@mui/icons-material/Email';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import { LoadingButton } from '@mui/lab';
import { Button, Stack, Typography } from '@mui/material';

import { fullWidth, shadowBorder } from '@/styles/mixins';

interface EmailMagicLinkFormProps {
  onEmailSignIn: (email: string) => Promise<void>;
  onMagicLinkCancel: () => void;
}

interface EmailForm {
  email: string;
}

type MagicLinkState = 'none' | 'sending' | 'sent';

const MagicLinkForm: FC<EmailMagicLinkFormProps> = (props) => {
  const { onEmailSignIn, onMagicLinkCancel } = props;

  const [linkStatus, setLinkStatus] = useState<MagicLinkState>('none');

  const formContext = useForm<EmailForm>({
    defaultValues: { email: '' },
  });
  const { watch } = formContext;

  const handleEmailSubmit = async (data: { email: string }): Promise<void> => {
    setLinkStatus('sending');
    await onEmailSignIn(data.email);
    setLinkStatus('sent');
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
            disabled={linkStatus !== 'none'}
          />
          <Stack gap={2} direction="row">
            {linkStatus !== 'sent' ? (
              <>
                <Button
                  color="inherit"
                  sx={{ width: '30%' }}
                  disabled={linkStatus === 'sending'}
                  onClick={onMagicLinkCancel}
                >
                  Cancel
                </Button>
                <LoadingButton
                  type="submit"
                  css={(theme) =>
                    shadowBorder(theme, { color: theme.palette.common.white })
                  }
                  variant="outlined"
                  color="inherit"
                  startIcon={<EmailIcon />}
                  loading={linkStatus === 'sending'}
                  disabled={!watch('email').length}
                  fullWidth
                >
                  <span>Send the link</span>
                </LoadingButton>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  sx={{ width: '30%' }}
                  startIcon={<ArrowBackIosIcon />}
                  onClick={onMagicLinkCancel}
                >
                  Back
                </Button>
                <Button
                  css={(theme) =>
                    shadowBorder(theme, { color: theme.palette.success.main })
                  }
                  color="success"
                  startIcon={<MarkEmailUnreadIcon />}
                  fullWidth
                >
                  The link has been sent
                </Button>
              </>
            )}
          </Stack>
        </Stack>
      </FormContainer>
    </Stack>
  );
};

export default MagicLinkForm;
