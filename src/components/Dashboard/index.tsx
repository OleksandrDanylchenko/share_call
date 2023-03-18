import React, { FC, useState } from 'react';

import LogoutIcon from '@mui/icons-material/Logout';
import { LoadingButton } from '@mui/lab';
import { Box, Stack, Typography } from '@mui/material';
import { signOut } from 'next-auth/react';

import DashboardOptions from '@/components/DashboardOptions';
import UserSettings from '@/components/UserSettings';
import {
  blurBackgroundContainer,
  fullHeight,
  shadowBorder,
} from '@/styles/mixins';

const Dashboard: FC = () => {
  const [signingOut, setSigningOut] = useState(false);
  const handleSignOut = async (): Promise<void> => {
    setSigningOut(true);
    await signOut({ redirect: false });
  };

  return (
    <Stack
      css={fullHeight}
      direction="row"
      alignItems="center"
      justifyContent="center"
      gap={4}
    >
      <Box css={blurBackgroundContainer} flex={1} height="80%">
        <DashboardOptions />
      </Box>
      <Stack
        css={blurBackgroundContainer}
        position="relative"
        alignItems="center"
        justifyContent="center"
        flexShrink={0}
        width={420}
        height="80%"
        gap={6}
        px={6}
        py={2}
      >
        <Typography variant="h4" position="absolute" top={20}>
          Welcome back!
        </Typography>
        <UserSettings />
        <LoadingButton
          css={(theme) =>
            shadowBorder(theme, {
              blurRadius: '7px',
              color: theme.palette.warning.light,
            })
          }
          variant="outlined"
          color="inherit"
          endIcon={<LogoutIcon />}
          loading={signingOut}
          onClick={handleSignOut}
          sx={{ position: 'absolute', bottom: 20 }}
        >
          <span>Sign Out</span>
        </LoadingButton>
      </Stack>
    </Stack>
  );
};

export default Dashboard;
