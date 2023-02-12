import { Container, Stack } from '@mui/material';
import { type NextPage } from 'next';
import Head from 'next/head';
import { getSession, GetSessionParams } from 'next-auth/react';

import BrandsShowcaseSection from '@/components/BrandsShowcaseSection';
import FindCarSection from '@/components/FindCarSection';
import Header from '@/components/Header';
import MostSearchedCarsSection from '@/components/MostSearchedCarsSection';
import NewCarsSection from '@/components/NewCarsSection';

const Landing: NextPage = () => {
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
        <Header />
        <Stack spacing={12} marginY={7}>
          <Container>
            <Stack spacing={6}>
              <FindCarSection />
              <NewCarsSection />
              <BrandsShowcaseSection />
              <MostSearchedCarsSection />
            </Stack>
          </Container>
        </Stack>
      </main>
    </>
  );
};

export const getServerSideProps = async (ctx: GetSessionParams) => {
  const session = await getSession(ctx);
  return { props: { session } };
};

export default Landing;
