import React, { FC } from 'react';

import { css, SerializedStyles } from '@emotion/react';
import {
  Box,
  Button,
  Divider,
  Stack,
  Theme,
  Typography,
  useTheme,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import logo from '@/assets/logo.png';
import { doubleColorGradient, fullViewport } from '@/styles/mixins';

const Autoline404: FC = () => {
  const router = useRouter();

  const {
    palette: {
      warning: { dark: warningColor },
      error: { light: errorColor },
    },
  } = useTheme();

  return (
    <Stack
      css={(theme) => [
        fullViewport,
        doubleColorGradient(theme, {
          colorStart: warningColor,
          colorEnd: errorColor,
        }),
      ]}
      alignItems="center"
      justifyContent="center"
    >
      <Link css={logoStyles} href="/">
        <Image
          src={logo}
          height={70}
          alt="" // Empty alt is used for the eye-candy images
        />
      </Link>
      <Stack alignItems="center" justifyContent="center">
        <Box minWidth={340}>
          <Typography variant="h1" fontSize="10rem">
            404
          </Typography>
          <Divider css={dividerStyles} component="div" role="presentation" />
          <Typography variant="subtitle1" marginBottom={5}>
            The page you are looking for could not be found.
          </Typography>
          <Button variant="contained" fullWidth onClick={router.back}>
            Go back
          </Button>
        </Box>
      </Stack>
    </Stack>
  );
};

const logoStyles = css`
  position: absolute;
  top: 40px;
  left: 40px;
`;

const dividerStyles = (theme: Theme): SerializedStyles => css`
  width: 30%;
  border-color: ${theme.palette.primary.main};
  border-width: 1px;
  margin-bottom: 37px;
`;

export default Autoline404;
