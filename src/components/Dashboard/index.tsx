import { FC, useState } from 'react';

import { useAutoAnimate } from '@formkit/auto-animate/react';
import LogoutIcon from '@mui/icons-material/Logout';
import { LoadingButton } from '@mui/lab';
import { Box, Stack, Typography } from '@mui/material';
import { signOut } from 'next-auth/react';

import DashboardScene, {
  DashboardSceneType,
} from '@/components/DashboardScene';
import { useDashboardSceneType } from '@/components/DashboardScene/routing';
import UserSettings from '@/components/UserSettings';
import {
  blurBackgroundContainer,
  fullHeight,
  shadowBorder,
} from '@/styles/mixins';

const Dashboard: FC = () => {
  const scene = useDashboardSceneType();

  const [signingOut, setSigningOut] = useState(false);
  const handleSignOut = async (): Promise<void> => {
    setSigningOut(true);
    await signOut({ redirect: false });
  };

  const isContainerExpanded =
    scene === DashboardSceneType.Rooms || scene === DashboardSceneType.Notes;

  const [animateDashboardParent] = useAutoAnimate();
  return (
    <Stack
      ref={animateDashboardParent}
      css={fullHeight}
      direction="row"
      alignItems="center"
      justifyContent="center"
      gap={4}
    >
      <Box
        css={blurBackgroundContainer}
        flex={1}
        height={isContainerExpanded ? '95%' : '80%'}
      >
        <DashboardScene />
      </Box>
      {!isContainerExpanded && (
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
      )}
    </Stack>
  );
};

export default Dashboard;
