import React, { FC, useMemo, useState } from 'react';

import { useAutoAnimate } from '@formkit/auto-animate/react';
import LogoutIcon from '@mui/icons-material/Logout';
import { LoadingButton } from '@mui/lab';
import { Box, Stack, Typography } from '@mui/material';
import { signOut } from 'next-auth/react';

import DashboardScene, {
  DashboardSceneType,
  DashboardSceneTypes,
} from '@/components/DashboardScene';
import UserSettings from '@/components/UserSettings';
import {
  blurBackgroundContainer,
  fullHeight,
  shadowBorder,
} from '@/styles/mixins';

const Dashboard: FC = () => {
  const [scene, setScene] = useState(DashboardSceneType.Options);
  const sceneView = useMemo(() => {
    const sceneType = DashboardSceneType[scene] as DashboardSceneTypes;
    const SceneView = DashboardScene[sceneType];
    return <SceneView onSceneChange={setScene} />;
  }, [scene]);

  const [signingOut, setSigningOut] = useState(false);
  const handleSignOut = async (): Promise<void> => {
    setSigningOut(true);
    await signOut({ redirect: false });
  };

  const [animateParent] = useAutoAnimate();
  return (
    <Stack
      css={fullHeight}
      direction="row"
      alignItems="center"
      justifyContent="center"
      gap={4}
    >
      <Box
        ref={animateParent}
        css={blurBackgroundContainer}
        flex={1}
        height="80%"
      >
        {sceneView}
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
