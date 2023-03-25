import { CSSProperties, FC, PropsWithChildren, ReactElement } from 'react';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import LoginIcon from '@mui/icons-material/Login';
import { Button, Stack, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/router';

import { DashboardSceneType } from '@/components/DashboardScene';
import { goToScene } from '@/components/DashboardScene/routing';
import { fullParent, shadowBorder } from '@/styles/mixins';

const DashboardOptions: FC = () => {
  const router = useRouter();

  const theme = useTheme();
  return (
    <Stack css={fullParent} px={5} py={7} gap={5}>
      <Option
        layout="horizontal"
        stretch={false}
        borderColor={theme.palette.warning.light}
        icon={<FormatListBulletedIcon />}
        onClick={() => goToScene(router, DashboardSceneType.Rooms)}
      >
        My rooms
      </Option>
      <Stack
        direction="row"
        alignItems="stretch"
        justifyContent="center"
        gap={5}
        flex={1}
      >
        <Option
          icon={<AddCircleOutlineIcon />}
          onClick={() => goToScene(router, DashboardSceneType.CreateRoom)}
        >
          Create a room
        </Option>
        <Option
          icon={<LoginIcon />}
          onClick={() => goToScene(router, DashboardSceneType.JoinCall)}
        >
          Join a call
        </Option>
      </Stack>
    </Stack>
  );
};

interface OptionProps extends PropsWithChildren {
  icon: ReactElement;
  layout?: 'horizontal' | 'vertical';
  borderColor?: CSSProperties['borderColor'];
  stretch?: boolean;
  onClick: () => void;
  className?: string;
}

const Option: FC<OptionProps> = (props) => {
  const {
    layout = 'vertical',
    stretch = true,
    borderColor,
    icon,
    onClick,
    className,
    children,
  } = props;

  return (
    <Button
      css={(theme) => shadowBorder(theme, { color: borderColor })}
      className={className}
      sx={[
        {
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: layout === 'vertical' ? 'column' : 'row',
          flex: stretch ? 1 : undefined,
          gap: (theme) => theme.spacing(1),
        },
        {
          '.MuiButton-startIcon > .MuiSvgIcon-root': {
            fontSize: '2.5rem',
          },
        },
      ]}
      color="inherit"
      onClick={onClick}
      startIcon={icon}
    >
      <Typography variant="h5" textAlign="center">
        {children}
      </Typography>
    </Button>
  );
};

export default DashboardOptions;
