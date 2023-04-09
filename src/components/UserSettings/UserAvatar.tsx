import React, { FC } from 'react';

import { ClassNames } from '@emotion/react';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { Box, css, Drawer, Skeleton, Tooltip } from '@mui/material';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useToggle } from 'usehooks-ts';

import AvatarEditor from '@/components/AvatarEditor';
import Dimmer from '@/components/Dimmer';
import { AVATAR_SIZE } from '@/constants/index';
import { blurBackgroundContainer, shadowBorder } from '@/styles/mixins';
import { getImageLoader } from '@/utils/files';

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
        <Box position="relative" lineHeight={0}>
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
              <Image
                alt={sessionName}
                src={sessionImage}
                width={AVATAR_SIZE}
                height={AVATAR_SIZE}
                quality={80}
                loader={getImageLoader(sessionImage)}
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
            <AvatarEditor onClose={toggleShowNewImageEditor} />
          </Drawer>
        )}
      </ClassNames>
    </>
  );
};
