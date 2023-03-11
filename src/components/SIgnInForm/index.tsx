import React, { FC, ReactElement, useState } from 'react';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';

import { css } from '@emotion/react';
import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import { LoadingButton } from '@mui/lab';
import { Divider, Stack, Button, Box } from '@mui/material';
import { signIn } from 'next-auth/react';

import { AuthProvider } from '@/pages/api/auth/[...nextauth]';
import { fullWidth, shadowBorder } from '@/styles/mixins';

const oAuthProviders = [
  {
    provider: 'google',
    label: 'Sign in with Google',
    color: '#DB4437',
    logo: <GoogleIcon />,
  },
  {
    provider: 'facebook',
    label: 'Sign in with Facebook',
    color: '#4267B2',
    logo: <FacebookIcon />,
  },
] as const;

const SignInForm: FC = () => {
  const [authenticatingProvider, setAuthenticatingProvider] =
    useState<AuthProvider>();

  const [emailLinkRequested, setEmailLinkRequested] = useState(false);

  const getIsAuthenticating = (provider: AuthProvider): boolean =>
    provider === authenticatingProvider;
  const getIsDeactivated = (provider: AuthProvider): boolean =>
    !!authenticatingProvider && provider !== authenticatingProvider;

  const handleOAuthSignIn = async (provider: AuthProvider): Promise<void> => {
    setAuthenticatingProvider(provider);
    await signIn(provider, { callbackUrl: '/' });
  };

  const handleEmailSignIn = async (data: { email: string }) => {
    setAuthenticatingProvider('email');
    await signIn('email', { ...data });
  };

  return (
    <Stack
      css={fullWidth}
      alignItems="center"
      justifyContent="center"
      gap={2}
      height={230}
    >
      {!emailLinkRequested ? (
        <>
          {oAuthProviders.map(({ provider, label, logo, color }) => (
            <LoadingButton
              key={provider}
              css={(theme) =>
                shadowBorder(theme, { blurRadius: '10px', color })
              }
              variant="outlined"
              color="inherit"
              fullWidth
              size="large"
              startIcon={logo}
              loading={getIsAuthenticating(provider)}
              disabled={getIsDeactivated(provider)}
              onClick={() => handleOAuthSignIn(provider)}
            >
              <span>{label}</span>
            </LoadingButton>
          ))}
          <Divider css={divider}>or</Divider>
          <Button
            type="submit"
            css={(theme) =>
              shadowBorder(theme, { blurRadius: '10px', color: 'white' })
            }
            variant="outlined"
            color="inherit"
            startIcon={<EmailIcon />}
            disabled={getIsDeactivated('email')}
            fullWidth
            onClick={() => setEmailLinkRequested(true)}
          >
            Sign in via magic link
          </Button>
        </>
      ) : (
        <Box css={fullWidth}>
          <FormContainer
            defaultValues={{ email: '' }}
            onSuccess={handleEmailSignIn}
          >
            <Stack gap={3}>
              <TextFieldElement
                name="email"
                label="Email"
                variant="filled"
                fullWidth
                required
              />
              <Stack gap={2} direction="row">
                <Button
                  color="inherit"
                  sx={{ width: '30%' }}
                  onClick={() => setEmailLinkRequested(false)}
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
                  loading={getIsAuthenticating('email')}
                  disabled={getIsDeactivated('email')}
                  fullWidth
                >
                  <span>Send the link</span>
                </LoadingButton>
              </Stack>
            </Stack>
          </FormContainer>
        </Box>
      )}
    </Stack>
  );
};

// Fixed positioning in the container with defined height
const divider = css`
  :after,
  :before {
    position: static;
  }
`;

export default SignInForm;
