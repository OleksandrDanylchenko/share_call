import React, { FC, useState } from 'react';

import { css } from '@emotion/react';
import EmailIcon from '@mui/icons-material/Email';
import { LoadingButton } from '@mui/lab';
import { Button, Divider, Stack, Typography } from '@mui/material';

import { OathProviderOptions } from '@/components/SignInForm/index';
import { AuthProvider } from '@/pages/api/auth/[...nextauth]';
import { fullWidth, shadowBorder } from '@/styles/mixins';

interface Props {
  oAuthProviders: Array<OathProviderOptions>;
  onProviderSignIn: (provider: AuthProvider) => void;
  onMagicLinkRequest: () => void;
}

const SignInOptions: FC<Props> = (props) => {
  const { oAuthProviders, onProviderSignIn, onMagicLinkRequest } = props;

  const [providedInProgress, setProvidedInProgress] = useState<AuthProvider>();
  const getIsInProgress = (provider: AuthProvider): boolean =>
    provider === providedInProgress;
  const getIsDeactivated = (provider: AuthProvider): boolean =>
    !!providedInProgress && provider !== providedInProgress;

  const handleOAuthSignIn = (provider: AuthProvider): void => {
    setProvidedInProgress(provider);
    onProviderSignIn(provider);
  };

  return (
    <Stack css={fullWidth} gap={2}>
      <Typography variant="h4">Could you introduce yourself?</Typography>
      {oAuthProviders.map(({ provider, label, logo, color }) => (
        <LoadingButton
          key={provider}
          css={(theme) => shadowBorder(theme, { color })}
          variant="outlined"
          color="inherit"
          fullWidth
          size="large"
          startIcon={logo}
          loading={getIsInProgress(provider)}
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
          shadowBorder(theme, { color: theme.palette.common.white })
        }
        variant="outlined"
        color="inherit"
        startIcon={<EmailIcon />}
        disabled={getIsDeactivated('email')}
        fullWidth
        onClick={onMagicLinkRequest}
      >
        Sign in via magic link
      </Button>
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

export default SignInOptions;
