import { css } from '@emotion/react';
import { Container, Stack, Typography } from '@mui/material';
import { type NextPage } from 'next';
import { getSession, GetSessionParams } from 'next-auth/react';

import ConferenceJoinForm from '@/components/ConferenceJoinForm';
import StringsRotator from '@/components/StringsRotator';
import {
  doubleColorGradient,
  fullHeight,
  viewportHeight,
} from '@/styles/mixins';

const Home: NextPage = () => (
  <main css={[viewportHeight, doubleColorGradient]}>
    <Container css={fullHeight}>
      <Stack
        css={fullHeight}
        direction={{ md: 'column', lg: 'row' }}
        alignItems="center"
        justifyContent={{ md: 'center', lg: 'space-around' }}
        gap={{ md: 4, lg: 14 }}
      >
        <Typography
          variant="h1"
          css={catchphrase}
          textAlign={{ md: 'center', lg: 'left' }}
          flex={{
            md: 0,
            lg: 1,
          }}
        >
          Let&apos;s
          <br />
          <StringsRotator strings={['chat', 'babble', 'give voice', 'share']} />
        </Typography>
        <ConferenceJoinForm />
      </Stack>
    </Container>
  </main>
);

const catchphrase = css`
  width: 100%;
  text-align: center;
  font-size: 11rem;
  font-weight: 400;
`;

export const getServerSideProps = async (ctx: GetSessionParams) => {
  const session = await getSession(ctx);
  return { props: { session } };
};

export default Home;
