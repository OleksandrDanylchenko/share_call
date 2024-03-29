import React, { FC, ReactElement, useState } from 'react';

import { useAutoAnimate } from '@formkit/auto-animate/react';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import { Stack } from '@mui/material';
import { signIn } from 'next-auth/react';

import MagicLinkForm from '@/components/SignInForm/MagicLinkForm';
import SignInOptions from '@/components/SignInForm/SignInOptions';
import { AuthProvider } from '@/pages/api/auth/[...nextauth]';
import { fullHeight, fullWidth } from '@/styles/mixins';

interface Props {
  callbackUrl?: string;
}

export type OathProviderOptions = {
  provider: AuthProvider;
  label: string;
  color: string;
  logo: ReactElement;
};

const oAuthProviders: Array<OathProviderOptions> = [
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
];

const SignInForm: FC<Props> = (props) => {
  const { callbackUrl = '/' } = props;

  const [emailLinkRequested, setEmailLinkRequested] = useState(false);

  const handleSignIn = async (provider: AuthProvider): Promise<void> => {
    await signIn(provider, { callbackUrl });
  };

  const handleEmailSignIn = async (email: string): Promise<void> => {
    await signIn('email', { email, redirect: false, callbackUrl });
  };

  const [animateParent] = useAutoAnimate();
  return (
    <Stack
      ref={animateParent}
      css={[fullWidth, fullHeight]}
      justifyContent="center"
    >
      {!emailLinkRequested ? (
        <SignInOptions
          oAuthProviders={oAuthProviders}
          onProviderSignIn={handleSignIn}
          onMagicLinkRequest={() => setEmailLinkRequested(true)}
        />
      ) : (
        <MagicLinkForm
          onEmailSignIn={handleEmailSignIn}
          onMagicLinkCancel={() => setEmailLinkRequested(false)}
        />
      )}
    </Stack>
  );
};

export default SignInForm;
