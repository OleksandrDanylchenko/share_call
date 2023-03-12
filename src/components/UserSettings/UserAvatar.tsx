import React, { FC } from 'react';

import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import {
  Avatar,
  Backdrop,
  Box,
  CircularProgress,
  css,
  Portal,
  Skeleton,
  Tooltip,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { useToggle } from 'usehooks-ts';

import Dimmer from '@/components/Dimmer';
import { AVATAR_SIZE } from '@/components/UserSettings/index';

export const UserAvatarSetting: FC = () => {
  const { status, data: session } = useSession();

  const [showEditOverlay, toggleShowOverlay] = useToggle(false);
  const [showNewImageEditor, toggleShowNewImageEditor] = useToggle(false);

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
                src={session!.user!.image || ''}
                alt={session!.user!.name!}
                sx={{
                  width: AVATAR_SIZE,
                  height: AVATAR_SIZE,
                }}
              />
            </Dimmer>
          </Tooltip>
        </Box>
      )}
      {showNewImageEditor && (
        <Portal>
          <Backdrop
            open={showNewImageEditor}
            onClick={toggleShowNewImageEditor}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </Portal>
      )}
    </>
  );
};
