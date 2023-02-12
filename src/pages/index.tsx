import { Container, Stack, Typography } from '@mui/material';
import { type NextPage } from 'next';
import Head from 'next/head';
import { getSession, GetSessionParams } from 'next-auth/react';

import ConferenceJoinForm from '@/components/ConferenceJoinForm';
import StringsRotator from '@/components/StringsRotator';
import { catchphrase, page, pageContent } from '@/pages/styles';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>ShareCall</title>
        <meta
          name="description"
          content="Application for the video conferences"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main css={page}>
        <Container>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-around"
            css={pageContent}
          >
            <Typography variant="h1" css={catchphrase}>
              Let&apos;s
              <br />
              <StringsRotator strings={['chat', 'babble', 'prat', 'talk']} />
            </Typography>
            <ConferenceJoinForm />
          </Stack>
        </Container>
      </main>
    </>
  );
};

export const getServerSideProps = async (ctx: GetSessionParams) => {
  const session = await getSession(ctx);
  return { props: { session } };
};

export default Home;
