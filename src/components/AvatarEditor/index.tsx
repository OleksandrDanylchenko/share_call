import React, { ChangeEvent, FC, useRef, useState } from 'react';

import { css } from '@emotion/react';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import EmailIcon from '@mui/icons-material/Email';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import UnsubscribeIcon from '@mui/icons-material/Unsubscribe';
import { LoadingButton } from '@mui/lab';
import { Button, Stack, useTheme } from '@mui/material';
import dynamic from 'next/dynamic';

import { AVATAR_SIZE } from '@/constants/index';
import useElementContentDimensions from '@/hooks/useElementContentDimensions';
import { fullHeight, shadowBorder } from '@/styles/mixins';
const AvatarEditorNoSSR = dynamic(() => import('react-avatar-edit'), {
  ssr: false,
});

interface Props {
  src: string;
  onClose: () => void;
}

const TEN_MB = 1024 * 1024 * 10;
const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
].join(',');

const AvatarEditor: FC<Props> = (props) => {
  const { src, onClose } = props;

  const editorContainerRef = useRef<HTMLDivElement>(null);
  const { height: containerContentHeight } =
    useElementContentDimensions(editorContainerRef);

  const [croppedImage, setCroppedImage] = useState('');

  const handleBeforeLoad = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files) {
      const file = event.target.files[0];
      if (file && file.size > TEN_MB) {
        // TODO Add toast message here
        event.target.value = '';
      }
    }
  };

  const theme = useTheme();

  return (
    <Stack css={fullHeight} px={4} py={4} gap={4}>
      <Stack
        ref={editorContainerRef}
        flex={1}
        alignItems="center"
        justifyContent="center"
        css={css`
          .konvajs-content {
            border-radius: ${theme.spacing(2)};
            overflow: hidden;
          }
        `}
      >
        <AvatarEditorNoSSR
          width={AVATAR_SIZE * 2}
          height={containerContentHeight}
          imageWidth={AVATAR_SIZE * 2}
          mimeTypes={ALLOWED_MIME_TYPES}
          closeIconColor="transparent"
          backgroundColor="transparent"
          shadingColor={theme.palette.grey[50]}
          shadingOpacity={0.2}
          labelStyle={{
            color: theme.palette.text.primary,
            fontFamily: theme.typography.h5.fontFamily,
            fontSize: theme.typography.h5.fontSize,
            cursor: 'pointer',
          }}
          onClose={onClose}
          onBeforeFileLoad={handleBeforeLoad}
          onCrop={setCroppedImage}
        />
      </Stack>
      <Stack gap={2} direction="row">
        <Button
          color="inherit"
          sx={{ width: '30%' }}
          startIcon={<ArrowBackIosIcon />}
          onClick={onClose}
        >
          Back
        </Button>
        <LoadingButton
          type="submit"
          css={(theme) =>
            shadowBorder(theme, { color: theme.palette.common.white })
          }
          variant="outlined"
          color="inherit"
          startIcon={<AddAPhotoIcon />}
          fullWidth
        >
          <span>Capture new image</span>
        </LoadingButton>
      </Stack>
    </Stack>
  );
};

export default AvatarEditor;
