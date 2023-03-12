import React, { ChangeEvent, FC, useRef, useState } from 'react';

import { css } from '@emotion/react';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { LoadingButton } from '@mui/lab';
import { Button, Stack, useTheme } from '@mui/material';
import { uploadFile } from '@uploadcare/upload-client';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';

import { AVATAR_SIZE } from '@/constants/index';
import { clientEnv } from '@/env/schema.mjs';
import useElementContentDimensions from '@/hooks/useElementContentDimensions';
import { fullHeight, shadowBorder } from '@/styles/mixins';
import { api } from '@/utils/api';
import { reloadAuthSession } from '@/utils/auth';
import { dataURLtoFile } from '@/utils/files';
const AvatarEditorNoSSR = dynamic(() => import('react-avatar-edit'), {
  ssr: false,
});

interface Props {
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
  const { data: session } = useSession();

  const { onClose } = props;

  const editorContainerRef = useRef<HTMLDivElement>(null);
  const { height: containerContentHeight } =
    useElementContentDimensions(editorContainerRef);

  const [imageName, setImageName] = useState('');
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

  const handleFileLoad = (
    event: ChangeEvent<HTMLInputElement> | File,
  ): void => {
    if ('target' in event) {
      const file = event.target.files![0];
      setImageName(file!.name);
    } else {
      setImageName(event!.name);
    }
  };

  const [uploadingCdnImage, setUploadingCdnImage] = useState(false);
  const { mutateAsync: updateImage } = api.userSettings.updateImage.useMutation(
    {
      onSuccess: () => {
        onClose();
        reloadAuthSession();
      },
    },
  );

  const handleImageCapture = async (): Promise<void> => {
    setUploadingCdnImage(true);
    const croppedBlob = dataURLtoFile(croppedImage, imageName);
    const { cdnUrl } = await uploadFile(croppedBlob, {
      publicKey: clientEnv.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY!,
      store: 'auto',
      metadata: {
        userId: session!.user!.id,
        type: 'avatar',
      },
    });
    await updateImage({ image: cdnUrl! });
    setUploadingCdnImage(false);
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
          onFileLoad={handleFileLoad}
          onCrop={setCroppedImage}
        />
      </Stack>
      <Stack gap={2} direction="row">
        <Button
          color="inherit"
          sx={{ width: '30%' }}
          startIcon={<ArrowBackIosIcon />}
          onClick={onClose}
          disabled={uploadingCdnImage}
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
          loading={uploadingCdnImage}
          disabled={!croppedImage}
          fullWidth
          onClick={handleImageCapture}
        >
          <span>Capture new image</span>
        </LoadingButton>
      </Stack>
    </Stack>
  );
};

export default AvatarEditor;
