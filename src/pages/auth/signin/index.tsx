import React, { FC, useState } from 'react';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';

import { LoadingButton } from '@mui/lab';
import { Box, Divider, Fade, Stack, Typography } from '@mui/material';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

import logo from '@/assets/logo.svg';
import signInBackground from '@/assets/sign-bg.jpg';
import {
  backgroundStyles,
  leftAlignedStyles,
  signInFormStyles,
  signInFormWrapperStyles,
  signInPageStyles,
} from '@/pages/auth/signin/styles';

const oAuthProviders = [
  {
    provider: 'google',
    label: 'Sign in with Google',
  },
  {
    provider: 'facebook',
    label: 'Sign in with Facebook',
  },
];

const SighIn: FC = () => {
  const [authenticating, setAuthenticating] = useState<string | null>(null);
  const getAuthenticating = (provider: string): boolean =>
    authenticating === provider;

  const handleEmailSignIn = async (data: { email: string }) => {
    setAuthenticating('email');
    await signIn('email', { ...data });
  };

  const handleOAuthSignIn = async (provider: string) => {
    setAuthenticating(provider);
    await signIn(provider, { callbackUrl: '/' });
  };

  return (
    <>
      <Head>
        <title>Login | Autoline</title>
      </Head>
      <Stack css={signInPageStyles} alignItems="center" justifyContent="center">
        <Image
          css={backgroundStyles}
          src={signInBackground}
          fill
          alt="" // Empty alt is used for the eye-candy images
        />
        <Fade in timeout={500}>
          <Stack spacing={6} css={signInFormWrapperStyles}>
            <Link href="/">
              <Image
                css={leftAlignedStyles}
                src={logo}
                alt="" // Empty alt is used for the eye-candy images
              />
            </Link>
            <Stack spacing={3} css={signInFormStyles}>
              <Typography css={leftAlignedStyles} variant="h4">
                Sign In
              </Typography>
              <FormContainer
                defaultValues={{ email: '' }}
                onSuccess={handleEmailSignIn}
              >
                <TextFieldElement
                  name="email"
                  label="Email"
                  required
                  type="email"
                  fullWidth
                />
                <LoadingButton
                  variant="contained"
                  type="submit"
                  loading={getAuthenticating('email')}
                  fullWidth
                >
                  <span>Sign in via magic link</span>
                </LoadingButton>
              </FormContainer>
              <Divider>or</Divider>
              <Stack spacing={2}>
                {oAuthProviders.map(({ provider, label }) => (
                  <LoadingButton
                    key={provider}
                    variant="outlined"
                    loading={getAuthenticating(provider)}
                    fullWidth
                    onClick={() => handleOAuthSignIn(provider)}
                  >
                    <span>{label}</span>
                  </LoadingButton>
                ))}
              </Stack>
            </Stack>
          </Stack>
        </Fade>
      </Stack>
    </>
  );
};

export default SighIn;
