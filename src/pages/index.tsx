import React from 'react';

import { Container, Stack, Typography } from '@mui/material';
import { type NextPage } from 'next';
import { getSession, GetSessionParams, useSession } from 'next-auth/react';

import SignInForm from '@/components/SignInForm';
import StringsRotator from '@/components/StringsRotator';
import {
  blurBackgroundContainer,
  doubleColorGradient,
  fullHeight,
  fullViewport,
  fullWidth,
} from '@/styles/mixins';

const Home: NextPage = () => {
  const { data: session } = useSession();

  return (
    <main css={[fullViewport, doubleColorGradient]}>
      <Container css={fullHeight}>
        <Stack
          css={fullHeight}
          direction={{ md: 'column', lg: 'row' }}
          alignItems="center"
          justifyContent={{ md: 'center', lg: 'space-around' }}
          gap={{ md: 4, lg: 14 }}
        >
          <Typography
            css={fullWidth}
            variant="h1"
            fontSize="11rem"
            fontWeight={400}
            textAlign={{ md: 'center', lg: 'left' }}
            flex={{ md: 0, lg: 1 }}
          >
            Let&apos;s
            <br />
            <StringsRotator
              strings={['chat', 'babble', 'give voice', 'share']}
            />
          </Typography>
          <Stack
            css={blurBackgroundContainer}
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
            width={500}
            gap={3}
            px={6}
            py={2}
          >
            {!session ? <SignInForm /> : <h2>Hello</h2>}
          </Stack>
        </Stack>
      </Container>
    </main>
  );
};

export const getServerSideProps = async (ctx: GetSessionParams) => {
  const session = await getSession(ctx);
  return { props: { session } };
};

export default Home;
