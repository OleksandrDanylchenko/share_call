import React, { FC, useState } from 'react';

import LogoutIcon from '@mui/icons-material/Logout';
import { LoadingButton } from '@mui/lab';
import { Box, Container, Stack, Typography } from '@mui/material';
import { type NextPage } from 'next';
import {
  getSession,
  GetSessionParams,
  signOut,
  useSession,
} from 'next-auth/react';

import Catchphrase from '@/components/Catchphrase';
import SignInForm from '@/components/SignInForm';
import UserSettings from '@/components/UserSettings';
import {
  blurBackgroundContainer,
  doubleColorGradient,
  fullHeight,
  fullViewport,
  fullWidth,
  shadowBorder,
} from '@/styles/mixins';

const Home: NextPage = () => {
  const { data: session } = useSession();
  return (
    <main css={[fullViewport, doubleColorGradient]}>
      <Container css={fullHeight}>
        {session ? <Dashboard /> : <Landing />}
      </Container>
    </main>
  );
};

const Landing: FC = () => (
  <Stack
    css={fullHeight}
    direction={{ md: 'column', lg: 'row' }}
    alignItems="center"
    justifyContent={{ md: 'center', lg: 'space-around' }}
    gap={{ md: 4, lg: 14 }}
  >
    <Catchphrase />
    <Stack
      css={blurBackgroundContainer}
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
      width={400}
      height="80%"
      gap={3}
      px={4}
      py={2}
    >
      <SignInForm />
    </Stack>
  </Stack>
);

const Dashboard: FC = () => {
  const [signingOut, setSigningOut] = useState(false);
  const handleSignOut = async (): Promise<void> => {
    setSigningOut(true);
    await signOut({ redirect: false });
  };

  return (
    <Stack
      css={fullHeight}
      direction="row"
      alignItems="center"
      justifyContent="center"
      gap={4}
    >
      <Box css={[fullWidth, blurBackgroundContainer]} height="80%"></Box>
      <Stack
        css={blurBackgroundContainer}
        position="relative"
        alignItems="center"
        justifyContent="center"
        flexShrink={0}
        width={420}
        height="80%"
        gap={6}
        px={6}
        py={2}
      >
        <Typography variant="h4" position="absolute" top={20}>
          Welcome back!
        </Typography>
        <UserSettings />
        <LoadingButton
          css={(theme) =>
            shadowBorder(theme, { color: theme.palette.error.light })
          }
          variant="outlined"
          color="inherit"
          endIcon={<LogoutIcon />}
          loading={signingOut}
          onClick={handleSignOut}
          sx={{ position: 'absolute', bottom: 20 }}
        >
          <span>Sign Out</span>
        </LoadingButton>
      </Stack>
    </Stack>
  );
};

export const getServerSideProps = async (ctx: GetSessionParams) => {
  const session = await getSession(ctx);
  return { props: { session } };
};

export default Home;
