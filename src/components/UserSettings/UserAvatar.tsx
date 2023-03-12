import React, { FC } from 'react';

import { ClassNames } from '@emotion/react';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { Box, css, Drawer, Skeleton, Tooltip } from '@mui/material';
import UploadcareImage from '@uploadcare/nextjs-loader';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useToggle } from 'usehooks-ts';

import AvatarEditor from '@/components/AvatarEditor';
import Dimmer from '@/components/Dimmer';
import { AVATAR_SIZE } from '@/components/UserSettings/index';
import { BORINGAVATARS_SERVICE_URL } from '@/constants/index';
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
              {sessionImage.startsWith(BORINGAVATARS_SERVICE_URL) ? (
                <Image
                  alt={sessionName}
                  src={sessionImage}
                  width={AVATAR_SIZE}
                  height={AVATAR_SIZE}
                  quality={80}
                />
              ) : (
                <UploadcareImage
                  alt={sessionName}
                  src={sessionImage}
                  width={AVATAR_SIZE}
                  height={AVATAR_SIZE}
                  quality={80}
                  style={{ borderRadius: '50%' }}
                />
              )}
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
