import React from 'react';

import { Container, Stack, Typography } from '@mui/material';
import { type NextPage } from 'next';

import SignInForm from '@/components/SIgnInForm';
import StringsRotator from '@/components/StringsRotator';
import {
  blurBackgroundContainer,
  doubleColorGradient,
  fullHeight,
  fullViewport,
  fullWidth,
} from '@/styles/mixins';

const Home: NextPage = () => (
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
          <StringsRotator strings={['chat', 'babble', 'give voice', 'share']} />
        </Typography>
        <Stack
          css={blurBackgroundContainer}
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
          width={500}
          gap={3}
          px={6}
          py={4}
        >
          <Typography variant="h4" component="label" htmlFor="name-field">
            Could you introduce yourself?
          </Typography>
          <SignInForm />
        </Stack>
      </Stack>
    </Container>
  </main>
);

export default Home;
