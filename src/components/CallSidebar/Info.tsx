import { FC } from 'react';

import { ClassNames } from '@emotion/react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import InfoIcon from '@mui/icons-material/Info';
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { DateTime } from 'luxon';
import { useToggle } from 'usehooks-ts';

import PillContainer from '@/components/PillContainer';
import RoomInvite from '@/components/RoomInvite';
import { useDuration } from '@/hooks/useDuration';
import {
  blurBackgroundContainer,
  fullHeight,
  lineClamp,
  shadowBorder,
} from '@/styles/mixins';
import { api } from '@/utils/api';

interface Props {
  roomId: string;
}

const CallSidebarInfo: FC<Props> = (props) => {
  const { roomId } = props;

  const [showInfo, toggleShowInfo] = useToggle(false);

  const { data: targetRoom } = api.rooms.getRoom.useQuery(
    { id: roomId },
    { retry: 1 },
  );

  const duration = useDuration(
    targetRoom?.lastSession?.startedAt || new Date(),
  );

  return (
    <>
      <IconButton
        css={(theme) =>
          shadowBorder(theme, {
            blurRadius: '16px',
            color: theme.palette.warning.main,
          })
        }
        size="medium"
        onClick={toggleShowInfo}
      >
        <InfoIcon />
      </IconButton>
      <ClassNames>
        {({ css, theme }) => (
          <Drawer
            anchor="right"
            open={showInfo}
            onClose={toggleShowInfo}
            PaperProps={{
              sx: {
                width: 420,
                padding: 4,
              },
              className: css(
                shadowBorder(theme, { color: theme.palette.warning.light }),
                blurBackgroundContainer,
              ),
            }}
          >
            {targetRoom && (
              <Stack css={fullHeight} justifyContent="space-between">
                <Box>
                  <Tooltip title={targetRoom.name} placement="bottom">
                    <Typography
                      css={lineClamp(4)}
                      variant="h3"
                      color="warning.main"
                    >
                      {targetRoom.name}
                    </Typography>
                  </Tooltip>
                  <Tooltip title={targetRoom.description} placement="bottom">
                    <Typography css={lineClamp(20)} variant="subtitle1">
                      {targetRoom.description}
                    </Typography>
                  </Tooltip>
                </Box>
                <Stack gap={2}>
                  <PillContainer active>
                    <Stack direction="row" alignItems="baseline" gap={2}>
                      <Typography variant="subtitle1">Duration:</Typography>
                      <Typography variant="subtitle1">{duration}</Typography>
                    </Stack>
                  </PillContainer>
                  <RoomInvite
                    inviteCode={targetRoom.inviteCode}
                    sx={{
                      padding: 0,
                      pl: 2,
                      '.MuiTypography-root': {
                        fontSize: theme.typography.subtitle1.fontSize,
                      },
                      '.MuiSvgIcon-root': {
                        fontSize: 35,
                      },
                    }}
                  />
                  <Button
                    color="inherit"
                    sx={{ width: '30%', alignSelf: 'flex-end' }}
                    endIcon={<ArrowForwardIosIcon />}
                    onClick={toggleShowInfo}
                  >
                    Close
                  </Button>
                </Stack>
              </Stack>
            )}
          </Drawer>
        )}
      </ClassNames>
    </>
  );
};

export default CallSidebarInfo;
