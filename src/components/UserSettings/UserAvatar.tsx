import React, { FC } from 'react';

import { ClassNames } from '@emotion/react';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import {
  Avatar,
  Backdrop,
  Box,
  CircularProgress,
  css,
  Drawer,
  Portal,
  Skeleton,
  Tooltip,
  useTheme,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { useToggle } from 'usehooks-ts';

import AvatarEditor from '@/components/AvatarEditor';
import Dimmer from '@/components/Dimmer';
import { AVATAR_SIZE } from '@/components/UserSettings/index';
import { blurBackgroundContainer, shadowBorder } from '@/styles/mixins';

export const UserAvatarSetting: FC = () => {
  const { status, data: session } = useSession();

  const [showEditOverlay, toggleShowOverlay] = useToggle(false);
  const [showNewImageEditor, toggleShowNewImageEditor] = useToggle(false);

  const sessionName = session?.user?.name || '';
  const sessionImage = session?.user?.image || '';

  return (
    <>
      {status === 'loading' ? (
        <Skeleton variant="circular" width={AVATAR_SIZE} height={AVATAR_SIZE} />
      ) : (
        <Box position="relative">
          <Tooltip
            open={showEditOverlay}
            title="Edit image"
            placement="top"
            onOpen={toggleShowOverlay}
            onClose={toggleShowOverlay}
            onClick={toggleShowNewImageEditor}
          >
            <Dimmer
              open={showEditOverlay}
              variant="circular"
              content={<AddAPhotoIcon />}
              css={css`
                cursor: pointer;
              `}
            >
              <Avatar
                variant="circular"
                src={sessionImage}
                alt={sessionName}
                sx={{
                  width: AVATAR_SIZE,
                  height: AVATAR_SIZE,
                }}
              />
            </Dimmer>
          </Tooltip>
        </Box>
      )}
      <ClassNames>
        {({ css, theme }) => (
          <Drawer
            anchor="right"
            open={showNewImageEditor}
            onClose={toggleShowNewImageEditor}
            PaperProps={{
              className: css(
                shadowBorder(theme, { color: theme.palette.warning.light }),
                blurBackgroundContainer,
              ),
            }}
          >
            <AvatarEditor
              src={sessionImage}
              onClose={toggleShowNewImageEditor}
            />
          </Drawer>
        )}
      </ClassNames>
    </>
  );
};
