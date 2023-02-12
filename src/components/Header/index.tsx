import React, { FC, useMemo } from 'react';

import { AppBar, Box, Button, Stack, Toolbar } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import logo from '@/assets/logo.svg';
import {
  activeLinkDecorationStyles,
  headerLinks,
  headerStyles,
  headerSubPagesLinks,
  subPageLink,
} from '@/components/Header/styles';
import HeaderUserMenu from '@/components/HeaderUserMenu';
import Reminders from '@/components/Reminders';

const navigationItems = [
  {
    href: '/search',
    label: 'Search',
  },
  {
    href: '/about-us',
    label: 'About Us',
  },
];
type NavigationItem = (typeof navigationItems)[number] & { isActive: boolean };

const Header: FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { push, asPath } = useRouter();

  const navigationItemsWithActive = useMemo<Array<NavigationItem>>(
    () =>
      navigationItems.map((item) => ({
        ...item,
        isActive: router.pathname === item.href,
      })),
    [router.pathname],
  );

  // Prevent full page reloading
  const handleSignIn = (): Promise<boolean> =>
    push(`/auth/signin?callbackUrl=${asPath}`);

  return (
    <AppBar position="static">
      <Toolbar css={headerStyles} variant="dense">
        <nav css={headerLinks}>
          <Link href="/">
            <Image
              src={logo}
              height={35}
              alt="" // Empty alt is used for the eye-candy images
            />
          </Link>
          <Box css={headerSubPagesLinks}>
            {navigationItemsWithActive.map(({ href, label, isActive }) => (
              <Link
                css={subPageLink}
                key={href}
                href={href}
                aria-current={isActive ? 'page' : undefined}
              >
                {label}
                {isActive && (
                  <span aria-hidden="true" css={activeLinkDecorationStyles} />
                )}
              </Link>
            ))}
          </Box>
        </nav>
        {session?.user ? (
          <Stack direction="row" alignItems="center" spacing={4}>
            <Reminders />
            <HeaderUserMenu user={session.user} />
          </Stack>
        ) : (
          <Button variant="contained" onClick={handleSignIn}>
            Sign in
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
