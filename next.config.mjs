// @ts-check

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import('./src/env/server.mjs'));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  images: {
    dangerouslyAllowSVG: true,
    domains: [
      'lh3.googleusercontent.com',
      'graph.facebook.com',
      'upload.wikimedia.org',
      'i.kinja-img.com',
      'source.boringavatars.com'
    ],
  },
};
export default config;
