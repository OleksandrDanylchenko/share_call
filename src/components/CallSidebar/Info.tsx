import React, { FC } from 'react';

import { ClassNames } from '@emotion/react';
import InfoIcon from '@mui/icons-material/Info';
import { Drawer, IconButton, Typography, Tooltip } from '@mui/material';
import { useToggle } from 'usehooks-ts';

import RoomInvite from '@/components/RoomInvite';
import {
  blurBackgroundContainer,
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
            <Tooltip title={targetRoom!.name} placement="bottom">
              <Typography css={lineClamp(4)} variant="h3" color="warning.main">
                {targetRoom!.name}
              </Typography>
            </Tooltip>
            <Tooltip title={targetRoom!.description} placement="bottom">
              <Typography css={lineClamp(20)} variant="subtitle1">
                {targetRoom!.description}
              </Typography>
            </Tooltip>
            <RoomInvite
              inviteCode={targetRoom!.inviteCode}
              sx={{
                position: 'absolute',
                bottom: 20,
                left: 0,
                right: 0,
                width: '90% !important',
                mx: 'auto',
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
          </Drawer>
        )}
      </ClassNames>
    </>
  );
};

export default CallSidebarInfo;
