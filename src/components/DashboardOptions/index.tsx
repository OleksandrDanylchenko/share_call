import { FC } from 'react';

import LoginIcon from '@mui/icons-material/Login';
import { Button, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';

import { fullHeight, fullWidth, shadowBorder } from '@/styles/mixins';

const DashboardOptions: FC = () => {
  const router = useRouter();

  return (
    <Stack
      css={[fullWidth, fullHeight]}
      flexWrap="wrap"
      alignItems="center"
      justifyContent="center"
    >
      <Button
        css={shadowBorder}
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: (theme) => theme.spacing(2),
          width: '300px',
          height: '600px',
        }}
        color="inherit"
        onClick={() => router.push('/preview')}
      >
        <LoginIcon fontSize="large" />
        <Typography variant="h5" textAlign="center">
          Enter into a test meeting
        </Typography>
      </Button>
    </Stack>
  );
};

export default DashboardOptions;
