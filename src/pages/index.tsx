import { Container, Stack } from '@mui/material';
import { type NextPage } from 'next';
import Head from 'next/head';
import { getSession, GetSessionParams } from 'next-auth/react';

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
      <main>
        <Stack>
          <Container>Hello there!</Container>
        </Stack>
      </main>
    </>
  );
};

export const getServerSideProps = async (ctx: GetSessionParams) => {
  const session = await getSession(ctx);
  return { props: { session } };
};

export default Home;
