import React, { FC, useState } from 'react';
import { FormContainer, TextFieldElement, useForm } from 'react-hook-form-mui';

import EmailIcon from '@mui/icons-material/Email';
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

const MagicLinkForm: FC<EmailMagicLinkFormProps> = (props) => {
  const { onEmailSignIn, onMagicLinkCancel } = props;

  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const formContext = useForm<EmailForm>({
    defaultValues: { email: '' },
  });
  const { watch } = formContext;

  const handleEmailSubmit = async (data: { email: string }): Promise<void> => {
    setSendingEmail(true);
    await onEmailSignIn(data.email);
    setEmailSent(true);
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
            variant="filled"
            fullWidth
            required
            hiddenLabel
          />
          <Stack gap={2} direction="row">
            <Button
              color="inherit"
              sx={{ width: '30%' }}
              disabled={sendingEmail || emailSent}
              onClick={onMagicLinkCancel}
            >
              Cancel
            </Button>
            <LoadingButton
              type="submit"
              css={(theme) =>
                shadowBorder(theme, {
                  blurRadius: '10px',
                  color: theme.palette.common.white,
                })
              }
              variant="outlined"
              color="inherit"
              startIcon={<EmailIcon />}
              loading={sendingEmail}
              disabled={!watch('email').length}
              fullWidth
            >
              <span>Send the link</span>
            </LoadingButton>
          </Stack>
        </Stack>
      </FormContainer>
    </Stack>
  );
};

export default MagicLinkForm;
