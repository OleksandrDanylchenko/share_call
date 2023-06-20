import React, { FC } from 'react';

import { Container, Stack } from '@mui/material';
import { type NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { getServerSession, Session } from 'next-auth';
import { useSession } from 'next-auth/react';

import Catchphrase from '@/components/Catchphrase';
import Dashboard from '@/components/Dashboard';
import SignInForm from '@/components/SignInForm';
import {
  blurBackgroundContainer,
  doubleColorGradient,
  fullHeight,
  fullViewport,
} from '@/styles/mixins';
import { authOptions } from 'pages/api/auth/[...nextauth]';

interface Props {
  session: Session | null;
}

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

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session && 'emailVerified' in session.user!) {
    delete session.user.emailVerified; // Non-serializable
  }
  return { props: { session } };
};

export default Home;
