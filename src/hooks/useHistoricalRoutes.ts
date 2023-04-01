import { useEffect } from 'react';

import { useRouter } from 'next/router';
import { useSessionStorage } from 'usehooks-ts';

export const useCaptureRoutes = (): void => {
  const router = useRouter();

  const [_, setPrevValue] = useSessionStorage('prev-route', '');
  const [currentRoute, setCurrentRoute] = useSessionStorage(
    'current-route',
    '',
  );

  useEffect(() => {
    const handleRouteChange = (): void => {
      setPrevValue(currentRoute);
      setCurrentRoute(router.asPath);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, [
    currentRoute,
    router.asPath,
    router.events,
    setCurrentRoute,
    setPrevValue,
  ]);
};

export const useHistoricalRoutes = (): { prev: string; current: string } => {
  const [prev] = useSessionStorage('prev-route', '');
  const [current] = useSessionStorage('current-route', '');
  return { prev, current };
};

export const useGoPrevRoute = (fallbackUrl = '/'): (() => void) => {
  const router = useRouter();

  const { prev, current } = useHistoricalRoutes();
  const prevRoutePath = prev && prev !== current ? prev : fallbackUrl;

  return () => router.push(prevRoutePath);
};
