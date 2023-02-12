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
            direction={{ md: 'column', lg: 'row' }}
            alignItems="center"
            justifyContent={{ md: 'center', lg: 'space-around' }}
            css={pageContent}
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
              <StringsRotator
                strings={['chat', 'babble', 'give voice', 'share']}
              />
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
