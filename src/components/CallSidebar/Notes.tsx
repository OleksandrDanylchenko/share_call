import React, { FC } from 'react';

import { ClassNames } from '@emotion/react';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import { Box, Drawer, IconButton, Stack } from '@mui/material';
import { useToggle } from 'usehooks-ts';

import {
  blurBackgroundContainer,
  fullHeight,
  shadowBorder,
} from '@/styles/mixins';
import { api } from '@/utils/api';

interface Props {
  roomId: string;
}

const CallSidebarNotes: FC<Props> = (props) => {
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
        <TextSnippetIcon />
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
                <Box>Here will be the notes!</Box>
              </Stack>
            )}
          </Drawer>
        )}
      </ClassNames>
    </>
  );
};
export default CallSidebarNotes;
