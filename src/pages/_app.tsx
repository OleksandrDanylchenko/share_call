import { EmotionCache } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { AppProps, type AppType } from 'next/app';
import Head from 'next/head';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

import { createEmotionCache } from '@/styles/mui/create-emotion-cache';
import { theme } from '@/styles/mui/theme';
import { api } from '@/utils/api';

import 'swiper/css';
import 'swiper/css/navigation';

import '../styles/globals.css';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface Props extends AppProps {
  session: Session | null;
  emotionCache?: EmotionCache;
}

const MyApp: AppType<Props> = ({
  Component,
  pageProps: { session, emotionCache = clientSideEmotionCache, ...pageProps },
}) => {
  return (
    <CacheProvider value={emotionCache}>
      <SessionProvider session={session}>
        <Head>
          <title>ShareCall</title>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
          <meta
            name="description"
            content="Application for the video conferences"
          />
          <link rel="icon" href="/favicon.ico" />
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </SessionProvider>
    </CacheProvider>
  );
};

export default api.withTRPC(MyApp);
