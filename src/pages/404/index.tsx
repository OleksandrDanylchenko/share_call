import React, { FC } from 'react';

import {
  Stack,
  Grow,
  Slide,
  Box,
  Typography,
  Divider,
  Button,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import brokenCar from '@/assets/broken-car.svg';
import circles from '@/assets/circles.svg';
import logo from '@/assets/logo.svg';
import {
  brokenCarStyles,
  circleDecorStyles,
  dividerStyles,
  headerErrorStyles,
  messageContainerStyles,
  notFoundContainer,
  messageStyles,
  logoStyles,
} from '@/pages/404/styles';

const Autoline404: FC = () => {
  const router = useRouter();

  return (
    <Stack css={notFoundContainer} alignItems="center" justifyContent="center">
      <Link css={logoStyles} href="/">
        <Image
          src={logo}
          height={35}
          alt="" // Empty alt is used for the eye-candy images
        />
      </Link>
      <Slide direction="right" in timeout={600} style={{ zIndex: -1 }}>
        <Image
          css={circleDecorStyles}
          src={circles}
          alt="" // Empty alt is used for the eye-candy images
        />
      </Slide>
      <Stack
        direction={{ xs: 'column-reverse', lg: 'row' }}
        alignItems="center"
        justifyContent="space-around"
        spacing={{ md: 5, lg: 30 }}
      >
        <Grow in timeout={900}>
          <Image
            css={brokenCarStyles}
            src={brokenCar}
            height={380}
            alt="" // Empty alt is used for the eye-candy images
          />
        </Grow>
        <Grow in timeout={1100}>
          <Box css={messageContainerStyles}>
            <Typography css={headerErrorStyles} variant="h1">
              404
            </Typography>
            <Divider css={dividerStyles} component="div" role="presentation" />
            <Typography css={messageStyles} variant="subtitle1">
              The page you are looking for could not be found.
            </Typography>
            <Button variant="contained" fullWidth onClick={router.back}>
              Go back
            </Button>
          </Box>
        </Grow>
      </Stack>
    </Stack>
  );
};

export default Autoline404;
