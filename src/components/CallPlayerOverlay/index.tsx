import React, { FC, PropsWithChildren } from 'react';

import { css, SerializedStyles } from '@emotion/react';
import { Box, Stack, Theme, Typography } from '@mui/material';

import DeviceIcon from '@/components/DeviceIcon';
import { selectTrackState, useCallTracks } from '@/store/callTracks';
import { fullParent, shadowInset } from '@/styles/mixins';

interface Props extends PropsWithChildren {
  userId: string;
  showName?: boolean;
  showTracksStatus?: boolean;
  className?: string;
}

const CallPlayerOverlay: FC<Props> = (props) => {
  const {
    userId,
    showName = true,
    showTracksStatus = true,
    className,
    children,
  } = props;

  const microphoneState = useCallTracks((state) =>
    selectTrackState(state, userId, 'microphone'),
  );
  const cameraState = useCallTracks((state) =>
    selectTrackState(state, userId, 'camera'),
  );

  return (
    <Box
      css={fullParent}
      className={className}
      position="relative"
      borderRadius={8}
      overflow="hidden"
      sx={{ containerType: 'inline-size' }}
    >
      {children}
      <Stack
        direction="row"
        alignItems="stretch"
        justifyContent="space-between"
        position="absolute"
        left={0}
        right={0}
        bottom={0}
      >
        {showTracksStatus ? (
          <Stack
            css={(theme) =>
              overlay(theme, {
                side: 'left-bottom',
                color: theme.palette.primary.dark,
              })
            }
            direction="row"
            alignItems="center"
            gap={1.5}
          >
            <DeviceIcon
              deviceType="camera"
              fontSize="small"
              enabled={cameraState?.enabled}
              color={cameraState?.enabled ? 'inherit' : 'error'}
            />
            <DeviceIcon
              deviceType="microphone"
              fontSize="small"
              enabled={microphoneState?.enabled}
              color={microphoneState?.enabled ? 'inherit' : 'error'}
            />
          </Stack>
        ) : (
          <>&nbsp;</>
        )}
        {showName ? (
          <Typography
            css={(theme) => overlay(theme, { side: 'right-bottom' })}
            variant="subtitle2"
          >
            {userId}
          </Typography>
        ) : (
          <>&nbsp;</>
        )}
      </Stack>
    </Box>
  );
};

const overlay = (
  theme: Theme,
  options: { side: 'left-bottom' | 'right-bottom'; color?: string },
): SerializedStyles => {
  const { spacing } = theme;

  const { side, color = theme.palette.warning.light } = options;

  return css`
    ${shadowInset(theme, { color, blurRadius: '50px' })};

    color: ${theme.palette.common.black};
    padding: ${spacing(0.1)};
    z-index: 1;

    @container (max-width: 400px) {
      font-size: 0.7em;
      padding: 4px 8px 4px 20px;
    }

    ${side === 'left-bottom' &&
    css`
      border-top-right-radius: 10px;
      padding-left: ${spacing(3)};
      padding-right: ${spacing(1)};
    `}
    ${side === 'right-bottom' &&
    css`
      border-top-left-radius: 10px;
      padding-left: ${spacing(1)};
      padding-right: ${spacing(3)};
    `}
  `;
};

export default CallPlayerOverlay;
